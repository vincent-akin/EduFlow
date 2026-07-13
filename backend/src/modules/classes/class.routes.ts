import { Router } from 'express';
import {
  createClassController,
  getClassByIdController,
  getAllClassesController,
  updateClassController,
  deleteClassController,
  getClassesByTeacherController,
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
router.get('/', getAllClassesController);

// Routes for school admin only
router.post(
  '/',
  rbacMiddleware(['school_admin']),
  validate(createClassSchema),
  createClassController
);

router.get(
  '/teacher/:teacherId',
  getClassesByTeacherController
);

router.get(
  '/:id',
  getClassByIdController
);

router.put(
  '/:id',
  rbacMiddleware(['school_admin']),
  validate(updateClassSchema),
  updateClassController
);

router.delete(
  '/:id',
  rbacMiddleware(['school_admin']),
  deleteClassController
);

export default router;