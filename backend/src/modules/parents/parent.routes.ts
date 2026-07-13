import { Router } from 'express';
import {
  createParentController,
  getParentByIdController,
  getMyParentProfileController,
  getAllParentsController,
  updateParentController,
  deleteParentController,
  getParentChildrenController,
  linkChildController,
} from './parent.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();
router.use(authMiddleware, tenantMiddleware);

// Parent routes
router.get('/me', getMyParentProfileController);
router.get('/children', getParentChildrenController);

// Admin routes
router.get('/', rbacMiddleware(['school_admin', 'teacher']), getAllParentsController);
router.get('/:id', rbacMiddleware(['school_admin', 'teacher']), getParentByIdController);
router.post('/', rbacMiddleware(['school_admin']), createParentController);
router.put('/:id', rbacMiddleware(['school_admin']), updateParentController);
router.delete('/:id', rbacMiddleware(['school_admin']), deleteParentController);
router.post('/link-child', rbacMiddleware(['school_admin']), linkChildController);

export default router;