import { Router } from 'express';
import {
  getAllStudentsController,
  getStudentByIdController,
  getMyStudentProfileController,
  getStudentsByClassController,
  createStudentController,
  updateStudentController,
  deleteStudentController,
} from './student.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Student Routes ============
// Get my student profile
router.get('/me', getMyStudentProfileController);

// ============ Admin/Teacher Routes ============
router.get('/', rbacMiddleware(['school_admin', 'teacher']), getAllStudentsController);
router.get('/class/:classId', rbacMiddleware(['school_admin', 'teacher']), getStudentsByClassController);
router.get('/:id', rbacMiddleware(['school_admin', 'teacher']), getStudentByIdController);

// ============ Admin Routes ============
router.post('/', rbacMiddleware(['school_admin']), createStudentController);
router.put('/:id', rbacMiddleware(['school_admin', 'teacher']), updateStudentController);
router.delete('/:id', rbacMiddleware(['school_admin']), deleteStudentController);

export default router;