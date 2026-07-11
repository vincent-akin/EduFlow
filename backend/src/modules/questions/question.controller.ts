import { Request, Response } from 'express';
import {
    createQuestion,
    getQuestionById,
    getAllQuestions,
    updateQuestion,
    deleteQuestion,
    archiveQuestionById,
    incrementQuestionUsage,
    getQuestionsBySubject,
    getQuestionsByTopic,
    getQuestionsByDifficulty,
    searchQuestions,
} from './question.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const createQuestionController = async (req: Request, res: Response): Promise<Response> => {
    const question = await createQuestion({
        ...req.body,
        schoolId: (req as any).schoolId,
        createdBy: (req as any).user.id,
    });
    return ResponseHelper.success(res, question, 'Question created successfully', 201);
};

export const getQuestionByIdController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Question ID is required', 400);
    }
    const question = await getQuestionById(id);
    return ResponseHelper.success(res, question, 'Question retrieved successfully');
};

export const getAllQuestionsController = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const filter: any = {};

    if (req.query.subjectId) {
        filter.subjectId = new Types.ObjectId(req.query.subjectId as string);
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    if (req.query.difficulty) {
        filter.difficulty = req.query.difficulty;
    }
    if (req.query.topic) {
        filter.topic = req.query.topic;
    }
    if (req.query.isArchived !== undefined) {
        filter.isArchived = req.query.isArchived === 'true';
    }

    const result = await getAllQuestions(schoolId, page, limit, filter);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Questions retrieved successfully');
};

export const updateQuestionController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Question ID is required', 400);
    }
    const question = await updateQuestion(id, req.body);
    return ResponseHelper.success(res, question, 'Question updated successfully');
};

export const deleteQuestionController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Question ID is required', 400);
    }
    await deleteQuestion(id);
    return ResponseHelper.success(res, null, 'Question deleted successfully');
};

export const archiveQuestionController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Question ID is required', 400);
    }
    const question = await archiveQuestionById(id);
    return ResponseHelper.success(res, question, 'Question archived successfully');
};

export const incrementUsageController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Question ID is required', 400);
    }
    const question = await incrementQuestionUsage(id);
    return ResponseHelper.success(res, question, 'Usage count incremented');
};

export const getQuestionsBySubjectController = async (req: Request, res: Response): Promise<Response> => {
    const { subjectId } = req.params;
    if (!subjectId) {
        return ResponseHelper.error(res, 'Subject ID is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const result = await getQuestionsBySubject(new Types.ObjectId(subjectId), page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Questions retrieved successfully');
};

export const getQuestionsByTopicController = async (req: Request, res: Response): Promise<Response> => {
    const { topic } = req.params;
    if (!topic) {
        return ResponseHelper.error(res, 'Topic is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const result = await getQuestionsByTopic(schoolId, topic, page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Questions retrieved successfully');
};

export const getQuestionsByDifficultyController = async (req: Request, res: Response): Promise<Response> => {
    const { difficulty } = req.params;
    if (!difficulty) {
        return ResponseHelper.error(res, 'Difficulty is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const result = await getQuestionsByDifficulty(schoolId, difficulty, page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Questions retrieved successfully');
};

export const searchQuestionsController = async (req: Request, res: Response): Promise<Response> => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return ResponseHelper.error(res, 'Search term is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const result = await searchQuestions(schoolId, q, page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Questions retrieved successfully');
};