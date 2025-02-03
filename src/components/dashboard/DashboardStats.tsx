import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Activity, UserCog } from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalRoles: number;
  activeUsers: number;
  lastActivity: string;
}

interface DashboardStatsProps {
  stats: StatsData;
  isLoading: boolean;
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const dashboardCards = [
    {
      title: "Total Users",
      value: isLoading ? "Loading..." : stats?.totalUsers,
      icon: Users,
      description: "Total registered users in the system",
    },
    {
      title: "User Roles",
      value: isLoading ? "Loading..." : stats?.totalRoles,
      icon: Shield,
      description: "Available user roles",
    },
    {
      title: "Active Users",
      value: isLoading ? "Loading..." : stats?.activeUsers,
      icon: UserCog,
      description: "Users active in last 24h",
    },
    {
      title: "Last Activity",
      value: isLoading ? "Loading..." : new Date(stats?.lastActivity || "").toLocaleDateString(),
      icon: Activity,
      description: "Most recent system activity",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};