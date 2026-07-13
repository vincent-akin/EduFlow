import { Router } from 'express';
import {
  getSubscriptionController,
  createSubscriptionController,
  updateSubscriptionController,
  cancelSubscriptionController,
  renewSubscriptionController,
  checkSubscriptionStatusController,
  getUsageStatsController,
} from './billing.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Only school admin can access billing
router.use(rbacMiddleware(['school_admin']));

router.get('/', getSubscriptionController);
router.post('/', createSubscriptionController);
router.put('/', updateSubscriptionController);
router.patch('/cancel', cancelSubscriptionController);
router.patch('/renew', renewSubscriptionController);
router.get('/status', checkSubscriptionStatusController);
router.get('/usage', getUsageStatsController);

export default router;