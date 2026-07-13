import { Request, Response } from 'express';
import {
  importQuestions,
  exportQuestions,
  importStudents,
  exportStudents,
  importTeachers,
  exportTeachers,
  exportResults,
  getQuestionTemplate,
} from './import-export.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { Types } from 'mongoose';

// ============ Question Import/Export ============
export const importQuestionsController = async (req: Request, res: Response): Promise<Response> => {
  const file = (req as any).file;
  if (!file) {
    return ResponseHelper.error(res, 'No file uploaded', 400);
  }

  const schoolId = (req as any).schoolId;
  const userId = (req as any).user.id;

  const result = await importQuestions(file.buffer, schoolId, userId);
  return ResponseHelper.success(res, {
    imported: result.length,
    questions: result,
  }, 'Questions imported successfully');
};

export const exportQuestionsController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const filter: any = {};
  
  if (req.query.subjectId) {
    filter.subjectId = new Types.ObjectId(req.query.subjectId as string);
  }
  if (req.query.topic) {
    filter.topic = req.query.topic;
  }
  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  const buffer = await exportQuestions(schoolId, filter);
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=questions_${Date.now()}.xlsx`);
  res.send(buffer);
  return res;
};

export const getQuestionTemplateController = async (_req: Request, res: Response): Promise<Response> => {
  const buffer = getQuestionTemplate();
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=question_template.xlsx');
  res.send(buffer);
  return res;
};

// ============ Student Import/Export ============
export const importStudentsController = async (req: Request, res: Response): Promise<Response> => {
  const file = (req as any).file;
  if (!file) {
    return ResponseHelper.error(res, 'No file uploaded', 400);
  }

  const { classId } = req.body;
  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }

  const schoolId = (req as any).schoolId;
  const result = await importStudents(file.buffer, schoolId, new Types.ObjectId(classId));
  
  return ResponseHelper.success(res, {
    imported: result.length,
  }, 'Students imported successfully');
};

export const exportStudentsController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const { classId } = req.params;
  
  const buffer = await exportStudents(
    schoolId,
    classId ? new Types.ObjectId(classId) : undefined
  );
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=students_${Date.now()}.xlsx`);
  res.send(buffer);
  return res;
};

// ============ Teacher Import/Export ============
export const importTeachersController = async (req: Request, res: Response): Promise<Response> => {
  const file = (req as any).file;
  if (!file) {
    return ResponseHelper.error(res, 'No file uploaded', 400);
  }

  const schoolId = (req as any).schoolId;
  const result = await importTeachers(file.buffer, schoolId);
  
  return ResponseHelper.success(res, {
    imported: result.length,
  }, 'Teachers imported successfully');
};

export const exportTeachersController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const buffer = await exportTeachers(schoolId);
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=teachers_${Date.now()}.xlsx`);
  res.send(buffer);
  return res;
};

// ============ Results Export ============
export const exportResultsController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const { classId, assessmentId } = req.query;
  
  const buffer = await exportResults(
    schoolId,
    classId ? new Types.ObjectId(classId as string) : undefined,
    assessmentId ? new Types.ObjectId(assessmentId as string) : undefined
  );
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=results_${Date.now()}.xlsx`);
  res.send(buffer);
  return res;
};