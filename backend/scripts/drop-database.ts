import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import logger from '../src/utils/logger.js';

const dropDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    await mongoose.connection.dropDatabase();
    logger.info('✅ Database dropped successfully');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to drop database:', error);
    process.exit(1);
  }
};

dropDatabase();