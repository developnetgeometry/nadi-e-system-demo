
import { useState, useRef, useEffect } from "react";
import { Workflow, WorkflowStep } from "@/types/workflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowStepCard } from "./WorkflowStepCard";
import { WorkflowStepForm } from "./WorkflowStepForm";
import {
  Plus,
  Save,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "../ui/empty-state";

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
}

export const WorkflowBuilder = ({ workflow, onSave }: WorkflowBuilderProps) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(
    workflow || {
      id: crypto.randomUUID(),
      name: "Untitled Workflow",
      description: "",
      status: "draft",
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedUsers: [],
      completedInstances: 0,
      activeInstances: 0,
    }
  );

  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workflow) {
      setCurrentWorkflow(workflow);
    }
  }, [workflow]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWorkflow((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentWorkflow((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setEditingStepIndex(null);
    setShowForm(true);
  };

  const handleEditStep = (step: WorkflowStep, index: number) => {
    setEditingStep(step);
    setEditingStepIndex(index);
    setShowForm(true);
  };

  const handleDeleteStep = (index: number) => {
    const newSteps = [...currentWorkflow.steps];
    newSteps.splice(index, 1);
    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: newSteps,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSaveStep = (step: WorkflowStep) => {
    let newSteps;
    
    if (editingStepIndex !== null) {
      // Update existing step
      newSteps = [...currentWorkflow.steps];
      newSteps[editingStepIndex] = step;
    } else {
      // Add new step
      newSteps = [...currentWorkflow.steps, step];
    }
    
    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: newSteps,
      updatedAt: new Date().toISOString(),
    }));
    
    setShowForm(false);
    setEditingStep(null);
    setEditingStepIndex(null);
  };

  const handleCancelStep = () => {
    setShowForm(false);
    setEditingStep(null);
    setEditingStepIndex(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newSteps = Array.from(currentWorkflow.steps);
    const [reorderedStep] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedStep);
    
    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: newSteps,
      updatedAt: new Date().toISOString(),
    }));
  };

  const validateWorkflow = (): boolean => {
    const newErrors: string[] = [];
    
    if (!currentWorkflow.name.trim()) {
      newErrors.push("Workflow name is required");
    }
    
    if (currentWorkflow.steps.length === 0) {
      newErrors.push("Workflow must have at least one step");
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveWorkflow = () => {
    if (validateWorkflow()) {
      onSave(currentWorkflow);
    }
  };

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Workflow Name
              </label>
              <Input
                value={currentWorkflow.name}
                onChange={handleNameChange}
                placeholder="Enter workflow name"
                className="text-lg font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <Textarea
                value={currentWorkflow.description}
                onChange={handleDescriptionChange}
                placeholder="Enter workflow description"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Steps</h3>
        <Button onClick={handleAddStep} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Step
        </Button>
      </div>

      {showForm ? (
        <Card className="border-2 border-primary/20 shadow-lg animate-in fade-in">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingStep ? "Edit Step" : "Add New Step"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelStep}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <WorkflowStepForm
              step={editingStep}
              onSave={handleSaveStep}
              onCancel={handleCancelStep}
            />
          </CardContent>
        </Card>
      ) : (
        <div ref={stepsContainerRef} className="space-y-4 min-h-[300px]">
          {currentWorkflow.steps.length === 0 ? (
            <EmptyState
              title="No steps defined"
              description="Start building your workflow by adding steps"
              icon={<ChevronRight className="h-12 w-12 text-gray-300" />}
              action={
                <Button onClick={handleAddStep}>Add First Step</Button>
              }
            />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="workflow-steps">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {currentWorkflow.steps.map((step, index) => (
                      <Draggable
                        key={step.id}
                        draggableId={step.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <WorkflowStepCard
                              step={step}
                              index={index}
                              onEdit={() => handleEditStep(step, index)}
                              onDelete={() => handleDeleteStep(index)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveWorkflow}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>
    </div>
  );
};
