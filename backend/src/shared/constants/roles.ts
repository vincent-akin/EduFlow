export const ROLES = {
    SCHOOL_ADMIN: 'school_admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
} as const;

export const ROLE_PERMISSIONS = {
    school_admin: [
        'manage_school',
        'manage_users',
        'manage_sessions',
        'manage_classes',
        'manage_subjects',
        'view_analytics',
        'manage_subscription',
    ],
    teacher: [
        'manage_questions',
        'manage_assessments',
        'grade_submissions',
        'publish_results',
        'view_analytics',
        'use_ai',
    ],
    student: [
        'view_assessments',
        'take_assessments',
        'view_results',
        'view_feedback',
        'view_progress',
    ],
} as const;