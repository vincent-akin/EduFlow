import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info('✅ MongoDB connected successfully');

        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('✅ MongoDB disconnected successfully');
    } catch (error) {
        logger.error('❌ MongoDB disconnection error:', error);
    }
};