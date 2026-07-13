import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface ISupportTicket extends SoftDeleteDocument {
  userId: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  category: 'technical' | 'academic' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: mongoose.Types.ObjectId;
  responses: {
      userId: mongoose.Types.ObjectId;
      message: string;
      isStaff: boolean;
      createdAt: Date;
  }[];
  resolvedAt?: Date;
  closedAt?: Date;
  rating?: number;
  feedback?: string;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ...BaseTenantSoftDeleteSchema,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['technical', 'academic', 'billing', 'general', 'feature_request', 'bug_report'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    responses: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        isStaff: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },
    feedback: {
        type: String,
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

SupportTicketSchema.index({ schoolId: 1, userId: 1 });
SupportTicketSchema.index({ schoolId: 1, status: 1 });
SupportTicketSchema.index({ schoolId: 1, assignedTo: 1 });
SupportTicketSchema.index({ schoolId: 1, priority: 1 });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
