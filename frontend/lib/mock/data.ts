// Sample data for dashboard UI development.
// Replace each of these with real API calls (see lib/api/) as endpoints come online.

export const performanceTrend = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 71 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 70 },
  { month: "May", score: 77 },
  { month: "Jun", score: 78.4 },
];

export const assessmentsByType = [
  { name: "Class Tests", value: 42, color: "var(--chart-1)" },
  { name: "Exams", value: 28, color: "var(--chart-2)" },
  { name: "Assignments", value: 20, color: "var(--chart-3)" },
  { name: "Quizzes", value: 10, color: "var(--chart-4)" },
];

export const performanceBySubject = [
  { subject: "Math", score: 82 },
  { subject: "Eng", score: 76 },
  { subject: "Bio", score: 88 },
  { subject: "Chem", score: 71 },
  { subject: "Phys", score: 79 },
];

export const topPerformingClasses = [
  { rank: 1, name: "SS 2A Mathematics", score: 86.7 },
  { rank: 2, name: "SS 1B English", score: 82.4 },
  { rank: 3, name: "JSS 3A Mathematics", score: 78.9 },
  { rank: 4, name: "SS 1A Biology", score: 75.3 },
  { rank: 5, name: "JSS 2B Chemistry", score: 72.1 },
];

export const recentActivities = [
  {
    id: "1",
    text: "Mrs. Sarah Johnson created a new assessment — Algebra Test for JSS 2A",
    time: "2 hours ago",
  },
  {
    id: "2",
    text: "32 students submitted answers for English Essay",
    time: "5 hours ago",
  },
  {
    id: "3",
    text: "Mr. David added 15 new questions to Question Bank",
    time: "Yesterday, 4:35pm",
  },
  {
    id: "4",
    text: "Term 2 results for SS 1A published",
    time: "Yesterday, 1:15pm",
  },
];

export const adminStats = [
  { label: "Total Students", value: "2,568", delta: "+12% from last month" },
  { label: "Total Teachers", value: "148", delta: "+6% from last month" },
  { label: "Assessments", value: "324", delta: "+15% from last month" },
  { label: "Avg. Performance", value: "78.4%", delta: "+4.2% from last month" },
];

export const upcomingAssessments = [
  {
    id: "1",
    title: "Mathematics Test",
    subtitle: "Algebra Unit 2 · Functions",
    date: "May 24, 2026",
    due: "2 days left",
    class: "SS 2A",
  },
  {
    id: "2",
    title: "English Essay",
    subtitle: "Descriptive Writing",
    date: "May 27, 2026",
    due: "5 days left",
    class: "SS 1B",
  },
  {
    id: "3",
    title: "Biology Quiz",
    subtitle: "Cell Structure",
    date: "May 30, 2026",
    due: "8 days left",
    class: "JSS 3A",
  },
];

export const recentResults = [
  { id: "1", title: "Mathematics Test", score: "88%" },
  { id: "2", title: "English Essay", score: "79%" },
  { id: "3", title: "Biology Quiz", score: "92%" },
  { id: "4", title: "Chemistry Test", score: "85%" },
];

export const classOverview = [
  { id: "1", name: "SS 2A Mathematics", students: 42, avg: "82.8%" },
  { id: "2", name: "SS 1B Mathematics", students: 38, avg: "78.4%" },
  { id: "3", name: "JSS 3A Mathematics", students: 45, avg: "75.1%" },
  { id: "4", name: "JSS 2B Mathematics", students: 40, avg: "74.6%" },
];

export const todoList = [
  { id: "1", text: "Grade Math Test — SS 2A", meta: "10 submissions" },
  { id: "2", text: "Review Assignments", meta: "15 pending" },
  { id: "3", text: "Prepare Lesson Plan", meta: "Unit 3: Trigonometry" },
  { id: "4", text: "Upload Resources", meta: "To be shared" },
];

export interface Assessment {
  id: string;
  title: string;
  type: string;
  class: string;
  dueDate: string;
  submissions: string;
  status: "Active" | "Draft" | "Scheduled";
}

