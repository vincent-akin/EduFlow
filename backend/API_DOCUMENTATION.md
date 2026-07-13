# EduFlow Backend - Complete API Documentation

Here's the complete API documentation for the frontend engineer.

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All endpoints except `/auth/*` require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "school_admin", // or "teacher" or "student"
  "schoolId": "65f8a1b2c3d4e5f6a7b8c9d0"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "school_admin",
    "schoolId": "..."
  }
}
```

---

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "school_admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Refresh Token

```http
POST /auth/refresh-token
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User Profile

```http
GET /auth/me
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "school_admin",
    "schoolId": "..."
  }
}
```

---

## 2. SCHOOL ENDPOINTS

### Create School

```http
POST /schools
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "name": "International School",
  "email": "info@school.com",
  "phone": "+2348001234567",
  "address": "123 Education Avenue",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "timezone": "Africa/Lagos",
  "currency": "NGN",
  "website": "https://school.com",
  "settings": {
    "gradingSystem": "standard",
    "defaultLanguage": "en",
    "allowStudentDownloads": true,
    "allowParentPortal": false,
    "branding": {
      "primaryColor": "#3B82F6",
      "secondaryColor": "#10B981"
    }
  }
}
```

---

### Get All Schools

```http
GET /schools?page=1&limit=10
```

**Roles:** `school_admin`

---

### Get School by ID

```http
GET /schools/:id
```

**Roles:** `school_admin`

---

### Get School by Slug

```http
GET /schools/slug/:slug
```

**Roles:** `school_admin`

---

### Update School

```http
PUT /schools/:id
```

**Roles:** `school_admin`

---

### Delete School (Soft Delete)

```http
DELETE /schools/:id
```

**Roles:** `school_admin`

---

## 3. USER ENDPOINTS

### Get All Users

```http
GET /users?page=1&limit=10&role=teacher&isActive=true
```

**Roles:** `school_admin`

---

### Get User by ID

```http
GET /users/:id
```

**Roles:** `school_admin`

---

### Update User

```http
PUT /users/:id
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+2348001234567",
  "isActive": true,
  "role": "teacher"
}
```

---

### Delete User

```http
DELETE /users/:id
```

**Roles:** `school_admin`

---

### Get All Teachers

```http
GET /users/teachers
```

**Roles:** `school_admin`, `teacher`

---

### Get All Students

```http
GET /users/students
```

**Roles:** `school_admin`, `teacher`

---

## 4. STUDENT ENDPOINTS

### Get My Student Profile

```http
GET /students/me
```

**Roles:** `student`

---

### Get All Students

```http
GET /students?page=1&limit=10&classId=...
```

**Roles:** `school_admin`, `teacher`

---

### Get Student by ID

```http
GET /students/:id
```

**Roles:** `school_admin`, `teacher`

---

### Create Student

```http
POST /students
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "userId": "...",
  "admissionNumber": "STU-2024-001",
  "classId": "...",
  "subjectIds": ["...", "..."],
  "guardian": {
    "name": "Parent Name",
    "phone": "+2348001234567",
    "email": "parent@email.com"
  },
  "enrollmentDate": "2024-01-01",
  "graduationYear": 2026
}
```

---

### Update Student

```http
PUT /students/:id
```

**Roles:** `school_admin`, `teacher`

---

### Delete Student

```http
DELETE /students/:id
```

**Roles:** `school_admin`

---

## 5. TEACHER ENDPOINTS

### Get My Teacher Profile

```http
GET /teachers/me
```

**Roles:** `teacher`

---

### Get All Teachers

```http
GET /teachers
```

**Roles:** `school_admin`

---

### Get Teacher by ID

```http
GET /teachers/:id
```

**Roles:** `school_admin`

---

### Create Teacher

```http
POST /teachers
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "userId": "...",
  "employeeId": "EMP-2024-001",
  "designation": "Senior Teacher",
  "department": "Science",
  "assignedClasses": ["..."],
  "assignedSubjects": ["..."],
  "employmentDate": "2024-01-01"
}
```

---

### Update Teacher

```http
PUT /teachers/:id
```

**Roles:** `school_admin`

---

### Delete Teacher

```http
DELETE /teachers/:id
```

**Roles:** `school_admin`

---

## 6. ACADEMIC SESSION ENDPOINTS

### Create Session

