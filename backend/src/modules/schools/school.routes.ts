import { Router } from 'express';
import {
  createSchool,
  getSchoolById,
  getSchoolBySlug,
  getSchools,
  updateSchool,
  deleteSchool,
  permanentlyDeleteSchool,
} from './school.controller.js';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createSchoolSchema,
  updateSchoolSchema,
} from './school.validators.js';

const router = Router();

// Protected routes
router.use(authMiddleware);
router.use(tenantMiddleware);
router.use(rbacMiddleware(['school_admin']));

// CRUD routes
router.post('/', validate(createSchoolSchema), createSchool);
router.get('/', getSchools);
router.get('/slug/:slug', getSchoolBySlug);
router.get('/:id', getSchoolById);
router.put('/:id', validate(updateSchoolSchema), updateSchool);
router.delete('/:id', deleteSchool);
router.delete('/:id/permanent', permanentlyDeleteSchool);

export default router;