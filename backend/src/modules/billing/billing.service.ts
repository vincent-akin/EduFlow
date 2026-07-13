import { Types } from 'mongoose';
import { Subscription } from '../schools/subscription.model.js';
//import { School } from '../schools/school.model.js';
import { AppError } from '../../middlewares/error.middleware.js';

export const getSubscription = async (schoolId: Types.ObjectId) => {
  const subscription = await Subscription.findOne({ schoolId });
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }
  return subscription;
};

export const createSubscription = async (
  schoolId: Types.ObjectId,
  plan: string,
  trialDays = 14
) => {
  // Check if subscription already exists
  const existing = await Subscription.findOne({ schoolId });
  if (existing) {
    throw new AppError('Subscription already exists for this school', 409);
  }

  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + trialDays);

  const subscription = new Subscription({
    schoolId,
    plan,
    status: 'trial',
    trialEndsAt: trialEnd,
    startDate: now,
    endDate: trialEnd,
    renewalDate: trialEnd,
    teacherLimit: getPlanLimit(plan, 'teachers'),
    studentLimit: getPlanLimit(plan, 'students'),
    assessmentLimit: getPlanLimit(plan, 'assessments'),
    aiRequestLimit: getPlanLimit(plan, 'aiRequests'),
    storageLimitMB: getPlanLimit(plan, 'storage'),
  });

  await subscription.save();
  return subscription;
};

export const updateSubscription = async (
  schoolId: Types.ObjectId,
  data: Partial<typeof Subscription.prototype>
) => {
  const subscription = await getSubscription(schoolId);
  
  // If plan is changing, update limits
  if (data.plan && data.plan !== subscription.plan) {
    data.teacherLimit = getPlanLimit(data.plan, 'teachers');
    data.studentLimit = getPlanLimit(data.plan, 'students');
    data.assessmentLimit = getPlanLimit(data.plan, 'assessments');
    data.aiRequestLimit = getPlanLimit(data.plan, 'aiRequests');
    data.storageLimitMB = getPlanLimit(data.plan, 'storage');
  }

  const updated = await Subscription.findByIdAndUpdate(
    subscription._id,
    { ...data, updatedAt: new Date() },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Subscription not found', 404);
  }
  return updated;
};

export const cancelSubscription = async (schoolId: Types.ObjectId) => {
  const subscription = await getSubscription(schoolId);
  
  const updated = await Subscription.findByIdAndUpdate(
    subscription._id,
    { status: 'cancelled', updatedAt: new Date() },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Subscription not found', 404);
  }
  return updated;
};

export const renewSubscription = async (schoolId: Types.ObjectId) => {
  const subscription = await getSubscription(schoolId);
  
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setMonth(renewalDate.getMonth() + 1); // Monthly renewal

  const updated = await Subscription.findByIdAndUpdate(
    subscription._id,
    {
      status: 'active',
      startDate: now,
      endDate: renewalDate,
      renewalDate: renewalDate,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError('Subscription not found', 404);
  }
  return updated;
};

export const checkSubscriptionStatus = async (schoolId: Types.ObjectId) => {
  const subscription = await getSubscription(schoolId);
  
  const now = new Date();
  const isExpired = subscription.endDate && new Date(subscription.endDate) < now;
  const isTrialExpired = subscription.trialEndsAt && new Date(subscription.trialEndsAt) < now;

  if (isExpired || isTrialExpired) {
    // Auto-expire the subscription
    if (subscription.status !== 'expired') {
      await Subscription.findByIdAndUpdate(
        subscription._id,
        { status: 'expired', updatedAt: new Date() }
      );
    }
    return { ...subscription.toObject(), isActive: false };
  }

  return { ...subscription.toObject(), isActive: true };
};

export const getUsageStats = async (schoolId: Types.ObjectId) => {
  const subscription = await getSubscription(schoolId);

  // In a real implementation, you would query actual usage from other collections
  // For now, return estimated usage
  return {
    schoolId,
    plan: subscription.plan,
    status: subscription.status,
    limits: {
      teachers: subscription.teacherLimit,
      students: subscription.studentLimit,
      assessments: subscription.assessmentLimit,
      aiRequests: subscription.aiRequestLimit,
      storage: subscription.storageLimitMB,
    },
    usage: {
      teachers: 0, // Would be actual count from TeacherProfile
      students: 0, // Would be actual count from StudentProfile
      assessments: 0, // Would be actual count from Assessment
      aiRequests: 0, // Would be actual count from AIGeneration
      storage: 0, // Would be actual storage used
    },
    isActive: subscription.status === 'active' || subscription.status === 'trial',
  };
};

// Helper function to get plan limits
const getPlanLimit = (plan: string, feature: string): number => {
  const limits: Record<string, Record<string, number>> = {
    free: {
      teachers: 5,
      students: 100,
      assessments: 50,
      aiRequests: 100,
      storage: 100,
    },
    starter: {
      teachers: 10,
      students: 300,
      assessments: 200,
      aiRequests: 500,
      storage: 500,
    },
    professional: {
      teachers: 50,
      students: 1000,
      assessments: 1000,
      aiRequests: 2000,
      storage: 2000,
    },
    enterprise: {
      teachers: 9999,
      students: 9999,
      assessments: 9999,
      aiRequests: 9999,
      storage: 9999,
    },
  };

  return limits[plan]?.[feature] || 0;
};