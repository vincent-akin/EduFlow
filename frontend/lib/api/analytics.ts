import { authedRequest } from './client';

export interface PerformanceTrendPoint {
  month: string;
  score: number;
}

export interface AssessmentTypeDistribution {
  name: string;
  value: number;
  color: string;
  bgColor: string;
}

export async function getPerformanceTrend(months: number = 12): Promise<PerformanceTrendPoint[]> {
  return authedRequest<PerformanceTrendPoint[]>(`/analytics/performance-trend?months=${months}`);
}

export async function getAssessmentTypeDistribution(): Promise<AssessmentTypeDistribution[]> {
  const data = await authedRequest<Omit<AssessmentTypeDistribution, 'color' | 'bgColor'>[]>('/analytics/assessment-types');
  
  // Color mapping with lighter backgrounds and deeper versions
  const colorMap: Record<string, { color: string; bgColor: string }> = {
    'Quiz': { 
      color: '#7C3AED', // Deep purple
      bgColor: '#EDE9FE' // Light purple
    },
    'Test': { 
      color: '#2563EB', // Deep blue
      bgColor: '#DBEAFE' // Light blue
    },
    'Assignment': { 
      color: '#059669', // Deep green
      bgColor: '#D1FAE5' // Light green
    },
    'Exam': { 
      color: '#D97706', // Deep amber
      bgColor: '#FEF3C7' // Light amber
    },
    'quiz': { 
      color: '#7C3AED',
      bgColor: '#EDE9FE'
    },
    'test': { 
      color: '#2563EB',
      bgColor: '#DBEAFE'
    },
    'assignment': { 
      color: '#059669',
      bgColor: '#D1FAE5'
    },
    'exam': { 
      color: '#D97706',
      bgColor: '#FEF3C7'
    },
  };
  
  const defaultColor = { color: '#6B7280', bgColor: '#F3F4F6' };
  
  return data.map(item => {
    const colors = colorMap[item.name] || colorMap[item.name.toLowerCase()] || defaultColor;
    return {
      ...item,
      color: colors.color,
      bgColor: colors.bgColor,
    };
  });
}

export interface RecentActivity {
  id: string;
  studentName: string;
  assessmentTitle: string;
  subjectName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  createdAt: string;
}

export async function getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
  return authedRequest<RecentActivity[]>(`/analytics/recent-activities?limit=${limit}`);
}

export interface TopPerformingClass {
  rank: number;
  name: string;
  score: number;
}

export async function getTopPerformingClasses(limit: number = 5): Promise<TopPerformingClass[]> {
  return authedRequest<TopPerformingClass[]>(`/analytics/top-classes?limit=${limit}`);
}