```http
POST /sessions/sessions
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "sessionName": "2024/2025",
  "startDate": "2024-09-01T00:00:00.000Z",
  "endDate": "2025-08-31T23:59:59.999Z",
  "isActive": true
}
```

---

### Get All Sessions

```http
GET /sessions/sessions?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Active Session

```http
GET /sessions/sessions/active
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Session by ID

```http
GET /sessions/sessions/:id
```

**Roles:** `school_admin`, `teacher`

---

### Update Session

```http
PUT /sessions/sessions/:id
```

**Roles:** `school_admin`

---

### Delete Session

```http
DELETE /sessions/sessions/:id
```

**Roles:** `school_admin`

---

## 7. ACADEMIC TERM ENDPOINTS

### Create Term

```http
POST /sessions/terms
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "sessionId": "...",
  "name": "First Term",
  "order": 1,
  "startDate": "2024-09-01T00:00:00.000Z",
  "endDate": "2024-12-15T23:59:59.999Z",
  "isActive": true
}
```

---

### Get Terms by Session

```http
GET /sessions/sessions/:sessionId/terms
```

**Roles:** `school_admin`, `teacher`

---

### Get Active Term for Session

```http
GET /sessions/sessions/:sessionId/terms/active
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Term by ID

```http
GET /sessions/terms/:id
```

**Roles:** `school_admin`, `teacher`

---

### Update Term

```http
PUT /sessions/terms/:id
```

**Roles:** `school_admin`

---

### Delete Term

```http
DELETE /sessions/terms/:id
```

**Roles:** `school_admin`

---

## 8. CLASS ENDPOINTS

### Create Class

```http
POST /classes
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "name": "SS1A",
  "level": "SS1",
  "classTeacherId": "...",
  "description": "Science Class",
  "isActive": true
}
```

---

### Get All Classes

```http
GET /classes?page=1&limit=10&isActive=true
```

**Roles:** `school_admin`, `teacher`

---

### Get Classes by Teacher

```http
GET /classes/teacher/:teacherId
```

**Roles:** `school_admin`, `teacher`

---

### Get Class by ID

```http
GET /classes/:id
```

**Roles:** `school_admin`, `teacher`

---

### Update Class

```http
PUT /classes/:id
```

**Roles:** `school_admin`

---

### Delete Class

```http
DELETE /classes/:id
```

**Roles:** `school_admin`

---

## 9. SUBJECT ENDPOINTS

### Create Subject

```http
POST /subjects
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "name": "Mathematics",
  "code": "MTH101",
  "description": "Basic Mathematics",
  "applicableClasses": ["..."],
  "isCore": true,
  "isActive": true
}
```

---

### Get All Subjects

```http
GET /subjects?page=1&limit=10&isCore=true&isActive=true
```

**Roles:** `school_admin`, `teacher`

---

### Get Core Subjects

```http
GET /subjects/core
```

**Roles:** `school_admin`, `teacher`

---

### Get Subjects by Class

```http
GET /subjects/class/:classId
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Subject by ID

```http
GET /subjects/:id
```

**Roles:** `school_admin`, `teacher`

---

### Update Subject

```http
PUT /subjects/:id
```

**Roles:** `school_admin`

---

### Delete Subject

```http
DELETE /subjects/:id
```

**Roles:** `school_admin`

---

## 10. QUESTION ENDPOINTS

### Create Question

```http
POST /questions
```

**Roles:** `school_admin`, `teacher`

**Request Body (MCQ):**

```json
{
  "subjectId": "...",
  "type": "mcq",
  "curriculum": "WAEC",
  "topic": "Algebra",
  "subTopic": "Quadratic Equations",
  "difficulty": "medium",
  "marks": 5,
  "language": "en",
  "questionText": "What is the solution to x² - 5x + 6 = 0?",
  "options": [
    { "key": "A", "text": "x = 2, 3", "isCorrect": true },
    { "key": "B", "text": "x = 1, 6", "isCorrect": false },
    { "key": "C", "text": "x = -2, -3", "isCorrect": false },
    { "key": "D", "text": "x = 0, 6", "isCorrect": false }
  ],
  "correctAnswer": "A",
  "explanation": "Factoring gives (x-2)(x-3)=0",
  "tags": ["algebra", "quadratic"]
}
```

**Request Body (Theory):**

