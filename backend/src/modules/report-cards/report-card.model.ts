import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IReportCard } from '../../shared/interfaces/base.interface.js';

const ReportCardSchema = new Schema<IReportCard>(
  {
    ...BaseTenantSoftDeleteSchema,
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true,
    },
    termId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicTerm',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subjects: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        grade: {
          type: String,
          required: true,
          trim: true,
        },
        remark: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
    averageScore: {
      type: Number,
      required: true,
      min: 0,
    },
    overallGrade: {
      type: String,
      required: true,
      trim: true,
    },
    classPosition: {
      type: Number,
      default: null,
    },
    attendancePercentage: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    teacherComment: {
      type: String,
      default: '',
    },
    principalComment: {
      type: String,
      default: '',
    },
    pdfFileId: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      default: null,
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
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

ReportCardSchema.index({ schoolId: 1 });
ReportCardSchema.index({ studentId: 1 });
ReportCardSchema.index({ classId: 1 });
ReportCardSchema.index({ sessionId: 1 });
ReportCardSchema.index({ termId: 1 });
ReportCardSchema.index(
  { schoolId: 1, studentId: 1, sessionId: 1, termId: 1 },
  { unique: true }
);

export const ReportCard = mongoose.model<IReportCard>('ReportCard', ReportCardSchema);
export type { IReportCard };