
import { useState } from "react";
import { WorkflowConfigStep, ApprovalCondition } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { StepBasicInfo } from "./StepBasicInfo";
import { ApproverUserTypes } from "./ApproverUserTypes";
import { ApprovalConditions } from "./ApprovalConditions";

interface WorkflowConfigStepFormProps {
  step: WorkflowConfigStep;
  onSave: (step: WorkflowConfigStep) => void;
  onCancel: () => void;
  isFirstStep?: boolean;
  availableSteps: WorkflowConfigStep[];
}

export function WorkflowConfigStepForm({
  step,
  onSave,
  onCancel,
  isFirstStep = false,
  availableSteps,
}: WorkflowConfigStepFormProps) {
  const [stepData, setStepData] = useState<WorkflowConfigStep>(step);

  const handleInputChange = (field: keyof WorkflowConfigStep, value: any) => {
    setStepData(prev => ({ ...prev, [field]: value }));
    
    // Special handling for isStartStep
    if (field === "isStartStep" && value === true) {
      setStepData(prev => ({ ...prev, isStartStep: true }));
    }
    
    // If isEndStep is set to true, clear the nextStepId
    if (field === "isEndStep" && value === true) {
      setStepData(prev => ({ ...prev, nextStepId: undefined }));
    }
  };
  
  const handleApproverToggle = (userTypeId: string) => {
    const isSelected = stepData.approverUserTypes.includes(userTypeId);
    
    const updatedApprovers = isSelected
      ? stepData.approverUserTypes.filter(id => id !== userTypeId)
      : [...stepData.approverUserTypes, userTypeId];
    
    setStepData(prev => ({
      ...prev,
      approverUserTypes: updatedApprovers
    }));
  };
  
  const addCondition = (condition: ApprovalCondition) => {
    setStepData(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition]
    }));
  };
  
  const removeCondition = (id: string) => {
    setStepData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== id)
    }));
  };
  
  const handleSave = () => {
    onSave(stepData);
  };
  
  return (
    <div className="space-y-4">
      <StepBasicInfo
        step={stepData}
        onInputChange={handleInputChange}
        isFirstStep={isFirstStep}
        availableSteps={availableSteps}
      />
      
      <ApproverUserTypes
        selectedUserTypes={stepData.approverUserTypes}
        onToggle={handleApproverToggle}
      />
      
      <ApprovalConditions
        conditions={stepData.conditions}
        onAddCondition={addCondition}
        onRemoveCondition={removeCondition}
      />
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Step</Button>
      </div>
    </div>
  );
}
