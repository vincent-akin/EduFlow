# 📘 EDUFLOW - ERD (ENTITY RELATIONSHIP DESIGN)

**Version:** 2.0
**Status:** Production Ready
**Database:** MongoDB Atlas
**Architecture:** Multi-Tenant SaaS
**Last Updated:** July 2026

---

# 1. SYSTEM OVERVIEW

EduFlow is a multi-tenant Assessment & Academic Productivity Platform built around the complete academic assessment lifecycle.

Every resource belongs to a single school and all business operations are tenant-isolated.

Core workflow:

```text
School
   ↓
Academic Sessions
   ↓
Classes & Subjects
   ↓
Question Bank
   ↓
Assessments
   ↓
Student Submissions
   ↓
Results
   ↓
Teacher Feedback
   ↓
Analytics
   ↓
AI Insights
```

---

# 2. CORE DOMAIN MODEL

```text
School
│
├── Subscription
│
├── Users
│      ├── Teacher Profiles
│      └── Student Profiles
│
├── Academic Sessions
│      └── Academic Terms
│
├── Classes
│
├── Subjects
│
├── Questions
│
├── Assessments
│      ├── Assessment Questions
│      └── Student Submissions
│
├── Results
│
├── Files
│
├── Notifications
│
├── AI Generations
│
└── Audit Logs
```

---

# 3. DESIGN PRINCIPLES

- Assessment-first architecture
- Multi-tenancy by default
- Repository-level tenant enforcement
- Immutable published assessments
- Snapshot-based assessments
- Soft deletes
- Event-ready architecture
- Auditability
- API-first development
- AI-assisted workflows
- Security by design

---

# 4. MULTI-TENANCY

Every tenant-owned document MUST include:

```ts
schoolId: ObjectId;
```

Every database query MUST automatically include:

```ts
{
  schoolId: req.user.schoolId;
}
```

No collection may expose data across tenants.

---

# 5. COLLECTIONS

The production database consists of the following collections.

```text
schools

subscriptions

users

teacher_profiles

student_profiles

academic_sessions

academic_terms

classes

subjects

questions

assessments

submissions

results

report_cards

ai_generations

files

notifications

audit_logs
```

---

# 6. HIGH LEVEL RELATIONSHIPS

```text
School (1)
│
├───────────────< Users (N)
│                    │
│                    ├────────── Teacher Profile (1)
│                    │
│                    └────────── Student Profile (1)
│
├───────────────< Academic Sessions (N)
│                        │
│                        └──────── Academic Terms (N)
│
├───────────────< Classes (N)
│
├───────────────< Subjects (N)
│
├───────────────< Questions (N)
│
├───────────────< Assessments (N)
│                       │
│                       └────────── Submissions (N)
│                                        │
│                                        └──────── Results (1)
│
├───────────────< AI Generations (N)
│
├───────────────< Files (N)
│
├───────────────< Notifications (N)
│
└───────────────< Audit Logs (N)
```

---

# 7. COLLECTION SCHEMAS

## 7.1 SCHOOLS

```ts
schools

{
    _id: ObjectId,

    name: String,

    slug: String,

    email: String,

    phone: String,

    address: String,

    city: String,

    state: String,

    country: String,

    timezone: String,

    currency: String,

    logoUrl: String,

    website: String,

    settings: {

        gradingSystem: String,

        defaultLanguage: String,

        allowStudentDownloads: Boolean,

        allowParentPortal: Boolean,

        branding: {

            primaryColor: String,

            secondaryColor: String
        }

    },

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → Users

1 → Classes

1 → Subjects

1 → Questions

1 → Assessments

1 → Results

1 → Files

1 → AI Generations

1 → Notifications

1 → Audit Logs

1 → Subscription
```

---

## Indexes

```ts
{
  slug: 1;
}
UNIQUE;

{
  name: 1;
}

{
  isActive: 1;
}
```

---

# 7.2 SUBSCRIPTIONS

