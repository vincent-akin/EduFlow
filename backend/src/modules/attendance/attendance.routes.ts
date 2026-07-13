import { Router } from 'express';
import {
  markAttendanceController,
  getAttendanceByStudentController,
  getMyAttendanceController,
  getAttendanceByClassController,
  getAttendanceByDateController,
  getTodayAttendanceController,
  updateAttendanceController,
  getAttendanceStatsController,
  getStudentAttendanceSummaryController,
  getMyAttendanceSummaryController,
  getClassAttendanceSummaryController,
} from './attendance.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Student Routes ============
router.get('/my', getMyAttendanceController);
router.get('/my/summary', getMyAttendanceSummaryController);

// ============ Teacher/Admin Routes ============
// Mark attendance
router.post(
  '/mark',
  rbacMiddleware(['school_admin', 'teacher']),
  markAttendanceController
);

// Get attendance
router.get(
  '/today',
  rbacMiddleware(['school_admin', 'teacher']),
  getTodayAttendanceController
);

router.get(
  '/date',
  rbacMiddleware(['school_admin', 'teacher']),
  getAttendanceByDateController
);

router.get(
  '/class/:classId',
  rbacMiddleware(['school_admin', 'teacher']),
  getAttendanceByClassController
);

router.get(
  '/class/:classId/summary',
  rbacMiddleware(['school_admin', 'teacher']),
  getClassAttendanceSummaryController
);

router.get(
  '/student/:studentId',
  rbacMiddleware(['school_admin', 'teacher']),
  getAttendanceByStudentController
);

router.get(
  '/student/:studentId/summary',
  rbacMiddleware(['school_admin', 'teacher']),
  getStudentAttendanceSummaryController
);

// Statistics
router.get(
  '/stats',
  rbacMiddleware(['school_admin', 'teacher']),
  getAttendanceStatsController
);

// Update attendance
router.put(
  '/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  updateAttendanceController
);

export default router;