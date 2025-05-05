import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  icon,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "min-h-10 w-full justify-between pr-2",
              selected.length > 0 && "border-primary/30 bg-primary/5",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center truncate">
              {icon && <span className="mr-2 shrink-0 text-muted-foreground">{icon}</span>}
              {selected.length > 0 ? (
                <div className="flex flex-wrap gap-1 items-center max-w-[180px] overflow-hidden">
                  {selected.length <= 2 ? (
                    selected.map((value) => (
                      <Badge key={value} variant="secondary" className="mr-1 truncate max-w-[100px]">
                        {options.find((option) => option.value === value)?.label || value}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="font-medium">
                      {selected.length} selected
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center">
              {selected.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 px-1 mr-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 shadow-lg shadow-primary/10 border-primary/20">
          <Command>
            <CommandInput placeholder="Search options..." className="h-9" />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                      selected.includes(option.value) 
                        ? "bg-primary border-primary" 
                        : "opacity-50"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}