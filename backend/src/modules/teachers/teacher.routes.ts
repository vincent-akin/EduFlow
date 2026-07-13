import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Teacher routes (accessible by teachers and admins)
router.get('/me', (_req, res) => {
  // Get current teacher profile
  res.json({ message: 'Get my teacher profile' });
});

// Admin routes
router.get('/', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Get all teachers' });
});

router.get('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Get teacher by ID' });
});

router.post('/', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Create teacher' });
});

router.put('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Update teacher' });
});

router.delete('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Delete teacher' });
});

export default router;