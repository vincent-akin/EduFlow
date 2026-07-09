# EduFlow - Product Requirements Document (PRD)

**Version:** 2.0
**Status:** Approved
**Product Name:** EduFlow
**Product Category:** AI-Powered Assessment & Academic Productivity Platform
**Document Owner:** Product Team
**Last Updated:** July 2026

---

# 1. Executive Summary

## Overview

EduFlow is an AI-powered Assessment & Academic Productivity Platform built for secondary schools, tutorial centres, colleges, and educators.

The platform simplifies the entire assessment lifecycle—from question creation to academic insights—while reducing administrative workload through intelligent automation.

EduFlow enables schools to:

- Build and manage question banks
- Create assessments
- Conduct Computer-Based Tests (CBT)
- Record and publish results
- Generate academic analytics
- Produce professional reports
- Improve teacher productivity using AI

EduFlow is intentionally designed as an assessment-first platform and not a complete school management solution.

Its core workflow is:

```text
Questions
      ↓
Assessments
      ↓
Results
      ↓
Analytics
      ↓
AI Insights
```

---

# 2. Product Vision

To become Africa's leading Assessment & Academic Productivity Platform and the foundational product powering a future Academic Operating System.

---

# 3. Product Positioning

## What EduFlow Is

- Assessment Platform
- Academic Productivity Platform
- AI Teaching Assistant
- CBT Platform
- Academic Analytics Platform

## What EduFlow Is Not

- School ERP
- Accounting Software
- Attendance System
- Hostel Management System
- Learning Management System
- Student Information System

---

## Product Boundaries

EduFlow is intentionally focused on assessment and academic productivity.

Every feature introduced into the platform must directly improve at least one of the following:

- Question creation
- Assessment delivery
- Result management
- Academic analytics
- Teacher productivity
- Student academic performance visibility

Features primarily related to finance, payroll, inventory, admissions, attendance, transport, hostel management, or general school administration fall outside EduFlow's scope and should exist as separate products or future integrations.

Maintaining product focus is a core business principle.

---

# 4. Problem Statement

Teachers and schools spend significant time:

- Creating examinations
- Writing questions
- Developing lesson plans
- Computing results
- Producing reports
- Analysing student performance
- Preparing printable assessment materials

Most institutions rely on disconnected tools such as:

- Microsoft Word
- Microsoft Excel
- WhatsApp
- Printed documents

This leads to:

- Administrative inefficiency
- Duplicate work
- Human error
- Poor academic visibility
- Inconsistent assessment quality

---

# 5. Objectives

## Business Objectives

- Onboard 20 schools within Year 1
- Acquire 500+ teachers
- Support 5,000+ students
- Generate recurring SaaS revenue
- Achieve high customer retention

## Product Objectives

- Reduce assessment preparation time
- Improve assessment quality
- Improve teacher productivity
- Deliver actionable academic insights
- Simplify result management
- Enable data-driven academic decisions

---

# 6. Target Users

## School Administrators

Responsibilities

- Manage school account
- Manage users
- Configure academic sessions
- Monitor school performance
- View institution-wide analytics

---

## Teachers

Responsibilities

- Create questions
- Manage question banks
- Build assessments
- Conduct CBT
- Grade assessments
- Publish results
- Generate lesson plans
- Review analytics

---

## Students

Responsibilities

- View assigned assessments
- Take CBT assessments
- View published results
- Review teacher feedback
- Monitor academic progress
- Compare performance across subjects
- View academic history
- Download report cards (where permitted)
- Receive AI study recommendations (Phase 2)

---

# 7. User Roles

## school_admin

Permissions

- Manage school
- Manage users
- Manage academic sessions
- Manage classes
- Manage subjects
- View school analytics
- Manage subscriptions
- Configure platform settings

---

## teacher

Permissions

- Create questions
- Manage question bank
- Create assessments
- Publish assessments
- Grade assessments
- Publish results
- Generate lesson plans
- View assigned analytics
- Access AI tools

