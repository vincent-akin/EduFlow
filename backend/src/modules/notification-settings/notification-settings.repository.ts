import { NotificationSettings, INotificationSettings } from './notification-settings.model.js';
import { Types } from 'mongoose';

export const createSettings = async (data: Partial<INotificationSettings>): Promise<INotificationSettings> => {
  const settings = new NotificationSettings(data);
  return settings.save();
};

export const findSettingsByUser = async (userId: Types.ObjectId): Promise<INotificationSettings | null> => {
  return NotificationSettings.findOne({ userId });
};

export const updateSettings = async (
  userId: Types.ObjectId,
  data: Partial<INotificationSettings>
): Promise<INotificationSettings | null> => {
  return NotificationSettings.findOneAndUpdate(
    { userId },
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const getDefaultSettings = (userId: Types.ObjectId, schoolId: Types.ObjectId): Partial<INotificationSettings> => {
  return {
    userId,
    schoolId,
    email: {
      enabled: true,
      assessmentReminders: true,
      resultPublished: true,
      classAnnouncements: true,
      messages: true,
      systemUpdates: true,
    },
    push: {
      enabled: true,
      assessmentReminders: true,
      resultPublished: true,
      classAnnouncements: true,
      messages: true,
      systemUpdates: true,
    },
    sms: {
      enabled: false,
      assessmentReminders: false,
      resultPublished: false,
      classAnnouncements: false,
      messages: false,
      systemUpdates: false,
    },
    inApp: {
      enabled: true,
      assessmentReminders: true,
      resultPublished: true,
      classAnnouncements: true,
      messages: true,
      systemUpdates: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  };
};