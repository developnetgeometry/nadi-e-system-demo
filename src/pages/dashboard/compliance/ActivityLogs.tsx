import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportList } from "@/components/reports/ReportList";
import { ActivityLogList } from "@/components/activity/ActivityLogList";

const ActivityLogs = () => {
  return (
    <div>
      <div className="space-y-1">
        <div>
          <h1 className="text-xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground mt-2">
            View and manage activity logs
          </p>
        </div>

        <ActivityLogList />
      </div>
    </div>
  );
};

export default ActivityLogs;
