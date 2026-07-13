import { Request, Response } from 'express';
import {
  getStudentCalendar,
  getTeacherCalendar,
  getAdminCalendar,
  getCalendarSummary,
} from './calendar.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { Types } from 'mongoose';

export const getCalendarController = async (req: Request, res: Response): Promise<Response> => {
  const { month, year } = req.query;
  const userId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const role = (req as any).user.role;

  const monthNum = month ? parseInt(month as string) : new Date().getMonth() + 1;
  const yearNum = year ? parseInt(year as string) : new Date().getFullYear();

  if (monthNum < 1 || monthNum > 12) {
    return ResponseHelper.error(res, 'Invalid month. Must be between 1 and 12', 400);
  }

  if (yearNum < 2000 || yearNum > 2100) {
    return ResponseHelper.error(res, 'Invalid year', 400);
  }

  const summary = await getCalendarSummary(
    userId,
    schoolId,
    role,
    monthNum,
    yearNum
  );

  return ResponseHelper.success(res, summary, 'Calendar retrieved successfully');
};

export const getStudentCalendarController = async (req: Request, res: Response): Promise<Response> => {
  const { month, year, studentId } = req.query;
  const schoolId = (req as any).schoolId;

  const monthNum = month ? parseInt(month as string) : new Date().getMonth() + 1;
  const yearNum = year ? parseInt(year as string) : new Date().getFullYear();

  const events = await getStudentCalendar(
    studentId ? new Types.ObjectId(studentId as string) : (req as any).user.id,
    schoolId,
    monthNum,
    yearNum
  );

  return ResponseHelper.success(res, events, 'Student calendar retrieved successfully');
};

export const getTeacherCalendarController = async (req: Request, res: Response): Promise<Response> => {
  const { month, year, teacherId } = req.query;
  const schoolId = (req as any).schoolId;

  const monthNum = month ? parseInt(month as string) : new Date().getMonth() + 1;
  const yearNum = year ? parseInt(year as string) : new Date().getFullYear();

  const events = await getTeacherCalendar(
    teacherId ? new Types.ObjectId(teacherId as string) : (req as any).user.id,
    schoolId,
    monthNum,
    yearNum
  );

  return ResponseHelper.success(res, events, 'Teacher calendar retrieved successfully');
};

export const getAdminCalendarController = async (req: Request, res: Response): Promise<Response> => {
  const { month, year } = req.query;
  const schoolId = (req as any).schoolId;

  const monthNum = month ? parseInt(month as string) : new Date().getMonth() + 1;
  const yearNum = year ? parseInt(year as string) : new Date().getFullYear();

  const events = await getAdminCalendar(
    schoolId,
    monthNum,
    yearNum
  );

  return ResponseHelper.success(res, events, 'Admin calendar retrieved successfully');
};