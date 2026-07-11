import { Router } from 'express';
import {
    createSubject,
    getSubjectById,
    getAllSubjects,
    updateSubject,
    deleteSubject,
    getSubjectsByClass,
    getCoreSubjects,
} from './subject.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createSubjectSchema, updateSubjectSchema } from './subject.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Routes accessible by teachers and admins
router.get('/', getAllSubjects);
router.get('/core', getCoreSubjects);

// Routes for school admin only
router.post(
    '/',
    rbacMiddleware(['school_admin']),
    validate(createSubjectSchema),
    createSubject
);

router.get(
    '/class/:classId',
    getSubjectsByClass
);

router.get(
    '/:id',
    getSubjectById
);

router.put(
    '/:id',
    rbacMiddleware(['school_admin']),
    validate(updateSubjectSchema),
    updateSubject
);

router.delete(
    '/:id',
    rbacMiddleware(['school_admin']),
    deleteSubject
);

export default router;