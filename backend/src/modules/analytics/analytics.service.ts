import { Types } from 'mongoose';
import { Result } from '../results/result.model.js';
import { Submission } from '../submissions/submission.model.js';
import { Assessment } from '../assessments/assessment.model.js';
import { StudentProfile } from '../students/student.model.js';
import { TeacherProfile } from '../teachers/teacher.model.js';
import { Class } from '../classes/class.model.js';
import { Subject } from '../subjects/subject.model.js';
import { AppError } from '../../middlewares/error.middleware.js';

// ============ Student Analytics ============
export const getStudentAnalytics = async (
  studentId: Types.ObjectId,
  schoolId: Types.ObjectId
): Promise<any> => {
  // Get all published results for the student
  const results = await Result.find({
    studentId,
    schoolId,
    status: 'published',
  }).populate('subjectId');

  if (results.length === 0) {
    throw new AppError('No results found for this student', 404);
  }

  // Calculate overall stats
  const totalMarks = results.reduce((sum: number, r: any) => sum + r.totalMarks, 0);
  const obtainedMarks = results.reduce((sum: number, r: any) => sum + r.obtainedMarks, 0);
  const overallPercentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  // Subject performance
  const subjectPerformance = results.map((r: any) => ({
    subjectId: r.subjectId,
    subjectName: r.subjectId?.name || 'Unknown',
    totalMarks: r.totalMarks,
    obtainedMarks: r.obtainedMarks,
    percentage: r.percentage,
    grade: r.grade,
    remark: r.remark,
  }));

  // Calculate subject averages
  const subjectAverages = subjectPerformance.reduce((acc: any, curr: any) => {
    const key = curr.subjectId.toString();
    if (!acc[key]) {
      acc[key] = {
        subjectId: curr.subjectId,
        subjectName: curr.subjectName,
        totalScore: 0,
        count: 0,
        percentages: [],
      };
    }
    acc[key].totalScore += curr.obtainedMarks;
    acc[key].count += 1;
    acc[key].percentages.push(curr.percentage);
    return acc;
  }, {} as Record<string, any>);

  const subjectAveragesArray = Object.values(subjectAverages).map((s: any) => ({
    subjectId: s.subjectId,
    subjectName: s.subjectName,
    averageScore: s.totalScore / s.count,
    averagePercentage: s.percentages.reduce((a: number, b: number) => a + b, 0) / s.percentages.length,
  }));

  // Grade distribution
  const gradeDistribution = results.reduce((acc: any, r: any) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Performance trend (by assessment)
  const trend = results.map((r: any) => ({
    assessmentId: r.assessmentId,
    percentage: r.percentage,
    grade: r.grade,
    createdAt: r.createdAt,
  })).sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());

  return {
    studentId,
    overallStats: {
      totalAssessments: results.length,
      totalMarks,
      obtainedMarks,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      grade: calculateGrade(overallPercentage),
    },
    subjectPerformance,
    subjectAverages: subjectAveragesArray,
    gradeDistribution,
    trend,
  };
};

