import {
  createMessage as createMessageRepo,
  findMessageById,
  getConversationMessages,
  markMessageAsRead as markMessageAsReadRepo,
  markAllMessagesAsRead as markAllMessagesAsReadRepo,
  deleteMessage as deleteMessageRepo,
  getUnreadCount as getUnreadCountRepo,
  createOrUpdateConversation,
  getConversations as getConversationsRepo,
  resetUnreadCount,
} from './message.repository.js';
import { IMessage } from './message.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Notification } from '../notifications/notification.model.js';
import { User } from '../users/user.model.js';
import { StudentProfile } from '../students/student.model.js';

// ============ Send Direct Message ============
export const sendMessage = async (
  senderId: Types.ObjectId,
  receiverId: Types.ObjectId,
  schoolId: Types.ObjectId,
  content: string,
  subject?: string,
  attachments?: any[]
): Promise<IMessage> => {
  if (senderId.toString() === receiverId.toString()) {
    throw new AppError('Cannot send message to yourself', 400);
  }

  const messageData = {
    senderId,
    receiverId,
    schoolId,
    content,
    subject: subject || null,
    attachments: attachments || [],
    type: 'direct' as const,
    isRead: false,
    readAt: null,
    parentMessageId: null,
    deletedAt: null,
  };

  const message = await createMessageRepo(messageData);

  // Create/Update conversation
  await createOrUpdateConversation(schoolId, [senderId, receiverId], {
    content: content.substring(0, 50),
    senderId,
    sentAt: new Date(),
  });

  // Create notification for receiver
  const sender = await User.findById(senderId);
  await Notification.create({
    userId: receiverId,
    schoolId,
    title: 'New Message',
    message: `New message from ${sender?.firstName || 'Unknown'} ${sender?.lastName || 'User'}`,
    type: 'system',
    priority: 'normal',
    link: `/messages/${message._id}`,
  });

  return message;
};

// ============ Get Messages ============
export const getMessages = async (
  userId: Types.ObjectId,
  currentUserId: Types.ObjectId,
  page = 1,
  limit = 20
) => {
  // Reset unread count for this conversation
  await resetUnreadCount(userId, currentUserId);
  
  return getConversationMessages(userId, currentUserId, page, limit);
};

// ============ Get Message By ID ============
export const getMessageById = async (id: string): Promise<IMessage> => {
  const message = await findMessageById(id);
  if (!message) {
    throw new AppError('Message not found', 404);
  }
  return message;
};

// ============ Mark Message as Read ============
export const markAsRead = async (id: string, userId: Types.ObjectId): Promise<IMessage> => {
  const message = await getMessageById(id);
  
  // Ensure user is the receiver
  if (message.receiverId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to mark this message as read', 403);
  }

  const updated = await markMessageAsReadRepo(id);
  if (!updated) {
    throw new AppError('Message not found', 404);
  }
  return updated;
};

// ============ Mark All Messages as Read ============
export const markAllAsRead = async (
  userId: Types.ObjectId,
  senderId: Types.ObjectId
): Promise<{ modifiedCount: number }> => {
  return markAllMessagesAsReadRepo(senderId, userId);
};

// ============ Delete Message ============
export const deleteMessage = async (id: string, userId: Types.ObjectId): Promise<void> => {
  const message = await getMessageById(id);
  
  // Only sender or receiver can delete
  if (message.senderId.toString() !== userId.toString() && 
      message.receiverId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to delete this message', 403);
  }

  await deleteMessageRepo(id);
};

// ============ Get Unread Count ============
export const getUnreadCount = async (userId: Types.ObjectId): Promise<{ count: number }> => {
  const count = await getUnreadCountRepo(userId);
  return { count };
};

// ============ Get Conversations ============
export const getConversations = async (userId: Types.ObjectId, page = 1, limit = 20) => {
  return getConversationsRepo(userId, page, limit);
};

// ============ Send Class Announcement ============
export const sendClassAnnouncement = async (
  senderId: Types.ObjectId,
  schoolId: Types.ObjectId,
  classId: Types.ObjectId,
  title: string,
  content: string
): Promise<IMessage> => {
  // Get all students in the class
  const students = await StudentProfile.find({ classId, schoolId, deletedAt: null });

  if (students.length === 0) {
    throw new AppError('No students found in this class', 404);
  }

  // Create messages for each student
  const messages = await Promise.all(
    students.map(async (student) => {
      const messageData = {
        senderId,
        receiverId: student.userId,
        schoolId,
        content,
        subject: title,
        type: 'class' as const,
        classId,
        isRead: false,
        readAt: null,
        parentMessageId: null,
        attachments: [],
        deletedAt: null,
      };
      return createMessageRepo(messageData);
    })
  );

  // Create notifications for all students
  await Notification.insertMany(
    students.map((student) => ({
      userId: student.userId,
      schoolId,
      title: `Class Announcement: ${title}`,
      message: content.substring(0, 100),
      type: 'system',
      priority: 'high',
      link: `/messages/class/${classId}`,
    }))
  );

  // Return the first message or throw error if none
  const firstMessage = messages[0];
  if (!firstMessage) {
    throw new AppError('Failed to create class announcement', 500);
  }
  return firstMessage;
};