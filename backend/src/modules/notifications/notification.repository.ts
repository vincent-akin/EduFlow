import { Notification, INotification } from './notification.model.js';
import { Types } from 'mongoose';

export const createNotification = async (data: Partial<INotification>): Promise<INotification> => {
  const notification = new Notification(data);
  return notification.save();
};

export const createBulkNotifications = async (
  data: Partial<INotification>[]
): Promise<INotification[]> => {
  if (data.length === 0) {
    return [];
  }

  // Create notification documents properly
  const notifications = data.map((item) => {
    // Ensure all required fields are present
    if (!item.userId || !item.schoolId || !item.title || !item.message || !item.type) {
      return null;
    }

    // Create a proper notification object with all required fields
    return {
      userId: item.userId,
      schoolId: item.schoolId,
      title: item.title,
      message: item.message,
      type: item.type,
      priority: item.priority || 'normal',
      link: item.link || null,
      isRead: item.isRead || false,
      readAt: item.readAt || null,
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date(),
    };
  });

  // Filter out null values
  const validData = notifications.filter((n): n is NonNullable<typeof n> => n !== null);

  if (validData.length === 0) {
    return [];
  }

  // Use create instead of insertMany for better type safety
  return Notification.create(validData);
};

export const findNotificationById = async (id: string | Types.ObjectId): Promise<INotification | null> => {
  return Notification.findById(id);
};

export const findNotificationsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: INotification[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { userId, ...filter };
  const [data, total] = await Promise.all([
    Notification.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Notification.countDocuments(query),
  ]);
  return { data, total };
};

export const findUnreadNotificationsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: INotification[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { userId, isRead: false };
  const [data, total] = await Promise.all([
    Notification.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Notification.countDocuments(query),
  ]);
  return { data, total };
};

export const markAsRead = async (id: string | Types.ObjectId): Promise<INotification | null> => {
  return Notification.findByIdAndUpdate(
    id,
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true }
  );
};

export const markAllAsRead = async (userId: Types.ObjectId): Promise<{ modifiedCount: number }> => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
  return { modifiedCount: result.modifiedCount || 0 };
};

export const deleteNotification = async (id: string | Types.ObjectId): Promise<INotification | null> => {
  return Notification.findByIdAndDelete(id);
};

export const deleteAllNotifications = async (userId: Types.ObjectId): Promise<{ deletedCount: number }> => {
  const result = await Notification.deleteMany({ userId });
  return { deletedCount: result.deletedCount || 0 };
};

export const getUnreadCount = async (userId: Types.ObjectId): Promise<number> => {
  return Notification.countDocuments({ userId, isRead: false });
};