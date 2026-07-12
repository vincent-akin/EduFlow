import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { IResult } from '../../shared/interfaces/base.interface.js';

const ResultSchema = new Schema<IResult>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
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
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
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
    feedback: {
      type: String,
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
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

ResultSchema.index({ schoolId: 1 });
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ assessmentId: 1 });
ResultSchema.index({ classId: 1 });
ResultSchema.index({ subjectId: 1 });
ResultSchema.index({ status: 1 });
ResultSchema.index({ schoolId: 1, studentId: 1, assessmentId: 1 });

export const Result = mongoose.model<IResult>('Result', ResultSchema);
export type { IResult };