import {
  findTeachers,
  findTeacherById,
  findTeacherByUserId,
  createTeacher as createTeacherRepo,
  updateTeacher as updateTeacherRepo,
  softDeleteTeacher,
} from './teacher.repository.js';
import { ITeacherProfile } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const getAllTeachers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findTeachers(schoolId, page, limit, filter);
};

export const getTeacherById = async (id: string): Promise<ITeacherProfile> => {
  const teacher = await findTeacherById(id);
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }
  return teacher;
};

export const getTeacherByUserId = async (userId: Types.ObjectId): Promise<ITeacherProfile> => {
  const teacher = await findTeacherByUserId(userId);
  if (!teacher) {
    throw new AppError('Teacher profile not found', 404);
  }
  return teacher;
};

export const createTeacher = async (data: Partial<ITeacherProfile>): Promise<ITeacherProfile> => {
  // Check if teacher already exists for this user
  if (data.userId) {
    const existing = await findTeacherByUserId(data.userId as Types.ObjectId);
    if (existing) {
      throw new AppError('Teacher profile already exists for this user', 409);
    }
  }

  return createTeacherRepo(data);
};

export const updateTeacher = async (id: string, data: Partial<ITeacherProfile>): Promise<ITeacherProfile> => {
  const updated = await updateTeacherRepo(id, data);
  if (!updated) {
    throw new AppError('Teacher not found', 404);
  }
  return updated;
};

export const deleteTeacher = async (id: string): Promise<void> => {
  const teacher = await softDeleteTeacher(id);
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }
};