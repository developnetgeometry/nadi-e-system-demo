
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { WorkflowConfigStep, ApprovalCondition } from "@/types/workflow";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface WorkflowConfigStepFormProps {
  step: WorkflowConfigStep;
  onSave: (step: WorkflowConfigStep) => void;
  onCancel: () => void;
  availableSteps?: WorkflowConfigStep[];
  isFirstStep?: boolean;
}

const CONDITION_TYPES = [
  { label: "Amount", value: "amount" },
  { label: "Field Value", value: "field_value" },
  { label: "User Role", value: "user_role" },
  { label: "Department", value: "department" }
];

const OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Less Than", value: "less_than" },
  { label: "Contains", value: "contains" },
  { label: "Not Contains", value: "not_contains" }
];

export function WorkflowConfigStepForm({ 
  step, 
  onSave, 
  onCancel, 
  availableSteps = [], 
  isFirstStep = false 
}: WorkflowConfigStepFormProps) {
  const [formData, setFormData] = useState<WorkflowConfigStep>(step);
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [newCondition, setNewCondition] = useState<Partial<ApprovalCondition>>({
    id: "",
    type: "field_value",
    field: "",
    operator: "equals",
    value: ""
  });
  const [showConditionDialog, setShowConditionDialog] = useState(false);
  
  // Fetch roles from the database
  const { data: roles = [], isLoading } = useQuery({
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
      
      return data;
    }
  });
  
  const roleNames = roles.map(role => role.name);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSwitchChange = (name: keyof WorkflowConfigStep, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // If marking as start step, can't be end step
    if (name === 'isStartStep' && checked) {
      setFormData(prev => ({ ...prev, isEndStep: false }));
    }
    
    // If marking as end step, can't be start step and can't have next step
    if (name === 'isEndStep' && checked) {
      setFormData(prev => ({ ...prev, isStartStep: false, nextStepId: undefined }));
    }
  };
  
  const handleAddUserType = () => {
    if (selectedUserType && !formData.approverUserTypes.includes(selectedUserType)) {
      setFormData({
        ...formData,
        approverUserTypes: [...formData.approverUserTypes, selectedUserType]
      });
      setSelectedUserType("");
    }
  };
  
  const handleRemoveUserType = (type: string) => {
    setFormData({
      ...formData,
      approverUserTypes: formData.approverUserTypes.filter(t => t !== type)
    });
  };
  
  const handleAddCondition = () => {
    if (newCondition.type && newCondition.operator) {
      const condition: ApprovalCondition = {
        id: crypto.randomUUID(),
        type: newCondition.type as any,
        field: newCondition.field,
        operator: newCondition.operator as any,
        value: newCondition.value as any
      };
      
      setFormData({
        ...formData,
        conditions: [...formData.conditions, condition]
      });
      
      setNewCondition({
        id: "",
        type: "field_value",
        field: "",
        operator: "equals",
        value: ""
      });
      
      setShowConditionDialog(false);
    }
  };
  
  const handleRemoveCondition = (id: string) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter(c => c.id !== id)
    });
  };
  
  const handleConditionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewCondition({
      ...newCondition,
      [e.target.name]: e.target.value
    });
  };

  const handleConditionTypeChange = (value: string) => {
    setNewCondition({
      ...newCondition,
      type: value as any,
      // Reset field and value when switching types
      field: value === "user_role" ? undefined : "",
      value: ""
    });
  };

  const handleConditionValueChange = (value: string) => {
    setNewCondition({
      ...newCondition, 
      value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // First step must be marked as start step
  useEffect(() => {
    if (isFirstStep && !formData.isStartStep) {
      setFormData(prev => ({ ...prev, isStartStep: true }));
    }
  }, [isFirstStep]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Step Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter step name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            placeholder="Step order"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Describe this approval step"
          rows={3}
        />
      </div>
      
      <div className="space-y-4">
        <Label>Approver Roles</Label>
        <div className="flex flex-wrap gap-2">
          {formData.approverUserTypes.map(type => (
            <Badge key={type} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {type}
              <button 
                type="button" 
                onClick={() => handleRemoveUserType(type)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={selectedUserType} 
            onValueChange={setSelectedUserType}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="" disabled>Loading roles...</SelectItem>
              ) : (
                roleNames
                  .filter(role => !formData.approverUserTypes.includes(role))
                  .map(role => (
                    <SelectItem key={role} value={role}>
                      {role.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            variant="outline" 
            disabled={!selectedUserType || isLoading}
            onClick={handleAddUserType}
          >
            Add
          </Button>
        </div>
      </div>
      
      {!isFirstStep && (
        <div className="flex items-center space-x-2">
          <Switch
            id="isStartStep"
            checked={formData.isStartStep}
            onCheckedChange={(checked) => handleSwitchChange('isStartStep', checked)}
          />
          <Label htmlFor="isStartStep">This is the starting step</Label>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isEndStep"
          checked={formData.isEndStep}
          onCheckedChange={(checked) => handleSwitchChange('isEndStep', checked)}
        />
        <Label htmlFor="isEndStep">This is the end step</Label>
      </div>
      
      {!formData.isEndStep && availableSteps.length > 0 && (
        <div>
          <Label htmlFor="nextStepId">Next Step</Label>
          <Select 
            value={formData.nextStepId} 
            onValueChange={(value) => setFormData({...formData, nextStepId: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select next step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No next step (end)</SelectItem>
              {availableSteps
                .filter(s => s.id !== formData.id)
                .map(step => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Approval Conditions</Label>
          <Dialog open={showConditionDialog} onOpenChange={setShowConditionDialog}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Approval Condition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="condition-type">Condition Type</Label>
                  <Select 
                    value={newCondition.type} 
                    onValueChange={handleConditionTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newCondition.type === 'field_value' && (
                  <div>
                    <Label htmlFor="field">Field Name</Label>
                    <Input
                      id="field"
                      name="field"
                      value={newCondition.field || ''}
                      onChange={handleConditionInputChange}
                      placeholder="e.g. amount, status, department"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Select 
                    value={newCondition.operator} 
                    onValueChange={(value) => setNewCondition({...newCondition, operator: value as any})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="value">Value</Label>
                  {newCondition.type === 'user_role' ? (
                    <Select
                      value={newCondition.value?.toString() || ''}
                      onValueChange={handleConditionValueChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="" disabled>Loading roles...</SelectItem>
                        ) : (
                          roleNames.map(role => (
                            <SelectItem key={role} value={role}>
                              {role.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="value"
                      name="value"
                      value={newCondition.value?.toString() || ''}
                      onChange={handleConditionInputChange}
                      placeholder="Comparison value"
                    />
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowConditionDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddCondition}>
                    Add Condition
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {formData.conditions.length > 0 ? (
          <div className="border rounded-md divide-y">
            {formData.conditions.map(condition => (
              <div key={condition.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {CONDITION_TYPES.find(t => t.value === condition.type)?.label}
                    {condition.type === 'field_value' && condition.field ? `: ${condition.field}` : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {OPERATORS.find(o => o.value === condition.operator)?.label} {condition.value}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCondition(condition.id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No conditions set</p>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Step</Button>
      </div>
    </form>
  );
}
