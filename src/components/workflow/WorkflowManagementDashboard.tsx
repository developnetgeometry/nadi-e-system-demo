
import { useState } from "react";
import { PendingApprovals } from "./PendingApprovals";
import { useAuth } from "@/hooks/useAuth";

export function WorkflowManagementDashboard() {
  const { user } = useAuth();
  // Since user.roles doesn't exist, we'll create a function to get user roles
  const getUserRoles = () => {
    // This is a placeholder. In a real app, you would get roles from the user object
    // or from a separate API call
    return user?.role ? [user.role] : ["user"];
  };
  
  const userRoles = getUserRoles();
  
  return (
    <div className="space-y-6">
      <PendingApprovals userRoles={userRoles} />
    </div>
  );
}
