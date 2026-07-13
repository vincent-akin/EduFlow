import { Types } from 'mongoose';
import { Attendance } from '../attendance/attendance.model.js';
import { Assessment } from '../assessments/assessment.model.js';
import { Result } from '../results/result.model.js';
import { Submission } from '../submissions/submission.model.js';
import { StudentProfile } from '../students/student.model.js';
import { AppError } from '../../middlewares/error.middleware.js';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'attendance' | 'assessment' | 'result' | 'submission';
  status?: string;
  color: string;
  metadata?: any;
}

// Helper to get date key
const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]!;
};

// Helper to get student class
const getStudentClassIds = async (studentId: Types.ObjectId): Promise<Types.ObjectId[]> => {
  const student = await StudentProfile.findOne({ userId: studentId });
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return [student.classId];
};

// ==================== STUDENT CALENDAR ====================
export const getStudentCalendar = async (
  studentId: Types.ObjectId,
  schoolId: Types.ObjectId,
  month: number,
  year: number
): Promise<CalendarEvent[]> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const events: CalendarEvent[] = [];

  // Attendance
  const attendanceRecords = await Attendance.find({
    studentId,
    date: { $gte: startDate, $lte: endDate },
  });

  const colorMap: Record<string, string> = {
    present: '#10B981',
    absent: '#EF4444',
    late: '#F59E0B',
    excused: '#8B5CF6',
  };

  attendanceRecords.forEach((record: any) => {
    events.push({
      id: `attendance-${record._id}`,
      title: record.status,
      date: record.date,
      type: 'attendance',
      status: record.status,
      color: colorMap[record.status] || '#6B7280',
      metadata: { remark: record.remark },
    });
  });

  // Assessments
  const classIds = await getStudentClassIds(studentId);
  const assessments = await Assessment.find({
    schoolId,
    classId: { $in: classIds },
    status: 'published',
    startTime: { $gte: startDate, $lte: endDate },
  }).populate('subjectId', 'name');

  assessments.forEach((assessment: any) => {
    events.push({
      id: `assessment-${assessment._id}`,
      title: `📝 ${assessment.title}`,
      date: assessment.startTime,
      type: 'assessment',
      status: 'upcoming',
      color: '#3B82F6',
      metadata: {
        subject: assessment.subjectId?.name,
        duration: assessment.durationMinutes,
      },
    });
  });

  // Results
  const results = await Result.find({
    studentId,
    status: 'published',
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate('assessmentId', 'title');

  results.forEach((result: any) => {
    events.push({
      id: `result-${result._id}`,
      title: `📊 ${result.assessmentId?.title || 'Assessment'} - ${result.grade}`,
      date: result.createdAt,
      type: 'result',
      status: result.grade,
      color: '#10B981',
      metadata: {
        score: result.obtainedMarks,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
      },
    });
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// ==================== TEACHER CALENDAR ====================
export const getTeacherCalendar = async (
  teacherId: Types.ObjectId,
  schoolId: Types.ObjectId,
  month: number,
  year: number
): Promise<CalendarEvent[]> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const events: CalendarEvent[] = [];

  // Assessments created by teacher
  const assessments = await Assessment.find({
    schoolId,
    createdBy: teacherId,
    startTime: { $gte: startDate, $lte: endDate },
  }).populate('classId', 'name')
    .populate('subjectId', 'name');

  assessments.forEach((assessment: any) => {
    events.push({
      id: `assessment-${assessment._id}`,
      title: `📝 ${assessment.title}`,
      date: assessment.startTime,
      type: 'assessment',
      status: assessment.status,
      color: assessment.status === 'published' ? '#3B82F6' : '#6B7280',
      metadata: {
        class: assessment.classId?.name,
        subject: assessment.subjectId?.name,
      },
    });
  });

  // Pending grading
  const pendingSubmissions = await Submission.find({
    schoolId,
    status: 'submitted',
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate('assessmentId', 'title')
    .populate('studentId', 'firstName lastName');

  pendingSubmissions.forEach((submission: any) => {
    events.push({
      id: `pending-${submission._id}`,
      title: `✏️ ${submission.assessmentId?.title} - Pending Grading`,
      date: submission.createdAt,
      type: 'submission',
      status: 'pending_grading',
      color: '#F59E0B',
      metadata: {
        student: `${submission.studentId?.firstName} ${submission.studentId?.lastName}`,
      },
    });
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// ==================== ADMIN CALENDAR ====================
export const getAdminCalendar = async (
  schoolId: Types.ObjectId,
  month: number,
  year: number
): Promise<CalendarEvent[]> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const events: CalendarEvent[] = [];

  // All assessments
  const assessments = await Assessment.find({
    schoolId,
    status: 'published',
    startTime: { $gte: startDate, $lte: endDate },
  }).populate('classId', 'name')
    .populate('subjectId', 'name');

  assessments.forEach((assessment: any) => {
    events.push({
      id: `assessment-${assessment._id}`,
      title: `📝 ${assessment.title}`,
      date: assessment.startTime,
      type: 'assessment',
      status: 'published',
      color: '#3B82F6',
      metadata: {
        class: assessment.classId?.name,
        subject: assessment.subjectId?.name,
      },
    });
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// ==================== CALENDAR SUMMARY ====================
export const getCalendarSummary = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  role: string,
  month: number,
  year: number
): Promise<any> => {
  let events: CalendarEvent[] = [];

  switch (role) {
    case 'student':
      events = await getStudentCalendar(userId, schoolId, month, year);
      break;
    case 'teacher':
      events = await getTeacherCalendar(userId, schoolId, month, year);
      break;
    case 'school_admin':
      events = await getAdminCalendar(schoolId, month, year);
      break;
    default:
      throw new AppError('Invalid role for calendar', 400);
  }

  // Group events by date
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  events.forEach((event) => {
    const dateKey = getDateKey(event.date);
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return {
    month,
    year,
    events: groupedEvents,
    stats: {
      totalEvents: events.length,
      assessmentCount: events.filter((e) => e.type === 'assessment').length,
      attendanceCount: events.filter((e) => e.type === 'attendance').length,
      resultCount: events.filter((e) => e.type === 'result').length,
      submissionCount: events.filter((e) => e.type === 'submission').length,
    },
    daysWithEvents: Object.keys(groupedEvents).length,
  };
};