---

## student

Permissions

- View assigned assessments
- Take CBT assessments
- View published results
- Review teacher feedback
- View assessment history
- Track academic progress
- Compare subject performance
- Download report cards (if enabled)
- Receive AI study recommendations (Phase 2)

---

# 8. Core Product Modules

## Authentication Module

Features

- Registration
- Login
- Password Reset
- JWT Authentication
- Role-Based Access Control
- Session Management

---

## School Module

Features

- School Profile
- Branding
- School Settings
- Academic Configuration

---

## User Module

Features

- User Management
- Teacher Accounts
- Student Accounts
- Invitations
- User Status Management

---

## Academic Session Module

Features

- Academic Sessions
- Terms
- Active Session Management

---

## Class Module

Features

- Class Creation
- Student Assignment
- Teacher Assignment

---

## Subject Module

Features

- Subject Management
- Subject Assignment

---

## Question Bank Module

Features

- Multiple Choice Questions
- Theory Questions
- Difficulty Levels
- Topic Classification
- Curriculum Tags
- Search
- Filtering

---

## Assessment Module

Features

- Assessment Creation
- Assessment Publishing
- CBT
- Question Selection
- PDF Generation
- Printable Assessments

---

## Result Module

Features

- Result Recording
- Grade Computation
- Result Publishing
- Report Card Generation

---

## Student Portal Module

Features

- Assessment Centre
- CBT Interface
- Results Centre
- Teacher Feedback Viewer
- Academic Progress Dashboard
- Assessment History
- Subject Performance Comparison
- Report Card Downloads
- AI Study Recommendations (Phase 2)

---

## Analytics Module

Features

### Class Analytics

- Average Score
- Class Ranking
- Top Students
- Lowest Performing Students

### Subject Analytics

- Pass Rate
- Fail Rate
- Grade Distribution

### Assessment Analytics

- Question Performance
- Difficulty Analysis
- Completion Statistics

---

## AI Module

### MVP

- Question Generation
- Lesson Plan Generation

### Phase 2

- Marking Scheme Generation
- AI Result Insights
- AI Study Recommendations
- Assessment Builder Assistant

### Phase 3

- Curriculum Alignment
- Learning Gap Detection
- Personalized Academic Recommendations

---

## Billing Module

Features

- Subscription Plans
- Usage Tracking
- Plan Enforcement
- Future Payment Integration

---

## Notification Module

Features

- Assessment Alerts
- Result Alerts
- Teacher Invitations
- Subscription Notifications

---

## Audit Module

Features

- User Activity
- Assessment Activity
- Result Activity
- AI Activity

---

## File Management Module

Features

- School Logos
- PDFs
- Report Cards
- Future Attachments

---

