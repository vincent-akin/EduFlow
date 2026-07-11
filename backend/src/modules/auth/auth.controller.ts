import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<Response> {
        const user = await authService.register(req.body);
        return ResponseHelper.success(res, user, 'User registered successfully', 201);
    }

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return ResponseHelper.success(res, result, 'Login successful');
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        return ResponseHelper.success(res, result, 'Token refreshed');
    }

    async me(req: Request, res: Response): Promise<Response> {
        // User is already attached to req by auth middleware
        const user = (req as any).user;
        return ResponseHelper.success(res, user, 'User profile retrieved');
    }
}