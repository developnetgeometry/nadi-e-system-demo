
import { WorkflowConfigStep } from "@/types/workflow";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, ArrowRight, Clock } from "lucide-react";

interface StepCardProps {
  step: WorkflowConfigStep;
  index: number;
  steps: WorkflowConfigStep[];
  onEdit: (step: WorkflowConfigStep, index: number) => void;
  onDelete: (index: number) => void;
}

export function StepCard({ 
  step, 
  index, 
  steps,
  onEdit,
  onDelete 
}: StepCardProps) {
  return (
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
                onClick={() => onEdit(step, index)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
