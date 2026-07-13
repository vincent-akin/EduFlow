import * as XLSX from 'xlsx';
import { Question } from '../questions/question.model.js';
import { StudentProfile } from '../students/student.model.js';
import { TeacherProfile } from '../teachers/teacher.model.js';
import { User } from '../users/user.model.js';
import { Result } from '../results/result.model.js';
import { Types } from 'mongoose';
import { AppError } from '../../middlewares/error.middleware.js';
import { hashPassword } from '../../utils/hasher.js';

// Type for row data
interface QuestionRow {
  subjectId: string;
  type?: string;
  curriculum: string;
  topic: string;
  subTopic?: string;
  difficulty?: string;
  marks: number | string;
  language?: string;
  questionText: string;
  options?: string;
  correctAnswer: string;
  explanation?: string;
  tags?: string;
}

interface StudentRow {
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber?: string;
  subjectIds?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  enrollmentDate?: string;
  graduationYear?: number | string;
}

interface TeacherRow {
  firstName: string;
  lastName: string;
  email: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  assignedClasses?: string;
  assignedSubjects?: string;
  employmentDate?: string;
}

// Helper function to get sheet data
const getSheetData = <T>(fileBuffer: Buffer): T[] => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new AppError('No sheets found in the file', 400);
  }
  
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new AppError('No valid sheet name found', 400);
  }
  
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new AppError('Could not read sheet data', 400);
  }
  
  return XLSX.utils.sheet_to_json(sheet) as T[];
};

// ============ Question Import/Export ============
export const importQuestions = async (
  fileBuffer: Buffer,
  schoolId: Types.ObjectId,
  createdBy: Types.ObjectId
) => {
  const data = getSheetData<QuestionRow>(fileBuffer);

  if (data.length === 0) {
    throw new AppError('No data found in file', 400);
  }

  const questions = data.map((row: QuestionRow) => ({
    schoolId,
    createdBy,
    subjectId: row.subjectId,
    type: row.type || 'mcq',
    curriculum: row.curriculum,
    topic: row.topic,
    subTopic: row.subTopic || null,
    difficulty: row.difficulty || 'medium',
    marks: typeof row.marks === 'string' ? parseFloat(row.marks) : (row.marks || 5),
    language: row.language || 'en',
    questionText: row.questionText,
    options: row.options ? JSON.parse(row.options) : [],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation || null,
    tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
    isArchived: false,
  }));

  const result = await Question.insertMany(questions);
  return result;
};

