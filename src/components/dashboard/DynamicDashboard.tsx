
import { SuperAdminDashboard } from "./user-dashboards/SuperAdminDashboard";
import { AdminDashboard } from "./user-dashboards/AdminDashboard";
import { MemberDashboard } from "./user-dashboards/MemberDashboard";
import { VendorDashboard } from "./user-dashboards/VendorDashboard";
import { useUserDashboard } from "@/hooks/use-user-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const DynamicDashboard = () => {
  const { userType, isLoading, error } = useUserDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Render the appropriate dashboard based on user type
  switch (userType) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "vendor":
      return <VendorDashboard />;
    case "member":
      return <MemberDashboard />;
    default:
      // Fallback to member dashboard if user type is unknown
      return <MemberDashboard />;
  }
};
