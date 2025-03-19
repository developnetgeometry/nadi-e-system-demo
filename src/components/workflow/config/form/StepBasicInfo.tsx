
import { useState } from "react";
import { WorkflowConfigStep } from "@/types/workflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepBasicInfoProps {
  step: WorkflowConfigStep;
  onInputChange: (field: keyof WorkflowConfigStep, value: any) => void;
  isFirstStep?: boolean;
  availableSteps: WorkflowConfigStep[];
}

export function StepBasicInfo({
  step,
  onInputChange,
  isFirstStep = false,
  availableSteps,
}: StepBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="step-name">Step Name</Label>
          <Input
            id="step-name"
            value={step.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Enter step name"
          />
        </div>
        <div>
          <Label htmlFor="step-sla">SLA Hours</Label>
          <Input
            id="step-sla"
            type="number"
            value={step.slaHours || ""}
            onChange={(e) => onInputChange("slaHours", Number(e.target.value))}
            placeholder="Enter SLA in hours"
            min="1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="step-description">Description</Label>
        <Textarea
          id="step-description"
          value={step.description || ""}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Enter step description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is-start-step"
            checked={step.isStartStep}
            onCheckedChange={(checked) => onInputChange("isStartStep", checked)}
            disabled={isFirstStep}
          />
          <Label htmlFor="is-start-step">Start Step</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is-end-step"
            checked={step.isEndStep}
            onCheckedChange={(checked) => onInputChange("isEndStep", checked)}
          />
          <Label htmlFor="is-end-step">End Step</Label>
        </div>
      </div>
      
      {!step.isEndStep && (
        <div>
          <Label htmlFor="next-step">Next Step</Label>
          <Select
            value={step.nextStepId || "none"}
            onValueChange={(value) => onInputChange("nextStepId", value === "none" ? undefined : value)}
            disabled={step.isEndStep || availableSteps.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select next step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availableSteps
                .filter(s => s.id !== step.id)
                .map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
