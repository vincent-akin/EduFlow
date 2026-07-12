import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { rateLimiter } from './middlewares/rate-limit.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import schoolRoutes from './modules/schools/school.routes.js';
import sessionRoutes from './modules/sessions/session.routes.js';
import classRoutes from './modules/classes/class.routes.js';
import subjectRoutes from './modules/subjects/subject.routes.js';
import questionRoutes from './modules/questions/question.routes.js';
import assessmentRoutes from './modules/assessments/assessment.routes.js';
import submissionRoutes from './modules/submissions/submission.routes.js';
import resultRoutes from './modules/results/result.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';

const app = express();

// ============ Security Middleware ============
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : '*',
  credentials: true,
}));

// ============ Request Parsing ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ Logging ============
app.use(loggingMiddleware);

// ============ Rate Limiting ============
app.use(rateLimiter);

// ============ Health Check ============
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduFlow API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============ API Routes ============
// Public routes
app.use('/api/v1/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/audit', auditRoutes);

// ============ 404 Handler ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ============ Error Handler ============
app.use(errorMiddleware);

export default app;