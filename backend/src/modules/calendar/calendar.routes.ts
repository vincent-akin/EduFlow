import { Router } from 'express';
import {
  getCalendarController,
  getStudentCalendarController,
  getTeacherCalendarController,
  getAdminCalendarController,
} from './calendar.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Main calendar endpoint (role-based)
router.get('/', getCalendarController);

// Role-specific calendars
router.get(
  '/student',
  rbacMiddleware(['school_admin', 'teacher', 'student']),
  getStudentCalendarController
);

router.get(
  '/teacher',
  rbacMiddleware(['school_admin', 'teacher']),
  getTeacherCalendarController
);

router.get(
  '/admin',
  rbacMiddleware(['school_admin']),
  getAdminCalendarController
);

export default router;