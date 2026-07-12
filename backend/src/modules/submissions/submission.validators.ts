import { z } from 'zod';

export const startAssessmentSchema = z.object({
  params: z.object({
    assessmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
  }),
});

export const saveAnswerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid submission ID'),
  }),
  body: z.object({
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
    selectedOption: z.string().optional().nullable(),
    answerText: z.string().optional().nullable(),
  }),
});

export const gradeSubmissionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid submission ID'),
  }),
  body: z.object({
    manualScore: z.number().min(0).optional(),
    finalScore: z.number().min(0).optional(),
    answers: z.array(
      z.object({
        questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
        obtainedMarks: z.number().min(0),
        isCorrect: z.boolean().optional(),
        feedback: z.string().optional(),
      })
    ).optional(),
  }),
});

export const submissionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid submission ID'),
  }),
});

export const assessmentIdParamSchema = z.object({
  params: z.object({
    assessmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
  }),
});

export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

export const studentAssessmentParamsSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    assessmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
  }),
});