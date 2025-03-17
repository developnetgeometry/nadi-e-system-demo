
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowService } from "@/services/workflow-service";
import { ApprovalAction, WorkOrderStatus } from "@/types/workflow";
import { useAuth } from "@/hooks/useAuth";

export function useWorkflow() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const startWorkOrderWorkflow = async (workOrderId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const result = await WorkflowService.startWorkOrderWorkflow(workOrderId, user.id);
      if (result) {
        toast({
          title: "Success",
          description: "Workflow started successfully",
        });
        return result;
      } else {
        toast({
          title: "Error",
          description: "Failed to start workflow",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error in startWorkOrderWorkflow:", error);
      toast({
        title: "Error",
        description: "An error occurred while starting the workflow",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processApproval = async (
    workOrderId: string,
    stepId: string,
    action: ApprovalAction,
    reason?: string
  ) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await WorkflowService.processApproval(
        workOrderId,
        stepId,
        user.id,
        action,
        reason
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Workflow ${action === "approve" ? "approved" : "rejected"} successfully`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to process workflow action",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error in processApproval:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the workflow action",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const getUserPendingApprovals = async (userRoles: string[]) => {
    if (!user?.id) {
      return [];
    }

    try {
      return await WorkflowService.getActiveWorkflowsForUser(user.id, userRoles);
    } catch (error) {
      console.error("Error in getUserPendingApprovals:", error);
      return [];
    }
  };

  return {
    isProcessing,
    startWorkOrderWorkflow,
    processApproval,
    getUserPendingApprovals,
  };
}
