import { Router } from 'express';
import {
    createClass,
    getClassById,
    getAllClasses,
    updateClass,
    deleteClass,
    getClassesByTeacher,
} from './class.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createClassSchema, updateClassSchema } from './class.validators.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Routes accessible by teachers and admins
router.get('/', getAllClasses);

// Routes for school admin only
router.post(
    '/',
    rbacMiddleware(['school_admin']),
    validate(createClassSchema),
    createClass
);

router.get(
    '/teacher/:teacherId',
    getClassesByTeacher
);

router.get(
    '/:id',
    getClassById
);

router.put(
    '/:id',
    rbacMiddleware(['school_admin']),
    validate(updateClassSchema),
    updateClass
);

router.delete(
    '/:id',
    rbacMiddleware(['school_admin']),
    deleteClass
);

export default router;