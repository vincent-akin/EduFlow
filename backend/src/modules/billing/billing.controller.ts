import { Request, Response } from 'express';
import {
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  checkSubscriptionStatus,
  getUsageStats,
} from './billing.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
//import { Types } from 'mongoose';

export const getSubscriptionController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const subscription = await getSubscription(schoolId);
  return ResponseHelper.success(res, subscription, 'Subscription retrieved successfully');
};

export const createSubscriptionController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const { plan, trialDays } = req.body;

  if (!plan) {
    return ResponseHelper.error(res, 'Plan is required', 400);
  }

  const subscription = await createSubscription(schoolId, plan, trialDays || 14);
  return ResponseHelper.success(res, subscription, 'Subscription created successfully', 201);
};

export const updateSubscriptionController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const subscription = await updateSubscription(schoolId, req.body);
  return ResponseHelper.success(res, subscription, 'Subscription updated successfully');
};

export const cancelSubscriptionController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const subscription = await cancelSubscription(schoolId);
  return ResponseHelper.success(res, subscription, 'Subscription cancelled successfully');
};

export const renewSubscriptionController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const subscription = await renewSubscription(schoolId);
  return ResponseHelper.success(res, subscription, 'Subscription renewed successfully');
};

export const checkSubscriptionStatusController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const status = await checkSubscriptionStatus(schoolId);
  return ResponseHelper.success(res, status, 'Subscription status retrieved successfully');
};

export const getUsageStatsController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const stats = await getUsageStats(schoolId);
  return ResponseHelper.success(res, stats, 'Usage stats retrieved successfully');
};