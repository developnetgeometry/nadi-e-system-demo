
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DynamicDashboard />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Dashboard;
