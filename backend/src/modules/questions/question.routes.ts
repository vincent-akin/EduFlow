import { Router } from 'express';
import {
    createQuestionController,
    getQuestionByIdController,
    getAllQuestionsController,
    updateQuestionController,
    deleteQuestionController,
    archiveQuestionController,
    incrementUsageController,
    getQuestionsBySubjectController,
    getQuestionsByTopicController,
    getQuestionsByDifficultyController,
    searchQuestionsController,
} from './question.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
    createQuestionSchema,
    updateQuestionSchema,
    questionIdParamSchema,
    subjectIdParamSchema,
    topicParamSchema,
    difficultyParamSchema,
} from './question.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Routes accessible by teachers and admins
router.get('/', getAllQuestionsController);
router.get('/search', searchQuestionsController);

// Routes for teachers and admins
router.post(
    '/',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(createQuestionSchema),
    createQuestionController
);

router.get(
    '/subject/:subjectId',
    validate(subjectIdParamSchema),
    getQuestionsBySubjectController
);

router.get(
    '/topic/:topic',
    validate(topicParamSchema),
    getQuestionsByTopicController
);

router.get(
    '/difficulty/:difficulty',
    validate(difficultyParamSchema),
    getQuestionsByDifficultyController
);

router.get(
    '/:id',
    validate(questionIdParamSchema),
    getQuestionByIdController
);

router.put(
    '/:id',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(updateQuestionSchema),
    updateQuestionController
);

router.delete(
    '/:id',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(questionIdParamSchema),
    deleteQuestionController
);

router.patch(
    '/:id/archive',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(questionIdParamSchema),
    archiveQuestionController
);

router.patch(
    '/:id/usage',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(questionIdParamSchema),
    incrementUsageController
);

export default router;