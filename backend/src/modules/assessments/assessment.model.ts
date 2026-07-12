import mongoose, { Schema } from 'mongoose';
import { BaseTenantSoftDeleteSchema } from '../../shared/models/base.model.js';
import { IAssessment } from '../../shared/interfaces/base.interface.js';

const AssessmentSchema = new Schema<IAssessment>(
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
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ['quiz', 'test', 'assignment', 'exam'],
            required: true,
        },
        deliveryMode: {
            type: String,
            enum: ['cbt', 'paper', 'hybrid'],
            required: true,
        },
        instructions: {
            type: String,
            default: '',
        },
        durationMinutes: {
            type: Number,
            required: true,
            min: 1,
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        passMark: {
            type: Number,
            required: true,
            min: 0,
        },
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
        shuffleOptions: {
            type: Boolean,
            default: false,
        },
        allowReview: {
            type: Boolean,
            default: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'closed', 'archived'],
            default: 'draft',
        },
        questionCount: {
            type: Number,
            default: 0,
        },
        questions: [
        {
            questionId: {
                type: Schema.Types.ObjectId,
                ref: 'Question',
                required: true,
            },
            order: {
                type: Number,
                required: true,
            },
            marks: {
                type: Number,
                required: true,
            },
            snapshot: {
            type: {
                type: String,
                required: true,
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
                },
                text: {
                    type: String,
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
            difficulty: {
                type: String,
                required: true,
            },
            topic: {
                type: String,
                required: true,
            },
            },
        },
        ],
        publishedAt: {
            type: Date,
            default: null,
        },
        publishedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

AssessmentSchema.index({ schoolId: 1 });
AssessmentSchema.index({ schoolId: 1, classId: 1 });
AssessmentSchema.index({ schoolId: 1, subjectId: 1 });
AssessmentSchema.index({ schoolId: 1, sessionId: 1 });
AssessmentSchema.index({ schoolId: 1, termId: 1 });
AssessmentSchema.index({ status: 1 });
AssessmentSchema.index({ createdBy: 1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export type { IAssessment };