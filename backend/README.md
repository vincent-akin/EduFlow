# EduFlow Backend

EduFlow is an AI-powered Assessment & Academic Productivity Platform.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Pino Logger

## Project Structure

backend/
├── src/
│ ├── config/ # Configuration files
│ ├── middlewares/ # Express middlewares
│ ├── modules/ # Feature modules
│ ├── shared/ # Shared utilities
│ ├── utils/ # Utility functions
│ ├── types/ # TypeScript types
│ ├── app.ts # Express app
│ └── server.ts # Server entry point
├── scripts/ # Utility scripts
├── .env # Environment variables
├── package.json
└── tsconfig.json

text

## Modules

- ✅ Authentication
- ✅ Schools
- ✅ Users
- ✅ Academic Sessions & Terms
- ✅ Classes
- ✅ Subjects
- ✅ Question Bank
- ✅ Assessments
- ✅ Submissions
- ✅ Results & Report Cards
- ✅ Analytics
- ✅ Notifications
- ✅ Audit Logs

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Seed the database
npm run seed

# Start development server
npm run dev
Environment Variables
env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduflow
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=http://localhost:3000
API Endpoints
Module	Base URL
Auth	/api/v1/auth
Schools	/api/v1/schools
Sessions	/api/v1/sessions
Classes	/api/v1/classes
Subjects	/api/v1/subjects
Questions	/api/v1/questions
Assessments	/api/v1/assessments
Submissions	/api/v1/submissions
Results	/api/v1/results
Analytics	/api/v1/analytics
Notifications	/api/v1/notifications
Audit	/api/v1/audit
Scripts
bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Seed the database
npm run db:drop      # Drop the database
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
License
MIT

text

---

## Complete Project Summary

### Modules Built:

1. ✅ **Auth** - Registration, login, JWT, refresh tokens
2. ✅ **Schools** - School CRUD with multi-tenancy
3. ✅ **Users** - User management with roles (admin, teacher, student)
4. ✅ **Sessions & Terms** - Academic sessions and terms
5. ✅ **Classes** - Class management
6. ✅ **Subjects** - Subject management
7. ✅ **Questions** - Question bank with MCQ and theory
8. ✅ **Assessments** - Assessment creation, publishing, and duplication
9. ✅ **Submissions** - Student submissions with auto-grading
10. ✅ **Results & Report Cards** - Results and report card generation
11. ✅ **Analytics** - Student, class, subject, and assessment analytics
12. ✅ **Notifications** - User notifications
13. ✅ **Audit Logs** - Activity tracking

### Features:

- ✅ Multi-tenancy with `schoolId` isolation
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication
- ✅ Soft deletes
- ✅ Pagination and filtering
- ✅ Request validation with Zod
- ✅ Logging with Pino
- ✅ Rate limiting
- ✅ Error handling
- ✅ Audit logging
- ✅ Database seeding

---

**EduFlow Backend is now complete and production-ready!** 🎉🚀

Would you like me to help you with any specific module or add any additional features?
```
