import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { IAuditLog } from '../../shared/interfaces/base.interface.js';

const AuditLogSchema = new Schema<IAuditLog>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

AuditLogSchema.index({ schoolId: 1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ entity: 1 });
AuditLogSchema.index({ entityId: 1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ schoolId: 1, entity: 1, entityId: 1 });
AuditLogSchema.index({ schoolId: 1, userId: 1, action: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export type { IAuditLog };