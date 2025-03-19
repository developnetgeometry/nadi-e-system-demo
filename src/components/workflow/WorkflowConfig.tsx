
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  WorkflowConfig as WorkflowConfigType, 
  WorkflowConfigStep 
} from "@/types/workflow";
import { WorkflowConfigForm } from "./config/WorkflowConfigForm";
import { StepList } from "./config/StepList";
import { EditStepCard } from "./config/EditStepCard";

interface WorkflowConfigProps {
  initialConfig?: WorkflowConfigType;
  initialSteps?: WorkflowConfigStep[];
  modules?: { id: string, name: string }[];
  isSaving?: boolean;
  onSave: (config: WorkflowConfigType, steps: WorkflowConfigStep[]) => void;
}

export function WorkflowConfig({ 
  initialConfig, 
  initialSteps = [],
  modules = [],
  isSaving = false,
  onSave 
}: WorkflowConfigProps) {
  const [steps, setSteps] = useState<WorkflowConfigStep[]>(initialSteps);
  const [editingStep, setEditingStep] = useState<WorkflowConfigStep | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  
  const handleEditStep = (step: WorkflowConfigStep | null, index: number | null) => {
    setEditingStep(step);
    setEditingStepIndex(index);
  };
  
  const handleSaveStep = (step: WorkflowConfigStep) => {
    let newSteps: WorkflowConfigStep[];
    
    // If this step is marked as start, update the startStepId in the form
    const isStart = step.isStartStep;
    
    if (editingStepIndex !== null) {
      // Update existing step
      newSteps = [...steps];
      newSteps[editingStepIndex] = step;
    } else {
      // Add new step
      newSteps = [...steps, step];
    }
    
    // Ensure we have only one start step
    if (isStart) {
      newSteps.forEach((s, i) => {
        if (s.id !== step.id) {
          newSteps[i] = { ...s, isStartStep: false };
        }
      });
    }
    
    setSteps(newSteps);
    setEditingStep(null);
    setEditingStepIndex(null);
  };
  
  const onSubmit = (data: WorkflowConfigType) => {
    const updatedConfig: WorkflowConfigType = {
      ...data,
      steps,
      updatedAt: new Date().toISOString()
    };
    
    // Find the start step ID
    const startStep = steps.find(s => s.isStartStep);
    if (startStep) {
      updatedConfig.startStepId = startStep.id;
    }
    
    onSave(updatedConfig, steps);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Configuration</CardTitle>
          <CardDescription>Configure your approval workflow with steps and conditions</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {initialConfig && (
              <WorkflowConfigForm 
                initialConfig={initialConfig}
                isSaving={isSaving}
                onSubmit={onSubmit}
              />
            )}
            
            <div className="space-y-4 mt-6">
              {editingStep ? (
                <EditStepCard
                  step={editingStep}
                  editingStepIndex={editingStepIndex}
                  availableSteps={steps}
                  onSave={handleSaveStep}
                  onCancel={() => {
                    setEditingStep(null);
                    setEditingStepIndex(null);
                  }}
                />
              ) : (
                <StepList 
                  steps={steps}
                  onStepsChange={setSteps}
                  onEditStep={handleEditStep}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