```json
{
  "subjectId": "...",
  "type": "theory",
  "curriculum": "WAEC",
  "topic": "Algebra",
  "subTopic": "Quadratic Equations",
  "difficulty": "hard",
  "marks": 10,
  "language": "en",
  "questionText": "Solve x² - 5x + 6 = 0 showing all steps.",
  "correctAnswer": "x = 2 or x = 3",
  "explanation": "Factor the equation...",
  "tags": ["algebra", "quadratic"]
}
```

---

### Get All Questions

```http
GET /questions?page=1&limit=10&subjectId=...&type=mcq&difficulty=medium&topic=Algebra&isArchived=false
```

**Roles:** `school_admin`, `teacher`

---

### Search Questions

```http
GET /questions/search?q=algebra&page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Questions by Subject

```http
GET /questions/subject/:subjectId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Questions by Topic

```http
GET /questions/topic/:topic?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Questions by Difficulty

```http
GET /questions/difficulty/:difficulty?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Question by ID

```http
GET /questions/:id
```

**Roles:** `school_admin`, `teacher`

---

### Update Question

```http
PUT /questions/:id
```

**Roles:** `school_admin`, `teacher`

---

### Delete Question

```http
DELETE /questions/:id
```

**Roles:** `school_admin`, `teacher`

---

### Archive Question

```http
PATCH /questions/:id/archive
```

**Roles:** `school_admin`, `teacher`

---

## 11. ASSESSMENT ENDPOINTS

### Create Assessment

```http
POST /assessments
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "sessionId": "...",
  "termId": "...",
  "classId": "...",
  "subjectId": "...",
  "title": "Math Quiz 1",
  "description": "Algebra Quiz",
  "type": "quiz",
  "deliveryMode": "cbt",
  "instructions": "Answer all questions",
  "durationMinutes": 30,
  "passMark": 40,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "allowReview": true,
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T10:30:00.000Z",
  "questions": [
    { "questionId": "...", "order": 1, "marks": 5 },
    { "questionId": "...", "order": 2, "marks": 5 }
  ]
}
```

---

### Get All Assessments

```http
GET /assessments?page=1&limit=10&classId=...&subjectId=...&status=published&type=quiz
```

**Roles:** `school_admin`, `teacher`

---

### Get Upcoming Assessments

```http
GET /assessments/upcoming?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Active Assessments

```http
GET /assessments/active
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get My Assessments (Teacher)

```http
GET /assessments/my?page=1&limit=10
```

**Roles:** `teacher`

---

### Get Assessments by Class

```http
GET /assessments/class/:classId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Assessments by Subject

```http
GET /assessments/subject/:subjectId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Assessment by ID

```http
GET /assessments/:id
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Update Assessment (Draft only)

```http
PUT /assessments/:id
```

**Roles:** `school_admin`, `teacher`

---

### Delete Assessment

```http
DELETE /assessments/:id
```

**Roles:** `school_admin`, `teacher`

---

### Publish Assessment

```http
PATCH /assessments/:id/publish
```

**Roles:** `school_admin`, `teacher`

---

### Close Assessment

```http
PATCH /assessments/:id/close
```

**Roles:** `school_admin`, `teacher`

---

### Duplicate Assessment

```http
POST /assessments/:id/duplicate
```

**Roles:** `school_admin`, `teacher`

---

## 12. SUBMISSION ENDPOINTS

### Start Assessment

```http
POST /submissions/assessments/:assessmentId/start
```

**Roles:** `student`

---

### Save Answer

```http
PATCH /submissions/:id/answer
```

**Roles:** `student`

**Request Body:**

```json
{
  "questionId": "...",
  "selectedOption": "A",
  "answerText": "My answer text"
}
```

---

### Submit Assessment

```http
PATCH /submissions/:id/submit
```

**Roles:** `student`

---

### Get My Submissions

```http
GET /submissions/my?page=1&limit=10
```

**Roles:** `student`

---

### Get All Submissions (Admin/Teacher)

```http
GET /submissions?page=1&limit=10&assessmentId=...&studentId=...&status=submitted
```

**Roles:** `school_admin`, `teacher`

---

### Get Pending Grading

```http
GET /submissions/pending-grading?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Submissions by Assessment

```http
GET /submissions/assessment/:assessmentId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Submissions by Student

```http
GET /submissions/student/:studentId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Submission by ID

