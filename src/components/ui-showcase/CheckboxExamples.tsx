
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const CheckboxExamples = () => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="checked-disabled" disabled defaultChecked />
        <Label htmlFor="checked-disabled" className="text-muted-foreground">
          Disabled checked
        </Label>
      </div>
    </div>
  );
};

export const checkboxCode = `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`;
