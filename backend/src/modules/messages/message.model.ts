import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface IMessage extends SoftDeleteDocument {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId; // For group messages
  subject?: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  parentMessageId?: mongoose.Types.ObjectId; // For replies
  attachments?: {
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  }[];
  type: 'direct' | 'class' | 'announcement' | 'group';
  priority?: 'low' | 'normal' | 'high';
}

const MessageSchema = new Schema<IMessage>(
  {
    ...BaseTenantSoftDeleteSchema,
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
      },
    ],
    type: {
      type: String,
      enum: ['direct', 'class', 'announcement', 'group'],
      default: 'direct',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
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

MessageSchema.index({ schoolId: 1, senderId: 1 });
MessageSchema.index({ schoolId: 1, receiverId: 1 });
MessageSchema.index({ schoolId: 1, classId: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);