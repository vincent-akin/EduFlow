import {
    createSubject as createSubjectRepo,
    findSubjectById,
    findSubjectByCode,
    findSubjectByName,
    findAllSubjects,
    updateSubject as updateSubjectRepo,
    softDeleteSubject,
    getSubjectsByClass as getSubjectsByClassRepo,
    getCoreSubjects as getCoreSubjectsRepo,
} from './subject.repository.js';
import { ISubject } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const createSubject = async (data: Partial<ISubject>): Promise<ISubject> => {
  // Check if subject with same code exists
    const existing = await findSubjectByCode(
        data.schoolId as Types.ObjectId,
        data.code!
    );
    if (existing) {
        throw new AppError('Subject with this code already exists', 409);
    }

    // Check if subject with same name exists
    const existingName = await findSubjectByName(
        data.schoolId as Types.ObjectId,
        data.name!
    );
    if (existingName) {
        throw new AppError('Subject with this name already exists', 409);
    }

    return createSubjectRepo(data);
};

export const getSubjectById = async (id: string): Promise<ISubject> => {
    const subject = await findSubjectById(id);
    if (!subject) {
        throw new AppError('Subject not found', 404);
    }
    return subject;
};

export const getAllSubjects = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
) => {
    return findAllSubjects(schoolId, page, limit, filter);
};

export const updateSubject = async (id: string, data: Partial<ISubject>): Promise<ISubject> => {
    const subject = await getSubjectById(id);

    // If code is changing, check for duplicates
    if (data.code && data.code !== subject.code) {
        const existing = await findSubjectByCode(
            subject.schoolId,
            data.code
        );
        if (existing) {
            throw new AppError('Subject with this code already exists', 409);
        }
    }

    // If name is changing, check for duplicates
    if (data.name && data.name !== subject.name) {
        const existing = await findSubjectByName(
            subject.schoolId,
            data.name
        );
        if (existing) {
            throw new AppError('Subject with this name already exists', 409);
        }
    }

    const updated = await updateSubjectRepo(id, data);
    if (!updated) {
        throw new AppError('Subject not found', 404);
    }
    return updated;
};

export const deleteSubject = async (id: string): Promise<void> => {
    const subject = await softDeleteSubject(id);
    if (!subject) {
        throw new AppError('Subject not found', 404);
    }
};

export const getSubjectsByClass = async (classId: Types.ObjectId): Promise<ISubject[]> => {
    return getSubjectsByClassRepo(classId);
};

export const getCoreSubjects = async (schoolId: Types.ObjectId): Promise<ISubject[]> => {
    return getCoreSubjectsRepo(schoolId);
};