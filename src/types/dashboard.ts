export interface DashboardStatsData {
  totalUsers: number;
  totalRoles: number;
  activeUsers: number;
  lastActivity: string;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}

export interface ErrorFallbackProps {
  error: Error;
}