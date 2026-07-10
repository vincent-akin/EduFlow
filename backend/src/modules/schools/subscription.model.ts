import mongoose, { Schema } from 'mongoose';
import { BaseDocument, Plan, SubscriptionStatus } from '../../types/index.js';

export interface ISubscription extends BaseDocument {
    schoolId: mongoose.Types.ObjectId;
    plan: Plan;
    status: SubscriptionStatus;
    trialEndsAt: Date;
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
    teacherLimit: number;
    studentLimit: number;
    assessmentLimit: number;
    aiRequestLimit: number;
    storageLimitMB: number;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        schoolId: {
            type: Schema.Types.ObjectId,
            ref: 'School',
            required: true,
        },
        plan: {
            type: String,
            enum: ['free', 'starter', 'professional', 'enterprise'],
            default: 'free',
        },
        status: {
            type: String,
            enum: ['trial', 'active', 'expired', 'cancelled'],
            default: 'trial',
        },
        trialEndsAt: {
            type: Date,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        renewalDate: {
            type: Date,
            required: true,
        },
        teacherLimit: {
            type: Number,
            default: 5,
        },
        studentLimit: {
            type: Number,
            default: 100,
        },
        assessmentLimit: {
            type: Number,
            default: 50,
        },
        aiRequestLimit: {
            type: Number,
            default: 100,
        },
        storageLimitMB: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    }
);

SubscriptionSchema.index({ schoolId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ renewalDate: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);