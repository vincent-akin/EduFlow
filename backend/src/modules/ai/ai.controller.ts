import { Request, Response } from 'express';
import {
  generateWithAI,
  getAIGenerationById,
  getAllAIGenerations,
  getAIGenerationsByUser,
  getAIGenerationsByFeature,
  generateQuestions,
  generateLessonPlan,
  generateMarkingScheme,
  generateFeedback,
  generateStudyRecommendations,
} from './ai.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const generateAIController = async (req: Request, res: Response): Promise<Response> => {
  const { provider, model, feature, prompt, metadata } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!provider || !model || !feature || !prompt) {
    return ResponseHelper.error(res, 'Provider, model, feature, and prompt are required', 400);
  }

  const result = await generateWithAI(
    userId,
    schoolId,
    provider,
    model,
    feature,
    prompt,
    metadata || {}
  );
  return ResponseHelper.success(res, result, 'AI generation completed successfully', 201);
};

export const generateQuestionsController = async (req: Request, res: Response): Promise<Response> => {
  const { subjectId, topic, difficulty, count } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!subjectId || !topic || !difficulty || !count) {
    return ResponseHelper.error(res, 'Subject ID, topic, difficulty, and count are required', 400);
  }

  const result = await generateQuestions(
    userId,
    schoolId,
    subjectId,
    topic,
    difficulty,
    count
  );
  return ResponseHelper.success(res, result, 'Questions generated successfully', 201);
};

export const generateLessonPlanController = async (req: Request, res: Response): Promise<Response> => {
  const { subjectId, topic, duration } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!subjectId || !topic || !duration) {
    return ResponseHelper.error(res, 'Subject ID, topic, and duration are required', 400);
  }

  const result = await generateLessonPlan(
    userId,
    schoolId,
    subjectId,
    topic,
    duration
  );
  return ResponseHelper.success(res, result, 'Lesson plan generated successfully', 201);
};

export const generateMarkingSchemeController = async (req: Request, res: Response): Promise<Response> => {
  const { assessmentId } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!assessmentId) {
    return ResponseHelper.error(res, 'Assessment ID is required', 400);
  }

  const result = await generateMarkingScheme(
    userId,
    schoolId,
    assessmentId
  );
  return ResponseHelper.success(res, result, 'Marking scheme generated successfully', 201);
};

export const generateFeedbackController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId, assessmentId, score } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!studentId || !assessmentId || score === undefined) {
    return ResponseHelper.error(res, 'Student ID, assessment ID, and score are required', 400);
  }

  const result = await generateFeedback(
    userId,
    schoolId,
    studentId,
    assessmentId,
    score
  );
  return ResponseHelper.success(res, result, 'Feedback generated successfully', 201);
};

export const generateStudyRecommendationsController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.body;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  const result = await generateStudyRecommendations(
    userId,
    schoolId,
    studentId
  );
  return ResponseHelper.success(res, result, 'Study recommendations generated successfully', 201);
};

export const getAIGenerationByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'AI generation ID is required', 400);
  }
  const generation = await getAIGenerationById(id);
  return ResponseHelper.success(res, generation, 'AI generation retrieved successfully');
};

export const getAllAIGenerationsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.feature) {
    filter.feature = req.query.feature;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.userId) {
    filter.userId = new Types.ObjectId(req.query.userId as string);
  }

  const result = await getAllAIGenerations(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'AI generations retrieved successfully');
};

export const getMyAIGenerationsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;
  const result = await getAIGenerationsByUser(userId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My AI generations retrieved successfully');
};

export const getAIGenerationsByFeatureController = async (req: Request, res: Response): Promise<Response> => {
  const { feature } = req.params;
  if (!feature) {
    return ResponseHelper.error(res, 'Feature is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const result = await getAIGenerationsByFeature(schoolId, feature, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'AI generations retrieved successfully');
};