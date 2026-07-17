import { Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllTeachers,
  getAllStudents,
  getAllParents,
} from './user.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';

// ============ Get All Users ============
export const getAllUsersController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const result = await getAllUsers(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Users retrieved successfully');
};

// ============ Get User by ID ============
export const getUserByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'User ID is required', 400);
  }

  const user = await getUserById(id);
  return ResponseHelper.success(res, user, 'User retrieved successfully');
};

// ============ Update User ============
export const updateUserController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'User ID is required', 400);
  }

  const user = await updateUser(id, req.body);
  return ResponseHelper.success(res, user, 'User updated successfully');
};

// ============ Delete User ============
export const deleteUserController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'User ID is required', 400);
  }

  await deleteUser(id);
  return ResponseHelper.success(res, null, 'User deleted successfully');
};

// ============ Get All Teachers ============
export const getTeachersController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;

  const result = await getAllTeachers(schoolId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Teachers retrieved successfully');
};

// ============ Get All Students ============
export const getStudentsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;

  const result = await getAllStudents(schoolId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Students retrieved successfully');
};

// ============ Get All Parents ============
export const getParentsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;

  const result = await getAllParents(schoolId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Parents retrieved successfully');
};