import { Router } from 'express';
import {
  createSubjectController,
  getSubjectByIdController,
  getAllSubjectsController,
  updateSubjectController,
  deleteSubjectController,
  getSubjectsByClassController,
  getCoreSubjectsController,
} from './subject.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createSubjectSchema, updateSubjectSchema } from './subject.validators.js';

const router = Router();
router.use(authMiddleware, tenantMiddleware);

router.get('/', getAllSubjectsController);
router.get('/core', getCoreSubjectsController);

router.post(
  '/',
  rbacMiddleware(['school_admin']),
  validate(createSubjectSchema),
  createSubjectController
);

router.get(
  '/class/:classId',
  getSubjectsByClassController
);

router.get(
  '/:id',
  getSubjectByIdController
);

router.put(
  '/:id',
  rbacMiddleware(['school_admin']),
  validate(updateSubjectSchema),
  updateSubjectController
);

router.delete(
  '/:id',
  rbacMiddleware(['school_admin']),
  deleteSubjectController
);

export default router;