import { Attendance, IAttendance } from './attendance.model.js';
import { Types } from 'mongoose';
import { AppError } from '../../middlewares/error.middleware.js';

export const markAttendance = async (data: any): Promise<IAttendance> => {
  // Check if attendance already exists for this student today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await Attendance.findOne({
    studentId: data.studentId,
    date: { $gte: startOfDay, $lt: endOfDay },
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
): Promise<IAttendance[]> => {
  return Attendance.find({
    studentId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });
};

export const getAttendanceByClass = async (
  classId: Types.ObjectId,
  date: Date
): Promise<IAttendance[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return Attendance.find({
    classId,
    date: { $gte: startOfDay, $lt: endOfDay },
  }).populate('studentId', 'firstName lastName');
};

export const getAttendanceByDate = async (
  schoolId: Types.ObjectId,
  date: Date
): Promise<IAttendance[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return Attendance.find({
    schoolId,
    date: { $gte: startOfDay, $lt: endOfDay },
  })
    .populate('studentId', 'firstName lastName')
    .populate('classId', 'name');
};

export const getTodayAttendance = async (schoolId: Types.ObjectId): Promise<IAttendance[]> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Attendance.find({
    schoolId,
    date: { $gte: startOfDay, $lt: endOfDay },
  })
    .populate('studentId', 'firstName lastName')
    .populate('classId', 'name');
};

export const updateAttendance = async (
  id: string,
  data: Partial<IAttendance>
): Promise<IAttendance> => {
  const attendance = await Attendance.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!attendance) {
    throw new AppError('Attendance not found', 404);
  }
  return attendance;
};

export const getAttendanceStats = async (
  schoolId: Types.ObjectId,
  startDate: Date,
  endDate: Date,
  classId?: Types.ObjectId
): Promise<any> => {
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

  const total = stats.reduce((sum: number, s: any) => sum + s.count, 0);

  return {
    total,
    breakdown: stats,
    percentages: stats.map((s: any) => ({
      status: s._id,
      count: s.count,
      percentage: total > 0 ? ((s.count / total) * 100).toFixed(2) : 0,
    })),
  };
};

export const getStudentAttendanceSummary = async (
  studentId: Types.ObjectId,
  days: number = 30
): Promise<any> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const attendance = await Attendance.find({
    studentId,
    date: { $gte: startDate },
  });

  const total = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const late = attendance.filter(a => a.status === 'late').length;
  const excused = attendance.filter(a => a.status === 'excused').length;

  return {
    studentId,
    daysTracked: total,
    present,
    absent,
    late,
    excused,
    attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
    daily: attendance.map(a => ({
      date: a.date,
      status: a.status,
      remark: a.remark,
    })),
  };
};

export const getClassAttendanceSummary = async (
  classId: Types.ObjectId,
  days: number = 30
): Promise<any> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const attendance = await Attendance.find({
    classId,
    date: { $gte: startDate },
  }).populate('studentId', 'firstName lastName');

  // Group by student
  const studentMap = new Map();
  attendance.forEach((a: any) => {
    const studentId = a.studentId._id.toString();
    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        studentId: a.studentId._id,
        studentName: `${a.studentId.firstName} ${a.studentId.lastName}`,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0,
      });
    }
    const record = studentMap.get(studentId);
    record[a.status] = (record[a.status] || 0) + 1;
    record.total += 1;
  });

  const studentSummary = Array.from(studentMap.values()).map((s: any) => ({
    ...s,
    attendanceRate: s.total > 0 ? ((s.present / s.total) * 100).toFixed(2) : 0,
  }));

  return {
    classId,
    daysTracked: days,
    totalStudents: studentSummary.length,
    students: studentSummary,
    classAverage: studentSummary.length > 0
      ? studentSummary.reduce((sum: number, s: any) => sum + parseFloat(s.attendanceRate), 0) / studentSummary.length
      : 0,
  };
};