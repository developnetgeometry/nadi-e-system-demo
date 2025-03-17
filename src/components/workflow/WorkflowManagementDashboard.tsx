
import { useState } from "react";
import { PendingApprovals } from "./PendingApprovals";
import { useAuth } from "@/hooks/useAuth";

export function WorkflowManagementDashboard() {
  const { user } = useAuth();
  // Normally you would fetch user roles from a backend
  const userRoles = user?.roles || ["user"];
  
  return (
    <div className="space-y-6">
      <PendingApprovals userRoles={userRoles} />
    </div>
  );
}
