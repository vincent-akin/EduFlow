import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IAcademicSession } from '../../shared/interfaces/base.interface.js';

const AcademicSessionSchema = new Schema<IAcademicSession>(
  {
    ...BaseTenantSoftDeleteSchema,
    sessionName: {
      type: String,
      required: true,
      trim: true,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

AcademicSessionSchema.index({ schoolId: 1 });
AcademicSessionSchema.index({ schoolId: 1, sessionName: 1 }, { unique: true });
AcademicSessionSchema.index({ schoolId: 1, isActive: 1 });

export const AcademicSession = mongoose.model<IAcademicSession>('AcademicSession', AcademicSessionSchema);

// Export the interface type for use in other files
export type { IAcademicSession };