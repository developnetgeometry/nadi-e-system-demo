import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { DuspClaimDashboard as DuspPage } from "@/components/claims/dashboard/DuspClaimDashboard";
import { McmcClaimDashboard as McmcPage } from "@/components/claims/dashboard/McmcClaimDashboard";
import { TpClaimDashboard as TpPage } from "@/components/claims/dashboard/TpClaimDashboard";

export default function ClaimDashboard() {
  const userMetadata = useUserMetadata(); // e.g. '{"user_type":"super_admin",…}' or just 'tp_admin'
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (!userMetadata) return;

    let userType = userMetadata;
    // if it looks like JSON, try to parse and extract .user_type
    if (userMetadata.trim().startsWith("{")) {
      try {
        const obj = JSON.parse(userMetadata);
        if (typeof obj === "object" && obj.user_type) {
          userType = obj.user_type;
        }
      } catch {
        // invalid JSON, fall back to raw
      }
    }
    setRole(userType);
  }, [userMetadata]);

  if (userMetadata === null) {
    return <DashboardLayout>Loading…</DashboardLayout>;
  }

  const renderDashboard = () => {
    switch (role) {
      case "super_admin":
        return <McmcPage />;
      case "mcmc":
        return <McmcPage />;
      case "dusp":
        return <DuspPage />;
      case "tp_operation":
      case "tp_admin":
      case "tp_pic":
      case "tp_site":
        return <TpPage />;
      default:
        return (
          <div>
            No Access found for <strong>{role || "unknown"}</strong>
          </div>
        );
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
