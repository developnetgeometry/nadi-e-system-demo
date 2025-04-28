import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectManyProps {
  options: { id: string | number; label: string }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string; // Add className prop
}

export const SelectMany: React.FC<SelectManyProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className, // Add className to component props
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

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "cursor-not-allowed",
            className // Apply passed className
          )}
          disabled={disabled}
        >
          <span className="line-clamp-1">
            {value.length > 0
              ? options
                  .filter((option) => value.includes(option.id))
                  .map((option) => option.label)
                  .join(", ")
              : placeholder}
          </span>
          <div className="flex items-center space-x-2">
            {value.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the dropdown
                  handleClear();
                }}
                className="p-1 rounded-full hover:bg-muted cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Popover.Trigger>
        <Popover.Content
          className="z-50 max-h-60 w-full rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          <div
            className="max-h-48 overflow-y-auto"
            style={{ minHeight: "6rem" }} // Set a fixed minimum height
          >
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value.includes(option.id) && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleToggle(option.id)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value.includes(option.id) && <Check className="h-4 w-4" />}
                </span>
                <span className="ml-6">{option.label}</span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-2 text-sm text-muted-foreground">No options found</div>
            )}
          </div>
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};
