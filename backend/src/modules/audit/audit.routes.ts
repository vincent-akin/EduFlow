import { Router } from 'express';
import {
    getAuditLogByIdController,
    getAllAuditLogsController,
    getAuditLogsByUserController,
    getAuditLogsByEntityController,
    getAuditLogsByActionController,
} from './audit.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Only school admin can access audit logs
router.use(rbacMiddleware(['school_admin']));

router.get('/', getAllAuditLogsController);
router.get('/user/:userId', getAuditLogsByUserController);
router.get('/entity/:entity/:entityId', getAuditLogsByEntityController);
router.get('/action/:action', getAuditLogsByActionController);
router.get('/:id', getAuditLogByIdController);

export default router;