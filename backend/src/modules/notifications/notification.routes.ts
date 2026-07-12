import { Router } from 'express';
import {
  getMyNotificationsController,
  getMyUnreadNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  deleteAllNotificationsController,
  createNotificationController,
  sendAssessmentPublishedNotificationController,
  sendResultPublishedNotificationController,
  sendAnnouncementController,
} from './notification.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ User Routes ============
router.get('/', getMyNotificationsController);
router.get('/unread', getMyUnreadNotificationsController);
router.get('/unread/count', getUnreadCountController);
router.patch('/:id/read', markAsReadController);
router.patch('/read-all', markAllAsReadController);
router.delete('/:id', deleteNotificationController);
router.delete('/', deleteAllNotificationsController);

// ============ Admin/Teacher Routes ============
router.post(
  '/',
  rbacMiddleware(['school_admin', 'teacher']),
  createNotificationController
);

router.post(
  '/send/assessment-published',
  rbacMiddleware(['school_admin', 'teacher']),
  sendAssessmentPublishedNotificationController
);

router.post(
  '/send/result-published',
  rbacMiddleware(['school_admin', 'teacher']),
  sendResultPublishedNotificationController
);

router.post(
  '/send/announcement',
  rbacMiddleware(['school_admin', 'teacher']),
  sendAnnouncementController
);

export default router;