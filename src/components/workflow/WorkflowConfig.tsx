
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { 
  WorkflowConfig as WorkflowConfigType, 
  WorkflowConfigStep 
} from "@/types/workflow";
import { 
  DragDropContext, 
  Droppable, 
  Draggable 
} from "react-beautiful-dnd";
import { Plus, Save, Trash2, GripVertical, ArrowRight, Clock } from "lucide-react";
import { WorkflowConfigStepForm } from "./WorkflowConfigStepForm";
import { Badge } from "@/components/ui/badge";

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
  
  const form = useForm<WorkflowConfigType>({
    defaultValues: initialConfig || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startStepId: '',
      steps: [],
      slaHours: 48, // Default 48 hours SLA
    }
  });
  
  const handleAddStep = () => {
    setEditingStep({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: steps.length,
      approverUserTypes: [],
      conditions: [],
      isStartStep: steps.length === 0,
      isEndStep: false,
      slaHours: 24 // Default 24 hours SLA per step
    });
    setEditingStepIndex(null);
  };
  
  const handleEditStep = (step: WorkflowConfigStep, index: number) => {
    setEditingStep({ ...step });
    setEditingStepIndex(index);
  };
  
  const handleDeleteStep = (index: number) => {
    const newSteps = [...steps];
    const deletedStep = newSteps.splice(index, 1)[0];
    
    // If we're deleting the start step, set the next one as start if available
    if (deletedStep.isStartStep && newSteps.length > 0) {
      newSteps[0].isStartStep = true;
      form.setValue('startStepId', newSteps[0].id);
    }
    
    // Reorder remaining steps
    newSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(newSteps);
  };
  
  const handleSaveStep = (step: WorkflowConfigStep) => {
    let newSteps: WorkflowConfigStep[];
    
    // If this step is marked as start, unmark any other start step
    if (step.isStartStep) {
      form.setValue('startStepId', step.id);
    }
    
    if (editingStepIndex !== null) {
      // Update existing step
      newSteps = [...steps];
      newSteps[editingStepIndex] = step;
    } else {
      // Add new step
      newSteps = [...steps, step];
    }
    
    // Ensure we have only one start step
    if (step.isStartStep) {
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
    
    setSteps(updatedSteps);
  };
  
  const onSubmit = (data: WorkflowConfigType) => {
    const updatedConfig: WorkflowConfigType = {
      ...data,
      steps,
      updatedAt: new Date().toISOString()
    };
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workflow title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slaHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall SLA (Hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="Enter SLA in hours"
                          min="1"
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum time to complete the entire workflow
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe the purpose of this workflow" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this workflow
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Approval Steps</h3>
                  <Button type="button" variant="outline" onClick={handleAddStep}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Step
                  </Button>
                </div>
                
                {editingStep ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingStepIndex !== null ? "Edit Step" : "Add Step"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WorkflowConfigStepForm 
                        step={editingStep} 
                        onSave={handleSaveStep} 
                        onCancel={() => {
                          setEditingStep(null);
                          setEditingStepIndex(null);
                        }}
                        isFirstStep={steps.length === 0 || (editingStepIndex !== null && steps[editingStepIndex].isStartStep)}
                        availableSteps={steps}
                      />
                    </CardContent>
                  </Card>
                ) : steps.length > 0 ? (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          {steps.map((step, index) => (
                            <Draggable key={step.id} draggableId={step.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border rounded-md p-4 bg-white dark:bg-gray-800"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <h4 className="font-medium">{step.name}</h4>
                                          <div className="flex gap-1">
                                            {step.isStartStep && (
                                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Start</Badge>
                                            )}
                                            {step.isEndStep && (
                                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">End</Badge>
                                            )}
                                            {step.slaHours && (
                                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {step.slaHours}h
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                        {step.approverUserTypes.length > 0 && (
                                          <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">Approvers:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {step.approverUserTypes.map((type) => (
                                                <Badge key={type} variant="secondary" className="text-xs">
                                                  {type}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {step.nextStepId && (
                                          <div className="mt-2 flex items-center space-x-1 text-sm text-gray-500">
                                            <span>Next:</span>
                                            <ArrowRight className="h-3 w-3" />
                                            <span>{steps.find(s => s.id === step.nextStepId)?.name || "Unknown"}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditStep(step, index)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteStep(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
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
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={steps.length === 0 || isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Workflow Configuration'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
