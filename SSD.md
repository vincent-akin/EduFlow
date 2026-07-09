# 📘 EduFlow - System Structure Design (SSD)

**Version:** 2.0
**Status:** Build Ready
**Architecture:** Modular Monolith
**Frontend:** Next.js (TypeScript)
**Backend:** Node.js, Express.js (TypeScript)
**Database:** MongoDB Atlas
**Document Owner:** Engineering Team
**Last Updated:** July 2026

---

# 1. SYSTEM OVERVIEW

EduFlow is a multi-tenant SaaS platform for academic assessment, Computer-Based Testing (CBT), academic analytics, student performance tracking, and AI-assisted teacher productivity.

The platform serves three primary user groups:

- School Administrators
- Teachers
- Students

EduFlow is intentionally assessment-first and is designed as the foundational product of a future Academic Operating System.

Core workflow:

```text
Question Bank
        ↓
Assessment Creation
        ↓
Assessment Delivery (CBT / PDF)
        ↓
Student Submission
        ↓
Result Processing
        ↓
Teacher Feedback
        ↓
Academic Analytics
        ↓
AI Insights
```

---

# 2. HIGH-LEVEL ARCHITECTURE

```text
                   Next.js Frontend
                           │
                           ▼
                  Express.js API Layer
                           │
                           ▼
              Modular Monolith Application
                           │
      ┌──────────────┬──────────────┐
      │              │              │
 MongoDB Atlas   AI Providers   Cloud Storage
```

---

# 3. ARCHITECTURE STYLE

## Primary Pattern

- Modular Monolith
- Feature-Based Modules
- Layered Architecture
- Domain-Oriented Design
- API-First Development

---

## Internal Request Flow

```text
HTTP Request
      ↓
Authentication Middleware
      ↓
Authorization (RBAC)
      ↓
Tenant Middleware
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
MongoDB
```

Controllers must never access the database directly.

Business rules belong inside Services.

Repositories are responsible only for data persistence.

---

# 4. REQUEST LIFECYCLE

```text
Client Request
      ↓
Validation
      ↓
JWT Authentication
      ↓
RBAC Authorization
      ↓
Tenant Injection (schoolId)
      ↓
Controller
      ↓
Service Layer
      ↓
Repository Layer
      ↓
MongoDB
      ↓
Response Formatter
      ↓
Client Response
```

---

# 5. MULTI-TENANCY DESIGN

## Core Principle

Every tenant-owned resource belongs to exactly one school.

Every tenant collection must contain:

```ts
schoolId;
```

---

## Tenant Collections

- users
- teacher_profiles
- student_profiles
- academic_sessions
- classes
- subjects
- questions
- assessments
- submissions
- results
- files
- notifications
- audit_logs
- ai_generations

---

## Tenant Enforcement

Repositories must automatically scope queries.

Example:

```ts
find({ schoolId });
```

Tenant filtering must never depend on client input.

Cross-school access is strictly prohibited.

---

# 6. BACKEND STRUCTURE

backend/
├── src/
│ ├── config/
│ │ └── database.ts
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── controller/
│ │ │ ├── service/
│ │ │ ├── repository/
│ │ │ ├── model/
│ │ │ ├── routes/
│ │ │ ├── validators/
│ │ │ ├── dto/
│ │ │ ├── interfaces/
│ │ │ └── index.ts
│ │ ├── schools/
│ │ ├── users/
│ │ ├── teachers/
│ │ ├── students/
│ │ ├── classes/
│ │ ├── subjects/
│ │ ├── questions/
│ │ ├── assessments/
│ │ ├── submissions/
│ │ ├── results/
│ │ ├── report-cards/
│ │ ├── analytics/
│ │ ├── ai/
│ │ ├── billing/
│ │ ├── notifications/
│ │ └── audit/
│ ├── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── rbac.middleware.ts
│ │ └── tenant.middleware.ts
│ ├── shared/
│ │ └── constants.ts
│ ├── utils/
│ │ └── helpers.ts
│ ├── types/
│ │ └── index.ts
│ ├── jobs/
│ │ └── index.ts
│ ├── app.ts
│ └── server.ts
├── dist/ # Compiled JavaScript
├── tests/
│ ├── unit/
│ └── integration/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── docker-compose.yml # For local development
└── README.md

````

---

## Standard Module Structure

