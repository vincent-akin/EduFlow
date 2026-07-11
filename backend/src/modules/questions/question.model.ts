import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IQuestion } from '../../shared/interfaces/base.interface.js';

const QuestionSchema = new Schema<IQuestion>(
    {
        ...BaseTenantSoftDeleteSchema,
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['mcq', 'theory'],
            required: true,
        },
        curriculum: {
            type: String,
            required: true,
            trim: true,
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        subTopic: {
            type: String,
            default: null,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        marks: {
            type: Number,
            required: true,
            min: 0,
        },
        language: {
            type: String,
            default: 'en',
            trim: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        options: [
        {
            key: {
                type: String,
                required: true,
                trim: true,
            },
            text: {
                type: String,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            },
        },
        ],
        correctAnswer: {
            type: Schema.Types.Mixed,
            default: null,
        },
        explanation: {
            type: String,
            default: null,
        },
        tags: [
        {
            type: String,
            trim: true,
        },
        ],
        usageCount: {
            type: Number,
            default: 0,
        },
        isArchived: {
            type: Boolean,
            default: false,
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

QuestionSchema.index({ schoolId: 1 });
QuestionSchema.index({ schoolId: 1, subjectId: 1 });
QuestionSchema.index({ schoolId: 1, topic: 1 });
QuestionSchema.index({ schoolId: 1, difficulty: 1 });
QuestionSchema.index({ schoolId: 1, createdBy: 1 });
QuestionSchema.index({ tags: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export type { IQuestion };