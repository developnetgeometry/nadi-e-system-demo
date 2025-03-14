
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ButtonExamples = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button>
        <ArrowRight className="mr-2 h-4 w-4" /> With Icon
      </Button>
    </div>
  );
};

export const buttonCode = `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button disabled>Disabled</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button>
  <ArrowRight className="mr-2 h-4 w-4" /> With Icon
</Button>`;
