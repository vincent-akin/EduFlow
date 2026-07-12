import { Router } from 'express';
import {
    createAssessmentController,
    getAssessmentByIdController,
    getAllAssessmentsController,
    updateAssessmentController,
    deleteAssessmentController,
    publishAssessmentController,
    closeAssessmentController,
    getAssessmentsByClassController,
    getAssessmentsBySubjectController,
    getAssessmentsByTeacherController,
    getUpcomingAssessmentsController,
    getActiveAssessmentsController,
    duplicateAssessmentController,
} from './assessment.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
    createAssessmentSchema,
    updateAssessmentSchema,
    assessmentIdParamSchema,
    classIdParamSchema,
    subjectIdParamSchema,
} from './assessment.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Routes accessible by teachers and admins
router.get('/', getAllAssessmentsController);
router.get('/upcoming', getUpcomingAssessmentsController);
router.get('/active', getActiveAssessmentsController);
router.get('/my', getAssessmentsByTeacherController);

router.post(
    '/',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(createAssessmentSchema),
    createAssessmentController
);

router.get(
    '/class/:classId',
    validate(classIdParamSchema),
    getAssessmentsByClassController
);

router.get(
    '/subject/:subjectId',
    validate(subjectIdParamSchema),
    getAssessmentsBySubjectController
);

router.get(
    '/:id',
    validate(assessmentIdParamSchema),
    getAssessmentByIdController
);

router.put(
    '/:id',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(updateAssessmentSchema),
    updateAssessmentController
);

router.delete(
    '/:id',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(assessmentIdParamSchema),
    deleteAssessmentController
);

router.patch(
    '/:id/publish',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(assessmentIdParamSchema),
    publishAssessmentController
);

router.patch(
    '/:id/close',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(assessmentIdParamSchema),
    closeAssessmentController
);

router.post(
    '/:id/duplicate',
    rbacMiddleware(['school_admin', 'teacher']),
    validate(assessmentIdParamSchema),
    duplicateAssessmentController
);

export default router;