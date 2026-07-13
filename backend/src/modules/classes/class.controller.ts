import { Request, Response } from 'express';
import {
  createClass,
  getClassById,
  getAllClasses,
  updateClass,
  deleteClass,
  getClassesByTeacher,
} from './class.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const createClassController = async (req: Request, res: Response): Promise<Response> => {
  const classItem = await createClass({
    ...req.body,
    schoolId: (req as any).schoolId,
  });
  return ResponseHelper.success(res, classItem, 'Class created successfully', 201);
};

export const getClassByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  const classItem = await getClassById(id);
  return ResponseHelper.success(res, classItem, 'Class retrieved successfully');
};

export const getAllClassesController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};
  
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === 'true';
  }
  
  const result = await getAllClasses(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Classes retrieved successfully');
};

export const updateClassController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  const classItem = await updateClass(id, req.body);
  return ResponseHelper.success(res, classItem, 'Class updated successfully');
};

export const deleteClassController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  await deleteClass(id);
  return ResponseHelper.success(res, null, 'Class deleted successfully');
};

export const getClassesByTeacherController = async (req: Request, res: Response): Promise<Response> => {
  const { teacherId } = req.params;
  if (!teacherId) {
    return ResponseHelper.error(res, 'Teacher ID is required', 400);
  }
  const classes = await getClassesByTeacher(new Types.ObjectId(teacherId));
  return ResponseHelper.success(res, classes, 'Classes retrieved successfully');
};