```ts
subscriptions

{
    _id: ObjectId,

    schoolId: ObjectId,

    plan:

        "free"

      | "starter"

      | "professional"

      | "enterprise",

    status:

        "trial"

      | "active"

      | "expired"

      | "cancelled",

    trialEndsAt: Date,

    startDate: Date,

    endDate: Date,

    renewalDate: Date,

    teacherLimit: Number,

    studentLimit: Number,

    assessmentLimit: Number,

    aiRequestLimit: Number,

    storageLimitMB: Number,

    createdAt: Date,

    updatedAt: Date
}
```

---

### Relationships

```text
School

1 → 1 Subscription
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  status: 1;
}

{
  renewalDate: 1;
}
```

---

# 7.3 USERS

```ts
users

{
    _id: ObjectId,

    schoolId: ObjectId,

    firstName: String,

    lastName: String,

    fullName: String,

    email: String,

    passwordHash: String,

    role:

        "school_admin"

      | "teacher"

      | "student",

    avatar: String | null,

    phone: String | null,

    emailVerified: Boolean,

    isActive: Boolean,

    lastLoginAt: Date | null,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → N Users

User

1 → 1 Teacher Profile

or

1 → 1 Student Profile
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, email: 1 } UNIQUE

{ role: 1 }

{ isActive: 1 }
```

---

# 7.4 TEACHER PROFILES

```ts
teacher_profiles

{
    _id: ObjectId,

    schoolId: ObjectId,

    userId: ObjectId,

    employeeId: String,

    designation: String,

    department: String,

    assignedClasses: [

        ObjectId

    ],

    assignedSubjects: [

        ObjectId

    ],

    employmentDate: Date,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
Teacher

1 → Many Classes

1 → Many Subjects
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, employeeId: 1 } UNIQUE

{ userId: 1 } UNIQUE
```

---

# 7.5 STUDENT PROFILES

```ts
student_profiles

{
    _id: ObjectId,

    schoolId: ObjectId,

    userId: ObjectId,

    admissionNumber: String,

    classId: ObjectId,

    subjectIds: [

        ObjectId

    ],

    guardian: {

        name: String,

        phone: String,

        email: String | null

    },

    enrollmentDate: Date,

    graduationYear: Number | null,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
Class

1 → Many Students

Student

1 → Many Results

Student

1 → Many Submissions
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, admissionNumber: 1 } UNIQUE

{ classId: 1 }

{ userId: 1 } UNIQUE
```

## 7.6 ACADEMIC SESSIONS

```ts
academic_sessions

{
    _id: ObjectId,

    schoolId: ObjectId,

    sessionName: String, // e.g. 2026/2027

    startDate: Date,

    endDate: Date,

    isActive: Boolean,

    createdBy: ObjectId,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → Many Academic Sessions

Academic Session

1 → Many Academic Terms
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, sessionName: 1 } UNIQUE

{ schoolId: 1, isActive: 1 }
```

---

## 7.7 ACADEMIC TERMS

```ts
academic_terms

{
    _id: ObjectId,

    schoolId: ObjectId,

    sessionId: ObjectId,

    name:
        "First Term"
      | "Second Term"
      | "Third Term",

    order: Number,

    startDate: Date,

    endDate: Date,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
Academic Session

1 → Many Terms

Term

1 → Many Assessments
```

---

### Indexes

```ts
{ schoolId: 1 }

{ sessionId: 1 }

{ schoolId: 1, sessionId: 1, order: 1 } UNIQUE
```

---

# 7.8 CLASSES

```ts
classes

{
    _id: ObjectId,

    schoolId: ObjectId,

    name: String, // SS1A

    level: String, // SS1

    classTeacherId: ObjectId | null,

    description: String | null,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → Many Classes

Class

1 → Many Students

Teacher

1 → Many Classes
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, name: 1 } UNIQUE

{ classTeacherId: 1 }

{ isActive: 1 }
```

---

# 7.9 SUBJECTS

```ts
subjects

{
    _id: ObjectId,

    schoolId: ObjectId,

    name: String,

    code: String,

    description: String | null,

    applicableClasses: [

        ObjectId

    ],

    isCore: Boolean,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → Many Subjects

Subject

Many ↔ Many Classes

Subject

1 → Many Questions

Subject

1 → Many Assessments
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, code: 1 } UNIQUE

{ schoolId: 1, name: 1 }
```

