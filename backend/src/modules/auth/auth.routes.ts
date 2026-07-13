import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshTokenController,
  meController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
  verifyEmailController,
  resendVerificationController,
  logoutController,
} from './auth.controller.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendVerificationSchema,
} from './auth.validators.js';

const router = Router();

// ============ Public Routes (No Authentication Required) ============

// Registration & Login
router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh-token', validate(refreshTokenSchema), refreshTokenController);

// Password Reset
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);

// Email Verification
router.get('/verify/:token', verifyEmailController);
router.post('/resend-verification', validate(resendVerificationSchema), resendVerificationController);

// ============ Protected Routes (Authentication Required) ============

// User Profile
router.get('/me', authMiddleware, meController);

// Password Change
router.patch('/change-password', authMiddleware, validate(changePasswordSchema), changePasswordController);

// Logout (Client-side only, but providing endpoint for consistency)
router.post('/logout', authMiddleware, logoutController);

export default router;