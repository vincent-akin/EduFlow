import { z } from 'zod';

export const createSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Subject name is required'),
        code: z.string().min(2, 'Subject code is required').max(10),
        description: z.string().optional(),
        applicableClasses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID')).optional(),
        isCore: z.boolean().default(false),
        isActive: z.boolean().default(true),
    }),
});

export const updateSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        code: z.string().min(2).max(10).optional(),
        description: z.string().optional().nullable(),
        applicableClasses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID')).optional(),
        isCore: z.boolean().optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
    }),
});

export const subjectIdParamSchema = z.object({
    params: z.object({
        subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
    }),
});