---

# 7.10 QUESTIONS

```ts
questions

{
    _id: ObjectId,

    schoolId: ObjectId,

    subjectId: ObjectId,

    createdBy: ObjectId,

    type:
        "mcq"
      | "theory",

    curriculum: String,

    topic: String,

    subTopic: String | null,

    difficulty:
        "easy"
      | "medium"
      | "hard",

    marks: Number,

    language: String,

    questionText: String,

    options: [

        {

            key: String,

            text: String,

            isCorrect: Boolean

        }

    ],

    correctAnswer: Mixed,

    explanation: String | null,

    tags: [

        String

    ],

    usageCount: Number,

    isArchived: Boolean,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
Teacher

1 → Many Questions

Subject

1 → Many Questions

Question

Many → Many Assessments
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, subjectId: 1 }

{ schoolId: 1, topic: 1 }

{ schoolId: 1, difficulty: 1 }

{ schoolId: 1, createdBy: 1 }

{ tags: 1 }
```

---

# QUESTION DESIGN RULES

Each question shall:

- Belong to exactly one school.
- Belong to one subject.
- Be created by one teacher.
- Support both MCQ and theory formats.
- Support curriculum classification.
- Support topic-based filtering.
- Support difficulty-based filtering.
- Support AI generation.
- Maintain usage statistics.
- Never be modified inside a published assessment snapshot.

---

# ENTITY CARDINALITY

```text
School
│
├── 1 → N Academic Sessions
│
├── 1 → N Classes
│
├── 1 → N Subjects
│
├── 1 → N Questions
│
└── 1 → N Teachers

Teacher
│
├── 1 → N Questions
│
├── 1 → N Subjects
│
└── 1 → N Classes

Class
│
└── 1 → N Students

Subject
│
├── 1 → N Questions
│
└── 1 → N Assessments
```

## 7.11 ASSESSMENTS

```ts
assessments

{
    _id: ObjectId,

    schoolId: ObjectId,

    sessionId: ObjectId,

    termId: ObjectId,

    classId: ObjectId,

    subjectId: ObjectId,

    createdBy: ObjectId,

    title: String,

    description: String | null,

    type:
        "quiz"
      | "test"
      | "assignment"
      | "exam",

    deliveryMode:
        "cbt"
      | "paper"
      | "hybrid",

    instructions: String,

    durationMinutes: Number,

    totalMarks: Number,

    passMark: Number,

    shuffleQuestions: Boolean,

    shuffleOptions: Boolean,

    allowReview: Boolean,

    startTime: Date,

    endTime: Date,

    status:
        "draft"
      | "published"
      | "closed"
      | "archived",

    questionCount: Number,

    questions: [

        {

            questionId: ObjectId,

            order: Number,

            marks: Number,

            snapshot: {

                type: String,

                questionText: String,

                options: [

                    {

                        key: String,

                        text: String

                    }

                ],

                correctAnswer: Mixed,

                explanation: String,

                difficulty: String,

                topic: String

            }

        }

    ],

    publishedAt: Date | null,

    publishedBy: ObjectId | null,

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
Teacher

1 → Many Assessments

Assessment

Many → One Class

Assessment

Many → One Subject

Assessment

1 → Many Submissions
```

---

### Indexes

```ts
{ schoolId: 1 }

{ schoolId: 1, classId: 1 }

{ schoolId: 1, subjectId: 1 }

{ schoolId: 1, sessionId: 1 }

{ schoolId: 1, termId: 1 }

{ status: 1 }

{ createdBy: 1 }
```

---

# ASSESSMENT DESIGN RULES

- Published assessments become immutable.
- Assessment questions are stored as snapshots.
- Editing the original question must never affect published assessments.
- Teachers may duplicate published assessments.
- Students cannot access draft assessments.
- Every assessment belongs to one academic session and one academic term.

---

# 7.12 SUBMISSIONS

