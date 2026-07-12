import { Router } from 'express';
import {
  startAssessmentController,
  getSubmissionByIdController,
  getAllSubmissionsController,
  updateSubmissionController,
  saveAnswerController,
  submitAssessmentController,
  gradeSubmissionController,
  getSubmissionsByAssessmentController,
  getSubmissionsByStudentController,
  getMySubmissionsController,
  getStudentAssessmentSubmissionsController,
  getPendingGradingController,
} from './submission.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  startAssessmentSchema,
  saveAnswerSchema,
  gradeSubmissionSchema,
  submissionIdParamSchema,
  assessmentIdParamSchema,
  studentIdParamSchema,
  studentAssessmentParamsSchema,
} from './submission.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Student routes
router.post(
  '/assessments/:assessmentId/start',
  validate(startAssessmentSchema),
  startAssessmentController
);

router.patch(
  '/:id/answer',
  validate(saveAnswerSchema),
  saveAnswerController
);

router.patch(
  '/:id/submit',
  validate(submissionIdParamSchema),
  submitAssessmentController
);

router.get(
  '/my',
  getMySubmissionsController
);

// Teacher/Admin routes
router.get(
  '/',
  rbacMiddleware(['school_admin', 'teacher']),
  getAllSubmissionsController
);

router.get(
  '/pending-grading',
  rbacMiddleware(['school_admin', 'teacher']),
  getPendingGradingController
);

router.get(
  '/assessment/:assessmentId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(assessmentIdParamSchema),
  getSubmissionsByAssessmentController
);

router.get(
  '/student/:studentId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(studentIdParamSchema),
  getSubmissionsByStudentController
);

router.get(
  '/student/:studentId/assessment/:assessmentId',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(studentAssessmentParamsSchema),
  getStudentAssessmentSubmissionsController
);

router.get(
  '/:id',
  validate(submissionIdParamSchema),
  getSubmissionByIdController
);

router.put(
  '/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(submissionIdParamSchema),
  updateSubmissionController
);

router.patch(
  '/:id/grade',
  rbacMiddleware(['school_admin', 'teacher']),
  validate(gradeSubmissionSchema),
  gradeSubmissionController
);

export default router;