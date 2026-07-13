import {
  createSettings,
  findSettingsByUser,
  updateSettings as updateSettingsRepo,
  getDefaultSettings,
} from './notification-settings.repository.js';
import { INotificationSettings } from './notification-settings.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

// Remove the unused getSettings function
// export const getSettings = async (userId: Types.ObjectId): Promise<INotificationSettings> => {
//   const settings = await findSettingsByUser(userId);
//   if (!settings) {
//     throw new AppError('Notification settings not found', 404);
//   }
//   return settings;
// };

export const getOrCreateSettings = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId
): Promise<INotificationSettings> => {
  let settings = await findSettingsByUser(userId);
  
  if (!settings) {
    const defaultSettings = getDefaultSettings(userId, schoolId);
    settings = await createSettings(defaultSettings);
  }
  
  return settings;
};

export const updateSettings = async (
  userId: Types.ObjectId,
  data: Partial<INotificationSettings>
): Promise<INotificationSettings> => {
  const settings = await updateSettingsRepo(userId, data);
  if (!settings) {
    throw new AppError('Notification settings not found', 404);
  }
  return settings;
};

export const updateEmailSettings = async (
  userId: Types.ObjectId,
  settings: Partial<INotificationSettings['email']>
): Promise<INotificationSettings> => {
  return updateSettings(userId, { email: settings } as any);
};

export const updatePushSettings = async (
  userId: Types.ObjectId,
  settings: Partial<INotificationSettings['push']>
): Promise<INotificationSettings> => {
  return updateSettings(userId, { push: settings } as any);
};

export const updateSmsSettings = async (
  userId: Types.ObjectId,
  settings: Partial<INotificationSettings['sms']>
): Promise<INotificationSettings> => {
  return updateSettings(userId, { sms: settings } as any);
};

export const updateInAppSettings = async (
  userId: Types.ObjectId,
  settings: Partial<INotificationSettings['inApp']>
): Promise<INotificationSettings> => {
  return updateSettings(userId, { inApp: settings } as any);
};

export const updateQuietHours = async (
  userId: Types.ObjectId,
  quietHours: Partial<INotificationSettings['quietHours']>
): Promise<INotificationSettings> => {
  return updateSettings(userId, { quietHours } as any);
};

export const toggleChannel = async (
  userId: Types.ObjectId,
  channel: 'email' | 'push' | 'sms' | 'inApp',
  enabled: boolean
): Promise<INotificationSettings> => {
  return updateSettings(userId, { [channel]: { enabled } } as any);
};

export const toggleAllChannels = async (
  userId: Types.ObjectId,
  enabled: boolean
): Promise<INotificationSettings> => {
  return updateSettings(userId, {
    email: { enabled },
    push: { enabled },
    sms: { enabled },
    inApp: { enabled },
  } as any);
};