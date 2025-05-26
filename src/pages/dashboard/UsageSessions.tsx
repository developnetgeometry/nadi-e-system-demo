import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsageSessionList } from "@/components/usage/UsageSessionList";

const UsageSessions = () => {
  return (
    <div>
      <div className="space-y-1">
        <div>
          <h1 className="text-3xl font-bold">Usage Sessions</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system usage and activity
          </p>
        </div>
        <UsageSessionList />
      </div>
    </div>
  );
};

export default UsageSessions;
