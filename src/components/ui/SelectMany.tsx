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
  searchThreshold?: number;
}

export const SelectMany: React.FC<SelectManyProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className,
  searchThreshold = 7,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [visibleLabels, setVisibleLabels] = React.useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const controlsRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Determine if search should be shown based on options length
  const showSearch = options.length > searchThreshold;

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

  const handleRemoveItem = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the popover toggle
    onChange(value.filter((v) => v !== id));
  };

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Selected labels for display
  const selectedLabels = options
    .filter((option) => value.includes(option.id))
    .map((option) => option.label);

  // Calculate visible labels based on available space
  React.useEffect(() => {
    if (!containerRef.current || selectedLabels.length === 0) {
      setVisibleLabels(selectedLabels.length);
      return;
    }

    const calculateVisibleLabels = () => {
      const triggerWidth = triggerRef.current?.offsetWidth || 0;
      const controlsWidth = controlsRef.current?.offsetWidth || 0;

      // Account for paddings, gaps, and leave 30% of space as buffer
      const totalAvailableWidth = triggerWidth - controlsWidth - 24;
      const effectiveWidth = totalAvailableWidth * 0.7; // Use only 70% of available space

      // Create temporary elements to measure each label's width
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.display = "flex";
      tempContainer.style.flexWrap = "nowrap";
      tempContainer.style.gap = "4px";
      document.body.appendChild(tempContainer);

      // Measure each label with the X button
      const labelWidths: number[] = [];
      for (const label of selectedLabels) {
        const labelEl = document.createElement("span");
        labelEl.className =
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground";

        // Add text span and X button to accurately measure full width
        const textSpan = document.createElement("span");
        textSpan.textContent = label;
        labelEl.appendChild(textSpan);

        const xButton = document.createElement("button");
        xButton.className = "ml-1 p-0.5 rounded-full";
        xButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        labelEl.appendChild(xButton);

        tempContainer.appendChild(labelEl);
        labelWidths.push(labelEl.offsetWidth);
        tempContainer.removeChild(labelEl);
      }

      // Measure +X more indicator
      const moreEl = document.createElement("span");
      moreEl.className =
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground";
      moreEl.textContent = "+2 more";
      tempContainer.appendChild(moreEl);
      const moreWidth = moreEl.offsetWidth;
      tempContainer.removeChild(moreEl);
      document.body.removeChild(tempContainer);

      // Calculate how many labels can fit
      let totalWidth = 0;
      let visibleCount = 0;

      // If we have multiple items, always reserve space for "+X more" indicator
      // unless all items can fit
      if (selectedLabels.length > 1) {
        // Try to fill available width
        for (let i = 0; i < selectedLabels.length; i++) {
          // If this is the last item and we can fit all, add it
          if (
            i === selectedLabels.length - 1 &&
            totalWidth + labelWidths[i] <= effectiveWidth
          ) {
            visibleCount = selectedLabels.length;
            break;
          }

          // Otherwise, check if we can fit this item plus the "+X more" indicator
          // for the remaining items
          if (totalWidth + labelWidths[i] + moreWidth <= effectiveWidth) {
            totalWidth += labelWidths[i] + 4; // 4px for gap
            visibleCount++;
          } else {
            // Can't fit more items
            break;
          }
        }

        // If not all items could fit, make room for the "+X more" indicator
        // by removing one visible item if necessary
        if (visibleCount < selectedLabels.length && visibleCount > 0) {
          // Check if we need to remove an item to fit the "+X more" indicator
          if (totalWidth + moreWidth > effectiveWidth) {
            visibleCount--;
          }
        }
      } else {
        // If there's only one item, just show it if it fits
        visibleCount = labelWidths[0] <= effectiveWidth ? 1 : 0;
      }

      return Math.max(visibleCount, 0);
    };

    const updateVisibleLabels = () => {
      setVisibleLabels(calculateVisibleLabels());
    };

    // Initial calculation
    updateVisibleLabels();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateVisibleLabels();
    });

    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedLabels, open]);

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
          <div
            ref={containerRef}
            className="flex flex-wrap gap-1 items-center overflow-hidden"
          >
            {value.length > 0 ? (
              <>
                {selectedLabels.slice(0, visibleLabels).map((label, i) => {
                  const itemId = options.find((opt) => opt.label === label)?.id;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground group relative"
                    >
                      <span>{label}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) =>
                            itemId && handleRemoveItem(itemId, e)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 p-0.5 rounded-full hover:bg-accent/90"
                          aria-label={`Remove ${label}`}
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </span>
                  );
                })}
                {visibleLabels < selectedLabels.length && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                    +{selectedLabels.length - visibleLabels} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div
            ref={controlsRef}
            className="flex items-center space-x-1 flex-shrink-0 ml-2"
          >
            {value.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 rounded-full hover:bg-accent/20 cursor-pointer transition-colors"
                aria-label="Clear selection"
              >
                <X className="text-muted-foreground" size={16}/>
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
                    value.includes(option.id)
                      ? "bg-accent/20 font-medium"
                      : ""
                  )}
                  onClick={() => handleToggle(option.id)}
                >
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    {value.includes(option.id) && (
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
