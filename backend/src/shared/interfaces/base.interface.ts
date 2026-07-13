import { Types } from 'mongoose';

// ============================================
// Base Document Interfaces
// ============================================

/**
 * Base document with common fields
 * All documents should extend this
 */
export interface BaseDocument {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Tenant document with schoolId
 * All tenant-owned documents should extend this
 */
export interface TenantDocument extends BaseDocument {
    schoolId: Types.ObjectId;
}

/**
 * Soft delete document with deletedAt
 * All soft-deletable documents should extend this
 */
export interface SoftDeleteDocument extends TenantDocument {
    deletedAt: Date | null;
}

// ============================================
// User Related Interfaces
// ============================================

export interface IUser extends SoftDeleteDocument {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    passwordHash: string;
    role: 'school_admin' | 'teacher' | 'student' | 'parent';
    avatar: string | null;
    phone: string | null;
    emailVerified: boolean;
    isActive: boolean;
    lastLoginAt: Date | null;
    resetPasswordToken: string | null;  // ✅ Add this
    resetPasswordExpires: Date | null;  // ✅ Add this
}

export interface ITeacherProfile extends SoftDeleteDocument {
    userId: Types.ObjectId;
    employeeId: string;
    designation: string;
    department: string;
    assignedClasses: Types.ObjectId[];
    assignedSubjects: Types.ObjectId[];
    employmentDate: Date;
}

export interface IStudentProfile extends SoftDeleteDocument {
    userId: Types.ObjectId;
    admissionNumber: string;
    classId: Types.ObjectId;
    subjectIds: Types.ObjectId[];
    guardian: {
        name: string;
        phone: string;
        email: string | null;
    };
    enrollmentDate: Date;
    graduationYear: number | null;
}

// ============================================
// Academic Related Interfaces
// ============================================

export interface IAcademicSession extends SoftDeleteDocument {
    sessionName: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdBy: Types.ObjectId;
}

export interface IAcademicTerm extends SoftDeleteDocument {
    sessionId: Types.ObjectId;
    name: 'First Term' | 'Second Term' | 'Third Term';
    order: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

// ============================================
// School Related Interfaces
// ============================================

export interface ISchool extends SoftDeleteDocument {
    name: string;
    slug: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
    currency: string;
    logoUrl: string;
    website: string;
    settings: {
        gradingSystem: string;
        defaultLanguage: string;
        allowStudentDownloads: boolean;
        allowParentPortal: boolean;
        branding: {
            primaryColor: string;
            secondaryColor: string;
        };
    };
    isActive: boolean;
}

export interface ISubscription extends BaseDocument {
    schoolId: Types.ObjectId;
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'trial' | 'active' | 'expired' | 'cancelled';
    trialEndsAt: Date;
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
    teacherLimit: number;
    studentLimit: number;
    assessmentLimit: number;
    aiRequestLimit: number;
    storageLimitMB: number;
}

// ============================================
// Class Related Interfaces
// ============================================

export interface IClass extends SoftDeleteDocument {
    name: string;
    level: string;
    classTeacherId: Types.ObjectId | null;
    description: string | null;
    isActive: boolean;
}

export interface ISubject extends SoftDeleteDocument {
    name: string;
    code: string;
    description: string | null;
    applicableClasses: Types.ObjectId[];
    isCore: boolean;
    isActive: boolean;
}

// ============================================
// Question Related Interfaces
// ============================================

export interface IQuestion extends SoftDeleteDocument {
    subjectId: Types.ObjectId;
    createdBy: Types.ObjectId;
    type: 'mcq' | 'theory';
    curriculum: string;
    topic: string;
    subTopic: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
    marks: number;
    language: string;
    questionText: string;
    options: {
        key: string;
        text: string;
        isCorrect: boolean;
    }[];
    correctAnswer: string | string[] | null;
    explanation: string | null;
    tags: string[];
    usageCount: number;
    isArchived: boolean;
}

// ============================================
// Assessment Related Interfaces
// ============================================

export interface IAssessment extends SoftDeleteDocument {
    sessionId: Types.ObjectId;
    termId: Types.ObjectId;
    classId: Types.ObjectId;
    subjectId: Types.ObjectId;
    createdBy: Types.ObjectId;
    title: string;
    description: string | null;
    type: 'quiz' | 'test' | 'assignment' | 'exam';
    deliveryMode: 'cbt' | 'paper' | 'hybrid';
    instructions: string;
    durationMinutes: number;
    totalMarks: number;
    passMark: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    allowReview: boolean;
    startTime: Date;
    endTime: Date;
    status: 'draft' | 'published' | 'closed' | 'archived';
    questionCount: number;
    questions: {
        questionId: Types.ObjectId;
        order: number;
        marks: number;
        snapshot: {
            type: string;
            questionText: string;
            options: {
                key: string;
                text: string;
            }[];
            correctAnswer: string | string[] | null;
            explanation: string | null;
            difficulty: string;
            topic: string;
        };
    }[];
    publishedAt: Date | null;
    publishedBy: Types.ObjectId | null;
}

export interface ISubmission extends BaseDocument {
    schoolId: Types.ObjectId;
    assessmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    attemptNumber: number;
    startedAt: Date;
    submittedAt: Date | null;
    timeSpentSeconds: number;
    status: 'in_progress' | 'submitted' | 'graded' | 'expired';
    answers: {
        questionId: Types.ObjectId;
        selectedOption: string | null;
        answerText: string | null;
        obtainedMarks: number;
        isCorrect: boolean;
        answeredAt: Date;
    }[];
    autoScore: number;
    manualScore: number;
    finalScore: number;
    gradedBy: Types.ObjectId | null;
    gradedAt: Date | null;
}

// ============================================
// Result Related Interfaces
// ============================================

export interface IResult extends BaseDocument {
    schoolId: Types.ObjectId;
    submissionId: Types.ObjectId;
    assessmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    classId: Types.ObjectId;
    subjectId: Types.ObjectId;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    remark: string;
    feedback: string | null;
    publishedBy: Types.ObjectId;
    publishedAt: Date;
    status: 'draft' | 'published';
}

export interface IReportCard extends SoftDeleteDocument {
    sessionId: Types.ObjectId;
    termId: Types.ObjectId;
    studentId: Types.ObjectId;
    classId: Types.ObjectId;
    subjects: {
        subjectId: Types.ObjectId;
        score: number;
        grade: string;
        remark: string;
    }[];
    totalScore: number;
    averageScore: number;
    overallGrade: string;
    classPosition: number | null;
    attendancePercentage: number | null;
    teacherComment: string;
    principalComment: string;
    pdfFileId: Types.ObjectId | null;
    publishedBy: Types.ObjectId;
    publishedAt: Date;
}

// ============================================
// AI Related Interfaces
// ============================================

export interface IAIGeneration extends BaseDocument {
    schoolId: Types.ObjectId;
    userId: Types.ObjectId;
    provider: 'openai' | 'gemini' | 'anthropic';
    model: string;
    feature: 'question_generation' | 'lesson_plan' | 'marking_scheme' | 'assessment_builder' | 'study_recommendation' | 'feedback_generation' | 'performance_analysis';
    prompt: string;
    response: string;
    metadata: {
        subjectId: Types.ObjectId | null;
        classId: Types.ObjectId | null;
        assessmentId: Types.ObjectId | null;
        tokens: number;
        estimatedCost: number;
    };
    status: 'completed' | 'failed' | 'cancelled';
}

// ============================================
// File Related Interfaces
// ============================================

export interface IFile extends SoftDeleteDocument {
    uploadedBy: Types.ObjectId;
    filename: string;
    originalFilename: string;
    mimeType: string;
    extension: string;
    size: number;
    storageProvider: 'cloudinary' | 'aws_s3';
    path: string;
    url: string;
    category: 'logo' | 'assessment_pdf' | 'report_card' | 'attachment' | 'image';
}

// ============================================
// Notification Related Interfaces
// ============================================

export interface INotification extends BaseDocument {
    schoolId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: 'assessment' | 'submission' | 'result' | 'system' | 'subscription' | 'announcement';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    link: string | null;
    isRead: boolean;
    readAt: Date | null;
}

// ============================================
// Audit Log Related Interfaces
// ============================================

export interface IAuditLog extends BaseDocument {
    schoolId: Types.ObjectId;
    userId: Types.ObjectId;
    action: string;
    entity: string;
    entityId: Types.ObjectId;
    ipAddress: string;
    userAgent: string;
    metadata: Record<string, any>;
}

// ============================================
// API Response and Pagination Interfaces
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================
// JWT and Auth Interfaces
// ============================================

export interface JwtPayload {
    id: string;
    schoolId: string;
    email: string;
    role: 'school_admin' | 'teacher' | 'student';
    iat?: number;
    exp?: number;
}

// ============================================
// Request with User Interface
// ============================================

export interface RequestWithUser extends Request {
    user?: JwtPayload;
    schoolId?: string;
}