```ts
submissions

{
    _id: ObjectId,

    schoolId: ObjectId,

    assessmentId: ObjectId,

    studentId: ObjectId,

    attemptNumber: Number,

    startedAt: Date,

    submittedAt: Date | null,

    timeSpentSeconds: Number,

    status:
        "in_progress"
      | "submitted"
      | "graded"
      | "expired",

    answers: [

        {

            questionId: ObjectId,

            selectedOption: String | null,

            answerText: String | null,

            obtainedMarks: Number,

            isCorrect: Boolean,

            answeredAt: Date

        }

    ],

    autoScore: Number,

    manualScore: Number,

    finalScore: Number,

    gradedBy: ObjectId | null,

    gradedAt: Date | null,

    createdAt: Date,

    updatedAt: Date
}
```

---

### Relationships

```text
Assessment

1 → Many Submissions

Student

1 → Many Submissions

Submission

1 → 1 Result
```

---

### Indexes

```ts
{ schoolId: 1 }

{ assessmentId: 1 }

{ studentId: 1 }

{ schoolId: 1, assessmentId: 1, studentId: 1 }

{ status: 1 }
```

---

# SUBMISSION DESIGN RULES

- One submission belongs to one assessment.
- One submission belongs to one student.
- Every answer is stored independently.
- Auto-grading is supported.
- Manual grading is supported.
- Autosave is supported.
- Submission history is retained.
- Time tracking is mandatory for CBT.

---

# 7.13 RESULTS

```ts
results

{
    _id: ObjectId,

    schoolId: ObjectId,

    submissionId: ObjectId,

    assessmentId: ObjectId,

    studentId: ObjectId,

    classId: ObjectId,

    subjectId: ObjectId,

    totalMarks: Number,

    obtainedMarks: Number,

    percentage: Number,

    grade: String,

    remark: String,

    feedback: String | null,

    publishedBy: ObjectId,

    publishedAt: Date,

    status:
        "draft"
      | "published",

    createdAt: Date,

    updatedAt: Date
}
```

---

### Relationships

```text
Submission

1 → 1 Result

Student

1 → Many Results

Assessment

1 → Many Results
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  studentId: 1;
}

{
  assessmentId: 1;
}

{
  classId: 1;
}

{
  subjectId: 1;
}

{
  status: 1;
}
```

---

# RESULT DESIGN RULES

- Results are generated from submissions.
- Published results become read-only.
- Teacher feedback is permanently attached to published results.
- Analytics consume published results only.
- Draft results are hidden from students.

---

# 7.14 REPORT CARDS

```ts
report_cards

{
    _id: ObjectId,

    schoolId: ObjectId,

    sessionId: ObjectId,

    termId: ObjectId,

    studentId: ObjectId,

    classId: ObjectId,

    subjects: [

        {

            subjectId: ObjectId,

            score: Number,

            grade: String,

            remark: String

        }

    ],

    totalScore: Number,

    averageScore: Number,

    overallGrade: String,

    classPosition: Number | null,

    attendancePercentage: Number | null,

    teacherComment: String,

    principalComment: String,

    pdfFileId: ObjectId | null,

    publishedBy: ObjectId,

    publishedAt: Date,

    createdAt: Date,

    updatedAt: Date
}
```

---

### Relationships

```text
Student

1 → Many Report Cards

Academic Term

1 → Many Report Cards

Class

1 → Many Report Cards
```

---

### Indexes

```ts
{ schoolId: 1 }

{ studentId: 1 }

{ classId: 1 }

{ sessionId: 1 }

{ termId: 1 }

{ schoolId: 1, studentId: 1, sessionId: 1, termId: 1 } UNIQUE
```

---

# REPORT CARD DESIGN RULES

- One report card represents one student for one academic term.
- Report cards are generated from published results.
- Report cards are immutable after publication unless explicitly regenerated.
- Generated PDFs reference the Files collection.

---

# ASSESSMENT LIFECYCLE

```text
Teacher Creates Assessment
            │
            ▼
        Draft
            │
            ▼
      Publish Assessment
            │
            ▼
      Student Submission
            │
            ▼
      Auto / Manual Grading
            │
            ▼
      Teacher Feedback
            │
            ▼
      Publish Results
            │
            ▼
      Generate Report Card
            │
            ▼
      Academic Analytics
```

