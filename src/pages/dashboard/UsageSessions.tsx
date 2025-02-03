import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsageSessionList } from "@/components/usage/UsageSessionList";

const UsageSessions = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Usage Sessions</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system usage and activity
          </p>
        </div>
        <UsageSessionList />
      </div>
    </DashboardLayout>
  );
};

export default UsageSessions;