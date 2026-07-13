import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface IFile extends SoftDeleteDocument {
  uploadedBy: mongoose.Types.ObjectId;
  filename: string;
  originalFilename: string;
  mimeType: string;
  extension: string;
  size: number;
  storageProvider: 'cloudinary' | 'aws_s3' | 'local';
  path: string;
  url: string;
  category: 'logo' | 'passport' | 'assessment_pdf' | 'report_card' | 'attachment' | 'image' | 'lesson';
  metadata?: Record<string, any>;
}

const FileSchema = new Schema<IFile>(
  {
    ...BaseTenantSoftDeleteSchema,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    storageProvider: {
      type: String,
      enum: ['cloudinary', 'aws_s3', 'local'],
      required: true,
      default: 'local',
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['logo', 'passport', 'assessment_pdf', 'report_card', 'attachment', 'image', 'lesson'],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
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

FileSchema.index({ schoolId: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ category: 1 });

export const File = mongoose.model<IFile>('File', FileSchema);