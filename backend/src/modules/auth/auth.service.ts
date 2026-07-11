import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { User } from '../users/user.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { ERROR_MESSAGES } from '../../shared/constants/errors.js';
import { JwtPayload } from '../../shared/interfaces/base.interface.js';

export class AuthService {
        async register(userData: any) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 409);
            }

        const passwordHash = await bcrypt.hash(userData.password, 10);
        
        const user = new User({
            ...userData,
            passwordHash,
            fullName: `${userData.firstName} ${userData.lastName}`,
        });

        await user.save();
        return user;
    }

    async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        }

        if (!user.isActive) {
            throw new AppError(ERROR_MESSAGES.USER_INACTIVE, 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const payload: JwtPayload = {
            id: user._id.toString(),
            schoolId: user.schoolId.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any,
        });

        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
        });

        return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
        };
    }

    async verifyToken(token: string): Promise<JwtPayload> {
        try {
            return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        } catch (error) {
            throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, 401);
        }
    }

    async refreshToken(refreshToken: string) {
        try {
        const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
        
        const payload: JwtPayload = {
            id: decoded.id,
            schoolId: decoded.schoolId,
            email: decoded.email,
            role: decoded.role,
        };

        const newAccessToken = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any,
        });

        return { accessToken: newAccessToken };
        } catch (error) {
            throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, 401);
        }
    }
}