
import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: any;
}

interface InfiniteScrollSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  filterPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  pageSize?: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onFilter?: (query: string) => void;
  filterDebounceMs?: number;
}

export function InfiniteScrollSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No options found",
  filterPlaceholder = "Search options...",
  disabled = false,
  className,
  pageSize = 15,
  isLoading = false,
  onLoadMore,
  onFilter,
  filterDebounceMs = 300,
}: InfiniteScrollSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [localFilter, setLocalFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filtering, setFiltering] = React.useState(false);
  
  // Number of items to display based on current page
  const displayCount = pageSize * page;
  const hasMore = options.length > displayCount;
  
  // Filter debouncing logic
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleFilter = React.useCallback((query: string) => {
    setLocalFilter(query);
    setFiltering(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      if (onFilter) {
        onFilter(query);
      }
      setFiltering(false);
    }, filterDebounceMs);
  }, [onFilter, filterDebounceMs]);
  
  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const handleScrollToBottom = () => {
    if (!hasMore || isLoading) return;
    
    setPage((prevPage) => prevPage + 1);
    
    if (onLoadMore) {
      onLoadMore();
    }
  };
  
  // Calculate if we should show loading when scrolled to bottom
  const showBottomLoader = isLoading && page > 1;
  
  // Determine the displayed options (paginated)
  const displayedOptions = options.slice(0, displayCount);
  
  const selectedOption = React.useMemo(() => 
    options.find(option => option.value === value),
    [options, value]
  );
  
  // Monitor scroll position and load more data when needed
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 20;
    
    if (isAtBottom && hasMore && !isLoading) {
      handleScrollToBottom();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          {isLoading && page === 1 ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder={filterPlaceholder}
              onValueChange={handleFilter}
              value={localFilter}
              className="flex-1"
            />
            {filtering && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
            )}
          </div>
          
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          
          {isLoading && page === 1 ? (
            <div className="py-6 text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <CommandList onScroll={handleScroll}>
              <ScrollArea className="h-64">
                <CommandGroup>
                  {displayedOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onValueChange?.(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                  
                  {showBottomLoader && (
                    <div className="py-2 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto opacity-50" />
                    </div>
                  )}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
