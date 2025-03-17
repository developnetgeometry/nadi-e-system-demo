
import { useState } from "react";
import { useWorkflow } from "@/hooks/use-workflow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalAction, WorkflowApprovalStep } from "@/types/workflow";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApprovalFormProps {
  entityId: string;
  currentStep: WorkflowApprovalStep;
  onComplete: () => void;
}

export function ApprovalForm({ entityId, currentStep, onComplete }: ApprovalFormProps) {
  const [reason, setReason] = useState("");
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const { processApproval, isProcessing } = useWorkflow();

  const handleAction = async (action: ApprovalAction) => {
    if (currentStep.requireReason && !reason.trim() && action === "reject") {
      setFormErrors("Please provide a reason for rejection");
      return;
    }

    setFormErrors(null);
    const success = await processApproval(
      entityId,
      currentStep.id,
      action,
      reason.trim() || undefined
    );

    if (success) {
      onComplete();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentStep.name}</CardTitle>
        <CardDescription>{currentStep.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {formErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formErrors}</AlertDescription>
          </Alert>
        )}
        
        {currentStep.requireReason && (
          <div className="space-y-2 mb-4">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason {currentStep.requireReason ? "(required for rejection)" : "(optional)"}
            </label>
            <Textarea
              id="reason"
              placeholder="Enter your reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={() => handleAction("reject")}
          disabled={isProcessing}
        >
          Reject
        </Button>
        <Button 
          onClick={() => handleAction("approve")} 
          disabled={isProcessing}
        >
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
