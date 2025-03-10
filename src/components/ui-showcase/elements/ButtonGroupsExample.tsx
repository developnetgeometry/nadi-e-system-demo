
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ButtonGroupsExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Button Groups</h3>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <Button className="rounded-r-none">Profile</Button>
        <Button className="rounded-none border-x-0">Settings</Button>
        <Button className="rounded-l-none">Messages</Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            New
          </Button>
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="outline" className="text-red-500">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export const buttonGroupsCode = `<div className="inline-flex rounded-md shadow-sm" role="group">
  <Button className="rounded-r-none">Profile</Button>
  <Button className="rounded-none border-x-0">Settings</Button>
  <Button className="rounded-l-none">Messages</Button>
</div>

<div className="flex space-x-2">
  <Button size="sm" variant="outline">
    <Plus className="mr-1 h-4 w-4" />
    New
  </Button>
  <Button size="sm" variant="outline">Edit</Button>
  <Button size="sm" variant="outline" className="text-red-500">Delete</Button>
</div>`;
