import { Message, IMessage } from './message.model.js';
import { Conversation, IConversation } from './conversation.model.js';
import { Types } from 'mongoose';

// ============ Message Repository ============
export const createMessage = async (data: any): Promise<IMessage> => {
  const message = new Message(data);
  return message.save();
};

export const findMessageById = async (id: string | Types.ObjectId): Promise<IMessage | null> => {
  return Message.findById(id)
    .populate('senderId', 'firstName lastName avatar')
    .populate('receiverId', 'firstName lastName avatar');
};

export const findMessages = async (
  filter: any = {},
  page = 1,
  limit = 20
): Promise<{ data: IMessage[]; total: number }> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Message.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'firstName lastName avatar')
      .populate('receiverId', 'firstName lastName avatar')
      .sort({ createdAt: -1 }),
    Message.countDocuments(filter),
  ]);
  return { data, total };
};

export const getConversationMessages = async (
  user1Id: Types.ObjectId,
  user2Id: Types.ObjectId,
  page = 1,
  limit = 20
): Promise<{ data: IMessage[]; total: number }> => {
  const skip = (page - 1) * limit;
  const filter = {
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
    deletedAt: null,
  };
  const [data, total] = await Promise.all([
    Message.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'firstName lastName avatar')
      .populate('receiverId', 'firstName lastName avatar')
      .sort({ createdAt: -1 }),
    Message.countDocuments(filter),
  ]);
  return { data, total };
};

export const markMessageAsRead = async (messageId: string | Types.ObjectId): Promise<IMessage | null> => {
  return Message.findByIdAndUpdate(
    messageId,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

export const markAllMessagesAsRead = async (
  senderId: Types.ObjectId,
  receiverId: Types.ObjectId
): Promise<{ modifiedCount: number }> => {
  const result = await Message.updateMany(
    {
      senderId,
      receiverId,
      isRead: false,
      deletedAt: null,
    },
    { isRead: true, readAt: new Date() }
  );
  return { modifiedCount: result.modifiedCount || 0 };
};

export const deleteMessage = async (id: string | Types.ObjectId): Promise<IMessage | null> => {
  return Message.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
};

export const getUnreadCount = async (userId: Types.ObjectId): Promise<number> => {
  return Message.countDocuments({ 
    receiverId: userId, 
    isRead: false, 
    deletedAt: null 
  });
};

// ============ Conversation Repository ============
export const createOrUpdateConversation = async (
  schoolId: Types.ObjectId,
  participants: Types.ObjectId[],
  lastMessage: { content: string; senderId: Types.ObjectId; sentAt: Date }
): Promise<IConversation> => {
  const sortedParticipants = [...participants].sort();
  
  const existing = await Conversation.findOne({
    schoolId,
    participants: { $all: sortedParticipants, $size: sortedParticipants.length },
  });

  if (existing) {
    existing.lastMessage = lastMessage;
    existing.unreadCount += 1;
    existing.updatedAt = new Date();
    await existing.save();
    return existing;
  }

  const conversation = new Conversation({
    schoolId,
    participants: sortedParticipants,
    lastMessage,
    unreadCount: 1,
  });
  return conversation.save();
};

export const getConversations = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 20
): Promise<{ data: IConversation[]; total: number }> => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Conversation.find({
      participants: userId,
      isArchived: false,
    })
      .skip(skip)
      .limit(limit)
      .populate('participants', 'firstName lastName avatar')
      .sort({ updatedAt: -1 }),
    Conversation.countDocuments({ participants: userId, isArchived: false }),
  ]);
  return { data, total };
};

export const resetUnreadCount = async (
  user1Id: Types.ObjectId,
  user2Id: Types.ObjectId
): Promise<void> => {
  const sortedParticipants = [user1Id, user2Id].sort();
  await Conversation.findOneAndUpdate(
    { participants: { $all: sortedParticipants, $size: 2 } },
    { unreadCount: 0 }
  );
};