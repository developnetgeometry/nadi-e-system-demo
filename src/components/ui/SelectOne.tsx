import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOneProps {
  options: { id: string | number; label: string }[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchThreshold?: number;
}

export const SelectOne: React.FC<SelectOneProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  searchThreshold = 7,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Determine if search should be shown based on options length
  const showSearch = options.length > searchThreshold;

  const handleSelect = (id: string | number) => {
    // If selected value is clicked again, don't deselect
    if (value !== id) {
      onChange(id);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Always set to null when clearing
    onChange(null);
  };

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Get the label of the selected option
  const selectedLabel = React.useMemo(() => {
    if (value === null || value === undefined || value === '') return null;
    return options.find(option => option.id === value)?.label;
  }, [options, value]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Popover.Trigger
          ref={triggerRef}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-ring hover:shadow-sm focus:shadow-md",
            disabled && "cursor-not-allowed",
            open && "border-ring shadow-sm",
            className
          )}
          disabled={disabled}
        >
          <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedLabel ? (
              <span>{selectedLabel}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {value !== null && value !== '' && value !== undefined && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-accent/20 cursor-pointer transition-colors"
                aria-label="Clear selection"
              >
                <X className="text-muted-foreground" size={16} />
              </button>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-70 transition-transform duration-200",
                open && "transform rotate-180"
              )}
            />
          </div>
        </Popover.Trigger>
        <Popover.Content
          className="z-50 w-[--radix-popover-trigger-width] rounded-md border bg-popover/95 text-popover-foreground shadow-lg backdrop-blur-sm overflow-hidden animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions
        >
          {/* Search bar - only shown when options exceed threshold */}
          {showSearch && (
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-accent/20 cursor-pointer"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center py-1.5 px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
                    value === option.id
                      ? "bg-accent/20 font-medium"
                      : ""
                  )}
                  onClick={() => handleSelect(option.id)}
                >
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    {value === option.id && (
                      <Check className="h-4 w-4 text-primary" />
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