## Core Domain Model

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
├── Question Banks
│
├── Assessments
│
├── Results
│
└── Analytics
```

Every feature must strengthen this domain model.

---

# 9. Multi-Tenancy Requirements

EduFlow is a multi-tenant SaaS platform.

Every tenant-owned collection must include:

```text
schoolId
```

Examples include:

- Users
- Teachers
- Students
- Classes
- Subjects
- Questions
- Assessments
- Results
- Files
- Notifications

Tenant isolation must be enforced at every repository and API layer.

Cross-school access is prohibited.

---

# 10. Academic Session Requirements

Every assessment and result belongs to an Academic Session and Term.

Historical records must remain immutable after publication.

---

# 11. AI Requirements

## AI Usage Tracking

Collection

```text
ai_generations
```

Stored Fields

- schoolId
- userId
- provider
- model
- prompt
- response
- tokenUsage
- estimatedCost
- createdAt

Purpose

- Cost Monitoring
- Billing
- Auditing
- Analytics

---

## AI Principles

- AI assists teachers rather than replacing them.
- Teachers maintain complete editorial control.
- AI-generated content is editable before publication.
- Every AI interaction is logged.
- Schools may disable AI features.
- Student privacy is protected during AI processing.

---

# 12. Subscription Plans

## Free

- Limited Users
- Limited AI Requests
- Limited Assessments

## Starter

Small schools.

## Professional

Growing schools.

## Enterprise

Large institutions.

---

# 13. Feature Limiting

Plans may limit:

- Teachers
- Students
- Classes
- Assessments
- AI Requests
- Storage

---

# 14. PDF Requirements

Technology

```text
Puppeteer
```

Supported Documents

- Assessment Papers
- Marking Schemes
- Result Sheets
- Report Cards

Future

- Student Transcripts

All generated documents must support school branding.

---

# 15. Dashboard Requirements

## School Administrator

Widgets

- Students
- Teachers
- Classes
- Assessments
- AI Usage
- Subscription Status
- Recent Activity

---

## Teacher

Widgets

- Assigned Classes
- Subjects
- Assessments
- Recent Results
- AI Tools
- Upcoming Assessments

---

## Student

Widgets

- Upcoming Assessments
- Published Results
- Academic Average
- Performance Trend
- Subject Comparison
- Teacher Feedback
- Assessment History
- AI Study Recommendations (Phase 2)
- Report Card Downloads

---

# 16. Non-Functional Requirements

## Availability

Target

```text
99.5%
```

---

## Performance

Target API Response

```text
<500ms
```

for standard requests.

---

## Security

- JWT Authentication
- RBAC
- Rate Limiting
- Helmet
- Input Validation
- Password Hashing
- Tenant Isolation

---

## Logging

Technology

```text
Pino
```

---

## Monitoring

Technology

```text
Sentry
```

---

## API Principles

- REST-first
- Versioned APIs
- Predictable Resources
- Pagination
- Consistent Error Responses
- JWT Authentication
- RBAC
- Tenant Isolation

---

## Scalability Principles

EduFlow shall support:

- Horizontal Scaling
- Stateless APIs
- Background Jobs
- Cloud Object Storage
- Redis (Future)
- Dedicated AI Services (Future)
- Event-Driven Integrations (Future)

---

# 17. Success Metrics

Year 1 Targets

- 20 Schools
- 500 Teachers
- 5,000 Students
- 10,000 Assessments
- 1,000 AI Generations per Month
- 90% Customer Retention

---

# 18. Product Principles

1. Assessment-first architecture.
2. Teacher-first experience.
3. Student-centered outcomes.
4. Multi-tenancy by default.
5. AI assists rather than replaces educators.
6. Simplicity over unnecessary complexity.
7. Commercial SaaS readiness from day one.
8. Security and privacy by design.

---

## Product Decision Framework

Every new feature should:

- Reduce teacher workload.
- Improve assessment quality.
- Improve student outcomes.
- Improve academic insights.
- Improve operational efficiency.

Features that do not satisfy these principles should not be added to EduFlow.

---

# 19. Product Roadmap

## Phase 2

- AI Marking Scheme Generator
- AI Result Insights
- AI Study Recommendations
- Advanced Analytics
- Redis Caching

## Phase 3

- Parent Portal
- Curriculum Alignment Engine
- Recommendation Engine
- Dedicated AI Services

---

## Platform Vision

EduFlow is the foundational product within a broader Academic Operating System.

Future platform products may include:

- Student Learning Platform
- Research & Project Hub
- Academic Community
- Career Services
- AI Learning Companion

Shared services such as authentication, AI, billing, analytics, notifications, storage, and identity will power the wider ecosystem while allowing EduFlow to remain independently valuable.

---

# 20. Final Product Statement

EduFlow is an AI-powered Assessment & Academic Productivity Platform that empowers schools, teachers, and students through intelligent assessment management, academic analytics, and AI-assisted productivity.

Built as a secure, scalable, multi-tenant SaaS platform, EduFlow streamlines the complete assessment lifecycle—from question creation to actionable academic insights—while improving educational outcomes through intelligent automation.

EduFlow is intentionally focused on assessment excellence and is architected as the foundational product of a future Academic Operating System.
