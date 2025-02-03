export interface DashboardStatsData {
  totalUsers: number;
  totalRoles: number;
  activeUsers: number;
  lastActivity: string;
}

export interface ErrorFallbackProps {
  error: Error;
}