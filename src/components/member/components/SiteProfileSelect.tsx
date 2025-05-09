
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { SiteProfile } from "../hook/useSiteProfile";

interface SiteProfileSelectProps {
  profiles: SiteProfile[];
  value: number | null;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export function SiteProfileSelect({
  profiles = [], // Default empty array
  value,
  onValueChange,
  disabled = false,
}: SiteProfileSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");

  // Ensure profiles is always an array
  const safeProfiles = Array.isArray(profiles) ? profiles : [];

  // Find the selected profile
  const selectedProfile = React.useMemo(
    () => safeProfiles.find((profile) => profile.id === value),
    [safeProfiles, value]
  );

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Filter profiles based on debounced search query
  const filteredProfiles = React.useMemo(() => {
    const query = debouncedSearchQuery ? debouncedSearchQuery.toLowerCase() : "";
    
    if (!query) return safeProfiles.slice(0, 8); // Limit to 8 items when not searching
    
    return safeProfiles.filter(
      (profile) =>
        profile.id.toString().includes(query) ||
        (profile.sitename?.toLowerCase().includes(query) ?? false) ||
        (profile.fullname?.toLowerCase().includes(query) ?? false) ||
        (profile.standard_code?.toLowerCase().includes(query) ?? false)
    ).slice(0, 8); // Limit to 8 items
  }, [safeProfiles, debouncedSearchQuery]);

  // Handle search query changes safely
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value || "");
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedProfile
            ? `${selectedProfile.sitename || ''} - ${selectedProfile.fullname || ''}`
            : "Select NADI site..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false} className="w-full">
          <CommandInput 
            placeholder="Search site profiles..." 
            value={searchQuery}
            onValueChange={handleSearchChange}
            className="h-9"
          />
          <CommandList className="max-h-64 overflow-auto">
            {filteredProfiles.length === 0 ? (
              <CommandEmpty>No profiles found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredProfiles.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.id.toString()}
                    onSelect={() => {
                      onValueChange(profile.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === profile.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{profile.sitename || 'No site name'}</div>
                      <div className="text-xs text-muted-foreground">
                        {profile.fullname || 'No full name'} {profile.standard_code ? `(${profile.standard_code})` : ''}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
