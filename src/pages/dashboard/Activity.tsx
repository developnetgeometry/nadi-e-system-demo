import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityLogList } from "@/components/activity/ActivityLogList";

const Activity = () => {
  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="text-xl font-bold mb-6">Activity Monitoring</h1>
        <ActivityLogList />
      </div>
    </div>
  );
};

export default Activity;
