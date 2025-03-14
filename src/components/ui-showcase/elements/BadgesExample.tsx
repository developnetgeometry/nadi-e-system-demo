
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const BadgesExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Badges</h3>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        
        <Badge className="gap-1">
          <Check className="h-3.5 w-3.5" />
          Completed
        </Badge>
      </div>
    </div>
  );
};

export const badgesCode = `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

<Badge className="gap-1">
  <Check className="h-3.5 w-3.5" />
  Completed
</Badge>`;
