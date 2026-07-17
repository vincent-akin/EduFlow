import { Router } from 'express';
import {
  getStudentAnalyticsController,
  getMyAnalyticsController,
  getClassAnalyticsController,
  getSubjectAnalyticsController,
  getAssessmentAnalyticsController,
  getDashboardAnalyticsController,
  getPerformanceTrendController,
  getAssessmentTypeDistributionController,
} from './analytics.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Student routes
router.get('/my', getMyAnalyticsController);

// Teacher/Admin routes
router.get(
  '/dashboard',
  rbacMiddleware(['school_admin', 'teacher']),
  getDashboardAnalyticsController
);

router.get(
  '/performance-trend',
  rbacMiddleware(['school_admin', 'teacher']),
  getPerformanceTrendController
);

router.get(
  '/student/:studentId',
  rbacMiddleware(['school_admin', 'teacher']),
  getStudentAnalyticsController
);

router.get(
  '/class/:classId',
  rbacMiddleware(['school_admin', 'teacher']),
  getClassAnalyticsController
);

router.get(
  '/subject/:subjectId',
  rbacMiddleware(['school_admin', 'teacher']),
  getSubjectAnalyticsController
);

router.get(
  '/assessment/:assessmentId',
  rbacMiddleware(['school_admin', 'teacher']),
  getAssessmentAnalyticsController
);

router.get(
  '/assessment-types',
  rbacMiddleware(['school_admin', 'teacher']),
  getAssessmentTypeDistributionController
);

export default router;