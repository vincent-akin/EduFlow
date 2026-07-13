import {
  createTicket as createTicketRepo,
  findTicketById,
  findAllTickets,
  findTicketsByUser,
  updateTicket as updateTicketRepo,
  addResponse as addResponseRepo,
  resolveTicket as resolveTicketRepo,
  closeTicket as closeTicketRepo,
  assignTicket as assignTicketRepo,
  rateTicket as rateTicketRepo,
  createFaq as createFaqRepo,
  findFaqById,
  findAllFaqs,
  updateFaq as updateFaqRepo,
  deleteFaq as deleteFaqRepo,
  incrementFaqViews,
  incrementFaqHelpful,
  incrementFaqNotHelpful,
} from './support.repository.js';
import { ISupportTicket, IFaq } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Notification } from '../notifications/notification.model.js';

// ============ Support Ticket Services ============
export const createSupportTicket = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  data: Partial<ISupportTicket>
): Promise<ISupportTicket> => {
  const ticketData = {
    ...data,
    userId,
    schoolId,
    status: 'open' as const,
  };
  return createTicketRepo(ticketData);
};

export const getTicketById = async (id: string): Promise<ISupportTicket> => {
  const ticket = await findTicketById(id);
  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }
  return ticket;
};

export const getAllTickets = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllTickets(schoolId, page, limit, filter);
};

export const getTicketsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findTicketsByUser(userId, page, limit);
};

export const updateTicket = async (
  id: string,
  data: Partial<ISupportTicket>
): Promise<ISupportTicket> => {
  const updated = await updateTicketRepo(id, data);
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }
  return updated;
};

export const addResponseToTicket = async (
  ticketId: string,
  userId: Types.ObjectId,
  message: string,
  isStaff: boolean
): Promise<ISupportTicket> => {
  const ticket = await getTicketById(ticketId);
  
  if (ticket.status === 'closed' || ticket.status === 'resolved') {
    throw new AppError('Cannot add response to closed or resolved ticket', 400);
  }

  const updated = await addResponseRepo(ticketId, { userId, message, isStaff });
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }

  // Notify the user about the response
  const responseReceiver = isStaff ? ticket.userId : (ticket.assignedTo || ticket.userId);
  await Notification.create({
    userId: responseReceiver,
    schoolId: ticket.schoolId,
    title: 'Support Ticket Update',
    message: `New response on ticket: ${ticket.subject}`,
    type: 'system',
    priority: 'normal',
    link: `/support/tickets/${ticketId}`,
  });

  return updated;
};

export const resolveTicket = async (id: string): Promise<ISupportTicket> => {
  const updated = await resolveTicketRepo(id);
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }
  return updated;
};

export const closeTicket = async (id: string): Promise<ISupportTicket> => {
  const updated = await closeTicketRepo(id);
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }
  return updated;
};

export const assignTicket = async (
  id: string,
  assignedTo: Types.ObjectId
): Promise<ISupportTicket> => {
  const updated = await assignTicketRepo(id, assignedTo);
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }
  return updated;
};

export const rateTicket = async (
  id: string,
  rating: number,
  feedback?: string
): Promise<ISupportTicket> => {
  if (rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }
  const updated = await rateTicketRepo(id, rating, feedback);
  if (!updated) {
    throw new AppError('Support ticket not found', 404);
  }
  return updated;
};

// ============ FAQ Services ============
export const createFaq = async (
  schoolId: Types.ObjectId,
  data: Partial<IFaq>
): Promise<IFaq> => {
  return createFaqRepo({ ...data, schoolId });
};

export const getFaqById = async (id: string): Promise<IFaq> => {
  const faq = await findFaqById(id);
  if (!faq) {
    throw new AppError('FAQ not found', 404);
  }
  return faq;
};

export const getAllFaqs = async (
  schoolId: Types.ObjectId,
  category?: string,
  page = 1,
  limit = 20
) => {
  const filter: any = { isPublished: true };
  if (category) {
    filter.category = category;
  }
  return findAllFaqs(schoolId, filter, page, limit);
};

export const getFaqsAdmin = async (
  schoolId: Types.ObjectId,
  filter: any = {},
  page = 1,
  limit = 20
) => {
  return findAllFaqs(schoolId, filter, page, limit);
};

export const updateFaq = async (id: string, data: Partial<IFaq>): Promise<IFaq> => {
  const updated = await updateFaqRepo(id, data);
  if (!updated) {
    throw new AppError('FAQ not found', 404);
  }
  return updated;
};

export const deleteFaq = async (id: string): Promise<void> => {
  const deleted = await deleteFaqRepo(id);
  if (!deleted) {
    throw new AppError('FAQ not found', 404);
  }
};

export const viewFaq = async (id: string): Promise<IFaq> => {
  const updated = await incrementFaqViews(id);
  if (!updated) {
    throw new AppError('FAQ not found', 404);
  }
  return updated;
};

export const markFaqHelpful = async (id: string): Promise<IFaq> => {
  const updated = await incrementFaqHelpful(id);
  if (!updated) {
    throw new AppError('FAQ not found', 404);
  }
  return updated;
};

export const markFaqNotHelpful = async (id: string): Promise<IFaq> => {
  const updated = await incrementFaqNotHelpful(id);
  if (!updated) {
    throw new AppError('FAQ not found', 404);
  }
  return updated;
};