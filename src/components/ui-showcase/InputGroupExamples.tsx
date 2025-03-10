
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const InputGroupExamples = () => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label htmlFor="firstname">First name</Label>
          <Input id="firstname" placeholder="First name" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="lastname">Last name</Label>
          <Input id="lastname" placeholder="Last name" />
        </div>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input placeholder="Search..." />
        <Button type="submit">Search</Button>
      </div>
    </div>
  );
};

export const inputGroupCode = `<div className="grid grid-cols-2 gap-2">
  <div className="grid gap-1">
    <Label htmlFor="firstname">First name</Label>
    <Input id="firstname" placeholder="First name" />
  </div>
  <div className="grid gap-1">
    <Label htmlFor="lastname">Last name</Label>
    <Input id="lastname" placeholder="Last name" />
  </div>
</div>

<div className="flex w-full max-w-sm items-center space-x-2">
  <Input placeholder="Search..." />
  <Button type="submit">Search</Button>
</div>`;
