import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IAcademicTerm } from '../../shared/interfaces/base.interface.js';

const AcademicTermSchema = new Schema<IAcademicTerm>(
    {
        ...BaseTenantSoftDeleteSchema,
        sessionId: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSession',
            required: true,
        },
        name: {
            type: String,
            enum: ['First Term', 'Second Term', 'Third Term'],
            required: true,
        },
        order: {
            type: Number,
            required: true,
            min: 1,
            max: 3,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
        type: Boolean,
        default: false,
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

AcademicTermSchema.index({ schoolId: 1 });
AcademicTermSchema.index({ sessionId: 1 });
AcademicTermSchema.index({ schoolId: 1, sessionId: 1, order: 1 }, { unique: true });

export const AcademicTerm = mongoose.model<IAcademicTerm>('AcademicTerm', AcademicTermSchema);

// Export the interface type for use in other files
export type { IAcademicTerm };