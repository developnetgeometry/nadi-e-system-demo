
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowStep } from "@/types/workflow";

interface WorkflowStepFormProps {
  step: WorkflowStep | null;
  onSave: (step: WorkflowStep) => void;
  onCancel: () => void;
}

export const WorkflowStepForm = ({
  step,
  onSave,
  onCancel,
}: WorkflowStepFormProps) => {
  const [formState, setFormState] = useState<WorkflowStep>(
    step || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      type: "approval",
      estimatedDuration: 0,
      requiredFields: [],
      assignedTo: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Step Name
          </label>
          <Input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Enter step name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Step Type
          </label>
          <Select
            value={formState.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select step type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="form">Form Submission</SelectItem>
              <SelectItem value="notification">Notification</SelectItem>
              <SelectItem value="delay">Time Delay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter step description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="estimatedDuration" className="text-sm font-medium">
          Estimated Duration (hours)
        </label>
        <Input
          id="estimatedDuration"
          name="estimatedDuration"
          type="number"
          min="0"
          step="0.5"
          value={formState.estimatedDuration}
          onChange={(e) => handleChange({
            ...e,
            target: {
              ...e.target,
              value: parseFloat(e.target.value) || 0,
              name: "estimatedDuration"
            }
          })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Step</Button>
      </div>
    </form>
  );
};