## 7.15 AI GENERATIONS

```ts
ai_generations

{
    _id: ObjectId,

    schoolId: ObjectId,

    userId: ObjectId,

    provider:
        "openai"
      | "gemini"
      | "anthropic",

    model: String,

    feature:
        "question_generation"
      | "lesson_plan"
      | "marking_scheme"
      | "assessment_builder"
      | "study_recommendation"
      | "feedback_generation"
      | "performance_analysis",

    prompt: String,

    response: String,

    metadata: {

        subjectId: ObjectId | null,

        classId: ObjectId | null,

        assessmentId: ObjectId | null,

        tokens: Number,

        estimatedCost: Number

    },

    status:
        "completed"
      | "failed"
      | "cancelled",

    createdAt: Date
}
```

---

### Relationships

```text
User

1 → Many AI Generations

School

1 → Many AI Generations
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  userId: 1;
}

{
  feature: 1;
}

{
  createdAt: -1;
}
```

---

# AI DESIGN RULES

- AI never modifies production records directly.
- Every generation is auditable.
- AI requests are billable.
- Failed requests remain logged.
- Student recommendations are generated from published results only.

---

# 7.16 FILES

```ts
files

{
    _id: ObjectId,

    schoolId: ObjectId,

    uploadedBy: ObjectId,

    filename: String,

    originalFilename: String,

    mimeType: String,

    extension: String,

    size: Number,

    storageProvider:
        "cloudinary"
      | "aws_s3",

    path: String,

    url: String,

    category:
        "logo"
      | "assessment_pdf"
      | "report_card"
      | "attachment"
      | "image",

    createdAt: Date,

    updatedAt: Date,

    deletedAt: Date | null
}
```

---

### Relationships

```text
School

1 → Many Files

User

1 → Many Files
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  uploadedBy: 1;
}

{
  category: 1;
}
```

---

# FILE DESIGN RULES

- Files are immutable.
- Physical deletion is asynchronous.
- PDFs reference this collection.
- Images and logos share the same storage abstraction.

---

# 7.17 NOTIFICATIONS

```ts
notifications

{
    _id: ObjectId,

    schoolId: ObjectId,

    userId: ObjectId,

    title: String,

    message: String,

    type:
        "assessment"
      | "submission"
      | "result"
      | "system"
      | "subscription"
      | "announcement",

    priority:
        "low"
      | "normal"
      | "high"
      | "urgent",

    link: String | null,

    isRead: Boolean,

    readAt: Date | null,

    createdAt: Date
}
```

---

### Relationships

```text
User

1 → Many Notifications
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  userId: 1;
}

{
  isRead: 1;
}

{
  createdAt: -1;
}
```

---

# 7.18 AUDIT LOGS

```ts
audit_logs

{
    _id: ObjectId,

    schoolId: ObjectId,

    userId: ObjectId,

    action: String,

    entity: String,

    entityId: ObjectId,

    ipAddress: String,

    userAgent: String,

    metadata: Object,

    createdAt: Date
}
```

---

### Relationships

```text
School

1 → Many Audit Logs

User

1 → Many Audit Logs
```

---

### Indexes

```ts
{
  schoolId: 1;
}

{
  userId: 1;
}

{
  entity: 1;
}

{
  entityId: 1;
}

{
  createdAt: -1;
}
```

---

# 8. RELATIONSHIP RULES

```text
School
│
├── 1 → 1 Subscription
│
├── 1 → N Users
│
├── 1 → N Academic Sessions
│
├── 1 → N Classes
│
├── 1 → N Subjects
│
├── 1 → N Questions
│
├── 1 → N Assessments
│
├── 1 → N Submissions
│
├── 1 → N Results
│
├── 1 → N Report Cards
│
├── 1 → N Files
│
├── 1 → N Notifications
│
├── 1 → N AI Generations
│
└── 1 → N Audit Logs
```

---

# ENTITY CARDINALITY

