import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface IParent extends SoftDeleteDocument {
    userId: mongoose.Types.ObjectId;
    phone: string;
    address: string;
    occupation: string;
    children: mongoose.Types.ObjectId[]; // Student IDs
    isActive: boolean;
}

const ParentSchema = new Schema<IParent>(
    {
        ...BaseTenantSoftDeleteSchema,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
        },
        occupation: {
            type: String,
            default: '',
        },
        children: [
            {
                type: Schema.Types.ObjectId,
                ref: 'StudentProfile',
                default: [],
            },
        ],
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

ParentSchema.index({ schoolId: 1 });
//ParentSchema.index({ userId: 1 }, { unique: true });
ParentSchema.index({ children: 1 });

export const Parent = mongoose.model<IParent>('Parent', ParentSchema);