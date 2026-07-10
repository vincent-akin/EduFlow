export const ERROR_MESSAGES = {
    // Auth errors
    AUTH_REQUIRED: 'Authentication required',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',

    // User errors
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    USER_INACTIVE: 'User account is inactive',
    USER_DELETED: 'User account has been deleted',

    // School errors
    SCHOOL_NOT_FOUND: 'School not found',
    SCHOOL_ALREADY_EXISTS: 'School already exists',
    SCHOOL_INACTIVE: 'School is inactive',

    // Assessment errors
    ASSESSMENT_NOT_FOUND: 'Assessment not found',
    ASSESSMENT_PUBLISHED: 'Cannot modify published assessment',
    ASSESSMENT_CLOSED: 'Assessment is closed',
    ASSESSMENT_EXPIRED: 'Assessment has expired',

    // Submission errors
    SUBMISSION_NOT_FOUND: 'Submission not found',
    SUBMISSION_ALREADY_SUBMITTED: 'Already submitted',
    SUBMISSION_EXPIRED: 'Submission window has expired',

    // Result errors
    RESULT_NOT_FOUND: 'Result not found',
    RESULT_PUBLISHED: 'Cannot modify published result',

    // Validation errors
    VALIDATION_FAILED: 'Validation failed',
    INVALID_INPUT: 'Invalid input provided',

    // Tenant errors
    TENANT_REQUIRED: 'School ID is required',
    TENANT_MISMATCH: 'Tenant mismatch',

    // AI errors
    AI_SERVICE_ERROR: 'AI service error',
    AI_REQUEST_FAILED: 'AI request failed',

    // File errors
    FILE_NOT_FOUND: 'File not found',
    FILE_UPLOAD_ERROR: 'File upload failed',

    // Database errors
    DUPLICATE_KEY: 'Duplicate entry found',
    DATABASE_ERROR: 'Database error occurred',
} as const;