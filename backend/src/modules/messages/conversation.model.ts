import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { BaseDocument } from '../../shared/interfaces/base.interface.js';

export interface IConversation extends BaseDocument {
  schoolId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    sentAt: Date;
  };
  unreadCount: number;
  isArchived: boolean;
}

const ConversationSchema = new Schema<IConversation>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      content: {
        type: String,
        default: '',
      },
      senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ schoolId: 1, participants: 1 });
ConversationSchema.index({ participants: 1, updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);