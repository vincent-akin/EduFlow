import { Router } from 'express';
import {
  importQuestionsController,
  exportQuestionsController,
  getQuestionTemplateController,
  importStudentsController,
  exportStudentsController,
  importTeachersController,
  exportTeachersController,
  exportResultsController,
} from './import-export.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Only teachers and admins can import/export
router.use(rbacMiddleware(['school_admin', 'teacher']));

// ============ Question Routes ============
router.post('/questions/import', importQuestionsController);
router.get('/questions/export', exportQuestionsController);
router.get('/questions/template', getQuestionTemplateController);

// ============ Student Routes ============
router.post('/students/import', importStudentsController);
router.get('/students/export/:classId?', exportStudentsController);

// ============ Teacher Routes ============
router.post('/teachers/import', importTeachersController);
router.get('/teachers/export', exportTeachersController);

// ============ Results Routes ============
router.get('/results/export', exportResultsController);

export default router;