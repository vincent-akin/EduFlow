import { Request, Response } from 'express';
import {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
  getAttendanceByDate,
  getAttendanceStats,
  updateAttendance,
  getStudentAttendanceSummary,
  getClassAttendanceSummary,
  getTodayAttendance,
} from './attendance.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
//import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

// ============ Mark Attendance ============
export const markAttendanceController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId, classId, status, remark } = req.body;
  const schoolId = (req as any).schoolId;
  const markedBy = (req as any).user.id;

  if (!studentId || !classId || !status) {
    return ResponseHelper.error(res, 'Student ID, Class ID, and Status are required', 400);
  }

  const attendance = await markAttendance({
    schoolId,
    studentId: new Types.ObjectId(studentId),
    classId: new Types.ObjectId(classId),
    status,
    markedBy: new Types.ObjectId(markedBy),
    remark: remark || null,
  });

  return ResponseHelper.success(res, attendance, 'Attendance marked successfully', 201);
};

// ============ Get Attendance ============
export const getAttendanceByStudentController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;

  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate as string) : new Date();

  const attendance = await getAttendanceByStudent(
    new Types.ObjectId(studentId),
    start,
    end
  );

  return ResponseHelper.success(res, attendance, 'Attendance retrieved successfully');
};

export const getMyAttendanceController = async (req: Request, res: Response): Promise<Response> => {
  const studentId = (req as any).user.id;
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate as string) : new Date();

  const attendance = await getAttendanceByStudent(
    studentId,
    start,
    end
  );

  return ResponseHelper.success(res, attendance, 'My attendance retrieved successfully');
};

export const getAttendanceByClassController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  const { date } = req.query;

  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }

  const attendanceDate = date ? new Date(date as string) : new Date();
  const attendance = await getAttendanceByClass(
    new Types.ObjectId(classId),
    attendanceDate
  );

  return ResponseHelper.success(res, attendance, 'Class attendance retrieved successfully');
};

export const getAttendanceByDateController = async (req: Request, res: Response): Promise<Response> => {
  const { date } = req.query;
  const schoolId = (req as any).schoolId;

  if (!date) {
    return ResponseHelper.error(res, 'Date is required', 400);
  }

  const attendanceDate = new Date(date as string);
  const attendance = await getAttendanceByDate(schoolId, attendanceDate);

  return ResponseHelper.success(res, attendance, 'Attendance retrieved successfully');
};

export const getTodayAttendanceController = async (req: Request, res: Response): Promise<Response> => {
  const schoolId = (req as any).schoolId;
  const attendance = await getTodayAttendance(schoolId);
  return ResponseHelper.success(res, attendance, 'Today\'s attendance retrieved successfully');
};

// ============ Update Attendance ============
export const updateAttendanceController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { status, remark } = req.body;

  if (!id) {
    return ResponseHelper.error(res, 'Attendance ID is required', 400);
  }

  if (!status) {
    return ResponseHelper.error(res, 'Status is required', 400);
  }

  const attendance = await updateAttendance(id, { status, remark });
  return ResponseHelper.success(res, attendance, 'Attendance updated successfully');
};

// ============ Statistics ============
export const getAttendanceStatsController = async (req: Request, res: Response): Promise<Response> => {
  const { startDate, endDate, classId } = req.query;
  const schoolId = (req as any).schoolId;

  const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate as string) : new Date();

  const stats = await getAttendanceStats(
    schoolId,
    start,
    end,
    classId ? new Types.ObjectId(classId as string) : undefined
  );

  return ResponseHelper.success(res, stats, 'Attendance stats retrieved successfully');
};

export const getStudentAttendanceSummaryController = async (req: Request, res: Response): Promise<Response> => {
  const { studentId } = req.params;
  const { days } = req.query;

  if (!studentId) {
    return ResponseHelper.error(res, 'Student ID is required', 400);
  }

  const numberOfDays = days ? parseInt(days as string) : 30;
  const summary = await getStudentAttendanceSummary(
    new Types.ObjectId(studentId),
    numberOfDays
  );

  return ResponseHelper.success(res, summary, 'Student attendance summary retrieved successfully');
};

export const getMyAttendanceSummaryController = async (req: Request, res: Response): Promise<Response> => {
  const studentId = (req as any).user.id;
  const { days } = req.query;
  const numberOfDays = days ? parseInt(days as string) : 30;

  const summary = await getStudentAttendanceSummary(
    studentId,
    numberOfDays
  );

  return ResponseHelper.success(res, summary, 'My attendance summary retrieved successfully');
};

export const getClassAttendanceSummaryController = async (req: Request, res: Response): Promise<Response> => {
  const { classId } = req.params;
  const { days } = req.query;

  if (!classId) {
    return ResponseHelper.error(res, 'Class ID is required', 400);
  }

  const numberOfDays = days ? parseInt(days as string) : 30;
  const summary = await getClassAttendanceSummary(
    new Types.ObjectId(classId),
    numberOfDays
  );

  return ResponseHelper.success(res, summary, 'Class attendance summary retrieved successfully');
};