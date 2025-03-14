
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const SwitchExamples = () => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="checked-disabled" disabled defaultChecked />
        <Label
          htmlFor="checked-disabled"
          className="text-muted-foreground"
        >
          Disabled checked
        </Label>
      </div>
    </div>
  );
};

export const switchCode = `<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`;
