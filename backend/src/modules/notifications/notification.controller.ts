import { Request, Response } from 'express';
import {
  createNotification,
  getNotificationsByUser,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  notifyAssessmentPublished,
  notifyResultPublished,
  notifySystemAnnouncement,
} from './notification.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

// ============ User Notification Controllers ============
export const getMyNotificationsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;
  const filter: any = {};

  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === 'true';
  }

  const result = await getNotificationsByUser(userId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Notifications retrieved successfully');
};

export const getMyUnreadNotificationsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;
  const result = await getUnreadNotifications(userId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Unread notifications retrieved successfully');
};

export const getUnreadCountController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const result = await getUnreadCount(userId);
  return ResponseHelper.success(res, result, 'Unread count retrieved successfully');
};

export const markAsReadController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Notification ID is required', 400);
  }
  const userId = (req as any).user.id;
  const notification = await markAsRead(id, userId);
  return ResponseHelper.success(res, notification, 'Notification marked as read');
};

export const markAllAsReadController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const result = await markAllAsRead(userId);
  return ResponseHelper.success(res, result, 'All notifications marked as read');
};

export const deleteNotificationController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Notification ID is required', 400);
  }
  const userId = (req as any).user.id;
  await deleteNotification(id, userId);
  return ResponseHelper.success(res, null, 'Notification deleted successfully');
};

export const deleteAllNotificationsController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const result = await deleteAllNotifications(userId);
  return ResponseHelper.success(res, result, 'All notifications deleted successfully');
};

// ============ Admin Notification Controllers ============
export const createNotificationController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const notification = await createNotification({
    ...req.body,
    schoolId,
  });
  return ResponseHelper.success(res, notification, 'Notification created successfully', 201);
};

export const sendAssessmentPublishedNotificationController = async (req: Request, res: Response): Promise<Response> => {
  const { userIds, assessmentTitle, link } = req.body;
  const schoolId = (req as any).schoolId;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return ResponseHelper.error(res, 'User IDs are required', 400);
  }
  if (!assessmentTitle) {
    return ResponseHelper.error(res, 'Assessment title is required', 400);
  }

  const notifications = await notifyAssessmentPublished(
    userIds.map((id: string) => new Types.ObjectId(id)),
    assessmentTitle,
    schoolId,
    link || '/assessments'
  );
  return ResponseHelper.success(res, notifications, 'Notifications sent successfully');
};

export const sendResultPublishedNotificationController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId, assessmentTitle, grade, link } = req.body;
  const schoolId = (req as any).schoolId;

  if (!studentId || !assessmentTitle || !grade) {
    return ResponseHelper.error(res, 'Student ID, assessment title, and grade are required', 400);
  }

  const notification = await notifyResultPublished(
    new Types.ObjectId(studentId),
    assessmentTitle,
    grade,
    schoolId,
    link || '/results'
  );
  return ResponseHelper.success(res, notification, 'Notification sent successfully');
};

export const sendAnnouncementController = async (req: Request, res: Response): Promise<Response> => {
  const { userIds, title, message, link } = req.body;
  const schoolId = (req as any).schoolId;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return ResponseHelper.error(res, 'User IDs are required', 400);
  }
  if (!title || !message) {
    return ResponseHelper.error(res, 'Title and message are required', 400);
  }

  const notifications = await notifySystemAnnouncement(
    userIds.map((id: string) => new Types.ObjectId(id)),
    title,
    message,
    schoolId,
    link
  );
  return ResponseHelper.success(res, notifications, 'Announcement sent successfully');
};