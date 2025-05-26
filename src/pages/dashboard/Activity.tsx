import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityLogList } from "@/components/activity/ActivityLogList";

const Activity = () => {
  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Activity Monitoring</h1>
        <p className="text-muted-foreground pb-6">
          Monitor User Activity and System Events
        </p>
        <ActivityLogList />
      </div>
    </div>
  );
};

export default Activity;
