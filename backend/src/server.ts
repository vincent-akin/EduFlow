import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import logger from './utils/logger.js';

const PORT = parseInt(env.PORT);

const startServer = async (): Promise<void> => {
    try {
        // Connect to database
        await connectDatabase();

        // Start server
        const server = app.listen(PORT, () => {
            logger.info(`🚀 EduFlow API running on port ${PORT}`);
            logger.info(`📍 Environment: ${env.NODE_ENV}`);
            logger.info(`📚 Health check: http://localhost:${PORT}/health`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string): Promise<void> => {
            logger.info(`Received ${signal}, shutting down gracefully...`);
            server.close(async () => {
                logger.info('HTTP server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();