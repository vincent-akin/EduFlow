import { z } from 'zod';

// ============ Result Validators ============
export const createResultSchema = z.object({
  params: z.object({
    submissionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid submission ID'),
  }),
});

export const updateResultSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid result ID'),
  }),
  body: z.object({
    obtainedMarks: z.number().min(0).optional(),
    grade: z.string().optional(),
    remark: z.string().optional(),
    feedback: z.string().optional().nullable(),
  }),
});

export const publishResultSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid result ID'),
  }),
});

export const resultIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid result ID'),
  }),
});

export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

export const assessmentIdParamSchema = z.object({
  params: z.object({
    assessmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assessment ID'),
  }),
});

export const classIdParamSchema = z.object({
  params: z.object({
    classId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID'),
  }),
});

// ============ Report Card Validators ============
export const generateReportCardSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    termId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid term ID'),
  }),
});

export const updateReportCardSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid report card ID'),
  }),
  body: z.object({
    teacherComment: z.string().optional(),
    principalComment: z.string().optional(),
    classPosition: z.number().optional().nullable(),
    attendancePercentage: z.number().min(0).max(100).optional().nullable(),
    pdfFileId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid file ID').optional().nullable(),
  }),
});

export const reportCardIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid report card ID'),
  }),
});