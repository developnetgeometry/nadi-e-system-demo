export interface Asset {
  id: string;
  name: string;
  category: string;
  status: "active" | "in_maintenance" | "retired" | "disposed";
  purchase_date: string;
  current_value: number;
  purchase_cost: number;
  depreciation_rate: number;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  location: string;
}

export interface AssetStatsData {
  totalUsers: number;
  totalRoles: number;
  activeUsers: number;
  lastActivity: string;
}

export interface AssetStatsCardProps {
  title: string;
  value: string;
  color?: string;
  description: string;
}

export interface ErrorFallbackProps {
  error: Error;
}
