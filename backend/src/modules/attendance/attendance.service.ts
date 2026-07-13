import { Attendance } from './attendance.model.js';
import { Types } from 'mongoose';
import { AppError } from '../../middlewares/error.middleware.js';

export const markAttendance = async (data: any) => {
  // Check if attendance already exists for this student today
  const existing = await Attendance.findOne({
    studentId: data.studentId,
    date: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });

  if (existing) {
    throw new AppError('Attendance already marked for today', 409);
  }

  const attendance = new Attendance(data);
  return attendance.save();
};

export const getAttendanceByStudent = async (
  studentId: Types.ObjectId,
  startDate: Date,
  endDate: Date
) => {
  return Attendance.find({
    studentId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });
};

export const getAttendanceByClass = async (
  classId: Types.ObjectId,
  date: Date
) => {
  return Attendance.find({
    classId,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  }).populate('studentId', 'firstName lastName');
};

export const getAttendanceStats = async (
  schoolId: Types.ObjectId,
  startDate: Date,
  endDate: Date,
  classId?: Types.ObjectId
) => {
  const filter: any = {
    schoolId,
    date: { $gte: startDate, $lte: endDate },
  };
  if (classId) {
    filter.classId = classId;
  }

  const stats = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};