import { Question, IQuestion } from './question.model.js';
import { Types } from 'mongoose';

export const createQuestion = async (data: Partial<IQuestion>): Promise<IQuestion> => {
    const question = new Question(data);
    return question.save();
};

export const findQuestionById = async (id: string | Types.ObjectId): Promise<IQuestion | null> => {
    return Question.findById(id);
};

export const findAllQuestions = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
): Promise<{ data: IQuestion[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { schoolId, deletedAt: null, ...filter };
    const [data, total] = await Promise.all([
        Question.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Question.countDocuments(query),
    ]);
    return { data, total };
};

export const updateQuestion = async (
    id: string | Types.ObjectId,
    data: Partial<IQuestion>
    ): Promise<IQuestion | null> => {
    return Question.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
    );
};

export const softDeleteQuestion = async (id: string | Types.ObjectId): Promise<IQuestion | null> => {
    return Question.findByIdAndUpdate(
        id,
        { deletedAt: new Date(), isArchived: true },
        { new: true }
    );
};

export const archiveQuestion = async (id: string | Types.ObjectId): Promise<IQuestion | null> => {
    return Question.findByIdAndUpdate(
        id,
        { isArchived: true },
        { new: true }
    );
};

export const incrementUsageCount = async (id: string | Types.ObjectId): Promise<IQuestion | null> => {
    return Question.findByIdAndUpdate(
        id,
        { $inc: { usageCount: 1 } },
        { new: true }
    );
};

export const getQuestionsBySubject = async (
    subjectId: Types.ObjectId,
    page = 1,
    limit = 10
    ): Promise<{ data: IQuestion[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { subjectId, deletedAt: null, isArchived: false };
    const [data, total] = await Promise.all([
        Question.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Question.countDocuments(query),
    ]);
    return { data, total };
};

export const getQuestionsByTopic = async (
    schoolId: Types.ObjectId,
    topic: string,
    page = 1,
    limit = 10
    ): Promise<{ data: IQuestion[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { schoolId, topic, deletedAt: null, isArchived: false };
    const [data, total] = await Promise.all([
        Question.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Question.countDocuments(query),
    ]);
    return { data, total };
};

export const getQuestionsByDifficulty = async (
    schoolId: Types.ObjectId,
    difficulty: string,
    page = 1,
    limit = 10
    ): Promise<{ data: IQuestion[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { schoolId, difficulty, deletedAt: null, isArchived: false };
    const [data, total] = await Promise.all([
        Question.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Question.countDocuments(query),
    ]);
    return { data, total };
};

export const searchQuestions = async (
    schoolId: Types.ObjectId,
    searchTerm: string,
    page = 1,
    limit = 10
    ): Promise<{ data: IQuestion[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = {
        schoolId,
        deletedAt: null,
        isArchived: false,
        $or: [
            { questionText: { $regex: searchTerm, $options: 'i' } },
            { topic: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
    };
    const [data, total] = await Promise.all([
        Question.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Question.countDocuments(query),
    ]);
    return { data, total };
};