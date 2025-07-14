import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { SuperAdminPage } from "@/components/hr/payroll/SuperAdminPage";
import { MCMCPage } from "@/components/hr/payroll/MCMCPage";
import { DUSPPage } from "@/components/hr/payroll/DUSPPage";
import { EnhancedTPPage } from "@/components/hr/payroll/EnhancedTPPage";
import { EnhancedStaffPage } from "@/components/hr/payroll/EnhancedStaffPage";

export default function PayrollPage() {
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
    return <div>Loading…</div>;
  }

  // 4. pick the right page
  const renderDashboard = () => {
    switch (role) {
      case "super_admin":
        return <SuperAdminPage />;
      case "mcmc":
        return <MCMCPage />;
      case "dusp":
        return <DUSPPage />;
      case "staff_manager":
      case "staff_assistant_manager":
        return <EnhancedStaffPage />;
      case "tp_operation":
      case "tp_admin":
      case "tp_hr":
      case "tp_pic":
      case "tp_site":
        return <EnhancedTPPage />;
      default:
        return (
          <div>
            No Access found for <strong>{role || "unknown"}</strong>
          </div>
        );
    }
  };

  return <div>{renderDashboard()}</div>;
}
