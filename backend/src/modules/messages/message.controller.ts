import { Request, Response } from 'express';
import {
  sendMessage,
  getMessages,
  getMessageById,
  markAsRead,
  markAllAsRead,
  deleteMessage,
  getUnreadCount,
  getConversations,
  sendClassAnnouncement,
} from './message.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const sendMessageController = async (req: Request, res: Response): Promise<Response> => {
  const { receiverId, content, subject, attachments } = req.body;
  const senderId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!receiverId || !content) {
    return ResponseHelper.error(res, 'Receiver ID and content are required', 400);
  }

  const message = await sendMessage(
    senderId,
    new Types.ObjectId(receiverId),
    schoolId,
    content,
    subject,
    attachments
  );
  return ResponseHelper.success(res, message, 'Message sent successfully', 201);
};

export const getMessagesController = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
  const { page, limit } = getPaginationOptions(req.query);
  const currentUserId = (req as any).user.id;

  if (!userId) {
    return ResponseHelper.error(res, 'User ID is required', 400);
  }

  const result = await getMessages(
    new Types.ObjectId(userId),
    currentUserId,
    page,
    limit
  );
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Messages retrieved successfully');
};

export const getMessageByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Message ID is required', 400);
  }
  const message = await getMessageById(id);
  return ResponseHelper.success(res, message, 'Message retrieved successfully');
};

export const markAsReadController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  if (!id) {
    return ResponseHelper.error(res, 'Message ID is required', 400);
  }

  const message = await markAsRead(id, userId);
  return ResponseHelper.success(res, message, 'Message marked as read');
};

export const markAllAsReadController = async (req: Request, res: Response): Promise<Response> => {
  const { senderId } = req.params;
  const userId = (req as any).user.id;

  if (!senderId) {
    return ResponseHelper.error(res, 'Sender ID is required', 400);
  }

  const result = await markAllAsRead(userId, new Types.ObjectId(senderId));
  return ResponseHelper.success(res, result, 'All messages marked as read');
};

export const deleteMessageController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  if (!id) {
    return ResponseHelper.error(res, 'Message ID is required', 400);
  }

  await deleteMessage(id, userId);
  return ResponseHelper.success(res, null, 'Message deleted successfully');
};

export const getUnreadCountController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const result = await getUnreadCount(userId);
  return ResponseHelper.success(res, result, 'Unread count retrieved successfully');
};

export const getConversationsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;

  const result = await getConversations(userId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Conversations retrieved successfully');
};

export const sendClassAnnouncementController = async (req: Request, res: Response): Promise<Response> => {
  const { classId, title, content } = req.body;
  const senderId = (req as any).user.id;
  const schoolId = (req as any).schoolId;

  if (!classId || !title || !content) {
    return ResponseHelper.error(res, 'Class ID, title, and content are required', 400);
  }

  const message = await sendClassAnnouncement(
    senderId,
    schoolId,
    new Types.ObjectId(classId),
    title,
    content
  );
  return ResponseHelper.success(res, message, 'Class announcement sent successfully', 201);
};