```text
Teacher
│
├── 1 → N Questions
├── 1 → N Assessments
└── 1 → N AI Requests

Student
│
├── 1 → N Submissions
├── 1 → N Results
└── 1 → N Report Cards

Assessment
│
├── 1 → N Submissions
└── 1 → N Results

Submission
│
└── 1 → 1 Result

Question
│
└── N → N Assessments (via snapshots)

Subject
│
├── 1 → N Questions
├── 1 → N Assessments
└── 1 → N Results

Class
│
├── 1 → N Students
├── 1 → N Assessments
└── 1 → N Report Cards
```

---

# DATA FLOW

```text
Teacher
    │
    ▼
Question Bank
    │
    ▼
Assessment
    │
    ▼
Publish
    │
    ▼
Student Submission
    │
    ▼
Auto Grading
    │
Manual Review
    ▼
Result
    ▼
Teacher Feedback
    ▼
Report Card
    ▼
Analytics
    ▼
AI Study Recommendations
```

# 9. INDEXING STRATEGY

## 9.1 GLOBAL INDEX RULES

Every tenant-owned collection MUST include the following index:

```ts
{
  schoolId: 1;
}
```

Frequently queried collections should additionally use compound indexes combining `schoolId` with their primary lookup fields.

---

## 9.2 USERS

```ts
{ schoolId: 1, email: 1 } UNIQUE

{ schoolId: 1, role: 1 }

{ schoolId: 1, isActive: 1 }

{ lastLoginAt: -1 }
```

---

## 9.3 STUDENT PROFILES

```ts
{ schoolId: 1, admissionNumber: 1 } UNIQUE

{ classId: 1 }

{ userId: 1 } UNIQUE
```

---

## 9.4 TEACHER PROFILES

```ts
{ schoolId: 1, employeeId: 1 } UNIQUE

{ userId: 1 } UNIQUE
```

---

## 9.5 QUESTIONS

```ts
{ schoolId: 1, subjectId: 1 }

{ schoolId: 1, topic: 1 }

{ schoolId: 1, difficulty: 1 }

{ schoolId: 1, createdBy: 1 }

{ tags: 1 }
```

---

## 9.6 ASSESSMENTS

```ts
{ schoolId: 1, classId: 1 }

{ schoolId: 1, subjectId: 1 }

{ schoolId: 1, termId: 1 }

{ schoolId: 1, sessionId: 1 }

{ status: 1 }

{ createdBy: 1 }
```

---

## 9.7 SUBMISSIONS

```ts
{ schoolId: 1, assessmentId: 1 }

{ schoolId: 1, studentId: 1 }

{ schoolId: 1, assessmentId: 1, studentId: 1 }

{ status: 1 }
```

---

## 9.8 RESULTS

```ts
{ schoolId: 1, studentId: 1 }

{ schoolId: 1, assessmentId: 1 }

{ schoolId: 1, classId: 1 }

{ schoolId: 1, subjectId: 1 }

{ status: 1 }
```

---

## 9.9 REPORT CARDS

```ts
{ schoolId: 1, studentId: 1 }

{ schoolId: 1, sessionId: 1 }

{ schoolId: 1, termId: 1 }

{ schoolId: 1, classId: 1 }
```

---

# 10. REFERENCE STRATEGY

EduFlow uses MongoDB ObjectId references.

```ts
schoolId;

userId;

teacherId;

studentId;

sessionId;

termId;

classId;

subjectId;

questionId;

assessmentId;

submissionId;

resultId;

reportCardId;

fileId;

notificationId;
```

Document embedding is reserved only for immutable data snapshots such as assessment questions.

---

# 11. VALIDATION RULES

## Required Fields

Every collection MUST contain:

```ts
_id;

createdAt;

updatedAt;
```

Tenant-owned collections MUST additionally include:

```ts
schoolId;
```

Soft-deletable collections MUST include:

```ts
deletedAt;
```

---

## User Validation

- Email must be unique within a school.
- Passwords must be stored only as hashes.
- Roles must be validated.
- Deactivated users cannot authenticate.

---

## Assessment Validation

