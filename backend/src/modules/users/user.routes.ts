import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getTeachersController,
  getStudentsController,
  getParentsController,
} from './user.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Admin Routes ============
// Get all users (with pagination and filters)
router.get('/', rbacMiddleware(['school_admin']), getAllUsersController);

// Get user by ID
router.get('/:id', rbacMiddleware(['school_admin']), getUserByIdController);

// Update user
router.put('/:id', rbacMiddleware(['school_admin']), updateUserController);

// Delete user (soft delete)
router.delete('/:id', rbacMiddleware(['school_admin']), deleteUserController);

// ============ Teacher/Admin Routes ============
// Get all teachers
router.get('/teachers', rbacMiddleware(['school_admin', 'teacher']), getTeachersController);

// Get all students
router.get('/students', rbacMiddleware(['school_admin', 'teacher']), getStudentsController);

// Get all parents
router.get('/parents', rbacMiddleware(['school_admin', 'teacher']), getParentsController);

export default router;