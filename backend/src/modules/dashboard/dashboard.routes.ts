import { Router } from 'express';
import {
  getAdminDashboardController,
  getTeacherDashboardController,
  getStudentDashboardController,
  getParentDashboardController,
} from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Admin dashboard
router.get(
  '/admin',
  rbacMiddleware(['school_admin']),
  getAdminDashboardController
);

// Teacher dashboard
router.get(
  '/teacher',
  rbacMiddleware(['school_admin', 'teacher']),
  getTeacherDashboardController
);

// Student dashboard
router.get(
  '/student',
  rbacMiddleware(['school_admin', 'teacher', 'student']),
  getStudentDashboardController
);

// Parent dashboard
router.get(
  '/parent',
  rbacMiddleware(['school_admin', 'teacher', 'parent']),
  getParentDashboardController
);

export default router;