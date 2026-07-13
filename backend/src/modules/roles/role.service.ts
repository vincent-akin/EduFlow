import { Role, IRole } from './role.model.js';
import { Types } from 'mongoose';
import { AppError } from '../../middlewares/error.middleware.js';

// Predefined permissions
export const PERMISSIONS = {
  // School permissions
  SCHOOL_VIEW: 'school:view',
  SCHOOL_UPDATE: 'school:update',
  SCHOOL_DELETE: 'school:delete',
  
  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_ACTIVATE: 'user:activate',
  USER_DEACTIVATE: 'user:deactivate',
  
  // Student permissions
  STUDENT_VIEW: 'student:view',
  STUDENT_CREATE: 'student:create',
  STUDENT_UPDATE: 'student:update',
  STUDENT_DELETE: 'student:delete',
  
  // Teacher permissions
  TEACHER_VIEW: 'teacher:view',
  TEACHER_CREATE: 'teacher:create',
  TEACHER_UPDATE: 'teacher:update',
  TEACHER_DELETE: 'teacher:delete',
  
  // Class permissions
  CLASS_VIEW: 'class:view',
  CLASS_CREATE: 'class:create',
  CLASS_UPDATE: 'class:update',
  CLASS_DELETE: 'class:delete',
  
  // Subject permissions
  SUBJECT_VIEW: 'subject:view',
  SUBJECT_CREATE: 'subject:create',
  SUBJECT_UPDATE: 'subject:update',
  SUBJECT_DELETE: 'subject:delete',
  
  // Question permissions
  QUESTION_VIEW: 'question:view',
  QUESTION_CREATE: 'question:create',
  QUESTION_UPDATE: 'question:update',
  QUESTION_DELETE: 'question:delete',
  QUESTION_ARCHIVE: 'question:archive',
  
  // Assessment permissions
  ASSESSMENT_VIEW: 'assessment:view',
  ASSESSMENT_CREATE: 'assessment:create',
  ASSESSMENT_UPDATE: 'assessment:update',
  ASSESSMENT_DELETE: 'assessment:delete',
  ASSESSMENT_PUBLISH: 'assessment:publish',
  ASSESSMENT_CLOSE: 'assessment:close',
  ASSESSMENT_DUPLICATE: 'assessment:duplicate',
  
  // Submission permissions
  SUBMISSION_VIEW: 'submission:view',
  SUBMISSION_GRADE: 'submission:grade',
  
  // Result permissions
  RESULT_VIEW: 'result:view',
  RESULT_PUBLISH: 'result:publish',
  RESULT_UPDATE: 'result:update',
  
  // Report card permissions
  REPORT_CARD_VIEW: 'report-card:view',
  REPORT_CARD_GENERATE: 'report-card:generate',
  REPORT_CARD_UPDATE: 'report-card:update',
  REPORT_CARD_DELETE: 'report-card:delete',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  
  // AI permissions
  AI_USE: 'ai:use',
  
  // Parent permissions
  PARENT_VIEW: 'parent:view',
  PARENT_CREATE: 'parent:create',
  PARENT_UPDATE: 'parent:update',
  PARENT_DELETE: 'parent:delete',
  
  // Attendance permissions
  ATTENDANCE_VIEW: 'attendance:view',
  ATTENDANCE_MARK: 'attendance:mark',
  
  // Billing permissions
  BILLING_VIEW: 'billing:view',
  BILLING_UPDATE: 'billing:update',
  
  // Audit permissions
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export',
  
  // Role permissions
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
};

