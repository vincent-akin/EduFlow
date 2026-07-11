import { Class, IClass } from './class.model.js';
import { Types } from 'mongoose';

export const createClass = async (data: Partial<IClass>): Promise<IClass> => {
    const classItem = new Class(data);
    return classItem.save();
};

export const findClassById = async (id: string | Types.ObjectId): Promise<IClass | null> => {
    return Class.findById(id);
};

export const findClassByName = async (schoolId: Types.ObjectId, name: string): Promise<IClass | null> => {
    return Class.findOne({ schoolId, name, deletedAt: null });
};

export const findAllClasses = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
): Promise<{ data: IClass[]; total: number }> => {
    const skip = (page - 1) * limit;
    const query = { schoolId, deletedAt: null, ...filter };
    const [data, total] = await Promise.all([
        Class.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Class.countDocuments(query),
    ]);
    return { data, total };
};

export const updateClass = async (
    id: string | Types.ObjectId,
    data: Partial<IClass>
): Promise<IClass | null> => {
    return Class.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
    );
};

export const softDeleteClass = async (id: string | Types.ObjectId): Promise<IClass | null> => {
    return Class.findByIdAndUpdate(
        id,
        { deletedAt: new Date(), isActive: false },
        { new: true }
    );
};

export const getClassesByTeacher = async (teacherId: Types.ObjectId): Promise<IClass[]> => {
    return Class.find({ classTeacherId: teacherId, deletedAt: null, isActive: true });
};