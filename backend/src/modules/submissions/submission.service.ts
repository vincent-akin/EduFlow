import {
  createSubmission as createSubmissionRepo,
  findSubmissionById,
  findSubmissionByAssessmentAndStudent,
  findAllSubmissions,
  updateSubmission as updateSubmissionRepo,
  submitAssessment as submitAssessmentRepo,
  gradeSubmission as gradeSubmissionRepo,
  getSubmissionsByAssessment as getSubmissionsByAssessmentRepo,
  getSubmissionsByStudent as getSubmissionsByStudentRepo,
  getSubmissionsByStatus as getSubmissionsByStatusRepo,
  getStudentSubmissionsByAssessment as getStudentSubmissionsByAssessmentRepo,
  getPendingGrading as getPendingGradingRepo,
} from './submission.repository.js';
import { ISubmission } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Assessment } from '../assessments/assessment.model.js';

export const startAssessment = async (
  assessmentId: string,
  studentId: string,
  schoolId: Types.ObjectId
): Promise<ISubmission> => {
  // Check if assessment exists and is published
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  if (assessment.status !== 'published') {
    throw new AppError('Assessment is not available', 400);
  }

  // Check if assessment is within time window
  const now = new Date();
  if (new Date(assessment.startTime) > now) {
    throw new AppError('Assessment has not started yet', 400);
  }
  if (new Date(assessment.endTime) < now) {
    throw new AppError('Assessment has ended', 400);
  }

  // Check for existing submission
  const existingSubmission = await findSubmissionByAssessmentAndStudent(
    new Types.ObjectId(assessmentId),
    new Types.ObjectId(studentId)
  );

  if (existingSubmission) {
    return existingSubmission;
  }

  // Create new submission
  const submissionData = {
    schoolId,
    assessmentId: new Types.ObjectId(assessmentId),
    studentId: new Types.ObjectId(studentId),
    attemptNumber: 1,
    startedAt: new Date(),
    status: 'in_progress' as const,
    answers: assessment.questions.map((q: any) => ({
      questionId: q.questionId,
      selectedOption: null,
      answerText: null,
      obtainedMarks: 0,
      isCorrect: false,
      answeredAt: new Date(),
    })),
  };

  return createSubmissionRepo(submissionData);
};

export const getSubmissionById = async (id: string): Promise<ISubmission> => {
  const submission = await findSubmissionById(id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }
  return submission;
};

export const getAllSubmissions = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllSubmissions(schoolId, page, limit, filter);
};

export const updateSubmission = async (
  id: string,
  data: Partial<ISubmission>
): Promise<ISubmission> => {
  const submission = await getSubmissionById(id);

  // Don't allow updates to submitted or graded submissions
  if (submission.status === 'submitted' || submission.status === 'graded') {
    throw new AppError('Cannot update submitted or graded submission', 400);
  }

  const updated = await updateSubmissionRepo(id, data);
  if (!updated) {
    throw new AppError('Submission not found', 404);
  }
  return updated;
};

export const saveAnswer = async (
  id: string,
  questionId: string,
  answer: any
): Promise<ISubmission> => {
  const submission = await getSubmissionById(id);

  // Check if submission can be updated
  if (submission.status === 'submitted' || submission.status === 'graded') {
    throw new AppError('Cannot modify submitted or graded submission', 400);
  }

  // Find and update the answer
  const answerIndex = submission.answers.findIndex(
    (a) => a.questionId.toString() === questionId
  );

  if (answerIndex === -1) {
    throw new AppError('Question not found in submission', 404);
  }

  // Update the answer
  const updatedAnswers = [...submission.answers];
  updatedAnswers[answerIndex] = {
    ...updatedAnswers[answerIndex],
    ...answer,
    answeredAt: new Date(),
  };

  const updated = await updateSubmissionRepo(id, {
    answers: updatedAnswers,
    timeSpentSeconds: submission.timeSpentSeconds,
  });

  if (!updated) {
    throw new AppError('Submission not found', 404);
  }
  return updated;
};

export const submitAssessment = async (id: string): Promise<ISubmission> => {
  const submission = await getSubmissionById(id);

  if (submission.status === 'submitted' || submission.status === 'graded') {
    throw new AppError('Assessment already submitted', 400);
  }

  // Auto-grade MCQ questions
  const assessment = await Assessment.findById(submission.assessmentId);
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  let autoScore = 0;
  const gradedAnswers = submission.answers.map((answer) => {
    const question = assessment.questions.find(
      (q: any) => q.questionId.toString() === answer.questionId.toString()
    );

    if (!question) return answer;

    // For MCQ, check if answer is correct
    if (question.snapshot?.type === 'mcq') {
      const isCorrect = answer.selectedOption === question.snapshot.correctAnswer;
      if (isCorrect) {
        autoScore += question.marks || 0;
      }
      return {
        ...answer,
        obtainedMarks: isCorrect ? question.marks || 0 : 0,
        isCorrect,
      };
    }

    // For theory, keep as 0 for manual grading
    return answer;
  });

  const submitted = await submitAssessmentRepo(id);
  if (!submitted) {
    throw new AppError('Submission not found', 404);
  }

  // Update with auto-grading results
  const graded = await gradeSubmissionRepo(id, new Types.ObjectId(), {
    autoScore,
    finalScore: autoScore,
    answers: gradedAnswers,
  });

  if (!graded) {
    throw new AppError('Submission not found', 404);
  }

  return graded;
};

export const gradeSubmission = async (
  id: string,
  gradedBy: Types.ObjectId,
  data: {
    manualScore?: number;
    finalScore?: number;
    answers?: any[];
    feedback?: string;
  }
): Promise<ISubmission> => {
  const submission = await getSubmissionById(id);

  if (submission.status !== 'submitted') {
    throw new AppError('Only submitted assessments can be graded', 400);
  }

  // Calculate final score
  const finalScore = data.finalScore || data.manualScore || submission.autoScore || 0;

  const graded = await gradeSubmissionRepo(id, gradedBy, {
    manualScore: data.manualScore || 0,
    finalScore,
    answers: data.answers || submission.answers,
  });

  if (!graded) {
    throw new AppError('Submission not found', 404);
  }

  return graded;
};

export const getSubmissionsByAssessment = async (
  assessmentId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getSubmissionsByAssessmentRepo(assessmentId, page, limit);
};

export const getSubmissionsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getSubmissionsByStudentRepo(studentId, page, limit);
};

export const getSubmissionsByStatus = async (
  schoolId: Types.ObjectId,
  status: string,
  page = 1,
  limit = 10
) => {
  return getSubmissionsByStatusRepo(schoolId, status, page, limit);
};

export const getStudentSubmissionsByAssessment = async (
  studentId: Types.ObjectId,
  assessmentId: Types.ObjectId
) => {
  return getStudentSubmissionsByAssessmentRepo(studentId, assessmentId);
};

export const getPendingGrading = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getPendingGradingRepo(schoolId, page, limit);
};