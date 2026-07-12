import { Request, Response } from 'express';
import {
  createResultFromSubmission,
  getResultById,
  getAllResults,
  updateResult,
  publishResult,
  getResultsByStudent,
  getResultsByAssessment,
  getResultsByClass,
  generateReportCard,
  getReportCardById,
  getAllReportCards,
  updateReportCard,
  deleteReportCard,
  getReportCardsByStudent,
  getReportCardsByClass,
} from './result.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

// ============ Result Controllers ============
export const createResultController = async (req: Request, res: Response): Promise<Response> => {
  const { submissionId } = req.params;
  if (!submissionId) {
    return ResponseHelper.error(res, 'Submission ID is required', 400);
  }
  const publishedBy = (req as any).user.id;
  const result = await createResultFromSubmission(submissionId, publishedBy);
  return ResponseHelper.success(res, result, 'Result created successfully', 201);
};

export const getResultByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Result ID is required', 400);
  }
  const result = await getResultById(id);
  return ResponseHelper.success(res, result, 'Result retrieved successfully');
};

export const getAllResultsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.studentId) {
    filter.studentId = new Types.ObjectId(req.query.studentId as string);
  }
  if (req.query.assessmentId) {
    filter.assessmentId = new Types.ObjectId(req.query.assessmentId as string);
  }
  if (req.query.classId) {
    filter.classId = new Types.ObjectId(req.query.classId as string);
  }
  if (req.query.subjectId) {
    filter.subjectId = new Types.ObjectId(req.query.subjectId as string);
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const result = await getAllResults(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Results retrieved successfully');
};

export const updateResultController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Result ID is required', 400);
  }
  const result = await updateResult(id, req.body);
  return ResponseHelper.success(res, result, 'Result updated successfully');
};

export const publishResultController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Result ID is required', 400);
  }
  const publishedBy = (req as any).user.id;
  const result = await publishResult(id, publishedBy);
  return ResponseHelper.success(res, result, 'Result published successfully');
};

export const getResultsByStudentController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.params;
  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getResultsByStudent(new Types.ObjectId(studentId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Results retrieved successfully');
};

export const getMyResultsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const studentId = (req as any).user.id;
  const result = await getResultsByStudent(studentId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My results retrieved successfully');
};

export const getResultsByAssessmentController = async (req: Request, res: Response): Promise<Response> => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return ResponseHelper.error(res, 'Assessment ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getResultsByAssessment(new Types.ObjectId(assessmentId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Results retrieved successfully');
};

export const getResultsByClassController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getResultsByClass(new Types.ObjectId(classId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Results retrieved successfully');
};

// ============ Report Card Controllers ============
export const generateReportCardController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId, termId } = req.params;
  if (!studentId || !termId) {
    return ResponseHelper.error(res, 'Student ID and Term ID are required', 400);
  }
  const publishedBy = (req as any).user.id;
  const reportCard = await generateReportCard(studentId, termId, publishedBy);
  return ResponseHelper.success(res, reportCard, 'Report card generated successfully', 201);
};

export const getReportCardByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Report card ID is required', 400);
  }
  const reportCard = await getReportCardById(id);
  return ResponseHelper.success(res, reportCard, 'Report card retrieved successfully');
};

export const getAllReportCardsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.studentId) {
    filter.studentId = new Types.ObjectId(req.query.studentId as string);
  }
  if (req.query.classId) {
    filter.classId = new Types.ObjectId(req.query.classId as string);
  }
  if (req.query.sessionId) {
    filter.sessionId = new Types.ObjectId(req.query.sessionId as string);
  }
  if (req.query.termId) {
    filter.termId = new Types.ObjectId(req.query.termId as string);
  }

  const result = await getAllReportCards(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Report cards retrieved successfully');
};

export const updateReportCardController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Report card ID is required', 400);
  }
  const reportCard = await updateReportCard(id, req.body);
  return ResponseHelper.success(res, reportCard, 'Report card updated successfully');
};

export const deleteReportCardController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Report card ID is required', 400);
  }
  await deleteReportCard(id);
  return ResponseHelper.success(res, null, 'Report card deleted successfully');
};

export const getMyReportCardsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const studentId = (req as any).user.id;
  const result = await getReportCardsByStudent(studentId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My report cards retrieved successfully');
};

export const getReportCardsByClassController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getReportCardsByClass(new Types.ObjectId(classId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Report cards retrieved successfully');
};