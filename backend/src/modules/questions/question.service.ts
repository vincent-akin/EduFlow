import {
    createQuestion as createQuestionRepo,
    findQuestionById,
    findAllQuestions,
    updateQuestion as updateQuestionRepo,
    softDeleteQuestion,
    archiveQuestion,
    incrementUsageCount,
    getQuestionsBySubject as getQuestionsBySubjectRepo,
    getQuestionsByTopic as getQuestionsByTopicRepo,
    getQuestionsByDifficulty as getQuestionsByDifficultyRepo,
    searchQuestions as searchQuestionsRepo,
} from './question.repository.js';
import { IQuestion } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const createQuestion = async (data: Partial<IQuestion>): Promise<IQuestion> => {
    // Validate that MCQ questions have options
    if (data.type === 'mcq') {
        if (!data.options || data.options.length < 2) {
            throw new AppError('MCQ questions must have at least 2 options', 400);
        }
        // Ensure at least one correct option
        const hasCorrect = data.options.some((opt) => opt.isCorrect);
        if (!hasCorrect) {
            throw new AppError('MCQ questions must have at least one correct option', 400);
        }
    }

  // For theory questions, ensure correctAnswer is provided
    if (data.type === 'theory' && !data.correctAnswer) {
        throw new AppError('Theory questions must have a correct answer', 400);
    }

    return createQuestionRepo(data);
};

export const getQuestionById = async (id: string): Promise<IQuestion> => {
    const question = await findQuestionById(id);
    if (!question) {
        throw new AppError('Question not found', 404);
    }
    return question;
};

export const getAllQuestions = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
) => {
    return findAllQuestions(schoolId, page, limit, filter);
};

export const updateQuestion = async (id: string, data: Partial<IQuestion>): Promise<IQuestion> => {
    const question = await getQuestionById(id);

    // If question is archived, prevent updates
    if (question.isArchived) {
        throw new AppError('Cannot update archived question', 400);
    }

    // Validate MCQ options if type is changing to MCQ
    if (data.type === 'mcq') {
        if (!data.options || data.options.length < 2) {
            throw new AppError('MCQ questions must have at least 2 options', 400);
        }
        const hasCorrect = data.options.some((opt) => opt.isCorrect);
        if (!hasCorrect) {
            throw new AppError('MCQ questions must have at least one correct option', 400);
        }
    }

    const updated = await updateQuestionRepo(id, data);
    if (!updated) {
        throw new AppError('Question not found', 404);
    }
    return updated;
};

export const deleteQuestion = async (id: string): Promise<void> => {
    const question = await softDeleteQuestion(id);
    if (!question) {
        throw new AppError('Question not found', 404);
    }
};

export const archiveQuestionById = async (id: string): Promise<IQuestion> => {
    const question = await archiveQuestion(id);
    if (!question) {
        throw new AppError('Question not found', 404);
    }
    return question;
};

export const incrementQuestionUsage = async (id: string): Promise<IQuestion> => {
    const question = await incrementUsageCount(id);
    if (!question) {
        throw new AppError('Question not found', 404);
    }
    return question;
};

export const getQuestionsBySubject = async (
    subjectId: Types.ObjectId,
    page = 1,
    limit = 10
    ) => {
    return getQuestionsBySubjectRepo(subjectId, page, limit);
};

export const getQuestionsByTopic = async (
    schoolId: Types.ObjectId,
    topic: string,
    page = 1,
    limit = 10
) => {
    return getQuestionsByTopicRepo(schoolId, topic, page, limit);
};

export const getQuestionsByDifficulty = async (
    schoolId: Types.ObjectId,
    difficulty: string,
    page = 1,
    limit = 10
) => {
    return getQuestionsByDifficultyRepo(schoolId, difficulty, page, limit);
};

export const searchQuestions = async (
    schoolId: Types.ObjectId,
    searchTerm: string,
    page = 1,
    limit = 10
) => {
    return searchQuestionsRepo(schoolId, searchTerm, page, limit);
};