export const exportQuestions = async (
  schoolId: Types.ObjectId,
  filter: any = {}
) => {
  const questions = await Question.find({ schoolId, ...filter });
  
  const data = questions.map((q: any) => ({
    id: q._id.toString(),
    subjectId: q.subjectId.toString(),
    type: q.type,
    curriculum: q.curriculum,
    topic: q.topic,
    subTopic: q.subTopic || '',
    difficulty: q.difficulty,
    marks: q.marks,
    language: q.language,
    questionText: q.questionText,
    options: JSON.stringify(q.options),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    tags: q.tags?.join(', ') || '',
    usageCount: q.usageCount || 0,
    isArchived: q.isArchived,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// ============ Student Import/Export ============
export const importStudents = async (
  fileBuffer: Buffer,
  schoolId: Types.ObjectId,
  classId: Types.ObjectId
) => {
  const data = getSheetData<StudentRow>(fileBuffer);

  if (data.length === 0) {
    throw new AppError('No data found in file', 400);
  }

  const students = [];

  for (const row of data) {
    // Create user first
    const defaultPassword = 'Student@123';
    const passwordHash = await hashPassword(defaultPassword);
    
    const user = new User({
      schoolId,
      firstName: row.firstName,
      lastName: row.lastName,
      fullName: `${row.firstName} ${row.lastName}`,
      email: row.email,
      passwordHash,
      role: 'student',
      emailVerified: true,
      isActive: true,
    });
    await user.save();

    // Create student profile
    const student = new StudentProfile({
      schoolId,
      userId: user._id,
      admissionNumber: row.admissionNumber || `STU-${Date.now()}`,
      classId,
      subjectIds: row.subjectIds ? row.subjectIds.split(',').map((s: string) => s.trim()) : [],
      guardian: {
        name: row.guardianName || '',
        phone: row.guardianPhone || '',
        email: row.guardianEmail || null,
      },
      enrollmentDate: row.enrollmentDate ? new Date(row.enrollmentDate) : new Date(),
      graduationYear: row.graduationYear ? parseInt(row.graduationYear as string) : null,
    });
    await student.save();

    students.push({ user, student });
  }

  return students;
};

export const exportStudents = async (
  schoolId: Types.ObjectId,
  classId?: Types.ObjectId
) => {
  const filter: any = { schoolId, deletedAt: null };
  if (classId) {
    filter.classId = classId;
  }

  const students = await StudentProfile.find(filter)
    .populate('userId', 'firstName lastName email')
    .populate('classId', 'name');

  const data = students.map((s: any) => ({
    id: s._id.toString(),
    firstName: s.userId?.firstName || '',
    lastName: s.userId?.lastName || '',
    email: s.userId?.email || '',
    admissionNumber: s.admissionNumber,
    className: s.classId?.name || '',
    guardianName: s.guardian.name,
    guardianPhone: s.guardian.phone,
    guardianEmail: s.guardian.email || '',
    enrollmentDate: s.enrollmentDate.toISOString().split('T')[0],
    graduationYear: s.graduationYear || '',
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// ============ Teacher Import/Export ============
export const importTeachers = async (
  fileBuffer: Buffer,
  schoolId: Types.ObjectId
) => {
  const data = getSheetData<TeacherRow>(fileBuffer);

  if (data.length === 0) {
    throw new AppError('No data found in file', 400);
  }

  const teachers = [];

  for (const row of data) {
    const defaultPassword = 'Teacher@123';
    const passwordHash = await hashPassword(defaultPassword);
    
    const user = new User({
      schoolId,
      firstName: row.firstName,
      lastName: row.lastName,
      fullName: `${row.firstName} ${row.lastName}`,
      email: row.email,
      passwordHash,
      role: 'teacher',
      emailVerified: true,
      isActive: true,
    });
    await user.save();

    const teacher = new TeacherProfile({
      schoolId,
      userId: user._id,
      employeeId: row.employeeId || `EMP-${Date.now()}`,
      designation: row.designation || 'Teacher',
      department: row.department || '',
      assignedClasses: row.assignedClasses ? row.assignedClasses.split(',').map((s: string) => s.trim()) : [],
      assignedSubjects: row.assignedSubjects ? row.assignedSubjects.split(',').map((s: string) => s.trim()) : [],
      employmentDate: row.employmentDate ? new Date(row.employmentDate) : new Date(),
    });
    await teacher.save();

    teachers.push({ user, teacher });
  }

  return teachers;
};

export const exportTeachers = async (schoolId: Types.ObjectId) => {
  const teachers = await TeacherProfile.find({ schoolId, deletedAt: null })
    .populate('userId', 'firstName lastName email')
    .populate('assignedClasses', 'name')
    .populate('assignedSubjects', 'name');

  const data = teachers.map((t: any) => ({
    id: t._id.toString(),
    firstName: t.userId?.firstName || '',
    lastName: t.userId?.lastName || '',
    email: t.userId?.email || '',
    employeeId: t.employeeId,
    designation: t.designation,
    department: t.department,
    assignedClasses: t.assignedClasses?.map((c: any) => c.name).join(', ') || '',
    assignedSubjects: t.assignedSubjects?.map((s: any) => s.name).join(', ') || '',
    employmentDate: t.employmentDate.toISOString().split('T')[0],
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// ============ Results Export ============
export const exportResults = async (
  schoolId: Types.ObjectId,
  classId?: Types.ObjectId,
  assessmentId?: Types.ObjectId
) => {
  const filter: any = { schoolId, status: 'published' };
  if (classId) {
    filter.classId = classId;
  }
  if (assessmentId) {
    filter.assessmentId = assessmentId;
  }

  const results = await Result.find(filter)
    .populate('studentId', 'firstName lastName')
    .populate('assessmentId', 'title')
    .populate('subjectId', 'name')
    .populate('classId', 'name');

  const data = results.map((r: any) => ({
    id: r._id.toString(),
    studentName: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown',
    assessmentTitle: r.assessmentId?.title || 'Unknown',
    subjectName: r.subjectId?.name || 'Unknown',
    className: r.classId?.name || 'Unknown',
    totalMarks: r.totalMarks,
    obtainedMarks: r.obtainedMarks,
    percentage: r.percentage,
    grade: r.grade,
    remark: r.remark,
    feedback: r.feedback || '',
    publishedAt: r.publishedAt.toISOString().split('T')[0],
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// ============ Get Template ============
export const getQuestionTemplate = (): Buffer => {
  const template = [
    {
      subjectId: 'SUBJECT_ID_HERE',
      type: 'mcq',
      curriculum: 'WAEC',
      topic: 'Algebra',
      subTopic: 'Quadratic Equations',
      difficulty: 'medium',
      marks: 5,
      language: 'en',
      questionText: 'What is the solution to x² - 5x + 6 = 0?',
      options: '[{"key":"A","text":"x = 2, 3","isCorrect":true},{"key":"B","text":"x = 1, 6","isCorrect":false}]',
      correctAnswer: 'A',
      explanation: 'Factoring gives (x-2)(x-3)=0',
      tags: 'algebra,quadratic',
    },
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(template);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};