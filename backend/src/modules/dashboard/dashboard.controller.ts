import { Request, Response } from 'express';
import {
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
  getParentDashboard,
} from './dashboard.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';

export const getAdminDashboardController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const dashboard = await getAdminDashboard(schoolId);
  return ResponseHelper.success(res, dashboard, 'Admin dashboard retrieved successfully');
};

export const getTeacherDashboardController = async (req: Request, res: Response): Promise<Response> => {
  const teacherId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const dashboard = await getTeacherDashboard(teacherId, schoolId);
  return ResponseHelper.success(res, dashboard, 'Teacher dashboard retrieved successfully');
};

export const getStudentDashboardController = async (req: Request, res: Response): Promise<Response> => {
  const studentId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const dashboard = await getStudentDashboard(studentId, schoolId);
  return ResponseHelper.success(res, dashboard, 'Student dashboard retrieved successfully');
};

export const getParentDashboardController = async (req: Request, res: Response): Promise<Response> => {
  const parentId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const dashboard = await getParentDashboard(parentId, schoolId);
  return ResponseHelper.success(res, dashboard, 'Parent dashboard retrieved successfully');
};