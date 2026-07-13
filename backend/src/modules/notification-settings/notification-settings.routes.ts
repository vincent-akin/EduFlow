import { Router } from 'express';
import {
  getSettingsController,
  updateSettingsController,
  updateEmailSettingsController,
  updatePushSettingsController,
  updateSmsSettingsController,
  updateInAppSettingsController,
  updateQuietHoursController,
  toggleChannelController,
  toggleAllChannelsController,
} from './notification-settings.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Get settings
router.get('/', getSettingsController);

// Update settings
router.put('/', updateSettingsController);

// Update specific channel settings
router.put('/email', updateEmailSettingsController);
router.put('/push', updatePushSettingsController);
router.put('/sms', updateSmsSettingsController);
router.put('/in-app', updateInAppSettingsController);

// Update quiet hours
router.put('/quiet-hours', updateQuietHoursController);

// Toggle channels
router.patch('/toggle-channel', toggleChannelController);
router.patch('/toggle-all', toggleAllChannelsController);

export default router;