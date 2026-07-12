import {
  createNotification as createNotificationRepo,
  createBulkNotifications,
  findNotificationById,
  findNotificationsByUser,
  findUnreadNotificationsByUser,
  markAsRead as markAsReadRepo,
  markAllAsRead as markAllAsReadRepo,
  deleteNotification as deleteNotificationRepo,
  deleteAllNotifications as deleteAllNotificationsRepo,
  getUnreadCount as getUnreadCountRepo,
} from './notification.repository.js';
import { INotification } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';

// ============ Notification Services ============
export const createNotification = async (
  data: Partial<INotification>
): Promise<INotification> => {
  return createNotificationRepo(data);
};

export const createMultipleNotifications = async (
  userIds: Types.ObjectId[],
  notificationData: Omit<Partial<INotification>, 'userId'>
): Promise<INotification[]> => {
  const notifications = userIds.map((userId) => ({
    ...notificationData,
    userId,
  }));
  return createBulkNotifications(notifications);
};

export const getNotificationById = async (id: string): Promise<INotification> => {
  const notification = await findNotificationById(id);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

export const getNotificationsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findNotificationsByUser(userId, page, limit, filter);
};

export const getUnreadNotifications = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findUnreadNotificationsByUser(userId, page, limit);
};

export const markAsRead = async (id: string, userId: Types.ObjectId): Promise<INotification> => {
  const notification = await getNotificationById(id);
  
  // Ensure the notification belongs to the user
  if (notification.userId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to mark this notification as read', 403);
  }

  const updated = await markAsReadRepo(id);
  if (!updated) {
    throw new AppError('Notification not found', 404);
  }
  return updated;
};

export const markAllAsRead = async (userId: Types.ObjectId): Promise<{ modifiedCount: number }> => {
  return markAllAsReadRepo(userId);
};

export const deleteNotification = async (id: string, userId: Types.ObjectId): Promise<void> => {
  const notification = await getNotificationById(id);
  
  // Ensure the notification belongs to the user
  if (notification.userId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to delete this notification', 403);
  }

  await deleteNotificationRepo(id);
};

export const deleteAllNotifications = async (userId: Types.ObjectId): Promise<{ deletedCount: number }> => {
  return deleteAllNotificationsRepo(userId);
};

export const getUnreadCount = async (userId: Types.ObjectId): Promise<{ count: number }> => {
  const count = await getUnreadCountRepo(userId);
  return { count };
};

// ============ Notification Helpers ============
export const notifyAssessmentPublished = async (
  userIds: Types.ObjectId[],
  assessmentTitle: string,
  schoolId: Types.ObjectId,
  link: string
): Promise<INotification[]> => {
  return createMultipleNotifications(userIds, {
    schoolId,
    title: `New Assessment: ${assessmentTitle}`,
    message: `A new assessment "${assessmentTitle}" has been published and is now available.`,
    type: 'assessment',
    priority: 'normal',
    link,
  });
};

export const notifyAssessmentSubmitted = async (
  teacherId: Types.ObjectId,
  studentName: string,
  assessmentTitle: string,
  schoolId: Types.ObjectId,
  link: string
): Promise<INotification> => {
  return createNotification({
    userId: teacherId,
    schoolId,
    title: 'Assessment Submitted',
    message: `${studentName} has submitted the assessment "${assessmentTitle}".`,
    type: 'submission',
    priority: 'normal',
    link,
  });
};

export const notifyResultPublished = async (
  studentId: Types.ObjectId,
  assessmentTitle: string,
  grade: string,
  schoolId: Types.ObjectId,
  link: string
): Promise<INotification> => {
  return createNotification({
    userId: studentId,
    schoolId,
    title: 'Result Published',
    message: `Your result for "${assessmentTitle}" has been published. Grade: ${grade}`,
    type: 'result',
    priority: 'high',
    link,
  });
};

export const notifySystemAnnouncement = async (
  userIds: Types.ObjectId[],
  title: string,
  message: string,
  schoolId: Types.ObjectId,
  link?: string
): Promise<INotification[]> => {
  return createMultipleNotifications(userIds, {
    schoolId,
    title,
    message,
    type: 'announcement',
    priority: 'normal',
    link: link || null,
  });
};

export const notifySubscriptionChange = async (
  userId: Types.ObjectId,
  plan: string,
  status: string,
  schoolId: Types.ObjectId
): Promise<INotification> => {
  return createNotification({
    userId,
    schoolId,
    title: 'Subscription Update',
    message: `Your subscription has been ${status}. Plan: ${plan}`,
    type: 'subscription',
    priority: 'high',
    link: '/settings/billing',
  });
};