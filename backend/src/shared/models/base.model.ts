import { Schema } from 'mongoose';

export const BaseSchema = {
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

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

export const BaseTenantSoftDeleteSchema = {
  ...BaseSchema,
  ...TenantSchema,
  ...SoftDeleteSchema,
};

export const BaseTenantSchema = {
  ...BaseSchema,
  ...TenantSchema,
};

export const BaseSoftDeleteSchema = {
  ...BaseSchema,
  ...SoftDeleteSchema,
};