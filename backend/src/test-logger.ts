import logger from './utils/logger.js';

logger.info('✅ Logger is working!');
logger.debug('Debug message');
logger.warn('Warning message');
logger.error('Error message');

// Log with object
logger.info({ user: { id: 1, name: 'John' } }, 'User info');