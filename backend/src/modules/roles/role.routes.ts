import { Router } from 'express';
import {
  createRoleController,
  getRoleByIdController,
  getAllRolesController,
  updateRoleController,
  deleteRoleController,
  initializeRolesController,
  getPermissionsController,
} from './role.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Only school admin can manage roles
router.use(rbacMiddleware(['school_admin']));

// Role management
router.post('/', createRoleController);
router.get('/', getAllRolesController);
router.get('/permissions', getPermissionsController);
router.post('/initialize', initializeRolesController);
router.get('/:id', getRoleByIdController);
router.put('/:id', updateRoleController);
router.delete('/:id', deleteRoleController);

export default router;