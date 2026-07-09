import { ObjectId } from 'mongoose';

// ============ Base Types ============
export interface BaseDocument {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface TenantDocument extends BaseDocument {
    schoolId: ObjectId;
}

export interface SoftDeleteDocument extends TenantDocument {
    deletedAt: Date | null;
}

// ============ User Types ============
export type UserRole = 'school_admin' | 'teacher' | 'student';

// ============ Question Types ============
export type QuestionType = 'mcq' | 'theory';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ============ Assessment Types ============
export type AssessmentStatus = 'draft' | 'published' | 'closed' | 'archived';
export type AssessmentType = 'quiz' | 'test' | 'assignment' | 'exam';
export type DeliveryMode = 'cbt' | 'paper' | 'hybrid';

// ============ Submission Types ============
export type SubmissionStatus = 'in_progress' | 'submitted' | 'graded' | 'expired';

// ============ Result Types ============
export type ResultStatus = 'draft' | 'published';

// ============ Academic Types ============
export type TermName = 'First Term' | 'Second Term' | 'Third Term';

// ============ Subscription Types ============
export type Plan = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';

// ============ AI Types ============
export type AIProvider = 'openai' | 'gemini' | 'anthropic';
export type AIFeature = 
    | 'question_generation'
    | 'lesson_plan'
    | 'marking_scheme'
    | 'assessment_builder'
    | 'study_recommendation'
    | 'feedback_generation'
    | 'performance_analysis';
export type AIStatus = 'completed' | 'failed' | 'cancelled';

// ============ Notification Types ============
export type NotificationType = 
    | 'assessment'
    | 'submission'
    | 'result'
    | 'system'
    | 'subscription'
    | 'announcement';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

// ============ File Types ============
export type FileCategory = 
    | 'logo'
    | 'assessment_pdf'
    | 'report_card'
    | 'attachment'
    | 'image';
export type StorageProvider = 'cloudinary' | 'aws_s3';

// ============ API Response Types ============
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

// ============ Pagination Types ============
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