```http
GET /submissions/:id
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Update Submission

```http
PUT /submissions/:id
```

**Roles:** `school_admin`, `teacher`

---

### Grade Submission

```http
PATCH /submissions/:id/grade
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "manualScore": 8,
  "finalScore": 8,
  "answers": [
    {
      "questionId": "...",
      "obtainedMarks": 5,
      "isCorrect": true
    }
  ]
}
```

---

## 13. RESULT ENDPOINTS

### Create Result from Submission

```http
POST /results/submissions/:submissionId
```

**Roles:** `school_admin`, `teacher`

---

### Get All Results

```http
GET /results?page=1&limit=10&studentId=...&assessmentId=...&classId=...&subjectId=...&status=published
```

**Roles:** `school_admin`, `teacher`

---

### Get My Results

```http
GET /results/my?page=1&limit=10
```

**Roles:** `student`

---

### Get Results by Student

```http
GET /results/student/:studentId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Results by Assessment

```http
GET /results/assessment/:assessmentId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Results by Class

```http
GET /results/class/:classId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Result by ID

```http
GET /results/:id
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Update Result

```http
PUT /results/:id
```

**Roles:** `school_admin`, `teacher`

---

### Publish Result

```http
PATCH /results/:id/publish
```

**Roles:** `school_admin`, `teacher`

---

## 14. REPORT CARD ENDPOINTS

### Generate Report Card

```http
POST /results/report-cards/student/:studentId/term/:termId
```

**Roles:** `school_admin`, `teacher`

---

### Get All Report Cards

```http
GET /results/report-cards?page=1&limit=10&studentId=...&classId=...&sessionId=...&termId=...
```

**Roles:** `school_admin`, `teacher`

---

### Get My Report Cards

```http
GET /results/report-cards/my?page=1&limit=10
```

**Roles:** `student`

---

### Get Report Cards by Class

```http
GET /results/report-cards/class/:classId?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get Report Card by ID

```http
GET /results/report-cards/:id
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Update Report Card

```http
PUT /results/report-cards/:id
```

**Roles:** `school_admin`, `teacher`

---

### Delete Report Card

```http
DELETE /results/report-cards/:id
```

**Roles:** `school_admin`, `teacher`

---

## 15. ANALYTICS ENDPOINTS

### Get My Analytics (Student)

```http
GET /analytics/my
```

**Roles:** `student`

---

### Get Dashboard Analytics

```http
GET /analytics/dashboard
```

**Roles:** `school_admin`, `teacher`

**Response:**

```json
{
  "overview": {
    "totalStudents": 150,
    "totalTeachers": 20,
    "totalClasses": 10,
    "totalSubjects": 15,
    "totalAssessments": 45
  },
  "performance": {
    "averageScore": 72.5,
    "passRate": 85.0,
    "gradeDistribution": {
      "A": 30,
      "B": 40,
      "C": 25,
      "D": 10,
      "E": 5,
      "F": 40
    }
  },
  "recentActivity": [...]
}
```

---

### Get Student Analytics

```http
GET /analytics/student/:studentId
```

**Roles:** `school_admin`, `teacher`

---

### Get Class Analytics

```http
GET /analytics/class/:classId
```

**Roles:** `school_admin`, `teacher`

---

### Get Subject Analytics

```http
GET /analytics/subject/:subjectId
```

**Roles:** `school_admin`, `teacher`

---

### Get Assessment Analytics

```http
GET /analytics/assessment/:assessmentId
```

**Roles:** `school_admin`, `teacher`

---

## 16. NOTIFICATION ENDPOINTS

### Get My Notifications

```http
GET /notifications?page=1&limit=10&type=assessment&isRead=false
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Unread Notifications

```http
GET /notifications/unread?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Get Unread Count

```http
GET /notifications/unread/count
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Mark Notification as Read

```http
PATCH /notifications/:id/read
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Mark All as Read

```http
PATCH /notifications/read-all
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Delete Notification

