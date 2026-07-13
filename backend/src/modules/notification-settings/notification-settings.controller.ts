import { Request, Response } from 'express';
import {
  getOrCreateSettings,
  updateSettings,
  updateEmailSettings,
  updatePushSettings,
  updateSmsSettings,
  updateInAppSettings,
  updateQuietHours,
  toggleChannel,
  toggleAllChannels,
} from './notification-settings.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';

export const getSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  
  const settings = await getOrCreateSettings(userId, schoolId);
  return ResponseHelper.success(res, settings, 'Notification settings retrieved successfully');
};

export const updateSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updateSettings(userId, req.body);
  return ResponseHelper.success(res, settings, 'Notification settings updated successfully');
};

export const updateEmailSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updateEmailSettings(userId, req.body);
  return ResponseHelper.success(res, settings, 'Email settings updated successfully');
};

export const updatePushSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updatePushSettings(userId, req.body);
  return ResponseHelper.success(res, settings, 'Push notification settings updated successfully');
};

export const updateSmsSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updateSmsSettings(userId, req.body);
  return ResponseHelper.success(res, settings, 'SMS settings updated successfully');
};

export const updateInAppSettingsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updateInAppSettings(userId, req.body);
  return ResponseHelper.success(res, settings, 'In-app settings updated successfully');
};

export const updateQuietHoursController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const settings = await updateQuietHours(userId, req.body);
  return ResponseHelper.success(res, settings, 'Quiet hours updated successfully');
};

export const toggleChannelController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const { channel, enabled } = req.body;
  
  if (!channel || enabled === undefined) {
    return ResponseHelper.error(res, 'Channel and enabled are required', 400);
  }
  
  const settings = await toggleChannel(userId, channel, enabled);
  return ResponseHelper.success(res, settings, `Notification channel ${enabled ? 'enabled' : 'disabled'} successfully`);
};

export const toggleAllChannelsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const { enabled } = req.body;
  
  if (enabled === undefined) {
    return ResponseHelper.error(res, 'Enabled is required', 400);
  }
  
  const settings = await toggleAllChannels(userId, enabled);
  return ResponseHelper.success(res, settings, `All notification channels ${enabled ? 'enabled' : 'disabled'} successfully`);
};