import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';

const router = Router();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// Student routes (accessible by students, teachers, and admins)
router.get('/me', (req, res) => {
  // Get current student profile
  res.json({ message: 'Get my student profile' });
});

// Admin/Teacher routes
router.get('/', rbacMiddleware(['school_admin', 'teacher']), (req, res) => {
  res.json({ message: 'Get all students' });
});

router.get('/:id', rbacMiddleware(['school_admin', 'teacher']), (req, res) => {
  res.json({ message: 'Get student by ID' });
});

router.post('/', rbacMiddleware(['school_admin']), (req, res) => {
  res.json({ message: 'Create student' });
});

router.put('/:id', rbacMiddleware(['school_admin', 'teacher']), (req, res) => {
  res.json({ message: 'Update student' });
});

router.delete('/:id', rbacMiddleware(['school_admin']), (req, res) => {
  res.json({ message: 'Delete student' });
});

export default router;