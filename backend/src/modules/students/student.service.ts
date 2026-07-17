import {
  findStudents,
  findStudentById,
  findStudentByUserId,
  findStudentsByClass,
  createStudent as createStudentRepo,
  updateStudent as updateStudentRepo,
  softDeleteStudent,
} from './student.repository.js';
import { IStudentProfile } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const getAllStudents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findStudents(schoolId, page, limit, filter);
};

export const getStudentById = async (id: string): Promise<IStudentProfile> => {
  const student = await findStudentById(id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return student;
};

export const getStudentByUserId = async (userId: Types.ObjectId): Promise<IStudentProfile> => {
  const student = await findStudentByUserId(userId);
  if (!student) {
    throw new AppError('Student profile not found', 404);
  }
  return student;
};

export const getStudentsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findStudentsByClass(classId, page, limit);
};

export const createStudent = async (data: Partial<IStudentProfile>): Promise<IStudentProfile> => {
  // Check if student already exists for this user
  if (data.userId) {
    const existing = await findStudentByUserId(data.userId as Types.ObjectId);
    if (existing) {
      throw new AppError('Student profile already exists for this user', 409);
    }
  }

  return createStudentRepo(data);
};

export const updateStudent = async (id: string, data: Partial<IStudentProfile>): Promise<IStudentProfile> => {
  const updated = await updateStudentRepo(id, data);
  if (!updated) {
    throw new AppError('Student not found', 404);
  }
  return updated;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const student = await softDeleteStudent(id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
};