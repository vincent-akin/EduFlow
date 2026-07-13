import { Request, Response } from 'express';
import {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
  initializeDefaultRoles,
  PERMISSIONS,
} from './role.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';


export const createRoleController = async (req: Request, res: Response): Promise<Response> => {
  const role = await createRole({
    ...req.body,
    schoolId: (req as any).schoolId,
  });
  return ResponseHelper.success(res, role, 'Role created successfully', 201);
};

export const getRoleByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Role ID is required', 400);
  }
  const role = await getRoleById(id);
  return ResponseHelper.success(res, role, 'Role retrieved successfully');
};

export const getAllRolesController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};
  if (req.query.isSystem) {
    filter.isSystem = req.query.isSystem === 'true';
  }
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === 'true';
  }
  const result = await getAllRoles(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Roles retrieved successfully');
};

export const updateRoleController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Role ID is required', 400);
  }
  const role = await updateRole(id, req.body);
  return ResponseHelper.success(res, role, 'Role updated successfully');
};

export const deleteRoleController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Role ID is required', 400);
  }
  await deleteRole(id);
  return ResponseHelper.success(res, null, 'Role deleted successfully');
};

export const initializeRolesController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  await initializeDefaultRoles(schoolId);
  return ResponseHelper.success(res, null, 'Default roles initialized successfully');
};

export const getPermissionsController = async (_req: Request, res: Response): Promise<Response> => {
  return ResponseHelper.success(res, PERMISSIONS, 'Permissions retrieved successfully');
};