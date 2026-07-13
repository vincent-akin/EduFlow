import { Schema } from 'mongoose';

export const TenantSchema = {
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    
  },
};

export const SoftDeleteSchema = {
  deletedAt: {
    type: Date,
    default: null,
  },
};

export const BaseTenantSchema = {
  ...TenantSchema,
};

export const BaseSoftDeleteSchema = {
  ...SoftDeleteSchema,
};

export const BaseTenantSoftDeleteSchema = {
  ...TenantSchema,
  ...SoftDeleteSchema,
};