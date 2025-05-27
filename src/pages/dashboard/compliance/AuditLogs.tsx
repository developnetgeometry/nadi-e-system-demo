import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityLogList } from "@/components/activity/ActivityLogList";

const AuditLogs = () => {
  return (
    <div>
      <div className="space-y-1 space-y-1">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Audit Logs & Compliance</h1>
        </div>

        <ActivityLogList />
      </div>
    </div>
  );
};

export default AuditLogs;
