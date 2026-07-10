import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        schoolId: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
        }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        schoolId: string;
        email: string;
        role: string;
    };

    req.user = decoded;
    next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};