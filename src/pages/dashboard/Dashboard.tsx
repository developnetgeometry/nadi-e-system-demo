import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { AnnouncementSimpleView } from "@/components/announcements/AnnouncementSimpleView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Announcement Banner */}
        <div className="mb-6">
          <AnnouncementSimpleView />
        </div>
        <DynamicDashboard />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Dashboard;
