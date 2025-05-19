import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterPopoverProps = {
  isActive: boolean;
  icon: LucideIcon;
  label: string;
  value?: string | number;
  children: ReactNode;
  className?: string;
};

export const FilterPopover = ({
  isActive,
  icon: Icon,
  label,
  value,
  children,
  className
}: FilterPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className={cn(
            "flex items-center gap-2 h-10",
            isActive && "bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-200",
            className
          )}
        >
          <Icon className={cn("h-4 w-4", isActive ? "text-purple-600" : "text-gray-500")} />
          {label} {value && `(${value})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        {children}
      </PopoverContent>
    </Popover>
  );
};
