import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectManyProps {
  options: { id: string | number; label: string }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectMany: React.FC<SelectManyProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleToggle = (id: string | number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const handleClear = () => {
    onChange([]);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );
  
  // Selected labels for display
  const selectedLabels = options
    .filter((option) => value.includes(option.id))
    .map((option) => option.label);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            disabled && "cursor-not-allowed",
            open && "border-primary",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 items-center max-w-[90%] overflow-hidden">
            {value.length > 0 ? (
              selectedLabels.map((label, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {value.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 rounded-full hover:bg-muted cursor-pointer transition-colors"
                aria-label="Clear selection"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "transform rotate-180")} />
          </div>
        </Popover.Trigger>
        <Popover.Content
          className="z-50 w-[--radix-popover-trigger-width] rounded-md border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search options..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md bg-transparent pl-8 py-1.5 text-sm ring-offset-background focus:outline-none placeholder:text-muted-foreground/70"
                autoComplete="off"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-muted cursor-pointer"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          <div
            className="max-h-56 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center py-1.5 px-3 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    value.includes(option.id) ? "bg-accent/50 text-accent-foreground" : ""
                  )}
                  onClick={() => handleToggle(option.id)}
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-2 rounded-sm border border-primary/30 bg-background">
                    {value.includes(option.id) && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                No options found
              </div>
            )}
          </div>
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};
