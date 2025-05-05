import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUsers } from "@/hooks/use-users"; // Import useUsers hook
import { SuperAdminPage } from "@/components/hr/payroll/SuperAdminPage";
import { MCMCPage } from "@/components/hr/payroll/MCMCPage";
import { DUSPPage } from "@/components/hr/payroll/DUSPPage";
import { TPPage } from "@/components/hr/payroll/TPPage";
import { StaffPage } from "@/components/hr/payroll/StaffPage";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function PayrollPage() {
  const { role, changeRole } = useUserRole(); // Use the hook outside the component
  const { useUsersQuery } = useUsers(); // Fetch user profile
  const { data: userProfiles } = useUsersQuery();
  const userProfile = userProfiles?.[0]; // Assuming the first profile is needed
  const [showRoleSelector, setShowRoleSelector] = useState(true);

  useEffect(() => {
    if (userProfile?.user_group) {
      changeRole(userProfile.user_group as UserRole); // Update role based on user_type
    }
  }, [userProfile, changeRole]);

  function useUserRole(): {
    role: string;
    changeRole: (newRole: string) => void;
  } {
    const [role, setRole] = useState<string>("");

    const changeRole = (newRole: string) => {
      setRole(newRole);
    };

    console.log("Current role:", role);
    return { role, changeRole };
  }

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (role) {
      case "super_admin":
        return <SuperAdminPage />;
      //   case "2":
      //     return <MCMCPage />;
      //   case "1":
      //     return <DUSPPage />;
      case "3":
        return <TPPage />;
      case "6":
        return <StaffPage />;
      default:
        return <SuperAdminPage />;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
