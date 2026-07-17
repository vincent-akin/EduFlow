import { useQuery } from '@tanstack/react-query';
import { 
  getPerformanceTrend, 
  getAssessmentTypeDistribution,
  PerformanceTrendPoint,
  AssessmentTypeDistribution 
} from './analytics';

const defaultColors: Record<string, string> = {
  'Quiz': '#8B5CF6',
  'Test': '#3B82F6',
  'Assignment': '#10B981',
  'Exam': '#F59E0B',
  'quiz': '#8B5CF6',
  'test': '#3B82F6',
  'assignment': '#10B981',
  'exam': '#F59E0B',
};

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
    queryFn: async () => {
      const data = await getAssessmentTypeDistribution();
      // Add colors if not present
      return data.map(item => ({
        ...item,
        color: item.color || defaultColors[item.name] || defaultColors[item.name.toLowerCase()] || '#6B7280'
      }));
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}