import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IClass } from '../../shared/interfaces/base.interface.js';

const ClassSchema = new Schema<IClass>(
    {
        ...BaseTenantSoftDeleteSchema,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            required: true,
            trim: true,
        },
        classTeacherId: {
            type: Schema.Types.ObjectId,
            ref: 'TeacherProfile',
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ClassSchema.index({ schoolId: 1 });
ClassSchema.index({ schoolId: 1, name: 1 }, { unique: true });
ClassSchema.index({ classTeacherId: 1 });
ClassSchema.index({ isActive: 1 });

export const Class = mongoose.model<IClass>('Class', ClassSchema);
export type { IClass };