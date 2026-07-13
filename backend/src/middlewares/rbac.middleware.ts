import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

type Role = 'school_admin' | 'teacher' | 'student' | 'parent';

export const rbacMiddleware = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};