import { Request, Response } from 'express';
import {
  createSupportTicket,
  getTicketById,
  getAllTickets,
  getTicketsByUser,
  updateTicket,
  addResponseToTicket,
  resolveTicket,
  closeTicket,
  assignTicket,
  rateTicket,
  createFaq,
  getFaqById,
  getAllFaqs,
  getFaqsAdmin,
  updateFaq,
  deleteFaq,
  viewFaq,
  markFaqHelpful,
  markFaqNotHelpful,
} from './support.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

// ============ Support Ticket Controllers ============
export const createTicketController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const { subject, message, category, priority } = req.body;

  if (!subject || !message || !category) {
    return ResponseHelper.error(res, 'Subject, message, and category are required', 400);
  }

  const ticket = await createSupportTicket(userId, schoolId, {
    subject,
    message,
    category,
    priority: priority || 'medium',
  });
  return ResponseHelper.success(res, ticket, 'Support ticket created successfully', 201);
};

export const getTicketByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Ticket ID is required', 400);
  }
  const ticket = await getTicketById(id);
  return ResponseHelper.success(res, ticket, 'Ticket retrieved successfully');
};

export const getAllTicketsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }
  if (req.query.assignedTo) {
    filter.assignedTo = new Types.ObjectId(req.query.assignedTo as string);
  }

  const result = await getAllTickets(schoolId, page, limit, filter);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'Tickets retrieved successfully');
};

export const getMyTicketsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const userId = (req as any).user.id;
  const result = await getTicketsByUser(userId, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'My tickets retrieved successfully');
};

export const updateTicketController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Ticket ID is required', 400);
  }
  const ticket = await updateTicket(id, req.body);
  return ResponseHelper.success(res, ticket, 'Ticket updated successfully');
};

export const addResponseController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { message } = req.body;
  const userId = (req as any).user.id;
  const isStaff = (req as any).user.role === 'school_admin' || (req as any).user.role === 'teacher';

  if (!id || !message) {
    return ResponseHelper.error(res, 'Ticket ID and message are required', 400);
  }

  const ticket = await addResponseToTicket(id, userId, message, isStaff);
  return ResponseHelper.success(res, ticket, 'Response added successfully');
};

export const resolveTicketController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Ticket ID is required', 400);
  }
  const ticket = await resolveTicket(id);
  return ResponseHelper.success(res, ticket, 'Ticket resolved successfully');
};

export const closeTicketController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'Ticket ID is required', 400);
  }
  const ticket = await closeTicket(id);
  return ResponseHelper.success(res, ticket, 'Ticket closed successfully');
};

export const assignTicketController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  if (!id || !assignedTo) {
    return ResponseHelper.error(res, 'Ticket ID and assignedTo are required', 400);
  }

  const ticket = await assignTicket(id, new Types.ObjectId(assignedTo));
  return ResponseHelper.success(res, ticket, 'Ticket assigned successfully');
};

export const rateTicketController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  if (!id || rating === undefined) {
    return ResponseHelper.error(res, 'Ticket ID and rating are required', 400);
  }

  const ticket = await rateTicket(id, rating, feedback);
  return ResponseHelper.success(res, ticket, 'Ticket rated successfully');
};

// ============ FAQ Controllers ============
export const createFaqController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const { question, answer, category, order } = req.body;

  if (!question || !answer || !category) {
    return ResponseHelper.error(res, 'Question, answer, and category are required', 400);
  }

  const faq = await createFaq(schoolId, {
    question,
    answer,
    category,
    order: order || 0,
    isPublished: true,
  });
  return ResponseHelper.success(res, faq, 'FAQ created successfully', 201);
};

export const getFaqByIdController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  const faq = await getFaqById(id);
  return ResponseHelper.success(res, faq, 'FAQ retrieved successfully');
};

export const getAllFaqsController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const { category } = req.query;
  const result = await getAllFaqs(
    schoolId,
    category as string,
    page,
    limit
  );
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'FAQs retrieved successfully');
};

export const getFaqsAdminController = async (req: Request, res: Response): Promise<Response> => {
  const { page, limit } = getPaginationOptions(req.query);
  const schoolId = (req as any).schoolId;
  const filter: any = {};
  
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.isPublished !== undefined) {
    filter.isPublished = req.query.isPublished === 'true';
  }

  const result = await getFaqsAdmin(schoolId, filter, page, limit);
  return ResponseHelper.paginated(res, result.data, {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
  }, 'FAQs retrieved successfully');
};

export const updateFaqController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  const faq = await updateFaq(id, req.body);
  return ResponseHelper.success(res, faq, 'FAQ updated successfully');
};

export const deleteFaqController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  await deleteFaq(id);
  return ResponseHelper.success(res, null, 'FAQ deleted successfully');
};

export const viewFaqController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  const faq = await viewFaq(id);
  return ResponseHelper.success(res, faq, 'FAQ viewed successfully');
};

export const markFaqHelpfulController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  const faq = await markFaqHelpful(id);
  return ResponseHelper.success(res, faq, 'Feedback recorded successfully');
};

export const markFaqNotHelpfulController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return ResponseHelper.error(res, 'FAQ ID is required', 400);
  }
  const faq = await markFaqNotHelpful(id);
  return ResponseHelper.success(res, faq, 'Feedback recorded successfully');
};