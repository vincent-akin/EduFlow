import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { ITeacherProfile } from '../../shared/interfaces/base.interface.js';

const TeacherProfileSchema = new Schema<ITeacherProfile>(
    {
        ...BaseTenantSoftDeleteSchema,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        assignedClasses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class',
        },
        ],
        assignedSubjects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
        },
        ],
        employmentDate: {
            type: Date,
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

TeacherProfileSchema.index({ schoolId: 1 });
TeacherProfileSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });
TeacherProfileSchema.index({ userId: 1 }, { unique: true });

export const TeacherProfile = mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);