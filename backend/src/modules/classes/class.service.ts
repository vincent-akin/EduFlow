import {
    createClass as createClassRepo,
    findClassById,
    findClassByName,
    findAllClasses,
    updateClass as updateClassRepo,
    softDeleteClass,
    getClassesByTeacher as getClassesByTeacherRepo,
} from './class.repository.js';
import { IClass } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const createClass = async (data: Partial<IClass>): Promise<IClass> => {
    // Check if class with same name exists
    const existing = await findClassByName(
        data.schoolId as Types.ObjectId,
        data.name!
    );
    if (existing) {
        throw new AppError('Class with this name already exists', 409);
    }

    return createClassRepo(data);
};

export const getClassById = async (id: string): Promise<IClass> => {
    const classItem = await findClassById(id);
    if (!classItem) {
        throw new AppError('Class not found', 404);
    }
    return classItem;
};

export const getAllClasses = async (
        schoolId: Types.ObjectId,
        page = 1,
        limit = 10,
        filter: any = {}
    ) => {
    return findAllClasses(schoolId, page, limit, filter);
};

export const updateClass = async (id: string, data: Partial<IClass>): Promise<IClass> => {
    const classItem = await getClassById(id);

    // If name is changing, check for duplicates
    if (data.name && data.name !== classItem.name) {
        const existing = await findClassByName(
            classItem.schoolId,
            data.name
        );
        if (existing) {
            throw new AppError('Class with this name already exists', 409);
        }
    }

    const updated = await updateClassRepo(id, data);
    if (!updated) {
        throw new AppError('Class not found', 404);
    }
    return updated;
};

export const deleteClass = async (id: string): Promise<void> => {
    const classItem = await softDeleteClass(id);
    if (!classItem) {
        throw new AppError('Class not found', 404);
    }
};

export const getClassesByTeacher = async (teacherId: Types.ObjectId): Promise<IClass[]> => {
    return getClassesByTeacherRepo(teacherId);
};