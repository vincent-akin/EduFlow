import { authedRequest } from './client';

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  totalAssessments: number;
  pendingSubmissions: number;
  unreadNotifications: number;
  averageScore: number;
  passRate: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  gradeDistribution: Record<string, number>;
  recentResults: any[];
  upcomingAssessments: any[];
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return authedRequest<AdminDashboardData>('/dashboard/admin');
}