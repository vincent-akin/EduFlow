import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { ISubmission } from '../../shared/interfaces/base.interface.js';

const SubmissionSchema = new Schema<ISubmission>(
    {
        ...BaseSchema,
        schoolId: {
            type: Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            
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
        attemptNumber: {
            type: Number,
            required: true,
            default: 1,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: null,
        },
        timeSpentSeconds: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['in_progress', 'submitted', 'graded', 'expired'],
            default: 'in_progress',
        },
        answers: [
        {
            questionId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            selectedOption: {
                type: String,
                default: null,
            },
            answerText: {
                type: String,
                default: null,
            },
            obtainedMarks: {
                type: Number,
                default: 0,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
            answeredAt: {
                type: Date,
                required: true,
            },
        },
        ],
        autoScore: {
            type: Number,
            default: 0,
        },
        finalScore: {
            type: Number,
            default: 0,
        },
        gradedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        gradedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

SubmissionSchema.index({ schoolId: 1 });
SubmissionSchema.index({ assessmentId: 1 });
SubmissionSchema.index({ studentId: 1 });
SubmissionSchema.index({ schoolId: 1, assessmentId: 1, studentId: 1 });
SubmissionSchema.index({ status: 1 });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
export type { ISubmission };