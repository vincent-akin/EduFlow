import { Types } from 'mongoose';
import { createAuditLog } from './audit.service.js';

// Pre-defined audit actions
export const AUDIT_ACTIONS = {
  // Auth actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGE: 'password_change',
  
  // User actions
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_ACTIVATED: 'user_activated',
  USER_DEACTIVATED: 'user_deactivated',
  
  // School actions
  SCHOOL_CREATED: 'school_created',
  SCHOOL_UPDATED: 'school_updated',
  SCHOOL_DELETED: 'school_deleted',
  
  // Session actions
  SESSION_CREATED: 'session_created',
  SESSION_UPDATED: 'session_updated',
  SESSION_DELETED: 'session_deleted',
  SESSION_ACTIVATED: 'session_activated',
  
  // Term actions
  TERM_CREATED: 'term_created',
  TERM_UPDATED: 'term_updated',
  TERM_DELETED: 'term_deleted',
  TERM_ACTIVATED: 'term_activated',
  
  // Class actions
  CLASS_CREATED: 'class_created',
  CLASS_UPDATED: 'class_updated',
  CLASS_DELETED: 'class_deleted',
  
  // Subject actions
  SUBJECT_CREATED: 'subject_created',
  SUBJECT_UPDATED: 'subject_updated',
  SUBJECT_DELETED: 'subject_deleted',
  
  // Question actions
  QUESTION_CREATED: 'question_created',
  QUESTION_UPDATED: 'question_updated',
  QUESTION_DELETED: 'question_deleted',
  QUESTION_ARCHIVED: 'question_archived',
  
  // Assessment actions
  ASSESSMENT_CREATED: 'assessment_created',
  ASSESSMENT_UPDATED: 'assessment_updated',
  ASSESSMENT_DELETED: 'assessment_deleted',
  ASSESSMENT_PUBLISHED: 'assessment_published',
  ASSESSMENT_CLOSED: 'assessment_closed',
  ASSESSMENT_DUPLICATED: 'assessment_duplicated',
  
  // Submission actions
  SUBMISSION_STARTED: 'submission_started',
  SUBMISSION_SAVED: 'submission_saved',
  SUBMISSION_SUBMITTED: 'submission_submitted',
  SUBMISSION_GRADED: 'submission_graded',
  
  // Result actions
  RESULT_CREATED: 'result_created',
  RESULT_UPDATED: 'result_updated',
  RESULT_PUBLISHED: 'result_published',
  
  // Report card actions
  REPORT_CARD_GENERATED: 'report_card_generated',
  REPORT_CARD_UPDATED: 'report_card_updated',
  REPORT_CARD_DELETED: 'report_card_deleted',
  
  // AI actions
  AI_REQUEST: 'ai_request',
  AI_COMPLETED: 'ai_completed',
  AI_FAILED: 'ai_failed',
  
  // Subscription actions
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
};

// Helper to log audit events
export const logAuditEvent = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  action: string,
  entity: string,
  entityId: Types.ObjectId,
  metadata: any = {},
  ipAddress = '127.0.0.1',
  userAgent = 'system'
): Promise<void> => {
  await createAuditLog({
    userId,
    schoolId,
    action,
    entity,
    entityId,
    ipAddress,
    userAgent,
    metadata,
  });
};