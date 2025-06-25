import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteProfile {
  id: number;
  sitename: string;
  fullname?: string;
  refid_mcmc?: string;
  isDisabled?: boolean;
}

interface SiteSelectProps {
  data: SiteProfile[];
  disabledItems?: number[];
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  allowDisabledSelection?: boolean; // For edit mode
  itemsPerPage?: number;
  searchPlaceholder?: string;
  disabledLabel?: string; // Customizable label for disabled items
}

export const SiteSelect: React.FC<SiteSelectProps> = ({
  data,
  disabledItems = [],
  value,
  onChange,
  disabled = false,
  isLoading = false,
  placeholder = "Select a site",
  className,
  showClearButton = true,
  allowDisabledSelection = false,
  itemsPerPage = 50,
  searchPlaceholder = "Search sites...",
  disabledLabel = "Disabled"
}) => {  // Local state for search and pagination
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search input for better performance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Add disabled status to profiles
  const profilesWithStatus = useMemo(() => {
    return data.map(profile => ({
      ...profile,
      isDisabled: disabledItems.includes(profile.id)
    }));
  }, [data, disabledItems]);

  // Filter profiles based on search (using debounced value)
  const filteredProfiles = useMemo(() => {
    if (!debouncedSearchValue) return profilesWithStatus;
    const searchLower = debouncedSearchValue.toLowerCase();
    return profilesWithStatus.filter(profile =>
      profile.sitename.toLowerCase().includes(searchLower) ||
      (profile.fullname && profile.fullname.toLowerCase().includes(searchLower)) ||
      (profile.refid_mcmc && profile.refid_mcmc.toLowerCase().includes(searchLower))
    );
  }, [profilesWithStatus, debouncedSearchValue]);

  // Get displayed profiles with pagination for performance
  const displayedProfiles = useMemo(() => {
    return filteredProfiles.slice(0, displayedCount);
  }, [filteredProfiles, displayedCount]);

  // Load more function
  const loadMore = useCallback(() => {
    if (displayedCount < filteredProfiles.length && !isLoadingMore) {
      setIsLoadingMore(true);
      // Add a small delay to simulate loading and prevent rapid firing
      setTimeout(() => {
        setDisplayedCount(prev => Math.min(prev + itemsPerPage, filteredProfiles.length));
        setIsLoadingMore(false);
      }, 150);
    }
  }, [filteredProfiles.length, itemsPerPage, displayedCount, isLoadingMore]);

  // Handle scroll events for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Load more when user scrolls to within 50px of the bottom
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (nearBottom && displayedCount < filteredProfiles.length && !isLoadingMore) {
      loadMore();
    }
  }, [loadMore, displayedCount, filteredProfiles.length, isLoadingMore]);  
  
  // Reset displayed count when search changes
  React.useEffect(() => {
    setDisplayedCount(itemsPerPage);
    setIsLoadingMore(false);
  }, [debouncedSearchValue, itemsPerPage]);

  // Reset to initial state when dropdown opens/closes
  React.useEffect(() => {
    if (!open) {
      // Reset when dropdown closes
      setSearchValue("");
      setDebouncedSearchValue("");
      setDisplayedCount(itemsPerPage);
      setIsLoadingMore(false);
    }
  }, [open, itemsPerPage]);

  // Get the display text for the selected value
  const getDisplayText = () => {
    if (value) {
      const selectedProfile = profilesWithStatus.find(profile => profile.id === value);
      return selectedProfile 
        ? `${selectedProfile.sitename} ${selectedProfile.fullname ? `(${selectedProfile.fullname})` : ''}`
        : placeholder;
    }
    return isLoading ? "Loading sites..." : placeholder;
  };
  // Handle selection
  const handleSelect = (profileId: number, profile: SiteProfile) => {
    const isDisabled = !allowDisabledSelection && profile.isDisabled;
    if (!isDisabled) {
      onChange(profileId);
      setOpen(false);
      setSearchValue("");
      setDebouncedSearchValue("");
    }
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-300 focus:ring-0"
            disabled={disabled || isLoading}
          >
            {getDisplayText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            
            {/* Loading indicator during search */}
            {searchValue !== debouncedSearchValue && (
              <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Searching...
              </div>
            )}
            
            <CommandEmpty>
              {searchValue !== debouncedSearchValue ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Searching...
                </div>
              ) : (
                "No sites found."
              )}
            </CommandEmpty>
            
            <CommandGroup 
              ref={scrollContainerRef}
              className="max-h-64 overflow-auto" 
              onScroll={handleScroll}
            >
              {displayedProfiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={`${profile.sitename} ${profile.fullname || ''} ${profile.refid_mcmc || ''}`}
                  onSelect={() => handleSelect(profile.id, profile)}                  
                  className={cn(
                    "cursor-pointer",
                    (!allowDisabledSelection && profile.isDisabled) && "opacity-50 cursor-not-allowed bg-gray-50",
                    value === profile.id && "bg-accent"
                  )}
                  disabled={!allowDisabledSelection && profile.isDisabled}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === profile.id ? "opacity-100" : "opacity-0"
                          )}
                        />                        
                        <span className={cn(
                          "font-medium",
                          (!allowDisabledSelection && profile.isDisabled) && "text-gray-400"
                        )}>
                          {profile.sitename}
                        </span>
                        {profile.fullname && (
                          <span className={cn(
                            "text-sm text-gray-500",
                            (!allowDisabledSelection && profile.isDisabled) && "text-gray-300"
                          )}>
                            ({profile.fullname})
                          </span>
                        )}
                      </div>
                      {profile.refid_mcmc && (
                        <span className={cn(
                          "text-xs text-gray-400 ml-6",
                          (!allowDisabledSelection && profile.isDisabled) && "text-gray-300"
                        )}>
                          RefID: {profile.refid_mcmc}
                        </span>
                      )}
                    </div>
                    
                    {/* Show disabled status indicator */}
                    {(!allowDisabledSelection && profile.isDisabled) && (
                      <span className="text-xs text-red-500 font-medium">
                        {disabledLabel}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}              
              
              {/* Loading More Indicator */}
              {isLoadingMore && (
                <div className="border-t border-gray-200 p-2">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading more sites...
                  </div>
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Clear button */}
      {showClearButton && value && !disabled && (
        <button
          type="button"
          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};
