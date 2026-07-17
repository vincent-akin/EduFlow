# EduFlow Frontend

Next.js (TypeScript) frontend for EduFlow, an AI-powered assessment platform.
Built per the SSD stack: Next.js App Router, Tailwind CSS, shadcn-style UI
primitives, TanStack Query, Zustand, React Hook Form, Zod, and Recharts.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the marketing homepage.

Copy `.env.example` to `.env.local` and point `NEXT_PUBLIC_API_BASE_URL` at
your running EduFlow backend (defaults to `http://localhost:5000/api/v1`).

**No backend running yet?** On the `/login` page there are four "demo"
buttons (Admin / Teacher / Student / Parent) that log you into each
dashboard with sample data, no API required.

## What's built

**Public site**
- `/` — marketing homepage: hero, stats, feature grid, CTA
- `/login`, `/register`, `/forgot-password` — real auth flow wired to the
  API contract, plus the demo-mode buttons described above

**Theming**
- Light theme ("Violet") and dark theme ("Emerald") matching the two
  approved mockups, switchable via the toggle in the top-right corner

**Dashboards** (`app/dashboard/`), each behind its own sidebar nav:
- `/dashboard/admin` — school stats, performance trend, assessment mix,
  recent activity, top classes
- `/dashboard/teacher` — class overview, to-do list, performance trend,
  AI assistant shortcut
- `/dashboard/student` — upcoming assessments, recent results, performance
  trend
- `/dashboard/parent` — children overview, academic table, fees summary,
  school updates

**Shared modules**
- `/dashboard/assessments` — searchable/filterable table
- `/dashboard/results` — stats + trend + subject breakdown
- `/dashboard/timetable` — weekly grid
- `/dashboard/messages` — thread list + conversation view
- `/dashboard/ai` — AI tool picker + generator form + recent generations
- `/dashboard/ai-chat` — chat assistant UI
- `/dashboard/profile` — profile form + quick stats

**Placeholder modules** (nav wired, real content next):
`schools`, `users`, `classes`, `analytics`, `billing`, `settings`,
`children`, `progress`, `attendance`, `news`, `resources` — each renders a
"coming soon" panel rather than a broken link.

**Foundations**
- `lib/api/client.ts` — typed fetch wrapper matching the API's
  `{success, message, data}` envelope and error format
- `lib/store/auth-store.ts` — Zustand store (persisted) holding the user,
  tokens, and demo-mode flag, plus a session cookie for middleware checks
- `lib/mock/data.ts` — sample data powering every dashboard until each
  module is wired to its real endpoint
- `components/ui/*` — Button, Input, Label, Select, Checkbox, Card, Alert
- `components/dashboard/*` — Sidebar, Topbar, Shell, Panel/StatCard
  widgets, chart wrappers (line/bar/donut)
- `middleware.ts` — protects `/dashboard/*`, redirects signed-in users
  away from the auth pages

## Project structure

```
app/
  page.tsx              # marketing homepage
  (auth)/                # login, register, forgot-password + shared layout
  dashboard/
    layout.tsx            # sidebar + topbar shell
    admin/ teacher/ student/ parent/   # role dashboards
    assessments/ results/ timetable/ messages/ ai/ ai-chat/ profile/
    schools/ users/ classes/ analytics/ billing/ settings/
    children/ progress/ attendance/ news/ resources/
components/
  marketing/            # site header/footer
  auth/                 # brand showcase panel
  dashboard/            # sidebar, topbar, shell, widgets, charts
  ui/                   # shared design-system primitives
lib/
  api/                  # typed API client + per-resource functions/hooks
  store/                # Zustand stores
  validations/          # Zod schemas
  mock/                 # sample data + demo users
middleware.ts           # route protection
```

## Next steps

- Wire each remaining dashboard/module off `lib/mock/data.ts` onto real API
  calls (see "Connecting the backend" below — `assessments` is done and is
  the pattern to copy)
- Build out the remaining "coming soon" modules (schools, users, classes,
  billing, settings, etc.)
- Real-time AI chat + generation against the `/ai` endpoints

## Connecting the backend

**1. Point the frontend at your API**

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_API_BASE_URL to your backend, e.g. http://localhost:5000/api/v1
```

Make sure your backend's CORS config allows the frontend's origin
(`http://localhost:3000` in dev).

**2. Auth + token refresh already work against the real API**

`/login` and `/register` call the real `/auth/login` and `/auth/register`
endpoints — no change needed. `lib/api/client.ts` also now handles token
refresh automatically: any authenticated request that gets a 401 will
transparently call `/auth/refresh-token` once and retry, using the
refresh token from `lib/store/auth-store.ts`. If refresh also fails, the
session is cleared and the user is bounced to `/login`.

The four **demo buttons** on `/login` still work independently of all this
— they set a fake in-memory session (`isDemo: true`) and are recognized by
the token-refresh logic so they won't try to call a real refresh endpoint.
Decide whether to keep them (handy for offline demos) or remove them
(`lib/mock/demo-users.ts` and the demo section in
`app/(auth)/login/page.tsx`) once the backend is confirmed working.

**3. The Assessments module is fully wired — use it as the template**

- `lib/api/assessments.ts` — typed functions for each endpoint
  (`getAssessments`, `createAssessment`, `publishAssessment`,
  `deleteAssessment`), matching API doc §12
- `lib/api/use-assessments.ts` — React Query hooks (`useAssessments`,
  `useCreateAssessment`) with cache invalidation on create
- `app/dashboard/assessments/page.tsx` — real loading/error/empty states,
  no mock data
- `components/dashboard/create-assessment-dialog.tsx` — real create form

One thing to verify once your backend is reachable: the API doc doesn't
show a sample response body for `GET /assessments`, so `AssessmentDto` in
`lib/api/assessments.ts` is inferred from the documented create payload.
Compare a real response against that type first and adjust field names if
they differ — that's the most likely thing to need a tweak.

**4. Repeat the pattern for each remaining module**

| Page | Mock data (remove) | Real endpoints (API doc §) |
|---|---|---|
| `dashboard/admin` | `adminStats`, `performanceTrend`, `assessmentsByType`, `recentActivities`, `topPerformingClasses` | Analytics (§21), Schools (§2) |
| `dashboard/teacher` | `classOverview`, `todoList` | Classes (§6), Assessments (§12) |
| `dashboard/student` | `upcomingAssessments`, `recentResults` | Assessments `/upcoming` (§12), Results (§14) |
| `dashboard/parent` | `children`, `academicOverview` | Students (§5), Results (§14) |
| `dashboard/results` | `performanceBySubject`, `recentResults` | Results (§14), Analytics (§21) |
| `dashboard/timetable` | `timetable` | (not in current API doc — needs a backend endpoint) |
| `dashboard/messages` | `messageThreads` | Messages (§18) |
| `dashboard/ai`, `ai-chat` | `aiTools`, `recentGenerations` | AI Endpoints (§22) |
| Topbar notifications | `notifications` in `lib/mock/data.ts` | Notifications (§17) |

For each: add a `lib/api/<resource>.ts` file (functions), a
`lib/api/use-<resource>.ts` file (React Query hooks), then swap the
page's mock import for the hook and add loading/error handling like
`assessments/page.tsx` does. Once every page is converted, delete
`lib/mock/data.ts`.
