
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldDefinition } from "./types";

interface AddDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldDefinition[];
  formData: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const AddDialog = ({
  title,
  open,
  onOpenChange,
  fields,
  formData,
  onInputChange,
  onSubmit,
}: AddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={`add-${field.name}`}>{field.label}</Label>
              <Input
                id={`add-${field.name}`}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={onInputChange}
                required={field.required}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
