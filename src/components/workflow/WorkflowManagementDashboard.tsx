
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/use-has-permission";
import { PendingApprovals } from "./PendingApprovals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkflowManagementDashboard() {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  // Get user's roles
  useEffect(() => {
    async function getUserRoles() {
      if (!user?.id) return;

      try {
        // This is a placeholder - you'll need to implement a function to get user roles
        // For now, we'll assume the user has TP and staff roles
        setUserRoles(['tp', 'staff']);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    }

    getUserRoles();
  }, [user?.id]);

  // Check if user has necessary permissions
  const canApproveWorkflows = useHasPermission("workflow:approve") || userRoles.some(role => ['tp', 'staff', 'admin'].includes(role));

  if (!canApproveWorkflows) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Workflow Management</h2>
        <p>You don't have permission to access workflow management features.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Workflow Management</h2>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PendingApprovals userRoles={userRoles} />
        </TabsContent>
        
        <TabsContent value="history">
          <div>
            <h3 className="text-xl font-semibold mb-4">Approval History</h3>
            <p>Your approval history will be displayed here.</p>
            {/* Implement approval history display here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
