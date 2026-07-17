import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  School,
  Users,
  BookOpen,
  ClipboardList,
  FileBarChart,
  BarChart3,
  Calendar,
  Receipt,
  Settings,
  Sparkles,
  MessageSquare,
  UserCircle,
  Baby,
  Newspaper,
  Wallet,
  FileText,
  History,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export type Role = "school_admin" | "teacher" | "student" | "parent";

const dashboard = (role: string): NavItem => ({
  label: "Dashboard",
  href: `/dashboard/${role}`,
  icon: LayoutDashboard,
});

export const navByRole: Record<Role, NavItem[]> = {
  school_admin: [
    dashboard("admin"),
    { label: "Schools", href: "/dashboard/schools", icon: School },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Classes", href: "/dashboard/classes", icon: BookOpen },
    { label: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
    { label: "Results", href: "/dashboard/results", icon: FileBarChart },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Timetable", href: "/dashboard/timetable", icon: Calendar },
    { label: "Billing", href: "/dashboard/billing", icon: Wallet },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  teacher: [
    dashboard("teacher"),
    { label: "My Classes", href: "/dashboard/classes", icon: BookOpen },
    { label: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
    { label: "Results", href: "/dashboard/results", icon: FileBarChart },
    { label: "Timetable", href: "/dashboard/timetable", icon: Calendar },
    { label: "AI Tools", href: "/dashboard/ai", icon: Sparkles },
    { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  student: [
    dashboard("student"),
    { label: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
    { label: "Results", href: "/dashboard/results", icon: FileBarChart },
    { label: "Timetable", href: "/dashboard/timetable", icon: Calendar },
    { label: "Resources", href: "/dashboard/resources", icon: FileText },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  parent: [
    dashboard("parent"),
    { label: "My Children", href: "/dashboard/children", icon: Baby },
    { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
    { label: "Attendance", href: "/dashboard/attendance", icon: History },
    { label: "Fees & Payments", href: "/dashboard/billing", icon: Receipt },
    { label: "School News", href: "/dashboard/news", icon: Newspaper },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
};

export const roleLabel: Record<Role, string> = {
  school_admin: "School Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};
