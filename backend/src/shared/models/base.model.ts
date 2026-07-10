import { Schema } from 'mongoose';

/**
 * Base schema with timestamps
 * All models should extend this
 */
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

/**
 * Tenant schema with schoolId
 * All tenant-owned models should extend this
 */
export const TenantSchema = {
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
    },
};

/**
 * Soft delete schema
 * For models that support soft deletion
 */
export const SoftDeleteSchema = {
    deletedAt: {
        type: Date,
        default: null,
    },
};

/**
 * Combined schema for tenant-owned soft-deletable models
 */
export const BaseTenantSoftDeleteSchema = {
    ...BaseSchema,
    ...TenantSchema,
    ...SoftDeleteSchema,
};