```text
module/
│
├── controller/
├── service/
├── repository/
├── model/
├── routes/
├── validators/
├── dto/
├── interfaces/
└── index.ts
````

Each module is independently maintainable.

---

# 7. FRONTEND ARCHITECTURE

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

---

## Frontend Structure

```text
frontend/
│
├── src/
│
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
└── middleware.ts
```

---

## Feature Modules

```text
features/

auth/
dashboard/
schools/
teachers/
students/
classes/
subjects/
questions/
assessments/
cbt/
results/
analytics/
ai/
billing/
notifications/
```

---

# 8. AUTHENTICATION & AUTHORIZATION

## Authentication

- JWT Access Token
- Optional Refresh Token

---

## Roles

```text
school_admin
teacher
student
```

---

## Middleware Order

```text
JWT
   ↓
RBAC
   ↓
Tenant Injection
   ↓
Route Handler
```

---

# 9. SYSTEM MODULES

## Authentication Module

Responsibilities

- Login
- Registration
- Password Reset
- Session Management

---

## School Module

Responsibilities

- School Profile
- Branding
- Settings

---

## User Module

Responsibilities

- User Management
- Role Management

---

## Academic Session Module

Responsibilities

- Academic Sessions
- Terms
- Active Session

---

## Student Module

Responsibilities

- Student Profiles
- Class Assignment
- Academic Records

---

## Teacher Module

Responsibilities

- Teacher Profiles
- Subject Assignment
- Class Assignment

---

## Class Module

Responsibilities

- Class Management
- Student Assignment

---

## Subject Module

Responsibilities

- Subject Management

---

## Question Bank Module

Responsibilities

- MCQ
- Theory Questions
- Topic Classification
- Difficulty Classification
- Search
- Filtering

---

## Assessment Module

Responsibilities

- Assessment Creation
- Assessment Publishing
- CBT Configuration
- Printable Assessments
- PDF Generation

---

## Submission Module

Responsibilities

- CBT Submission
- Answer Storage
- Submission Tracking

---

## Result Module

Responsibilities

- Result Computation
- Grade Calculation
- Result Publishing
- Report Cards

---

## Student Portal Module

Responsibilities

- Assessment Centre
- CBT Interface
- Results
- Teacher Feedback
- Academic Progress
- Performance Trends
- Subject Comparison
- Assessment History
- Report Cards
- AI Recommendations

---

## Analytics Module

Responsibilities

- Student Analytics
- Class Analytics
- Subject Analytics
- Assessment Analytics
- School Analytics

---

## AI Module

Flow

```text
Teacher
     ↓
AI Service
     ↓
LLM Provider
     ↓
Response Validation
     ↓
Storage
     ↓
User
```

Rules

- AI never publishes directly.
- Teachers review every generated output.
- Every interaction is logged.
- Student data is minimized.
- Model usage is auditable.
- AI recommendations never replace grading decisions.

---

## Billing Module

Responsibilities

- Subscription Plans
- Usage Tracking
- Feature Enforcement

---

## Notification Module

Responsibilities

- Assessment Alerts
- Result Alerts
- Invitations
- Subscription Notifications

---

## Audit Module

Tracks

- Authentication
- CRUD Operations
- AI Usage
- Result Publication
- Administrative Actions

---

## File Module

Responsibilities

- School Logos
- PDFs
- Report Cards
- Attachments

Storage Strategy

- Cloudinary (MVP)
- AWS S3 (Future)
- Google Cloud Storage (Future)
- Azure Blob Storage (Future)

---

# 10. DOMAIN MODEL

```text
School
│
├── Academic Sessions
│
├── Classes
│
├── Subjects
│
├── Teachers
│
├── Students
│
├── Question Bank
│
├── Assessments
│
├── Submissions
│
├── Results
│
└── Analytics
```

Every feature must strengthen this domain model.

---

# 11. DATA FLOW ARCHITECTURE

## Assessment Flow

```text
Teacher
      ↓
Question Bank
      ↓
Assessment
      ↓
Student
      ↓
Submission
      ↓
Result Processing
      ↓
Teacher Feedback
      ↓
Student Dashboard
      ↓
Analytics
      ↓
AI Insights
```

---

## AI Flow

```text
Teacher Request
      ↓
AI Module
      ↓
LLM Provider
      ↓
Validation
      ↓
ai_generations
      ↓
Teacher Review
```

---

## Student Flow

```text
Assessment Published
        ↓
