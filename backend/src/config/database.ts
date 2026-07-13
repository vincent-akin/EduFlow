import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority' as const,
    };

    logger.info('⏳ Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI, options);
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