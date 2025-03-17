
import { WorkflowConfigStep } from "@/types/workflow";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { StepCard } from "./StepCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface StepListProps {
  steps: WorkflowConfigStep[];
  onStepsChange: (steps: WorkflowConfigStep[]) => void;
  onEditStep: (step: WorkflowConfigStep | null, index: number | null) => void;
}

export function StepList({ 
  steps, 
  onStepsChange,
  onEditStep
}: StepListProps) {
  const handleAddStep = () => {
    onEditStep({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: steps.length,
      approverUserTypes: [],
      conditions: [],
      isStartStep: steps.length === 0,
      isEndStep: false,
      slaHours: 24 // Default 24 hours SLA per step
    }, null);
  };
  
  const handleEditStep = (step: WorkflowConfigStep, index: number) => {
    onEditStep({ ...step }, index);
  };
  
  const handleDeleteStep = (index: number) => {
    const newSteps = [...steps];
    const deletedStep = newSteps.splice(index, 1)[0];
    
    // If we're deleting the start step, set the next one as start if available
    if (deletedStep.isStartStep && newSteps.length > 0) {
      newSteps[0].isStartStep = true;
    }
    
    // Reorder remaining steps
    newSteps.forEach((step, i) => {
      step.order = i;
    });
    
    onStepsChange(newSteps);
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedSteps = Array.from(steps);
    const [removed] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, removed);
    
    // Update order values
    const updatedSteps = reorderedSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    
    onStepsChange(updatedSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Approval Steps</h3>
        <Button type="button" variant="outline" onClick={handleAddStep}>
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </div>
      
      {steps.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {steps.map((step, index) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={index}
                    steps={steps}
                    onEdit={handleEditStep}
                    onDelete={handleDeleteStep}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="border border-dashed rounded-lg p-6 text-center">
          <p className="text-gray-500">No steps configured. Add your first approval step.</p>
        </div>
      )}
    </div>
  );
}
