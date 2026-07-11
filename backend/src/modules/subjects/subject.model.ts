import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { ISubject } from '../../shared/interfaces/base.interface.js';

const SubjectSchema = new Schema<ISubject>(
    {
        ...BaseTenantSoftDeleteSchema,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            default: null,
        },
        applicableClasses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class',
        },
        ],
        isCore: {
            type: Boolean,
            default: false,
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

SubjectSchema.index({ schoolId: 1 });
SubjectSchema.index({ schoolId: 1, code: 1 }, { unique: true });
SubjectSchema.index({ schoolId: 1, name: 1 });

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
export type { ISubject };