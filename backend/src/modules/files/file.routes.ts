import { Router } from 'express';
import {
  uploadFileController,
  getFileByIdController,
  getFilesByCategoryController,
  getMyFilesController,
  deleteFileController,
} from './file.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Upload file (teachers and admins)
router.post(
  '/upload',
  rbacMiddleware(['school_admin', 'teacher']),
  uploadFileController
);

// Get files by category (teachers and admins)
router.get(
  '/category/:category',
  rbacMiddleware(['school_admin', 'teacher']),
  getFilesByCategoryController
);

// Get my files (all authenticated users)
router.get('/my', getMyFilesController);

// Get file by ID (all authenticated users)
router.get('/:id', getFileByIdController);

// Delete file (teachers and admins)
router.delete(
  '/:id',
  rbacMiddleware(['school_admin', 'teacher']),
  deleteFileController
);

export default router;