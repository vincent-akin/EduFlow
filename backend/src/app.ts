import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { rateLimiter } from './middlewares/rate-limit.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

import schoolRoutes from './modules/schools/school.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import sessionRoutes from './modules/sessions/session.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true,
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(loggingMiddleware);

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduFlow API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes will be registered here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/sessions', sessionRoutes);
// app.use('/api/v1/auth', authRoutes);
// etc.

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

export default app;