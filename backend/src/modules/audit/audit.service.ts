import {
  createAuditLog as createAuditLogRepo,
  createBulkAuditLogs as createBulkAuditLogsRepo,
  findAuditLogById,
  findAllAuditLogs,
  findAuditLogsByUser,
  findAuditLogsByEntity,
  findAuditLogsByAction,
} from './audit.repository.js';
import { IAuditLog } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Request } from 'express';

export const createAuditLog = async (data: Partial<IAuditLog>): Promise<IAuditLog> => {
  return createAuditLogRepo(data);
};

export const createAuditLogFromRequest = async (
  req: Request,
  action: string,
  entity: string,
  entityId: Types.ObjectId,
  metadata: any = {}
): Promise<IAuditLog> => {
  const userId = (req as any).user?.id;
  const schoolId = (req as any).schoolId;

  if (!userId || !schoolId) {
    throw new AppError('User or school not authenticated', 401);
  }

  const auditData = {
    userId: new Types.ObjectId(userId),
    schoolId: new Types.ObjectId(schoolId),
    action,
    entity,
    entityId,
    ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('user-agent') || 'unknown',
    metadata,
  };

  return createAuditLogRepo(auditData);
};

export const createBulkAuditLogs = async (
  data: Partial<IAuditLog>[]
): Promise<IAuditLog[]> => {
  return createBulkAuditLogsRepo(data);
};

export const getAuditLogById = async (id: string): Promise<IAuditLog> => {
  const auditLog = await findAuditLogById(id);
  if (!auditLog) {
    throw new AppError('Audit log not found', 404);
  }
  return auditLog;
};

export const getAllAuditLogs = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllAuditLogs(schoolId, page, limit, filter);
};

export const getAuditLogsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findAuditLogsByUser(userId, page, limit);
};

export const getAuditLogsByEntity = async (
  entity: string,
  entityId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findAuditLogsByEntity(entity, entityId, page, limit);
};

export const getAuditLogsByAction = async (
  schoolId: Types.ObjectId,
  action: string,
  page = 1,
  limit = 10
) => {
  return findAuditLogsByAction(schoolId, action, page, limit);
};