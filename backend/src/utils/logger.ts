import { pino } from 'pino';
import { env } from '../config/env.js';

const isDevelopment = env.NODE_ENV === 'development';

const options: pino.LoggerOptions = {
    level: env.LOG_LEVEL || 'info',
    formatters: {
        level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
};

if (isDevelopment) {
    options.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    };
}

export const logger = pino(options);

export default logger;