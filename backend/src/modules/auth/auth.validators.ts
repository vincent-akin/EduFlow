import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, 'First name is required'),
        lastName: z.string().min(2, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['school_admin', 'teacher', 'student']).default('teacher'),
        schoolId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});