- Draft assessments may be edited.
- Published assessments are immutable.
- Closed assessments reject new submissions.
- Archived assessments are read-only.

---

## Submission Validation

- One submission belongs to one assessment.
- One submission belongs to one student.
- Time limits must be enforced.
- Duplicate attempts follow assessment configuration.

---

## Result Validation

- Results cannot exist without submissions.
- Only published results appear on student dashboards.
- Report cards use published results only.

---

# 12. MULTI-TENANCY RULES

Tenant isolation is mandatory.

Every repository query MUST include:

```ts
{
  schoolId: req.user.schoolId;
}
```

Controllers must never query MongoDB directly.

Repositories are solely responsible for tenant filtering.

Cross-school access is prohibited.

---

# 13. SOFT DELETE STRATEGY

Entities should never be permanently deleted during normal application usage.

Instead:

```ts
deletedAt: Date | null;
```

Queries should automatically exclude deleted records unless explicitly requested.

Soft deletes apply to:

- users
- teacher_profiles
- student_profiles
- classes
- subjects
- questions
- assessments
- report_cards
- files

Audit logs are never deleted.

---

# 14. SECURITY RULES

- JWT Authentication
- Role-Based Access Control (RBAC)
- Repository-level tenant enforcement
- Password hashing with bcrypt/Argon2
- HTTPS only
- Rate limiting
- Input validation (Zod)
- Helmet
- CORS
- Audit logging of sensitive operations

---

# 15. AUDITABLE EVENTS

The following events MUST create audit log entries:

- User login
- User logout
- Password reset
- User creation
- User deletion
- Question creation
- Question update
- Assessment publication
- Assessment closure
- Submission grading
- Result publication
- Report card generation
- AI request
- Subscription change

---

# 16. PERFORMANCE RULES

Target API response:

```text
< 500 ms
```

Target CBT answer autosave:

```text
< 2 seconds
```

Target report card generation:

```text
< 10 seconds
```

Target PDF generation:

```text
< 15 seconds
```

---

# 17. DATA RETENTION POLICY

| Collection    | Retention               |
| ------------- | ----------------------- |
| Audit Logs    | Permanent               |
| Results       | Permanent               |
| Report Cards  | Permanent               |
| Assessments   | Permanent               |
| AI Logs       | Configurable            |
| Notifications | Configurable            |
| Files         | Until deleted by policy |

---

# 18. FUTURE COLLECTIONS

The architecture supports future expansion without schema redesign.

Potential collections include:

```text
parent_profiles

parent_student_links

attendance

curriculums

lesson_plans

lesson_resources

assignments

discussion_threads

project_topics

project_supervisors

student_portfolios

certificates

badges

achievements

payments

payment_transactions

api_keys

webhooks

integrations
```

---

# 19. FINAL SYSTEM RELATIONSHIP

```text
School
│
├── Subscription
│
├── Users
│      ├── Teacher Profiles
│      └── Student Profiles
│
├── Academic Sessions
│      └── Academic Terms
│
├── Classes
│
├── Subjects
│
├── Questions
│
├── Assessments
│      ├── Question Snapshots
│      └── Student Submissions
│              └── Results
│                      └── Report Cards
│
├── Files
│
├── Notifications
│
├── AI Generations
│
└── Audit Logs
```

---

# 20. DESIGN PRINCIPLES

1. Assessment-first architecture.
2. Multi-tenancy by default.
3. AI assists educators without replacing professional judgment.
4. Published assessments are immutable.
5. Every student action is traceable.
6. Every grading action is auditable.
7. Repository pattern is mandatory.
8. Controllers never access the database directly.
9. Student data privacy is enforced by tenant isolation.
10. Simplicity, scalability, and maintainability take precedence over premature optimization.

---

# 21. FINAL ARCHITECTURE STATEMENT

EduFlow is a production-ready, multi-tenant Assessment & Academic Productivity Platform engineered around the complete academic assessment lifecycle. Its architecture supports secure school isolation, AI-assisted teaching, computer-based testing, analytics, report generation, and future expansion while maintaining a clean, scalable domain model suitable for commercial SaaS deployment.
