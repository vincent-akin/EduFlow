import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { IAIGeneration } from '../../shared/interfaces/base.interface.js';

const AIGenerationSchema = new Schema<IAIGeneration>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      
    },
    provider: {
      type: String,
      enum: ['openai', 'gemini', 'anthropic'],
      required: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    feature: {
      type: String,
      enum: [
        'question_generation',
        'lesson_plan',
        'marking_scheme',
        'assessment_builder',
        'study_recommendation',
        'feedback_generation',
        'performance_analysis',
      ],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    metadata: {
      subjectId: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        default: null,
      },
      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        default: null,
      },
      assessmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assessment',
        default: null,
      },
      tokens: {
        type: Number,
        default: 0,
      },
      estimatedCost: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'cancelled'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

AIGenerationSchema.index({ schoolId: 1 });
AIGenerationSchema.index({ userId: 1 });
AIGenerationSchema.index({ feature: 1 });
AIGenerationSchema.index({ createdAt: -1 });

export const AIGeneration = mongoose.model<IAIGeneration>('AIGeneration', AIGenerationSchema);
export type { IAIGeneration };