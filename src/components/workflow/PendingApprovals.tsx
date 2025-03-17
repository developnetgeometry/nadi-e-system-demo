
import { useEffect, useState } from "react";
import { useWorkflow } from "@/hooks/use-workflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowDefinition, WorkflowApprovalStep } from "@/types/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApprovalForm } from "./ApprovalForm";

interface PendingApprovalsProps {
  userRoles: string[];
}

export function PendingApprovals({ userRoles }: PendingApprovalsProps) {
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<{
    workflowData: any;
    currentStep: WorkflowApprovalStep;
    workflowDef: WorkflowDefinition;
  } | null>(null);
  
  const { getUserPendingApprovals } = useWorkflow();

  const loadPendingApprovals = async () => {
    setLoading(true);
    try {
      const approvals = await getUserPendingApprovals(userRoles);
      setPendingApprovals(approvals);
    } catch (error) {
      console.error("Error loading pending approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingApprovals();
  }, [userRoles]);

  const handleSelectApproval = (approval: any) => {
    const { data, workflow_id, current_step } = approval;
    const workflowService = require("@/services/workflow-service").WorkflowService;
    const workflowDef = workflowService.getWorkflowDefinition(workflow_id);
    
    if (!workflowDef) {
      console.error("Workflow definition not found:", workflow_id);
      return;
    }
    
    const currentStep = workflowDef.steps.find(step => step.id === current_step);
    if (!currentStep) {
      console.error("Current step not found:", current_step);
      return;
    }
    
    setSelectedApproval({
      workflowData: approval,
      currentStep,
      workflowDef
    });
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType) {
      case "work_order": return "Work Order";
      case "training_report": return "Training Report";
      case "center_management": return "Center Management";
      default: return entityType;
    }
  };

  const handleApprovalComplete = () => {
    setSelectedApproval(null);
    loadPendingApprovals();
  };

  if (selectedApproval) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedApproval(null)}>
          Back to List
        </Button>
        
        <ApprovalForm
          entityId={selectedApproval.workflowData.entity_id}
          currentStep={selectedApproval.currentStep}
          onComplete={handleApprovalComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Approvals</h2>
      
      {loading ? (
        <p>Loading pending approvals...</p>
      ) : pendingApprovals.length === 0 ? (
        <p>No pending approvals found.</p>
      ) : (
        pendingApprovals.map(approval => (
          <Card key={`${approval.entity_type}-${approval.entity_id}`} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {getEntityTypeLabel(approval.entity_type)} #{approval.entity_id.substring(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    {approval.data?.title || "No title"}
                  </CardDescription>
                </div>
                <Badge variant="outline">{approval.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p><strong>Created:</strong> {new Date(approval.created_at).toLocaleDateString()}</p>
                  {approval.data?.description && (
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                      {approval.data.description}
                    </p>
                  )}
                </div>
                <Button onClick={() => handleSelectApproval(approval)}>Review</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
