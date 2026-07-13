import {
  createParent as createParentRepo,
  findParentById,
  findParentByUserId,
  findAllParents,
  updateParent as updateParentRepo,
  deleteParent as deleteParentRepo,
  getParentChildren as getParentChildrenRepo,
  linkChildToParent,
} from './parent.repository.js';
import { IParent } from './parent.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export const createParent = async (data: Partial<IParent>): Promise<IParent> => {
  // Check if userId exists
  if (!data.userId) {
    throw new AppError('User ID is required', 400);
  }
  
  // Check if parent already exists for user
  const existing = await findParentByUserId(data.userId as Types.ObjectId);
  if (existing) {
    throw new AppError('Parent profile already exists for this user', 409);
  }
  return createParentRepo(data);
};

export const getParentById = async (id: string): Promise<IParent> => {
  const parent = await findParentById(id);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  return parent;
};

export const getParentByUserId = async (userId: Types.ObjectId): Promise<IParent> => {
  const parent = await findParentByUserId(userId);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  return parent;
};

export const getAllParents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllParents(schoolId, page, limit, filter);
};

export const updateParent = async (id: string, data: Partial<IParent>): Promise<IParent> => {
  const updated = await updateParentRepo(id, data);
  if (!updated) {
    throw new AppError('Parent not found', 404);
  }
  return updated;
};

export const deleteParent = async (id: string): Promise<void> => {
  const parent = await deleteParentRepo(id);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
};

export const getParentChildren = async (parentId: string): Promise<IParent> => {
  const parent = await getParentChildrenRepo(new Types.ObjectId(parentId));
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  return parent;
};

export const linkChild = async (parentId: string, studentId: string): Promise<IParent> => {
  const parent = await linkChildToParent(
    new Types.ObjectId(parentId),
    new Types.ObjectId(studentId)
  );
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  return parent;
};