import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface IFaq extends SoftDeleteDocument {
  question: string;
  answer: string;
  category: 'general' | 'academic' | 'technical' | 'billing' | 'account' | 'assessment';
  order: number;
  isPublished: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
}

const FaqSchema = new Schema<IFaq>(
  {
    ...BaseTenantSoftDeleteSchema,
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'academic', 'technical', 'billing', 'account', 'assessment'],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
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

FaqSchema.index({ schoolId: 1, category: 1 });
FaqSchema.index({ schoolId: 1, isPublished: 1 });
FaqSchema.index({ schoolId: 1, order: 1 });

export const Faq = mongoose.model<IFaq>('Faq', FaqSchema);