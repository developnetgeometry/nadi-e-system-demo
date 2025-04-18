import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SsoDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardData();

  if (error) {
    console.error("SSO dashboard data error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">SSO Dashboard</h1>
      </div>

      <DashboardStats stats={stats} isLoading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View your active contracts and their status
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
