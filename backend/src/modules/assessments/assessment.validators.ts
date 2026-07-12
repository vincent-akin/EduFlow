import { z } from 'zod';

const questionSchema = z.object({
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
    order: z.number().min(0),
    marks: z.number().min(0),
});

export const createAssessmentSchema = z.object({
    body: z.object({
        sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session ID'),
        termId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid term ID'),
        classId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID'),
        subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
        title: z.string().min(2, 'Title is required'),
        description: z.string().optional(),
        type: z.enum(['quiz', 'test', 'assignment', 'exam']),
        deliveryMode: z.enum(['cbt', 'paper', 'hybrid']),
        instructions: z.string().default(''),
        durationMinutes: z.number().min(1, 'Duration must be at least 1 minute'),
        passMark: z.number().min(0, 'Pass mark must be 0 or greater'),
        shuffleQuestions: z.boolean().default(false),
        shuffleOptions: z.boolean().default(false),
        allowReview: z.boolean().default(true),
        startTime: z.string().datetime().or(z.date()),
        endTime: z.string().datetime().or(z.date()),
        questions: z.array(questionSchema).optional(),
    }),
});

export const updateAssessmentSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        description: z.string().optional().nullable(),
        type: z.enum(['quiz', 'test', 'assignment', 'exam']).optional(),
        deliveryMode: z.enum(['cbt', 'paper', 'hybrid']).optional(),
        instructions: z.string().optional(),
        durationMinutes: z.number().min(1).optional(),
        passMark: z.number().min(0).optional(),
        shuffleQuestions: z.boolean().optional(),
        shuffleOptions: z.boolean().optional(),
        allowReview: z.boolean().optional(),
        startTime: z.string().datetime().or(z.date()).optional(),
        endTime: z.string().datetime().or(z.date()).optional(),
        questions: z.array(questionSchema).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
    }),
});

export const assessmentIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
    }),
});

export const classIdParamSchema = z.object({
    params: z.object({
        classId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID'),
    }),
});

export const subjectIdParamSchema = z.object({
    params: z.object({
        subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
    }),
});