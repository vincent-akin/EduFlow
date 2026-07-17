import {
  findUsers,
  findUserById,
  findUserByEmail,
  updateUser as updateUserRepo,
  softDeleteUser,
  findTeachers,
  findStudents,
  findParents,
} from './user.repository.js';
import { IUser } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const getAllUsers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findUsers(schoolId, page, limit, filter);
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await findUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const getUserByEmail = async (email: string): Promise<IUser> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const updateUser = async (id: string, data: Partial<IUser>): Promise<IUser> => {
  // Don't allow role changes through this endpoint (security)
  if (data.role) {
    throw new AppError('Cannot change user role through this endpoint', 400);
  }

  const updated = await updateUserRepo(id, data);
  if (!updated) {
    throw new AppError('User not found', 404);
  }
  return updated;
};

export const deleteUser = async (id: string): Promise<void> => {
  const user = await softDeleteUser(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
};

export const getAllTeachers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findTeachers(schoolId, page, limit);
};

export const getAllStudents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findStudents(schoolId, page, limit);
};

export const getAllParents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findParents(schoolId, page, limit);
};