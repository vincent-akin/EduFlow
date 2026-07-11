import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validators.js';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/register', validate(registerSchema), controller.register.bind(controller));
router.post('/login', validate(loginSchema), controller.login.bind(controller));
router.post('/refresh-token', validate(refreshTokenSchema), controller.refreshToken.bind(controller));

// Protected routes
router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;