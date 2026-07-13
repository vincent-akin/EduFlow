import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// User management routes (admin only)
router.get('/', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Get all users' });
});

router.get('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Get user by ID' });
});

router.put('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Update user' });
});

router.delete('/:id', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Delete user' });
});

// Teacher routes
router.get('/teachers', rbacMiddleware(['school_admin', 'teacher']), (_req, res) => {
  res.json({ message: 'Get all teachers' });
});

// Student routes
router.get('/students', rbacMiddleware(['school_admin', 'teacher']), (_req, res) => {
  res.json({ message: 'Get all students' });
});

// Billing status route
router.get('/billing/status', rbacMiddleware(['school_admin']), (_req, res) => {
  res.json({ message: 'Billing status' });
});

export default router;