// ============ Class Analytics ============
export const getClassAnalytics = async (
  classId: Types.ObjectId,
  schoolId: Types.ObjectId
): Promise<any> => {
  // Get all students in the class
  const students = await StudentProfile.find({
    classId,
    schoolId,
    deletedAt: null,
  });

  if (students.length === 0) {
    throw new AppError('No students found in this class', 404);
  }

  const studentIds = students.map(s => s.userId);

  // Get all results for these students
  const results = await Result.find({
    studentId: { $in: studentIds },
    schoolId,
    status: 'published',
  });

  if (results.length === 0) {
    throw new AppError('No results found for this class', 404);
  }

  // Class average
  const totalPercentage = results.reduce((sum: number, r: any) => sum + r.percentage, 0);
  const classAverage = results.length > 0 ? totalPercentage / results.length : 0;

  // Student performance ranking
  const studentPerformance = studentIds.map((studentId) => {
    const studentResults = results.filter((r: any) => r.studentId.toString() === studentId.toString());
    const avgPercentage = studentResults.length > 0
      ? studentResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / studentResults.length
      : 0;
    return {
      studentId,
      averagePercentage: Math.round(avgPercentage * 100) / 100,
      totalAssessments: studentResults.length,
    };
  }).sort((a: any, b: any) => b.averagePercentage - a.averagePercentage);

  // Grade distribution for the class
  const gradeDistribution = results.reduce((acc: any, r: any) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Subject performance in the class
  const subjectPerformance = results.reduce((acc: any, r: any) => {
    const key = r.subjectId.toString();
    if (!acc[key]) {
      acc[key] = {
        subjectId: r.subjectId,
        totalPercentage: 0,
        count: 0,
      };
    }
    acc[key].totalPercentage += r.percentage;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const subjectAverages = Object.values(subjectPerformance).map((s: any) => ({
    subjectId: s.subjectId,
    averagePercentage: Math.round((s.totalPercentage / s.count) * 100) / 100,
  }));

  // Pass rate
  const passed = results.filter((r: any) => r.percentage >= 40);
  const passRate = results.length > 0 ? (passed.length / results.length) * 100 : 0;

  return {
    classId,
    totalStudents: students.length,
    totalAssessments: results.length,
    classAverage: Math.round(classAverage * 100) / 100,
    passRate: Math.round(passRate * 100) / 100,
    studentRanking: studentPerformance,
    gradeDistribution,
    subjectAverages,
  };
};

// ============ Subject Analytics ============
export const getSubjectAnalytics = async (
  subjectId: Types.ObjectId,
  schoolId: Types.ObjectId
): Promise<any> => {
  // Get all results for this subject
  const results = await Result.find({
    subjectId,
    schoolId,
    status: 'published',
  });

  if (results.length === 0) {
    throw new AppError('No results found for this subject', 404);
  }

  // Overall subject performance
  const totalPercentage = results.reduce((sum: number, r: any) => sum + r.percentage, 0);
  const averagePercentage = results.length > 0 ? totalPercentage / results.length : 0;

  // Grade distribution
  const gradeDistribution = results.reduce((acc: any, r: any) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Pass rate
  const passed = results.filter((r: any) => r.percentage >= 40);
  const passRate = results.length > 0 ? (passed.length / results.length) * 100 : 0;

  // Performance by class
  const classPerformance = results.reduce((acc: any, r: any) => {
    const key = r.classId.toString();
    if (!acc[key]) {
      acc[key] = {
        classId: r.classId,
        totalPercentage: 0,
        count: 0,
      };
    }
    acc[key].totalPercentage += r.percentage;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const classAverages = Object.values(classPerformance).map((c: any) => ({
    classId: c.classId,
    averagePercentage: Math.round((c.totalPercentage / c.count) * 100) / 100,
  }));

  return {
    subjectId,
    totalResults: results.length,
    averagePercentage: Math.round(averagePercentage * 100) / 100,
    passRate: Math.round(passRate * 100) / 100,
    gradeDistribution,
    classAverages,
  };
};

// ============ Assessment Analytics ============
export const getAssessmentAnalytics = async (
  assessmentId: Types.ObjectId,
  schoolId: Types.ObjectId
): Promise<any> => {
  // Get assessment
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  // Get all submissions for this assessment
  const submissions = await Submission.find({
    assessmentId,
    schoolId,
  });

  if (submissions.length === 0) {
    throw new AppError('No submissions found for this assessment', 404);
  }

  // Get results
  const results = await Result.find({
    assessmentId,
    schoolId,
    status: 'published',
  });

  // Submission statistics
  const totalStudents = submissions.length;
  const submitted = submissions.filter((s: any) => s.status === 'submitted' || s.status === 'graded').length;
  const inProgress = submissions.filter((s: any) => s.status === 'in_progress').length;
  const graded = submissions.filter((s: any) => s.status === 'graded').length;

  // Score statistics
  const scores = results.map((r: any) => r.percentage);
  const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;

  // Grade distribution
  const gradeDistribution = results.reduce((acc: any, r: any) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Pass rate
  const passed = results.filter((r: any) => r.percentage >= 40);
  const passRate = results.length > 0 ? (passed.length / results.length) * 100 : 0;

  // Question performance (if available)
  let questionPerformance: any[] = [];
  const firstSubmission = submissions[0];
  if (
    firstSubmission && 
    firstSubmission.answers && 
    Array.isArray(firstSubmission.answers) && 
    firstSubmission.answers.length > 0
  ) {
    const questionMap = new Map();
    submissions.forEach((sub: any) => {
      if (sub.answers && Array.isArray(sub.answers) && sub.answers.length > 0) {
        sub.answers.forEach((answer: any) => {
          if (answer && answer.questionId) {
            const qId = answer.questionId.toString();
            if (!questionMap.has(qId)) {
              questionMap.set(qId, { correct: 0, total: 0 });
            }
            const stats = questionMap.get(qId);
            if (answer.isCorrect) {
              stats.correct += 1;
            }
            stats.total += 1;
          }
        });
      }
    });

    questionPerformance = Array.from(questionMap.entries()).map(([questionId, stats]) => ({
      questionId,
      correctCount: stats.correct,
      totalAttempts: stats.total,
      successRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    }));
  }

  return {
    assessmentId,
    assessmentTitle: assessment.title,
    totalStudents,
    submitted,
    inProgress,
    graded,
    statistics: {
      averageScore: Math.round(averageScore * 100) / 100,
      maxScore: Math.round(maxScore * 100) / 100,
      minScore: Math.round(minScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
    },
    gradeDistribution,
    questionPerformance: questionPerformance.sort((a, b) => a.successRate - b.successRate),
  };
};

// ============ Dashboard Analytics ============
export const getDashboardAnalytics = async (
  schoolId: Types.ObjectId
): Promise<any> => {
  // Get counts
  const totalStudents = await StudentProfile.countDocuments({ schoolId, deletedAt: null });
  const totalTeachers = await TeacherProfile.countDocuments({ schoolId, deletedAt: null });
  const totalClasses = await Class.countDocuments({ schoolId, deletedAt: null });
  const totalSubjects = await Subject.countDocuments({ schoolId, deletedAt: null });
  const totalAssessments = await Assessment.countDocuments({ schoolId, deletedAt: null });

  // Recent activity
  const recentResults = await Result.find({ schoolId, status: 'published' })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('studentId', 'firstName lastName')
    .populate('assessmentId', 'title');

  // Overall performance
  const allResults = await Result.find({ schoolId, status: 'published' });
  const averageScore = allResults.length > 0
    ? allResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / allResults.length
    : 0;

  // Grade distribution across school
  const gradeDistribution = allResults.reduce((acc: any, r: any) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Pass rate
  const passed = allResults.filter((r: any) => r.percentage >= 40);
  const passRate = allResults.length > 0 ? (passed.length / allResults.length) * 100 : 0;

  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      totalAssessments,
    },
    performance: {
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      gradeDistribution,
    },
    recentActivity: recentResults.map((r: any) => ({
      studentName: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown',
      assessmentTitle: r.assessmentId?.title || 'Unknown',
      score: r.obtainedMarks,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      grade: r.grade,
      createdAt: r.createdAt,
    })),
  };
};

// ============ Helper Functions ============
const calculateGrade = (percentage: number): string => {
  if (isNaN(percentage) || percentage === undefined || percentage === null) {
    return 'F';
  }
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
};