import { z } from 'zod';

// ============ Session Validators ============
export const createSessionSchema = z.object({
    body: z.object({
        sessionName: z.string().min(2, 'Session name is required'),
        startDate: z.string().datetime().or(z.date()),
        endDate: z.string().datetime().or(z.date()),
        isActive: z.boolean().default(false),
    }),
});

export const updateSessionSchema = z.object({
    body: z.object({
        sessionName: z.string().min(2).optional(),
        startDate: z.string().datetime().or(z.date()).optional(),
        endDate: z.string().datetime().or(z.date()).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
    }),
});

// ============ Term Validators ============
export const createTermSchema = z.object({
    body: z.object({
        sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
        name: z.enum(['First Term', 'Second Term', 'Third Term']),
        order: z.number().min(1).max(3),
        startDate: z.string().datetime().or(z.date()),
        endDate: z.string().datetime().or(z.date()),
        isActive: z.boolean().default(false),
    }),
});

export const updateTermSchema = z.object({
    body: z.object({
        name: z.enum(['First Term', 'Second Term', 'Third Term']).optional(),
        order: z.number().min(1).max(3).optional(),
        startDate: z.string().datetime().or(z.date()).optional(),
        endDate: z.string().datetime().or(z.date()).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid term ID'),
    }),
});

export const sessionIdParamSchema = z.object({
    params: z.object({
        sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
    }),
});