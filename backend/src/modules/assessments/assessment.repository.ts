import { Assessment, IAssessment } from './assessment.model.js';
import { Types } from 'mongoose';

export const createAssessment = async (data: Partial<IAssessment>): Promise<IAssessment> => {
    const assessment = new Assessment(data);
    return assessment.save();
};

export const findAssessmentById = async (id: string | Types.ObjectId): Promise<IAssessment | null> => {
    return Assessment.findById(id);
};

export const findAllAssessments = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
): Promise<{ data: IAssessment[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { schoolId, deletedAt: null, ...filter };
    const [data, total] = await Promise.all([
        Assessment.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Assessment.countDocuments(query),
    ]);
    return { data, total };
};

export const updateAssessment = async (
    id: string | Types.ObjectId,
    data: Partial<IAssessment>
    ): Promise<IAssessment | null> => {
    return Assessment.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
    );
};

export const softDeleteAssessment = async (id: string | Types.ObjectId): Promise<IAssessment | null> => {
    return Assessment.findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: 'archived' },
        { new: true }
    );
};

export const publishAssessment = async (
    id: string | Types.ObjectId,
    publishedBy: Types.ObjectId
    ): Promise<IAssessment | null> => {
    return Assessment.findByIdAndUpdate(
        id,
        {
            status: 'published',
            publishedAt: new Date(),
            publishedBy,
        },
        { new: true }
    );
};

export const closeAssessment = async (id: string | Types.ObjectId): Promise<IAssessment | null> => {
    return Assessment.findByIdAndUpdate(
        id,
        { status: 'closed' },
        { new: true }
    );
};

export const getAssessmentsByClass = async (
    classId: Types.ObjectId,
    page = 1,
    limit = 10
    ): Promise<{ data: IAssessment[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { classId, deletedAt: null, status: { $in: ['published', 'closed'] } };
    const [data, total] = await Promise.all([
        Assessment.find(query).skip(skip).limit(limit).sort({ startTime: 1 }),
        Assessment.countDocuments(query),
    ]);
    return { data, total };
};

export const getAssessmentsBySubject = async (
    subjectId: Types.ObjectId,
    page = 1,
    limit = 10
    ): Promise<{ data: IAssessment[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { subjectId, deletedAt: null };
    const [data, total] = await Promise.all([
        Assessment.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Assessment.countDocuments(query),
    ]);
    return { data, total };
};

export const getAssessmentsByTeacher = async (
    createdBy: Types.ObjectId,
    page = 1,
    limit = 10
    ): Promise<{ data: IAssessment[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { createdBy, deletedAt: null };
    const [data, total] = await Promise.all([
        Assessment.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Assessment.countDocuments(query),
    ]);
    return { data, total };
};

export const getUpcomingAssessments = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10
    ): Promise<{ data: IAssessment[]; total: number }> => {
    const skip = (page - 1) * limit;
    const now = new Date();
    const query = {
        schoolId,
        deletedAt: null,
        status: 'published',
        startTime: { $gt: now },
    };
    const [data, total] = await Promise.all([
        Assessment.find(query).skip(skip).limit(limit).sort({ startTime: 1 }),
        Assessment.countDocuments(query),
    ]);
    return { data, total };
};

export const getActiveAssessments = async (
    schoolId: Types.ObjectId
    ): Promise<IAssessment[]> => {
    const now = new Date();
    return Assessment.find({
        schoolId,
        deletedAt: null,
        status: 'published',
        startTime: { $lte: now },
        endTime: { $gte: now },
    }).sort({ startTime: 1 });
};