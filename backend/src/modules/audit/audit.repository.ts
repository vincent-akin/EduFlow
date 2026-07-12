import { AuditLog, IAuditLog } from './audit.model.js';
import { Types } from 'mongoose';

// Helper type for creating audit logs
type AuditLogInput = Pick<IAuditLog, 'userId' | 'schoolId' | 'action' | 'entity' | 'entityId'> &
  Partial<Omit<IAuditLog, 'userId' | 'schoolId' | 'action' | 'entity' | 'entityId'>>;

export const createAuditLog = async (data: AuditLogInput): Promise<IAuditLog> => {
  const auditLog = new AuditLog(data);
  return auditLog.save();
};

export const createBulkAuditLogs = async (
  data: AuditLogInput[]
): Promise<IAuditLog[]> => {
  if (data.length === 0) {
    return [];
  }

  // Filter out incomplete data and ensure all required fields
  const validData = data
    .filter((item): item is Required<AuditLogInput> => {
      return !!(
        item.userId &&
        item.schoolId &&
        item.action &&
        item.entity &&
        item.entityId
      );
    })
    .map((item) => ({
      userId: item.userId,
      schoolId: item.schoolId,
      action: item.action,
      entity: item.entity,
      entityId: item.entityId,
      ipAddress: item.ipAddress || 'unknown',
      userAgent: item.userAgent || 'unknown',
      metadata: item.metadata || {},
    }));

  if (validData.length === 0) {
    return [];
  }

  // Create each document individually to maintain type safety
  const auditLogs: IAuditLog[] = [];
  for (const data of validData) {
    const auditLog = new AuditLog(data);
    await auditLog.save();
    auditLogs.push(auditLog);
  }

  return auditLogs;
};

export const findAuditLogById = async (id: string | Types.ObjectId): Promise<IAuditLog | null> => {
  return AuditLog.findById(id);
};

export const findAllAuditLogs = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IAuditLog[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, ...filter };
  const [data, total] = await Promise.all([
    AuditLog.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    AuditLog.countDocuments(query),
  ]);
  return { data, total };
};

export const findAuditLogsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IAuditLog[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { userId };
  const [data, total] = await Promise.all([
    AuditLog.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    AuditLog.countDocuments(query),
  ]);
  return { data, total };
};

export const findAuditLogsByEntity = async (
  entity: string,
  entityId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IAuditLog[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { entity, entityId };
  const [data, total] = await Promise.all([
    AuditLog.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    AuditLog.countDocuments(query),
  ]);
  return { data, total };
};

export const findAuditLogsByAction = async (
  schoolId: Types.ObjectId,
  action: string,
  page = 1,
  limit = 10
): Promise<{ data: IAuditLog[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, action };
  const [data, total] = await Promise.all([
    AuditLog.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    AuditLog.countDocuments(query),
  ]);
  return { data, total };
};