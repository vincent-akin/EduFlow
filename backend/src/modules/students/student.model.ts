import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IStudentProfile } from '../../shared/interfaces/base.interface.js';

const StudentProfileSchema = new Schema<IStudentProfile>(
    {
        ...BaseTenantSoftDeleteSchema,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        admissionNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        subjectIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
        },
        ],
        guardian: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            default: null,
            trim: true,
            lowercase: true,
        },
        },
        enrollmentDate: {
            type: Date,
            required: true,
        },
        graduationYear: {
            type: Number,
            default: null,
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

StudentProfileSchema.index({ schoolId: 1 });
StudentProfileSchema.index({ schoolId: 1, admissionNumber: 1 }, { unique: true });
StudentProfileSchema.index({ classId: 1 });
//StudentProfileSchema.index({ userId: 1 }, { unique: true });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);