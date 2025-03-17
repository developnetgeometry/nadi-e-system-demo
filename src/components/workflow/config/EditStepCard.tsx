
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { WorkflowConfigStep } from "@/types/workflow";
import { WorkflowConfigStepForm } from "../WorkflowConfigStepForm";

interface EditStepCardProps {
  step: WorkflowConfigStep | null;
  editingStepIndex: number | null;
  availableSteps: WorkflowConfigStep[];
  onSave: (step: WorkflowConfigStep) => void;
  onCancel: () => void;
}

export function EditStepCard({ 
  step, 
  editingStepIndex, 
  availableSteps, 
  onSave, 
  onCancel 
}: EditStepCardProps) {
  if (!step) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingStepIndex !== null ? "Edit Step" : "Add Step"}</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkflowConfigStepForm 
          step={step} 
          onSave={onSave} 
          onCancel={onCancel}
          isFirstStep={availableSteps.length === 0 || (editingStepIndex !== null && availableSteps[editingStepIndex].isStartStep)}
          availableSteps={availableSteps}
        />
      </CardContent>
    </Card>
  );
}
