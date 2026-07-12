import { Request, Response } from 'express';
import {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByEntity,
  getAuditLogsByAction,
} from './audit.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const getAuditLogByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Audit log ID is required', 400);
  }
  const auditLog = await getAuditLogById(id);
  return ResponseHelper.success(res, auditLog, 'Audit log retrieved successfully');
};

export const getAllAuditLogsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.userId) {
    filter.userId = new Types.ObjectId(req.query.userId as string);
  }
  if (req.query.entity) {
    filter.entity = req.query.entity;
  }
  if (req.query.action) {
    filter.action = req.query.action;
  }
  if (req.query.entityId) {
    filter.entityId = new Types.ObjectId(req.query.entityId as string);
  }

  const result = await getAllAuditLogs(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Audit logs retrieved successfully');
};

export const getAuditLogsByUserController = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
  if (!userId) {
    return ResponseHelper.error(res, 'User ID is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getAuditLogsByUser(new Types.ObjectId(userId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Audit logs retrieved successfully');
};

export const getAuditLogsByEntityController = async (req: Request, res: Response): Promise<Response> => {
  const { entity, entityId } = req.params;
  if (!entity || !entityId) {
    return ResponseHelper.error(res, 'Entity and Entity ID are required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const result = await getAuditLogsByEntity(entity, new Types.ObjectId(entityId), page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Audit logs retrieved successfully');
};

export const getAuditLogsByActionController = async (req: Request, res: Response): Promise<Response> => {
  const { action } = req.params;
  if (!action) {
    return ResponseHelper.error(res, 'Action is required', 400);
  }
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const result = await getAuditLogsByAction(schoolId, action, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Audit logs retrieved successfully');
};