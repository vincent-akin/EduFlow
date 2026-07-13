import { Router } from 'express';
import {
  sendMessageController,
  getMessagesController,
  getMessageByIdController,
  markAsReadController,
  markAllAsReadController,
  deleteMessageController,
  getUnreadCountController,
  getConversationsController,
  sendClassAnnouncementController,
} from './message.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Conversations
router.get('/conversations', getConversationsController);
router.get('/unread/count', getUnreadCountController);

// Messages
router.post('/', sendMessageController);
router.get('/:userId', getMessagesController);
router.get('/message/:id', getMessageByIdController);
router.patch('/:id/read', markAsReadController);
router.patch('/read-all/:senderId', markAllAsReadController);
router.delete('/:id', deleteMessageController);

// Class Announcement (Admin/Teacher only)
router.post(
  '/class-announcement',
  rbacMiddleware(['school_admin', 'teacher']),
  sendClassAnnouncementController
);

export default router;