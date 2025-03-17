
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkflowStep } from "@/types/workflow";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, Clock, User, FileText } from "lucide-react";
import { formatDuration } from "@/utils/date-utils";

interface WorkflowStepCardProps {
  step: WorkflowStep;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkflowStepCard = ({
  step,
  index,
  onEdit,
  onDelete,
}: WorkflowStepCardProps) => {
  const getStepTypeIcon = () => {
    switch (step.type) {
      case "approval":
        return <User className="h-4 w-4 mr-1.5" />;
      case "form":
        return <FileText className="h-4 w-4 mr-1.5" />;
      case "notification":
        return <Bell className="h-4 w-4 mr-1.5" />;
      case "delay":
        return <Clock className="h-4 w-4 mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-medium">
            {index + 1}
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-base">{step.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center">
                    {getStepTypeIcon()}
                    {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                  </Badge>
                  
                  {step.estimatedDuration && (
                    <Badge variant="secondary" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(step.estimatedDuration)}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="h-8 w-8 flex items-center justify-center cursor-move">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            {step.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {step.description}
              </p>
            )}
            
            {step.assignedTo && step.assignedTo.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">Assigned to:</div>
                <div className="flex flex-wrap gap-2">
                  {step.assignedTo.map((assignee) => (
                    <Badge key={assignee.id} variant="secondary" className="text-xs">
                      {assignee.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
