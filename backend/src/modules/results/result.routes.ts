import { Router } from 'express';
import {
  createResultController,
  getResultByIdController,
  getAllResultsController,
  updateResultController,
  publishResultController,
  getResultsByStudentController,
  getMyResultsController,
  getResultsByAssessmentController,
  getResultsByClassController,
  generateReportCardController,
  getReportCardByIdController,
  getAllReportCardsController,
  updateReportCardController,
  deleteReportCardController,
  getMyReportCardsController,
  getReportCardsByClassController,
} from './result.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createResultSchema,
  updateResultSchema,
  publishResultSchema,
  resultIdParamSchema,
  studentIdParamSchema,
  assessmentIdParamSchema,
  classIdParamSchema,
  generateReportCardSchema,
  updateReportCardSchema,
  reportCardIdParamSchema,
} from './result.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Student Routes ============
router.get('/my', getMyResultsController);
router.get('/report-cards/my', getMyReportCardsController);

// ============ Teacher/Admin Routes ============
// Results
router.post(
  '/submissions/:submissionId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(createResultSchema),
  createResultController
);

router.get(
  '/',
  rbacMiddleware(['school_admin', 'teacher']),
  getAllResultsController
);

router.get(
  '/student/:studentId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(studentIdParamSchema),
  getResultsByStudentController
);

router.get(
  '/assessment/:assessmentId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(assessmentIdParamSchema),
  getResultsByAssessmentController
);

router.get(
  '/class/:classId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(classIdParamSchema),
  getResultsByClassController
);

router.get(
  '/:id',
  validate(resultIdParamSchema),
  getResultByIdController
);

router.put(
  '/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(updateResultSchema),
  updateResultController
);

router.patch(
  '/:id/publish',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(publishResultSchema),
  publishResultController
);

// ============ Report Cards ============
router.post(
  '/report-cards/student/:studentId/term/:termId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(generateReportCardSchema),
  generateReportCardController
);

router.get(
  '/report-cards',
  rbacMiddleware(['school_admin', 'teacher']),
  getAllReportCardsController
);

router.get(
  '/report-cards/class/:classId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(classIdParamSchema),
  getReportCardsByClassController
);

router.get(
  '/report-cards/:id',
  validate(reportCardIdParamSchema),
  getReportCardByIdController
);

router.put(
  '/report-cards/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(updateReportCardSchema),
  updateReportCardController
);

router.delete(
  '/report-cards/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(reportCardIdParamSchema),
  deleteReportCardController
);

export default router;