export const assessments: Assessment[] = [
  {
    id: "1",
    title: "Mathematics Test",
    type: "Test",
    class: "SS 2A",
    dueDate: "May 24, 2026",
    submissions: "36/42",
    status: "Active" as const,
  },
  {
    id: "2",
    title: "English Essay",
    type: "Assignment",
    class: "SS 1B",
    dueDate: "May 27, 2026",
    submissions: "30/38",
    status: "Active" as const,
  },
  {
    id: "3",
    title: "Biology Quiz",
    type: "Quiz",
    class: "JSS 3A",
    dueDate: "May 30, 2026",
    submissions: "22/45",
    status: "Active" as const,
  },
  {
    id: "4",
    title: "Chemistry Test",
    type: "Test",
    class: "SS 1A",
    dueDate: "Jun 2, 2026",
    submissions: "26/40",
    status: "Draft" as const,
  },
  {
    id: "5",
    title: "Physics Practical",
    type: "Practical",
    class: "SS 2B",
    dueDate: "Jun 4, 2026",
    submissions: "—",
    status: "Scheduled" as const,
  },
];

export const timetable = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  slots: [
    { time: "8:00 AM", entries: ["Mathematics · SS 2A", "", "Biology · JSS 3A", "", "Chemistry · SS 1A"] },
    { time: "9:00 AM", entries: ["", "English · SS 1B", "", "Mathematics · SS 1B", ""] },
    { time: "11:00 AM", entries: ["Physics · SS 2B", "", "Assembly", "", "Sports · SS 2B"] },
    { time: "1:00 PM", entries: ["", "", "", "Biology Lab · JSS 3A", ""] },
  ],
};

export const messageThreads = [
  {
    id: "1",
    name: "Mrs. Johnson",
    role: "Mathematics Teacher",
    preview: "Please check student's assignment by tomorrow.",
    time: "2:30 PM",
    unread: true,
  },
  {
    id: "2",
    name: "School Admin",
    role: "Announcement",
    preview: "School will be closed on Friday.",
    time: "11:55 AM",
    unread: true,
  },
  {
    id: "3",
    name: "Mr. David",
    role: "Science Teacher",
    preview: "Don't forget about the lab session.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "4",
    name: "Mary Adewale",
    role: "Parent",
    preview: "Thank you for the update.",
    time: "Yesterday",
    unread: false,
  },
];

export const aiTools = [
  {
    id: "question-generator",
    title: "Question Generator",
    description: "Generate curriculum-aligned tests and quizzes in seconds",
  },
  {
    id: "lesson-plan",
    title: "Lesson Plan Generator",
    description: "Create detailed lesson plans and guides",
  },
  {
    id: "marking-scheme",
    title: "Marking Scheme",
    description: "Generate marking schemes and rubrics",
  },
  {
    id: "rubric-generator",
    title: "Rubric Generator",
    description: "Create grading criteria for assignments",
  },
  {
    id: "report-generator",
    title: "Report Generator",
    description: "Generate reports and analytics summaries",
  },
  {
    id: "content-simplifier",
    title: "Content Simplifier",
    description: "Simplify complex topics for students",
  },
];

export const recentGenerations = [
  { id: "1", title: "Quadratic Equations — MCQ (10 Questions)", time: "2 mins ago" },
  { id: "2", title: "Linear Equations — Short Answer (8 Questions)", time: "1 hour ago" },
  { id: "3", title: "Algebraic Expressions — MCQ (15 Questions)", time: "Yesterday" },
];

export const children = [
  { id: "1", name: "James Adewale", className: "SS 2A", average: "84.5%" },
  { id: "2", name: "Mary Adewale", className: "JSS 3A", average: "78.2%" },
];

export const notifications = [
  {
    id: "1",
    title: "New assessment published",
    body: "Mathematics Test for SS 2A is now live.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: "2",
    title: "Result published",
    body: "Term 2 results for SS 1A have been published.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "3",
    title: "New message",
    body: "Mrs. Johnson sent you a message.",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: "4",
    title: "Assignment submitted",
    body: "32 students submitted the English Essay assignment.",
    time: "Yesterday",
    unread: false,
  },
];

export const academicOverview = [
  { subject: "Mathematics", james: "88% (A)", mary: "76% (B)" },
  { subject: "English Language", james: "76% (B)", mary: "82% (A)" },
  { subject: "Biology", james: "91% (A)", mary: "90% (A)" },
  { subject: "Chemistry", james: "72% (B)", mary: "74% (B)" },
];
