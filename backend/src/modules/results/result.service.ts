import {
  createResult as createResultRepo,
  findResultById,
  findResultBySubmission,
  findAllResults,
  updateResult as updateResultRepo,
  publishResult as publishResultRepo,
  getResultsByStudent as getResultsByStudentRepo,
  getResultsByAssessment as getResultsByAssessmentRepo,
  getResultsByClass as getResultsByClassRepo,
  createReportCard as createReportCardRepo,
  findReportCardById,
  findReportCardByStudentAndTerm,
  findAllReportCards,
  updateReportCard as updateReportCardRepo,
  deleteReportCard as deleteReportCardRepo,
  getReportCardsByStudent as getReportCardsByStudentRepo,
  getReportCardsByClass as getReportCardsByClassRepo,
} from './result.repository.js';
import { IResult, IReportCard } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Submission } from '../submissions/submission.model.js';
import { Assessment } from '../assessments/assessment.model.js';
import { Result } from './result.model.js';

// ============ Result Services ============
export const createResultFromSubmission = async (
  submissionId: string,
  publishedBy: Types.ObjectId
): Promise<IResult> => {
  // Get submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check if result already exists
  const existingResult = await findResultBySubmission(new Types.ObjectId(submissionId));
  if (existingResult) {
    throw new AppError('Result already exists for this submission', 409);
  }

  // Get assessment
  const assessment = await Assessment.findById(submission.assessmentId);
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  // Calculate values
  const totalMarks = assessment.totalMarks || 0;
  const obtainedMarks = submission.finalScore || 0;
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  // Calculate grade and remark
  const { grade, remark } = calculateGradeAndRemark(percentage);

  // Create result
  const resultData = {
    schoolId: submission.schoolId,
    submissionId: submission._id,
    assessmentId: submission.assessmentId,
    studentId: submission.studentId,
    classId: assessment.classId,
    subjectId: assessment.subjectId,
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    remark,
    publishedBy,
    publishedAt: new Date(),
    status: 'published' as const,
  };

  return createResultRepo(resultData);
};

export const getResultById = async (id: string): Promise<IResult> => {
  const result = await findResultById(id);
  if (!result) {
    throw new AppError('Result not found', 404);
  }
  return result;
};

export const getAllResults = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllResults(schoolId, page, limit, filter);
};

export const updateResult = async (id: string, data: Partial<IResult>): Promise<IResult> => {
  const result = await getResultById(id);

  // Don't allow updates to published results
  if (result.status === 'published') {
    throw new AppError('Cannot update a published result', 400);
  }

  const updated = await updateResultRepo(id, data);
  if (!updated) {
    throw new AppError('Result not found', 404);
  }
  return updated;
};

export const publishResult = async (id: string, publishedBy: Types.ObjectId): Promise<IResult> => {
  const result = await getResultById(id);

  if (result.status === 'published') {
    throw new AppError('Result already published', 400);
  }

  const published = await publishResultRepo(id, publishedBy);
  if (!published) {
    throw new AppError('Result not found', 404);
  }
  return published;
};

export const getResultsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getResultsByStudentRepo(studentId, page, limit);
};

export const getResultsByAssessment = async (
  assessmentId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getResultsByAssessmentRepo(assessmentId, page, limit);
};

export const getResultsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getResultsByClassRepo(classId, page, limit);
};

// ============ Report Card Services ============
export const generateReportCard = async (
  studentId: string,
  termId: string,
  publishedBy: Types.ObjectId
): Promise<IReportCard> => {
  // Check if report card already exists
  const existing = await findReportCardByStudentAndTerm(
    new Types.ObjectId(studentId),
    new Types.ObjectId(termId)
  );
  if (existing) {
    throw new AppError('Report card already exists for this student and term', 409);
  }

  // Get all published results for this student
  const results = await Result.find({
    studentId: new Types.ObjectId(studentId),
    status: 'published',
  });

  if (results.length === 0) {
    throw new AppError('No published results found for this student', 404);
  }

  // Group results by subject
  const subjectResults = results.map((r: IResult) => ({
    subjectId: r.subjectId,
    score: r.obtainedMarks,
    grade: r.grade,
    remark: r.remark,
  }));

  // Calculate totals
  const totalScore = subjectResults.reduce((sum: number, s: { score: number }) => sum + s.score, 0);
  const averageScore = subjectResults.length > 0 ? totalScore / subjectResults.length : 0;
  const overallGrade = calculateGrade(averageScore);

  // Get class and session info from results
  const firstResult = results[0];
  if (!firstResult) {
    throw new AppError('No results found for this student', 404);
  }
  
  const classId = firstResult.classId;
  const schoolId = firstResult.schoolId;

  // Get sessionId from assessment
  const assessment = await Assessment.findById(firstResult.assessmentId);
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  // Create report card
  const reportCardData = {
    schoolId,
    sessionId: assessment.sessionId,
    termId: new Types.ObjectId(termId),
    studentId: new Types.ObjectId(studentId),
    classId,
    subjects: subjectResults,
    totalScore,
    averageScore,
    overallGrade,
    classPosition: null,
    attendancePercentage: null,
    teacherComment: '',
    principalComment: '',
    publishedBy,
    publishedAt: new Date(),
  };

  return createReportCardRepo(reportCardData);
};

export const getReportCardById = async (id: string): Promise<IReportCard> => {
  const reportCard = await findReportCardById(id);
  if (!reportCard) {
    throw new AppError('Report card not found', 404);
  }
  return reportCard;
};

export const getAllReportCards = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllReportCards(schoolId, page, limit, filter);
};

export const updateReportCard = async (id: string, data: Partial<IReportCard>): Promise<IReportCard> => {
  // Check if report card exists
  await getReportCardById(id);

  const updated = await updateReportCardRepo(id, data);
  if (!updated) {
    throw new AppError('Report card not found', 404);
  }
  return updated;
};

export const deleteReportCard = async (id: string): Promise<void> => {
  const reportCard = await deleteReportCardRepo(id);
  if (!reportCard) {
    throw new AppError('Report card not found', 404);
  }
};

export const getReportCardsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getReportCardsByStudentRepo(studentId, page, limit);
};

export const getReportCardsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return getReportCardsByClassRepo(classId, page, limit);
};

// ============ Helper Functions ============
const calculateGradeAndRemark = (percentage: number): { grade: string; remark: string } => {
  if (percentage >= 80) {
    return { grade: 'A', remark: 'Excellent' };
  } else if (percentage >= 70) {
    return { grade: 'B', remark: 'Very Good' };
  } else if (percentage >= 60) {
    return { grade: 'C', remark: 'Good' };
  } else if (percentage >= 50) {
    return { grade: 'D', remark: 'Fair' };
  } else if (percentage >= 40) {
    return { grade: 'E', remark: 'Pass' };
  } else {
    return { grade: 'F', remark: 'Fail' };
  }
};

const calculateGrade = (percentage: number): string => {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
};