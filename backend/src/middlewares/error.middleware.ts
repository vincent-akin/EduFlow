import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        });
        return;
    }

    // MongoDB duplicate key error
    if ((err as any).code === 11000) {
        res.status(409).json({
            success: false,
            message: 'Duplicate entry found',
        });
        return;
    }

    // MongoDB validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: Object.values((err as any).errors).map((e: any) => e.message),
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};