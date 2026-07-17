import { Request, Response } from 'express';
import {
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  getStudentsByClass,
  createStudent,
  updateStudent,
  deleteStudent,
} from './student.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const getAllStudentsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.classId) {
    filter.classId = new Types.ObjectId(req.query.classId as string);
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const result = await getAllStudents(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Students retrieved successfully');
};

export const getStudentByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  const student = await getStudentById(id);
  return ResponseHelper.success(res, student, 'Student retrieved successfully');
};

export const getMyStudentProfileController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const student = await getStudentByUserId(userId);
  return ResponseHelper.success(res, student, 'My student profile retrieved successfully');
};

export const getStudentsByClassController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }

  const { page, limit } = getPaginationOptions(req.query);
  const result = await getStudentsByClass(new Types.ObjectId(classId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Students retrieved successfully');
};

export const createStudentController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const student = await createStudent({
    ...req.body,
    schoolId,
  });
  return ResponseHelper.success(res, student, 'Student created successfully', 201);
};

export const updateStudentController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  const student = await updateStudent(id, req.body);
  return ResponseHelper.success(res, student, 'Student updated successfully');
};

export const deleteStudentController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  await deleteStudent(id);
  return ResponseHelper.success(res, null, 'Student deleted successfully');
};