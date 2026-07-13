import { Request, Response } from 'express';
import {
  uploadFile,
  getFileById,
  deleteFile,
  getFilesByCategory,
  getFilesByUser,
} from './file.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';


export const uploadFileController = async (req: Request, res: Response): Promise<Response> => {
  const file = (req as any).file;
  if (!file) {
    return ResponseHelper.error(res, 'No file uploaded', 400);
  }

  const { category } = req.body;
  if (!category) {
    return ResponseHelper.error(res, 'File category is required', 400);
  }

  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  const uploadedFile = await uploadFile(file, userId, schoolId, category);
  return ResponseHelper.success(res, uploadedFile, 'File uploaded successfully', 201);
};

export const getFileByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'File ID is required', 400);
  }
  const file = await getFileById(id);
  return ResponseHelper.success(res, file, 'File retrieved successfully');
};

export const getFilesByCategoryController = async (req: Request, res: Response): Promise<Response> => {
  const { category } = req.params;
  if (!category) {
    return ResponseHelper.error(res, 'Category is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const result = await getFilesByCategory(schoolId, category, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Files retrieved successfully');
};

export const getMyFilesController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;
  const result = await getFilesByUser(userId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My files retrieved successfully');
};

export const deleteFileController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'File ID is required', 400);
  }
  await deleteFile(id);
  return ResponseHelper.success(res, null, 'File deleted successfully');
};