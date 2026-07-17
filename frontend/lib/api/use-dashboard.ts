import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard, AdminDashboardData } from './dashboard';

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ['dashboard', 'admin'],
    queryFn: getAdminDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}