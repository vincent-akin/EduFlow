import { SupportTicket, ISupportTicket } from './support-ticket.model.js';
import { Faq, IFaq } from './faq.model.js';
import { Types } from 'mongoose';

// ============ Support Ticket Repository ============
export const createTicket = async (data: Partial<ISupportTicket>): Promise<ISupportTicket> => {
  const ticket = new SupportTicket(data);
  return ticket.save();
};

export const findTicketById = async (id: string | Types.ObjectId): Promise<ISupportTicket | null> => {
  return SupportTicket.findById(id)
    .populate('userId', 'firstName lastName email avatar')
    .populate('assignedTo', 'firstName lastName email avatar')
    .populate('responses.userId', 'firstName lastName email avatar');
};

export const findAllTickets = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: ISupportTicket[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    SupportTicket.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    SupportTicket.countDocuments(query),
  ]);
  return { data, total };
};

export const findTicketsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: ISupportTicket[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { userId, deletedAt: null };
  const [data, total] = await Promise.all([
    SupportTicket.find(query)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 }),
    SupportTicket.countDocuments(query),
  ]);
  return { data, total };
};

export const updateTicket = async (
  id: string | Types.ObjectId,
  data: Partial<ISupportTicket>
): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const addResponse = async (
  ticketId: string | Types.ObjectId,
  response: { userId: Types.ObjectId; message: string; isStaff: boolean }
): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $push: { responses: { ...response, createdAt: new Date() } },
      status: 'in_progress',
      updatedAt: new Date(),
    },
    { new: true }
  );
};

export const resolveTicket = async (id: string | Types.ObjectId): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    id,
    {
      status: 'resolved',
      resolvedAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true }
  );
};

export const closeTicket = async (id: string | Types.ObjectId): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    id,
    {
      status: 'closed',
      closedAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true }
  );
};

export const assignTicket = async (
  id: string | Types.ObjectId,
  assignedTo: Types.ObjectId
): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    id,
    {
      assignedTo,
      status: 'in_progress',
      updatedAt: new Date(),
    },
    { new: true }
  );
};

export const rateTicket = async (
  id: string | Types.ObjectId,
  rating: number,
  feedback?: string
): Promise<ISupportTicket | null> => {
  return SupportTicket.findByIdAndUpdate(
    id,
    {
      rating,
      feedback: feedback || null,
      updatedAt: new Date(),
    },
    { new: true }
  );
};

// ============ FAQ Repository ============
export const createFaq = async (data: Partial<IFaq>): Promise<IFaq> => {
  const faq = new Faq(data);
  return faq.save();
};

export const findFaqById = async (id: string | Types.ObjectId): Promise<IFaq | null> => {
  return Faq.findById(id);
};

export const findAllFaqs = async (
  schoolId: Types.ObjectId,
  filter: any = {},
  page = 1,
  limit = 20
): Promise<{ data: IFaq[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    Faq.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ order: 1, createdAt: -1 }),
    Faq.countDocuments(query),
  ]);
  return { data, total };
};

export const updateFaq = async (
  id: string | Types.ObjectId,
  data: Partial<IFaq>
): Promise<IFaq | null> => {
  return Faq.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const deleteFaq = async (id: string | Types.ObjectId): Promise<IFaq | null> => {
  return Faq.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
};

export const incrementFaqViews = async (id: string | Types.ObjectId): Promise<IFaq | null> => {
  return Faq.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
};

export const incrementFaqHelpful = async (id: string | Types.ObjectId): Promise<IFaq | null> => {
  return Faq.findByIdAndUpdate(
    id,
    { $inc: { helpful: 1 } },
    { new: true }
  );
};

export const incrementFaqNotHelpful = async (id: string | Types.ObjectId): Promise<IFaq | null> => {
  return Faq.findByIdAndUpdate(
    id,
    { $inc: { notHelpful: 1 } },
    { new: true }
  );
};