// Default role permissions
export const DEFAULT_ROLES = {
  school_admin: [
    PERMISSIONS.SCHOOL_VIEW,
    PERMISSIONS.SCHOOL_UPDATE,
    PERMISSIONS.SCHOOL_DELETE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_ACTIVATE,
    PERMISSIONS.USER_DEACTIVATE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_DELETE,
    PERMISSIONS.TEACHER_VIEW,
    PERMISSIONS.TEACHER_CREATE,
    PERMISSIONS.TEACHER_UPDATE,
    PERMISSIONS.TEACHER_DELETE,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_UPDATE,
    PERMISSIONS.CLASS_DELETE,
    PERMISSIONS.SUBJECT_VIEW,
    PERMISSIONS.SUBJECT_CREATE,
    PERMISSIONS.SUBJECT_UPDATE,
    PERMISSIONS.SUBJECT_DELETE,
    PERMISSIONS.QUESTION_VIEW,
    PERMISSIONS.QUESTION_CREATE,
    PERMISSIONS.QUESTION_UPDATE,
    PERMISSIONS.QUESTION_DELETE,
    PERMISSIONS.QUESTION_ARCHIVE,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_DELETE,
    PERMISSIONS.ASSESSMENT_PUBLISH,
    PERMISSIONS.ASSESSMENT_CLOSE,
    PERMISSIONS.ASSESSMENT_DUPLICATE,
    PERMISSIONS.SUBMISSION_VIEW,
    PERMISSIONS.SUBMISSION_GRADE,
    PERMISSIONS.RESULT_VIEW,
    PERMISSIONS.RESULT_PUBLISH,
    PERMISSIONS.RESULT_UPDATE,
    PERMISSIONS.REPORT_CARD_VIEW,
    PERMISSIONS.REPORT_CARD_GENERATE,
    PERMISSIONS.REPORT_CARD_UPDATE,
    PERMISSIONS.REPORT_CARD_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.PARENT_VIEW,
    PERMISSIONS.PARENT_CREATE,
    PERMISSIONS.PARENT_UPDATE,
    PERMISSIONS.PARENT_DELETE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_UPDATE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.ROLE_VIEW,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  teacher: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.TEACHER_VIEW,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.SUBJECT_VIEW,
    PERMISSIONS.QUESTION_VIEW,
    PERMISSIONS.QUESTION_CREATE,
    PERMISSIONS.QUESTION_UPDATE,
    PERMISSIONS.QUESTION_DELETE,
    PERMISSIONS.QUESTION_ARCHIVE,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.ASSESSMENT_CREATE,
    PERMISSIONS.ASSESSMENT_UPDATE,
    PERMISSIONS.ASSESSMENT_DELETE,
    PERMISSIONS.ASSESSMENT_PUBLISH,
    PERMISSIONS.ASSESSMENT_CLOSE,
    PERMISSIONS.ASSESSMENT_DUPLICATE,
    PERMISSIONS.SUBMISSION_VIEW,
    PERMISSIONS.SUBMISSION_GRADE,
    PERMISSIONS.RESULT_VIEW,
    PERMISSIONS.RESULT_PUBLISH,
    PERMISSIONS.RESULT_UPDATE,
    PERMISSIONS.REPORT_CARD_VIEW,
    PERMISSIONS.REPORT_CARD_GENERATE,
    PERMISSIONS.REPORT_CARD_UPDATE,
    PERMISSIONS.REPORT_CARD_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  student: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.SUBJECT_VIEW,
    PERMISSIONS.QUESTION_VIEW,
    PERMISSIONS.ASSESSMENT_VIEW,
    PERMISSIONS.RESULT_VIEW,
    PERMISSIONS.REPORT_CARD_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  parent: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.RESULT_VIEW,
    PERMISSIONS.REPORT_CARD_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
};

export const createRole = async (data: Partial<IRole>): Promise<IRole> => {
  // Check if role already exists
  const existing = await Role.findOne({ 
    schoolId: data.schoolId, 
    name: data.name,
  });
  if (existing) {
    throw new AppError('Role already exists', 409);
  }
  const role = new Role(data);
  return role.save();
};

export const getRoleById = async (id: string): Promise<IRole> => {
  const role = await Role.findById(id);
  if (!role) {
    throw new AppError('Role not found', 404);
  }
  return role;
};

export const getAllRoles = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  const skip = (page - 1) * limit;
  const query = { schoolId, ...filter };
  const [data, total] = await Promise.all([
    Role.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Role.countDocuments(query),
  ]);
  return { data, total };
};

export const updateRole = async (id: string, data: Partial<IRole>): Promise<IRole> => {
  const role = await Role.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!role) {
    throw new AppError('Role not found', 404);
  }
  return role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const role = await Role.findByIdAndDelete(id);
  if (!role) {
    throw new AppError('Role not found', 404);
  }
};

export const initializeDefaultRoles = async (schoolId: Types.ObjectId): Promise<void> => {
  const defaultRoles = [
    { name: 'school_admin', permissions: DEFAULT_ROLES.school_admin, isSystem: true },
    { name: 'teacher', permissions: DEFAULT_ROLES.teacher, isSystem: true },
    { name: 'student', permissions: DEFAULT_ROLES.student, isSystem: true },
    { name: 'parent', permissions: DEFAULT_ROLES.parent, isSystem: true },
  ];

  for (const roleData of defaultRoles) {
    await Role.findOneAndUpdate(
      { schoolId, name: roleData.name },
      { ...roleData, schoolId },
      { upsert: true, new: true }
    );
  }
};

export const checkPermission = (role: string, permission: string): boolean => {
  const rolePermissions = DEFAULT_ROLES[role as keyof typeof DEFAULT_ROLES] || [];
  return rolePermissions.includes(permission);
};