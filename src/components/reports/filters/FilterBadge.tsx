import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FilterBadgeProps = {
  label: string;
  value: string;
  onClear: () => void;
  className?: string;
};

export const FilterBadge = ({
  label,
  value,
  onClear,
  className
}: FilterBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={`gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50 ${className || ''}`}
    >
      <span className="font-medium">
        {label}: {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};
