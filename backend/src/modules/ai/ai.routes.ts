import { Router } from 'express';
import {
  generateAIController,
  generateQuestionsController,
  generateLessonPlanController,
  generateMarkingSchemeController,
  generateFeedbackController,
  generateStudyRecommendationsController,
  getAIGenerationByIdController,
  getAllAIGenerationsController,
  getMyAIGenerationsController,
  getAIGenerationsByFeatureController,
} from './ai.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Routes accessible by teachers and admins
router.post('/generate', rbacMiddleware(['school_admin', 'teacher']), generateAIController);
router.post('/generate/questions', rbacMiddleware(['school_admin', 'teacher']), generateQuestionsController);
router.post('/generate/lesson-plan', rbacMiddleware(['school_admin', 'teacher']), generateLessonPlanController);
router.post('/generate/marking-scheme', rbacMiddleware(['school_admin', 'teacher']), generateMarkingSchemeController);
router.post('/generate/feedback', rbacMiddleware(['school_admin', 'teacher']), generateFeedbackController);
router.post('/generate/recommendations', rbacMiddleware(['school_admin', 'teacher']), generateStudyRecommendationsController);

// Get AI generations
router.get('/', rbacMiddleware(['school_admin', 'teacher']), getAllAIGenerationsController);
router.get('/my', getMyAIGenerationsController);
router.get('/feature/:feature', rbacMiddleware(['school_admin', 'teacher']), getAIGenerationsByFeatureController);
router.get('/:id', getAIGenerationByIdController);

export default router;