```http
DELETE /notifications/:id
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Delete All Notifications

```http
DELETE /notifications
```

**Roles:** `school_admin`, `teacher`, `student`

---

### Create Notification (Admin/Teacher)

```http
POST /notifications
```

**Roles:** `school_admin`, `teacher`

---

### Send Assessment Published Notification

```http
POST /notifications/send/assessment-published
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "userIds": ["...", "..."],
  "assessmentTitle": "Math Quiz 1",
  "link": "/assessments/123"
}
```

---

### Send Result Published Notification

```http
POST /notifications/send/result-published
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "studentId": "...",
  "assessmentTitle": "Math Quiz 1",
  "grade": "A",
  "link": "/results/123"
}
```

---

### Send Announcement

```http
POST /notifications/send/announcement
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "userIds": ["...", "..."],
  "title": "School Holiday",
  "message": "School will be closed on Friday",
  "link": "/announcements"
}
```

---

## 17. AUDIT LOG ENDPOINTS

### Get All Audit Logs

```http
GET /audit?page=1&limit=10&userId=...&entity=User&action=user_login&entityId=...
```

**Roles:** `school_admin`

---

### Get Audit Logs by User

```http
GET /audit/user/:userId?page=1&limit=10
```

**Roles:** `school_admin`

---

### Get Audit Logs by Entity

```http
GET /audit/entity/:entity/:entityId?page=1&limit=10
```

**Roles:** `school_admin`

---

### Get Audit Logs by Action

```http
GET /audit/action/:action?page=1&limit=10
```

**Roles:** `school_admin`

---

### Get Audit Log by ID

```http
GET /audit/:id
```

**Roles:** `school_admin`

---

## 18. AI ENDPOINTS

### Generate with AI

```http
POST /ai/generate
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "provider": "openai",
  "model": "gpt-3.5-turbo",
  "feature": "question_generation",
  "prompt": "Generate 5 questions on Algebra",
  "metadata": {
    "subjectId": "...",
    "topic": "Algebra"
  }
}
```

---

### Generate Questions

```http
POST /ai/generate/questions
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "subjectId": "...",
  "topic": "Algebra",
  "difficulty": "medium",
  "count": 10
}
```

---

### Generate Lesson Plan

```http
POST /ai/generate/lesson-plan
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "subjectId": "...",
  "topic": "Quadratic Equations",
  "duration": 60
}
```

---

### Generate Marking Scheme

```http
POST /ai/generate/marking-scheme
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "assessmentId": "..."
}
```

---

### Generate Feedback

```http
POST /ai/generate/feedback
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "studentId": "...",
  "assessmentId": "...",
  "score": 75
}
```

---

### Generate Study Recommendations

```http
POST /ai/generate/recommendations
```

**Roles:** `school_admin`, `teacher`

**Request Body:**

```json
{
  "studentId": "..."
}
```

---

### Get All AI Generations

```http
GET /ai?page=1&limit=10&feature=question_generation&status=completed&userId=...
```

**Roles:** `school_admin`, `teacher`

---

### Get My AI Generations

```http
GET /ai/my?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get AI Generations by Feature

```http
GET /ai/feature/:feature?page=1&limit=10
```

**Roles:** `school_admin`, `teacher`

---

### Get AI Generation by ID

```http
GET /ai/:id
```

**Roles:** `school_admin`, `teacher`

---

## 19. BILLING ENDPOINTS

### Get Subscription

```http
GET /billing
```

**Roles:** `school_admin`

---

### Create Subscription

```http
POST /billing
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "plan": "starter",
  "trialDays": 14
}
```

---

### Update Subscription

```http
PUT /billing
```

**Roles:** `school_admin`

**Request Body:**

```json
{
  "plan": "professional"
}
```

---

### Cancel Subscription

```http
PATCH /billing/cancel
```

**Roles:** `school_admin`

---

### Renew Subscription

```http
PATCH /billing/renew
```

**Roles:** `school_admin`

---

### Check Subscription Status

```http
GET /billing/status
```

**Roles:** `school_admin`

---

### Get Usage Stats

```http
GET /billing/usage
```

**Roles:** `school_admin`

---

## Response Format

All endpoints return a standardized response:

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "List retrieved",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Common Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

## Authentication Flow

1. **Register** user via `/auth/register`
2. **Login** via `/auth/login` to get `accessToken` and `refreshToken`
3. **Include** `accessToken` in `Authorization: Bearer <token>` header for protected endpoints
4. **Refresh** token via `/auth/refresh-token` when `accessToken` expires
5. **Logout** by discarding tokens on client side

---

## Frontend Integration Tips

1. **Store tokens** securely (HTTP-only cookies or localStorage)
2. **Handle token expiry** - refresh token automatically before expiry
3. **Use interceptors** to add Authorization header to all requests
4. **Handle errors** - show user-friendly error messages
5. **Use pagination** for all list endpoints
6. **Poll for updates** on assessment/submission status

---

**Happy Building! 🚀**
