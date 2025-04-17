
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityLogList } from "@/components/activity/ActivityLogList";

const AuditLogs = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 container mx-auto py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Audit Logs & Compliance</h1>
        </div>

        <ActivityLogList />
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
