import { Router } from 'express';
import {
  getAllTeachersController,
  getTeacherByIdController,
  getMyTeacherProfileController,
  createTeacherController,
  updateTeacherController,
  deleteTeacherController,
} from './teacher.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Teacher Routes ============
// Get my teacher profile
router.get('/me', getMyTeacherProfileController);

// ============ Admin Routes ============
router.get('/', rbacMiddleware(['school_admin']), getAllTeachersController);
router.get('/:id', rbacMiddleware(['school_admin']), getTeacherByIdController);
router.post('/', rbacMiddleware(['school_admin']), createTeacherController);
router.put('/:id', rbacMiddleware(['school_admin']), updateTeacherController);
router.delete('/:id', rbacMiddleware(['school_admin']), deleteTeacherController);

export default router;