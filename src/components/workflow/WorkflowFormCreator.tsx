
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormField as FormFieldType, WorkflowFormConfig } from "@/types/workflow";
import { Plus, Trash2, MoveVertical, Edit, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WorkflowFormCreatorProps {
  initialFormConfig?: WorkflowFormConfig;
  onSave: (formConfig: WorkflowFormConfig) => void;
}

export function WorkflowFormCreator({ initialFormConfig, onSave }: WorkflowFormCreatorProps) {
  const [formConfig, setFormConfig] = useState<WorkflowFormConfig>(
    initialFormConfig || {
      id: crypto.randomUUID(),
      name: "Untitled Form",
      description: "",
      fields: []
    }
  );
  
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newField, setNewField] = useState<FormFieldType>({
    id: "",
    name: "",
    label: "",
    type: "text",
    required: false,
    placeholder: ""
  });

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormConfig(prev => ({ ...prev, name: e.target.value }));
  };

  const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormConfig(prev => ({ ...prev, description: e.target.value }));
  };

  const addField = () => {
    if (!newField.name || !newField.label) return;
    
    const field = {
      ...newField,
      id: crypto.randomUUID()
    };
    
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));
    
    // Reset new field form
    setNewField({
      id: "",
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: ""
    });
  };

  const updateField = () => {
    if (editingFieldIndex === null) return;
    
    const updatedFields = [...formConfig.fields];
    updatedFields[editingFieldIndex] = newField;
    
    setFormConfig(prev => ({
      ...prev,
      fields: updatedFields
    }));
    
    setEditingFieldIndex(null);
    setNewField({
      id: "",
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: ""
    });
  };

  const editField = (index: number) => {
    const field = formConfig.fields[index];
    setNewField({ ...field });
    setEditingFieldIndex(index);
  };

  const deleteField = (index: number) => {
    const updatedFields = [...formConfig.fields];
    updatedFields.splice(index, 1);
    
    setFormConfig(prev => ({
      ...prev,
      fields: updatedFields
    }));
  };

  const handleSaveForm = () => {
    if (!formConfig.name) return;
    onSave(formConfig);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-name">Form Name</Label>
            <Input
              id="form-name"
              value={formConfig.name}
              onChange={handleFormNameChange}
              placeholder="Enter form name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={formConfig.description || ""}
              onChange={handleFormDescriptionChange}
              placeholder="Enter form description"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Fields</CardTitle>
          <Button variant="outline" onClick={handleSaveForm}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">{editingFieldIndex !== null ? "Edit Field" : "Add New Field"}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  value={newField.label}
                  onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter field label"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="field-name">Field Name (ID)</Label>
                <Input
                  id="field-name"
                  value={newField.name}
                  onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter field name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="field-type">Field Type</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value: any) => setNewField(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={newField.placeholder || ""}
                  onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="Enter placeholder text"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={newField.required}
                onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: checked }))}
              />
              <Label>Required Field</Label>
            </div>
            
            <div className="flex justify-end">
              {editingFieldIndex !== null ? (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingFieldIndex(null);
                      setNewField({
                        id: "",
                        name: "",
                        label: "",
                        type: "text",
                        required: false,
                        placeholder: ""
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateField}>
                    Update Field
                  </Button>
                </div>
              ) : (
                <Button onClick={addField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              )}
            </div>
          </div>
          
          {formConfig.fields.length > 0 ? (
            <div className="border rounded-md divide-y">
              {formConfig.fields.map((field, index) => (
                <div key={field.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MoveVertical className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-xs text-gray-500">{field.name} - {field.type}</div>
                    </div>
                    {field.required && (
                      <div className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        Required
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => editField(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteField(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md">
              <p className="text-gray-500">No fields added yet</p>
              <p className="text-sm text-gray-400">Add fields to your form using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
