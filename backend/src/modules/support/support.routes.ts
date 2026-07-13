import { Router } from 'express';
import {
  createTicketController,
  getTicketByIdController,
  getAllTicketsController,
  getMyTicketsController,
  updateTicketController,
  addResponseController,
  resolveTicketController,
  closeTicketController,
  assignTicketController,
  rateTicketController,
  createFaqController,
  getFaqByIdController,
  getAllFaqsController,
  getFaqsAdminController,
  updateFaqController,
  deleteFaqController,
  viewFaqController,
  markFaqHelpfulController,
  markFaqNotHelpfulController,
} from './support.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Ticket Routes ============
// User routes
router.post('/tickets', createTicketController);
router.get('/tickets/my', getMyTicketsController);
router.get('/tickets/:id', getTicketByIdController);
router.post('/tickets/:id/response', addResponseController);
router.patch('/tickets/:id/rate', rateTicketController);

// Admin/Staff routes
router.get('/tickets', rbacMiddleware(['school_admin', 'teacher']), getAllTicketsController);
router.put('/tickets/:id', rbacMiddleware(['school_admin', 'teacher']), updateTicketController);
router.patch('/tickets/:id/resolve', rbacMiddleware(['school_admin', 'teacher']), resolveTicketController);
router.patch('/tickets/:id/close', rbacMiddleware(['school_admin', 'teacher']), closeTicketController);
router.patch('/tickets/:id/assign', rbacMiddleware(['school_admin', 'teacher']), assignTicketController);

// ============ FAQ Routes ============
// Public (for users)
router.get('/faqs', getAllFaqsController);
router.get('/faqs/:id', getFaqByIdController);
router.patch('/faqs/:id/view', viewFaqController);
router.patch('/faqs/:id/helpful', markFaqHelpfulController);
router.patch('/faqs/:id/not-helpful', markFaqNotHelpfulController);

// Admin routes
router.post('/faqs', rbacMiddleware(['school_admin']), createFaqController);
router.get('/faqs/admin', rbacMiddleware(['school_admin']), getFaqsAdminController);
router.put('/faqs/:id', rbacMiddleware(['school_admin']), updateFaqController);
router.delete('/faqs/:id', rbacMiddleware(['school_admin']), deleteFaqController);

export default router;