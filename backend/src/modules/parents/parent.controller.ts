import { Request, Response } from 'express';
import {
  createParent,
  getParentById,
  getParentByUserId,
  getAllParents,
  updateParent,
  deleteParent,
  getParentChildren,
  linkChild,
} from './parent.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';

export const createParentController = async (req: Request, res: Response): Promise<Response> => {
  const parent = await createParent({
    ...req.body,
    schoolId: (req as any).schoolId,
  });
  return ResponseHelper.success(res, parent, 'Parent created successfully', 201);
};

export const getParentByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Parent ID is required', 400);
  }
  const parent = await getParentById(id);
  return ResponseHelper.success(res, parent, 'Parent retrieved successfully');
};

export const getMyParentProfileController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const parent = await getParentByUserId(userId);
  return ResponseHelper.success(res, parent, 'Parent profile retrieved successfully');
};

export const getAllParentsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === 'true';
  }
  const result = await getAllParents(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Parents retrieved successfully');
};

export const updateParentController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Parent ID is required', 400);
  }
  const parent = await updateParent(id, req.body);
  return ResponseHelper.success(res, parent, 'Parent updated successfully');
};

export const deleteParentController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Parent ID is required', 400);
  }
  await deleteParent(id);
  return ResponseHelper.success(res, null, 'Parent deleted successfully');
};

export const getParentChildrenController = async (req: Request, res: Response): Promise<Response> => {
  const { parentId } = req.params;
  if (!parentId) {
    return ResponseHelper.error(res, 'Parent ID is required', 400);
  }
  const parent = await getParentChildren(parentId);
  return ResponseHelper.success(res, parent.children, 'Children retrieved successfully');
};

export const linkChildController = async (req: Request, res: Response): Promise<Response> => {
  const { parentId, studentId } = req.body;
  if (!parentId || !studentId) {
    return ResponseHelper.error(res, 'Parent ID and Student ID are required', 400);
  }
  const parent = await linkChild(parentId, studentId);
  return ResponseHelper.success(res, parent, 'Child linked successfully');
};