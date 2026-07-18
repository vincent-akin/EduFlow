import { Request, Response } from 'express';
import {
  getStudentAnalytics,
  getClassAnalytics,
  getSubjectAnalytics,
  getAssessmentAnalytics,
  getDashboardAnalytics,
  getPerformanceTrend,
  getRecentActivities,
  getAssessmentTypeDistribution,
  getTopPerformingClasses, // ✅ Add this import
} from './analytics.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { Types } from 'mongoose';

export const getStudentAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.params;
  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }
  const schoolId = (req as any).schoolId;
  const analytics = await getStudentAnalytics(new Types.ObjectId(studentId), schoolId);
  return ResponseHelper.success(res, analytics, 'Student analytics retrieved successfully');
};

export const getMyAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const studentId = (req as any).user.id;
  const schoolId = (req as any).schoolId;
  const analytics = await getStudentAnalytics(studentId, schoolId);
  return ResponseHelper.success(res, analytics, 'My analytics retrieved successfully');
};

export const getClassAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }
  const schoolId = (req as any).schoolId;
  const analytics = await getClassAnalytics(new Types.ObjectId(classId), schoolId);
  return ResponseHelper.success(res, analytics, 'Class analytics retrieved successfully');
};

export const getSubjectAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const { subjectId } = req.params;
  if (!subjectId) {
    return ResponseHelper.error(res, 'Subject ID is required', 400);
  }
  const schoolId = (req as any).schoolId;
  const analytics = await getSubjectAnalytics(new Types.ObjectId(subjectId), schoolId);
  return ResponseHelper.success(res, analytics, 'Subject analytics retrieved successfully');
};

export const getAssessmentAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return ResponseHelper.error(res, 'Assessment ID is required', 400);
  }
  const schoolId = (req as any).schoolId;
  const analytics = await getAssessmentAnalytics(new Types.ObjectId(assessmentId), schoolId);
  return ResponseHelper.success(res, analytics, 'Assessment analytics retrieved successfully');
};

export const getPerformanceTrendController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const months = req.query.months ? parseInt(req.query.months as string) : 12;
  
  const trend = await getPerformanceTrend(schoolId, months);
  return ResponseHelper.success(res, trend, 'Performance trend retrieved successfully');
};

export const getRecentActivitiesController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const activities = await getRecentActivities(schoolId, limit);
  return ResponseHelper.success(res, activities, 'Recent activities retrieved successfully');
};

export const getAssessmentTypeDistributionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const distribution = await getAssessmentTypeDistribution(schoolId);
  return ResponseHelper.success(
    res,
    distribution,
    'Assessment type distribution retrieved successfully'
  );
};

export const getTopPerformingClassesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const classes = await getTopPerformingClasses(schoolId, limit);
  return ResponseHelper.success(
    res,
    classes,
    'Top performing classes retrieved successfully'
  );
};

export const getDashboardAnalyticsController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const analytics = await getDashboardAnalytics(schoolId);
  return ResponseHelper.success(res, analytics, 'Dashboard analytics retrieved successfully');
};