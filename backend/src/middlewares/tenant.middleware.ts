import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

export const tenantMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }

  // Attach schoolId to request for repository-level filtering
    (req as any).schoolId = user.schoolId;
    next();
};