
import { useState, useEffect } from "react";
import { WorkflowConfigStep, ApprovalCondition, ApprovalConditionType, ApprovalOperator } from "@/types/workflow";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PlusCircle, TrashIcon } from "lucide-react";

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
  const [newCondition, setNewCondition] = useState<Partial<ApprovalCondition>>({
    type: "field_value",
    operator: "equals",
    field: "",
    value: ""
  });
  
  // Fetch roles from the roles table
  const { data: userTypes = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('name, description')
        .order('name');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      return data.map(role => ({ 
        id: role.name, // Using name as the id
        name: role.name.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: role.description
      }));
    }
  });

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
  
  const addCondition = () => {
    // Validate the condition before adding
    if (!newCondition.type) return;
    
    // Make sure value is not empty
    if (typeof newCondition.value === 'string' && !newCondition.value.trim()) {
      return;
    }
    
    const conditionToAdd: ApprovalCondition = {
      id: crypto.randomUUID(),
      type: newCondition.type as ApprovalConditionType,
      operator: newCondition.operator as ApprovalOperator,
      value: newCondition.value!,
      ...(newCondition.field && { field: newCondition.field })
    };
    
    setStepData(prev => ({
      ...prev,
      conditions: [...prev.conditions, conditionToAdd]
    }));
    
    // Reset the new condition form
    setNewCondition({
      type: "field_value",
      operator: "equals",
      field: "",
      value: ""
    });
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
  
  const getConditionText = (condition: ApprovalCondition) => {
    switch (condition.type) {
      case "amount":
        return `Amount ${condition.operator} ${condition.value}`;
      case "field_value":
        return `${condition.field} ${condition.operator} ${condition.value}`;
      case "user_role":
        return `User role ${condition.operator} ${condition.value}`;
      case "department":
        return `Department ${condition.operator} ${condition.value}`;
      case "sla":
        return `SLA ${condition.operator} ${condition.value} hours`;
      default:
        return "Unknown condition";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="step-name">Step Name</Label>
          <Input
            id="step-name"
            value={stepData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter step name"
          />
        </div>
        <div>
          <Label htmlFor="step-sla">SLA Hours</Label>
          <Input
            id="step-sla"
            type="number"
            value={stepData.slaHours || ""}
            onChange={(e) => handleInputChange("slaHours", Number(e.target.value))}
            placeholder="Enter SLA in hours"
            min="1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="step-description">Description</Label>
        <Textarea
          id="step-description"
          value={stepData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter step description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is-start-step"
            checked={stepData.isStartStep}
            onCheckedChange={(checked) => handleInputChange("isStartStep", checked)}
            disabled={isFirstStep}
          />
          <Label htmlFor="is-start-step">Start Step</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is-end-step"
            checked={stepData.isEndStep}
            onCheckedChange={(checked) => handleInputChange("isEndStep", checked)}
          />
          <Label htmlFor="is-end-step">End Step</Label>
        </div>
      </div>
      
      {!stepData.isEndStep && (
        <div>
          <Label htmlFor="next-step">Next Step</Label>
          <Select
            value={stepData.nextStepId || "none"}
            onValueChange={(value) => handleInputChange("nextStepId", value === "none" ? undefined : value)}
            disabled={stepData.isEndStep || availableSteps.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select next step" />
            </SelectTrigger>
            <SelectContent>
              {/* Using "none" instead of empty string */}
              <SelectItem value="none">None</SelectItem>
              {availableSteps
                .filter(s => s.id !== stepData.id)
                .map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-3">
        <Label>Approver User Types</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {userTypes.map((userType) => (
            <div key={userType.id} className="flex items-center space-x-2">
              <Checkbox
                id={`userType-${userType.id}`}
                checked={stepData.approverUserTypes.includes(userType.id)}
                onCheckedChange={() => handleApproverToggle(userType.id)}
              />
              <label
                htmlFor={`userType-${userType.id}`}
                className="text-sm cursor-pointer"
                title={userType.description || ""}
              >
                {userType.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Approval Conditions</Label>
        {stepData.conditions.length > 0 ? (
          <div className="space-y-2">
            {stepData.conditions.map(condition => (
              <div key={condition.id} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                <span className="text-sm">{getConditionText(condition)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(condition.id)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No conditions set</div>
        )}
        
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="condition-type">Condition Type</Label>
                <Select
                  value={newCondition.type as string || "field_value"}
                  onValueChange={(value) => setNewCondition({ ...newCondition, type: value as ApprovalConditionType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field_value">Field Value</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="user_role">User Role</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="sla">SLA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="condition-operator">Operator</Label>
                <Select
                  value={newCondition.operator as string || "equals"}
                  onValueChange={(value) => setNewCondition({ ...newCondition, operator: value as ApprovalOperator })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="not_contains">Not Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newCondition.type === "field_value" && (
                <div>
                  <Label htmlFor="condition-field">Field</Label>
                  <Input
                    id="condition-field"
                    value={newCondition.field || ""}
                    onChange={(e) => setNewCondition({ ...newCondition, field: e.target.value })}
                    placeholder="Field name"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="condition-value">
                  {newCondition.type === "sla" ? "Hours" : 
                   newCondition.type === "user_role" ? "User Type" : "Value"}
                </Label>
                {newCondition.type === "user_role" ? (
                  <Select
                    value={String(newCondition.value || "")}
                    onValueChange={(value) => setNewCondition({ ...newCondition, value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((userType) => (
                        <SelectItem key={userType.id} value={userType.id}>
                          {userType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="condition-value"
                    value={String(newCondition.value || "")}
                    onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                    placeholder={newCondition.type === "sla" ? "Hours" : "Value"}
                    type={newCondition.type === "amount" || newCondition.type === "sla" ? "number" : "text"}
                  />
                )}
              </div>
            </div>
            
            <Button
              type="button"
              onClick={addCondition}
              className="mt-3"
              variant="outline"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Step</Button>
      </div>
    </div>
  );
}
