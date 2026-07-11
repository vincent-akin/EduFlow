import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Class name is required'),
    level: z.string().min(1, 'Level is required'),
    classTeacherId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID').optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateClassSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    level: z.string().min(1).optional(),
    classTeacherId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID').optional().nullable(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID'),
  }),
});

export const classIdParamSchema = z.object({
  params: z.object({
    classId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID'),
  }),
});