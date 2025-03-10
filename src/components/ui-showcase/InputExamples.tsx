
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const InputExamples = () => {
  return (
    <div className="grid w-full gap-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="disabled">Disabled</Label>
        <Input disabled id="disabled" placeholder="Disabled" />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="with-icon">With Icon</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="with-icon"
            placeholder="Search..."
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
};

export const inputCode = `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>

<div className="relative">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input id="with-icon" placeholder="Search..." className="pl-8" />
</div>`;
