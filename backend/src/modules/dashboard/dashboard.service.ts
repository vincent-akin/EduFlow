import { Types } from 'mongoose';
import { User } from '../users/user.model.js';
import { StudentProfile } from '../students/student.model.js';
import { TeacherProfile } from '../teachers/teacher.model.js';
import { Class } from '../classes/class.model.js';
import { Subject } from '../subjects/subject.model.js';
import { Assessment } from '../assessments/assessment.model.js';
import { Result } from '../results/result.model.js';
import { Submission } from '../submissions/submission.model.js';
import { Notification } from '../notifications/notification.model.js';
import { Parent } from '../parents/parent.model.js';
import { Attendance } from '../attendance/attendance.model.js';
import { AppError } from '../../middlewares/error.middleware.js';

// ============ ADMIN DASHBOARD ============
export const getAdminDashboard = async (schoolId: Types.ObjectId) => {
  const [
    totalStudents,
    totalTeachers,
    totalParents,
    totalClasses,
    totalSubjects,
    totalAssessments,
    pendingSubmissions,
    unreadNotifications,
    recentResults,
    upcomingAssessments,
  ] = await Promise.all([
    StudentProfile.countDocuments({ schoolId, deletedAt: null }),
    TeacherProfile.countDocuments({ schoolId, deletedAt: null }),
    Parent.countDocuments({ schoolId, deletedAt: null }),
    Class.countDocuments({ schoolId, deletedAt: null }),
    Subject.countDocuments({ schoolId, deletedAt: null }),
    Assessment.countDocuments({ schoolId, deletedAt: null }),
    Submission.countDocuments({ schoolId, status: 'submitted' }),
    Notification.countDocuments({ schoolId, isRead: false }),
    Result.find({ schoolId, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId', 'firstName lastName')
      .populate('assessmentId', 'title')
      .populate('subjectId', 'name'),
    Assessment.find({ 
      schoolId, 
      status: 'published', 
      startTime: { $gt: new Date() } 
    })
      .sort({ startTime: 1 })
      .limit(10)
      .populate('subjectId', 'name')
      .populate('classId', 'name'),
  ]);

  // Calculate overall performance
  const allResults = await Result.find({ schoolId, status: 'published' });
  const averageScore = allResults.length > 0
    ? allResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / allResults.length
    : 0;

  const passed = allResults.filter((r: any) => r.percentage >= 40);
  const passRate = allResults.length > 0 ? (passed.length / allResults.length) * 100 : 0;

  // Grade distribution
  const gradeDistribution = allResults.reduce((acc: Record<string, number>, r: any) => {
    const grade = r.grade || 'Unknown';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  return {
    stats: {
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalSubjects,
      totalAssessments,
      pendingSubmissions,
      unreadNotifications,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
    },
    gradeDistribution,
    recentResults: recentResults.map((r: any) => ({
      id: r._id,
      studentName: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown',
      assessmentTitle: r.assessmentId?.title || 'Unknown',
      subjectName: r.subjectId?.name || 'Unknown',
      score: r.obtainedMarks,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      grade: r.grade || 'N/A',
      createdAt: r.createdAt,
    })),
    upcomingAssessments: upcomingAssessments.map((a: any) => ({
      id: a._id,
      title: a.title,
      subjectName: a.subjectId?.name || 'Unknown',
      className: a.classId?.name || 'Unknown',
      startTime: a.startTime,
      endTime: a.endTime,
      durationMinutes: a.durationMinutes,
    })),
  };
};

// ============ TEACHER DASHBOARD ============
export const getTeacherDashboard = async (teacherId: Types.ObjectId, schoolId: Types.ObjectId) => {
  const teacher = await TeacherProfile.findOne({ userId: teacherId });
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }

  const assignedClasses = teacher.assignedClasses || [];
  const assignedSubjects = teacher.assignedSubjects || [];

  // Get teacher's assessments
  const assessments = await Assessment.find({
    schoolId,
    createdBy: teacherId,
    deletedAt: null,
  });

  // Get pending grading
  const pendingGrading = await Submission.countDocuments({
    schoolId,
    status: 'submitted',
    assessmentId: { $in: assessments.map((a: any) => a._id) },
  });

  // Get recent submissions
  const recentSubmissions = await Submission.find({
    schoolId,
    assessmentId: { $in: assessments.map((a: any) => a._id) },
    status: 'submitted',
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('studentId', 'firstName lastName')
    .populate('assessmentId', 'title');

  // Get upcoming assessments
  const upcomingAssessments = await Assessment.find({
    schoolId,
    createdBy: teacherId,
    status: 'published',
    startTime: { $gt: new Date() },
  })
    .sort({ startTime: 1 })
    .limit(10)
    .populate('subjectId', 'name')
    .populate('classId', 'name');

  // Get class performance
  const classResults = await Result.find({
    schoolId,
    classId: { $in: assignedClasses },
    status: 'published',
  });

  const classAverage = classResults.length > 0
    ? classResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / classResults.length
    : 0;

  return {
    assignedClasses,
    assignedSubjects,
    stats: {
      totalAssessments: assessments.length,
      pendingGrading,
      classAverage: Math.round(classAverage * 100) / 100,
    },
    recentSubmissions: recentSubmissions.map((s: any) => ({
      id: s._id,
      studentName: s.studentId ? `${s.studentId.firstName} ${s.studentId.lastName}` : 'Unknown',
      assessmentTitle: s.assessmentId?.title || 'Unknown',
      submittedAt: s.submittedAt,
      status: s.status,
    })),
    upcomingAssessments: upcomingAssessments.map((a: any) => ({
      id: a._id,
      title: a.title,
      subjectName: a.subjectId?.name || 'Unknown',
      className: a.classId?.name || 'Unknown',
      startTime: a.startTime,
      endTime: a.endTime,
    })),
  };
};

// ============ STUDENT DASHBOARD ============
export const getStudentDashboard = async (studentId: Types.ObjectId, schoolId: Types.ObjectId) => {
  const student = await StudentProfile.findOne({ userId: studentId });
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const [
    upcomingAssessments,
    recentResults,
    pendingAssessments,
    notifications,
    overallPerformance,
    attendanceStats,
  ] = await Promise.all([
    Assessment.find({
      schoolId,
      classId: student.classId,
      status: 'published',
      startTime: { $gt: new Date() },
    })
      .sort({ startTime: 1 })
      .limit(10)
      .populate('subjectId', 'name'),
    Result.find({ studentId, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('assessmentId', 'title')
      .populate('subjectId', 'name'),
    Submission.countDocuments({ studentId, status: 'in_progress' }),
    Notification.find({ userId: studentId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(10),
    Result.aggregate([
      { $match: { studentId, status: 'published' } },
      { $group: {
        _id: null,
        averageScore: { $avg: '$percentage' },
        totalAssessments: { $sum: 1 },
        totalMarks: { $sum: '$obtainedMarks' },
        maxScore: { $max: '$percentage' },
        minScore: { $min: '$percentage' },
      } },
    ]),
    Attendance.aggregate([
      { $match: { studentId, date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
      } },
    ]),
  ]);

  // Calculate attendance rate
  const totalAttendance = attendanceStats.reduce((sum: number, a: any) => sum + a.count, 0);
  const presentCount = attendanceStats.find((a: any) => a._id === 'present')?.count || 0;
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

  // Subject performance
  const subjectPerformance = await Result.aggregate([
    { $match: { studentId, status: 'published' } },
    { $group: {
      _id: '$subjectId',
      averageScore: { $avg: '$percentage' },
      totalAssessments: { $sum: 1 },
    } },
    { $lookup: {
      from: 'subjects',
      localField: '_id',
      foreignField: '_id',
      as: 'subject',
    } },
    { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
  ]);

  return {
    classId: student.classId,
    subjects: student.subjectIds,
    stats: {
      pendingAssessments,
      averageScore: overallPerformance[0]?.averageScore || 0,
      totalAssessments: overallPerformance[0]?.totalAssessments || 0,
      totalMarks: overallPerformance[0]?.totalMarks || 0,
      maxScore: overallPerformance[0]?.maxScore || 0,
      minScore: overallPerformance[0]?.minScore || 0,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    },
    subjectPerformance: subjectPerformance.map((s: any) => ({
      subjectId: s._id,
      subjectName: s.subject?.name || 'Unknown',
      averageScore: Math.round(s.averageScore * 100) / 100,
      totalAssessments: s.totalAssessments,
    })),
    upcomingAssessments: upcomingAssessments.map((a: any) => ({
      id: a._id,
      title: a.title,
      subjectName: a.subjectId?.name || 'Unknown',
      startTime: a.startTime,
      endTime: a.endTime,
    })),
    recentResults: recentResults.map((r: any) => ({
      id: r._id,
      assessmentTitle: r.assessmentId?.title || 'Unknown',
      subjectName: r.subjectId?.name || 'Unknown',
      score: r.obtainedMarks,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      grade: r.grade || 'N/A',
      createdAt: r.createdAt,
    })),
    notifications: notifications.map((n: any) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      createdAt: n.createdAt,
      link: n.link,
    })),
  };
};

// ============ PARENT DASHBOARD ============
export const getParentDashboard = async (parentId: Types.ObjectId, schoolId: Types.ObjectId) => {
  const parent = await Parent.findOne({ userId: parentId, schoolId, deletedAt: null })
    .populate({
      path: 'children',
      populate: {
        path: 'userId',
        select: 'firstName lastName email avatar',
      },
    });

  if (!parent) {
    throw new AppError('Parent not found', 404);
  }

  // Get parent user info
  const parentUser = await User.findById(parentId);
  const parentName = parentUser ? `${parentUser.firstName} ${parentUser.lastName}` : 'Parent';
  const parentEmail = parentUser?.email || '';

  const children = parent.children || [];
  const childIds = children.map((child: any) => child._id);

  if (childIds.length === 0) {
    return {
      parent: {
        id: parent._id,
        name: parentName,
        phone: parent.phone || '',
        email: parentEmail,
      },
      children: [],
      stats: {
        totalChildren: 0,
        pendingAssessments: 0,
        upcomingAssessments: 0,
        averagePerformance: 0,
        unreadNotifications: 0,
      },
      recentResults: [],
      upcomingAssessments: [],
      notifications: [],
      attendanceSummary: [],
    };
  }

  // Get all children data
  const childrenPromises = children.map(async (child: any) => {
    const studentId = child._id;

    const results = await Result.find({
      studentId,
      status: 'published',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('assessmentId', 'title subjectId')
      .populate('subjectId', 'name');

    const upcoming = await Assessment.find({
      schoolId,
      classId: child.classId,
      status: 'published',
      startTime: { $gt: new Date() },
    })
      .sort({ startTime: 1 })
      .limit(5);

    const pending = await Submission.countDocuments({
      studentId,
      status: 'in_progress',
    });

    const attendance = await Attendance.aggregate([
      {
        $match: {
          studentId,
          date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const scores = results.map((r: any) => r.percentage);
    const averageScore = scores.length > 0
      ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      : 0;

    const gradeDistribution = results.reduce((acc: Record<string, number>, r: any) => {
      const grade = r.grade || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    return {
      childId: studentId,
      name: child.userId ? `${child.userId.firstName} ${child.userId.lastName}` : 'Unknown',
      classId: child.classId,
      stats: {
        totalResults: results.length,
        averageScore: Math.round(averageScore * 100) / 100,
        pendingAssessments: pending,
        upcomingAssessments: upcoming.length,
      },
      gradeDistribution,
      recentResults: results.slice(0, 5),
      upcomingAssessments: upcoming,
      attendance: attendance.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };
  });

  const childrenData = await Promise.all(childrenPromises);

  const totalChildren = childrenData.length;
  const totalPending = childrenData.reduce((sum: number, c: any) => sum + (c.stats?.pendingAssessments || 0), 0);
  const totalUpcoming = childrenData.reduce((sum: number, c: any) => sum + (c.stats?.upcomingAssessments || 0), 0);
  const totalAvg = childrenData.reduce((sum: number, c: any) => sum + (c.stats?.averageScore || 0), 0);
  const overallAvg = totalChildren > 0 ? totalAvg / totalChildren : 0;

  const allRecentResults = await Result.find({
    studentId: { $in: childIds },
    status: 'published',
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('studentId', 'firstName lastName')
    .populate('assessmentId', 'title')
    .populate('subjectId', 'name');

  const allUpcomingAssessments = await Assessment.find({
    schoolId,
    classId: { $in: children.map((c: any) => c.classId) },
    status: 'published',
    startTime: { $gt: new Date() },
  })
    .sort({ startTime: 1 })
    .limit(10);

  const notifications = await Notification.find({
    userId: parentId,
    isRead: false,
  })
    .sort({ createdAt: -1 })
    .limit(10);

  // Attendance summary
  const attendanceSummary = await Attendance.aggregate([
    {
      $match: {
        studentId: { $in: childIds },
        date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
      },
    },
    {
      $group: {
        _id: '$studentId',
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
        late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
        excused: { $sum: { $cond: [{ $eq: ['$status', 'excused'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  const attendanceMap = attendanceSummary.reduce((acc: Record<string, any>, curr: any) => {
    acc[curr._id.toString()] = {
      present: curr.present,
      absent: curr.absent,
      late: curr.late,
      excused: curr.excused,
      total: curr.total,
      attendanceRate: curr.total > 0 ? (curr.present / curr.total) * 100 : 0,
    };
    return acc;
  }, {});

  const enrichedChildrenData = childrenData.map((child: any) => ({
    ...child,
    attendance: attendanceMap[child.childId.toString()] || {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
      attendanceRate: 0,
    },
  }));

  return {
    parent: {
      id: parent._id,
      name: parentName,
      phone: parent.phone || '',
      email: parentEmail,
    },
    children: enrichedChildrenData.map((child: any) => ({
      id: child.childId,
      name: child.name,
      averageScore: child.stats.averageScore,
      attendanceRate: child.attendance.attendanceRate,
      pendingAssessments: child.stats.pendingAssessments,
      upcomingAssessments: child.stats.upcomingAssessments,
    })),
    stats: {
      totalChildren,
      pendingAssessments: totalPending,
      upcomingAssessments: totalUpcoming,
      averagePerformance: Math.round(overallAvg * 100) / 100,
      unreadNotifications: notifications.length,
    },
    recentResults: allRecentResults.map((r: any) => ({
      id: r._id,
      studentName: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown',
      assessmentTitle: r.assessmentId?.title || 'Unknown',
      subjectName: r.subjectId?.name || 'Unknown',
      score: r.obtainedMarks,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      grade: r.grade || 'N/A',
      createdAt: r.createdAt,
    })),
    upcomingAssessments: allUpcomingAssessments.map((a: any) => ({
      id: a._id,
      title: a.title,
      subjectName: a.subjectId?.name || 'Unknown',
      className: a.classId?.name || 'Unknown',
      startTime: a.startTime,
      endTime: a.endTime,
    })),
    notifications: notifications.map((n: any) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      createdAt: n.createdAt,
      link: n.link,
    })),
    attendanceSummary: enrichedChildrenData.map((child: any) => ({
      childId: child.childId,
      childName: child.name,
      attendance: child.attendance,
    })),
  };
};