Student Notification
        ↓
Student Takes CBT
        ↓
Submission Stored
        ↓
Teacher Reviews
        ↓
Result Published
        ↓
Dashboard Updated
        ↓
Performance Analytics
        ↓
AI Recommendations
```

---

## File Flow

```text
Frontend
      ↓
Backend API
      ↓
Storage Provider
      ↓
Database stores metadata
```

---

## PDF Flow

```text
Business Data
      ↓
HTML Template
      ↓
Puppeteer
      ↓
PDF
      ↓
Storage
```

---

# 12. DOMAIN EVENTS

Core Events

```text
SchoolCreated
TeacherInvited
StudentCreated
AcademicSessionCreated
QuestionCreated
AssessmentCreated
AssessmentPublished
AssessmentStarted
AssessmentSubmitted
ResultPublished
FeedbackPublished
AIRequestCompleted
SubscriptionCreated
SubscriptionRenewed
SubscriptionExpired
```

These events enable future event-driven architecture.

---

# 13. DATABASE DESIGN RULES

Every collection includes:

```ts
createdAt;
updatedAt;
```

Tenant collections include:

```ts
schoolId;
```

Soft-deletable collections include:

```ts
deletedAt;
```

Reference Strategy

```ts
schoolId;
userId;
teacherId;
studentId;
subjectId;
classId;
assessmentId;
submissionId;
resultId;
```

ObjectId references are used throughout the system.

---

# 14. API DESIGN PRINCIPLES

Base URL

```text
/api/v1
```

Principles

- REST-first
- Versioned APIs
- Predictable Resource Names
- Pagination
- Filtering
- Sorting
- Consistent Error Responses
- JWT Authentication
- RBAC
- Tenant Isolation

---

## Standard Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 15. SECURITY ARCHITECTURE

Authentication

- JWT

Authorization

- RBAC

Security Layers

- Helmet
- CORS
- Rate Limiting
- Input Validation
- bcrypt Password Hashing
- Tenant Isolation

Sensitive data must never be exposed through APIs.

---

# 16. LOGGING & MONITORING

Logging

- Pino

Captured Logs

- Requests
- Errors
- Authentication
- AI Usage
- Billing Events
- Performance Metrics

Monitoring

- Sentry

---

# 17. EXTERNAL INTEGRATIONS

AI Providers

- OpenAI
- Gemini (Fallback)

Storage

- Cloudinary (MVP)
- AWS S3 (Future)

Future Integrations

- Email Providers
- SMS Providers
- Payment Gateways
- Google Workspace
- Microsoft 365

---

# 18. SCALABILITY STRATEGY

## MVP

- Modular Monolith
- Single Backend
- MongoDB
- No Queues
- No Redis

---

## Phase 2

- Redis
- Background Jobs
- AI Optimization Layer
- Improved Caching

---

## Future Evolution

The system is intentionally designed as a Modular Monolith.

Individual modules may be extracted into independent services only when justified by operational requirements.

Premature migration to microservices is discouraged.

---

# 19. PERFORMANCE TARGETS

Availability

```text
99.5%
```

API Response

```text
<500ms
```

Standard Requests

AI Operations

- Background processing where appropriate

PDF Generation

- Asynchronous where appropriate

---

# 20. DESIGN PRINCIPLES

- Assessment-First
- Teacher-First
- Student-Centered Outcomes
- API-First
- Modular by Design
- Multi-Tenant by Default
- Security by Design
- Cloud-Native
- AI-Assisted
- Event-Ready
- Developer-Friendly

Every architectural decision must strengthen the assessment lifecycle while preserving system simplicity.

---

# 21. FUTURE ARCHITECTURE VISION

```text
                    Academic OS
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     EduFlow          Learning         Research
        │                 │                 │
        └──────────── Shared Platform ────────────┘
          Authentication • AI • Billing
          Analytics • Notifications
          Storage • Search • Identity
```

EduFlow remains independently valuable while providing the architectural foundation for future products.

---

# 22. FINAL SYSTEM STATEMENT

EduFlow is a secure, scalable, modular, multi-tenant SaaS platform that streamlines assessment creation, Computer-Based Testing, result management, academic analytics, and AI-assisted teacher productivity.

Built using a Modular Monolith architecture, EduFlow is engineered for long-term scalability, maintainability, and extensibility while serving as the foundational platform for a future Academic Operating System.
