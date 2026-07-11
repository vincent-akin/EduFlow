import { z } from 'zod';

const optionSchema = z.object({
  key: z.string().min(1, 'Option key is required'),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const createQuestionSchema = z.object({
  body: z.object({
    subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
    type: z.enum(['mcq', 'theory']),
    curriculum: z.string().min(1, 'Curriculum is required'),
    topic: z.string().min(1, 'Topic is required'),
    subTopic: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    marks: z.number().min(0, 'Marks must be 0 or greater'),
    language: z.string().default('en'),
    questionText: z.string().min(1, 'Question text is required'),
    options: z.array(optionSchema).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
    explanation: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateQuestionSchema = z.object({
  body: z.object({
    subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID').optional(),
    type: z.enum(['mcq', 'theory']).optional(),
    curriculum: z.string().min(1).optional(),
    topic: z.string().min(1).optional(),
    subTopic: z.string().optional().nullable(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    marks: z.number().min(0).optional(),
    language: z.string().optional(),
    questionText: z.string().min(1).optional(),
    options: z.array(optionSchema).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    explanation: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    isArchived: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
  }),
});

export const questionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
  }),
});

export const subjectIdParamSchema = z.object({
  params: z.object({
    subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
  }),
});

export const topicParamSchema = z.object({
  params: z.object({
    topic: z.string().min(1, 'Topic is required'),
  }),
});

export const difficultyParamSchema = z.object({
  params: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']),
  }),
});