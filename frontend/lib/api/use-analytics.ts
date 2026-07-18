import { useQuery } from '@tanstack/react-query';
import { 
  getPerformanceTrend, 
  getAssessmentTypeDistribution,
  getRecentActivities,
  getTopPerformingClasses,
  PerformanceTrendPoint,
  AssessmentTypeDistribution,
  RecentActivity,
  TopPerformingClass  // ✅ Add this import
} from './analytics';

export function usePerformanceTrend(months: number = 12) {
  return useQuery<PerformanceTrendPoint[]>({
    queryKey: ['analytics', 'performance-trend', months],
    queryFn: () => getPerformanceTrend(months),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useAssessmentTypeDistribution() {
  return useQuery<AssessmentTypeDistribution[]>({
    queryKey: ['analytics', 'assessment-types'],
    queryFn: getAssessmentTypeDistribution,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery<RecentActivity[]>({
    queryKey: ['analytics', 'recent-activities', limit],
    queryFn: () => getRecentActivities(limit),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useTopPerformingClasses(limit: number = 5) {
  return useQuery<TopPerformingClass[]>({
    queryKey: ['analytics', 'top-classes', limit],
    queryFn: () => getTopPerformingClasses(limit),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}