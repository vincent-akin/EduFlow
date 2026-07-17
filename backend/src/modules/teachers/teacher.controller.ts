import { Request, Response } from 'express';
import {
  getAllTeachers,
  getTeacherById,
  getTeacherByUserId,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from './teacher.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';

export const getAllTeachersController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const result = await getAllTeachers(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Teachers retrieved successfully');
};

export const getTeacherByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Teacher ID is required', 400);
  }

  const teacher = await getTeacherById(id);
  return ResponseHelper.success(res, teacher, 'Teacher retrieved successfully');
};

export const getMyTeacherProfileController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const teacher = await getTeacherByUserId(userId);
  return ResponseHelper.success(res, teacher, 'My teacher profile retrieved successfully');
};

export const createTeacherController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const teacher = await createTeacher({
    ...req.body,
    schoolId,
  });
  return ResponseHelper.success(res, teacher, 'Teacher created successfully', 201);
};

export const updateTeacherController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Teacher ID is required', 400);
  }

  const teacher = await updateTeacher(id, req.body);
  return ResponseHelper.success(res, teacher, 'Teacher updated successfully');
};

export const deleteTeacherController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Teacher ID is required', 400);
  }

  await deleteTeacher(id);
  return ResponseHelper.success(res, null, 'Teacher deleted successfully');
};