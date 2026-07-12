import { Request, Response } from 'express';
import {
  startAssessment,
  getSubmissionById,
  getAllSubmissions,
  updateSubmission,
  saveAnswer,
  submitAssessment,
  gradeSubmission,
  getSubmissionsByAssessment,
  getSubmissionsByStudent,
  getStudentSubmissionsByAssessment,
  getPendingGrading,
} from './submission.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const startAssessmentController = async (req: Request, res: Response): Promise<Response> => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return ResponseHelper.error(res, 'Assessment ID is required', 400);
  }
  const studentId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const submission = await startAssessment(assessmentId, studentId, schoolId);
  return ResponseHelper.success(res, submission, 'Assessment started successfully', 201);
};

export const getSubmissionByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Submission ID is required', 400);
  }
  const submission = await getSubmissionById(id);
  return ResponseHelper.success(res, submission, 'Submission retrieved successfully');
};

export const getAllSubmissionsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.assessmentId) {
    filter.assessmentId = new Types.ObjectId(req.query.assessmentId as string);
  }
  if (req.query.studentId) {
    filter.studentId = new Types.ObjectId(req.query.studentId as string);
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const result = await getAllSubmissions(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Submissions retrieved successfully');
};

export const updateSubmissionController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Submission ID is required', 400);
  }
  const submission = await updateSubmission(id, req.body);
  return ResponseHelper.success(res, submission, 'Submission updated successfully');
};

export const saveAnswerController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { questionId, selectedOption, answerText } = req.body;

  if (!id || !questionId) {
    return ResponseHelper.error(res, 'Submission ID and Question ID are required', 400);
  }

  const submission = await saveAnswer(id, questionId, {
    selectedOption: selectedOption || null,
    answerText: answerText || null,
  });
  return ResponseHelper.success(res, submission, 'Answer saved successfully');
};

export const submitAssessmentController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Submission ID is required', 400);
  }
  const submission = await submitAssessment(id);
  return ResponseHelper.success(res, submission, 'Assessment submitted successfully');
};

export const gradeSubmissionController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Submission ID is required', 400);
  }
  const gradedBy = (req as any).user.id;
  const submission = await gradeSubmission(id, gradedBy, req.body);
  return ResponseHelper.success(res, submission, 'Submission graded successfully');
};

export const getSubmissionsByAssessmentController = async (req: Request, res: Response): Promise<Response> => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return ResponseHelper.error(res, 'Assessment ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getSubmissionsByAssessment(new Types.ObjectId(assessmentId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Submissions retrieved successfully');
};

export const getSubmissionsByStudentController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.params;
  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getSubmissionsByStudent(new Types.ObjectId(studentId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Submissions retrieved successfully');
};

export const getMySubmissionsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const studentId = (req as any).user.id;
  const result = await getSubmissionsByStudent(studentId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My submissions retrieved successfully');
};

export const getStudentAssessmentSubmissionsController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId, assessmentId } = req.params;
  if (!studentId || !assessmentId) {
    return ResponseHelper.error(res, 'Student ID and Assessment ID are required', 400);
  }
  const submissions = await getStudentSubmissionsByAssessment(
    new Types.ObjectId(studentId),
    new Types.ObjectId(assessmentId)
  );
  return ResponseHelper.success(res, submissions, 'Submissions retrieved successfully');
};

export const getPendingGradingController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const result = await getPendingGrading(schoolId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Pending grading submissions retrieved successfully');
};