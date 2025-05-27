import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteProfile } from "../hook/useSiteProfile";

interface SiteProfileSelectProps {
  profiles: SiteProfile[];
  value: number | null;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export function SiteProfileSelect({
  profiles = [],
  value,
  onValueChange,
  disabled = false,
}: SiteProfileSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter profiles based on the search query
  const filteredProfiles = profiles.filter((profile) =>
    [profile.sitename, profile.fullname, profile.standard_code]
      .filter(Boolean) // Remove null/undefined values
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  // Get the selected profile
  const selectedProfile = profiles.find((profile) => profile.id === value);
  const selectedLabel = selectedProfile
    ? `${selectedProfile.sitename || ""} - ${selectedProfile.fullname || ""}`
    : "Select NADI site...";

  // Automatically select the only profile if the length is 1
  React.useEffect(() => {
    if (profiles.length === 1 && value !== profiles[0].id) {
      onValueChange(profiles[0].id);
    }
  }, [profiles, value, onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-300 text-black dark:text-white font-normal hover:bg-gray-50 hover:text-black dark:hover:bg-gray-700"
          disabled={disabled}
        >
          <span className="truncate overflow-hidden whitespace-nowrap">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search NADI site..."
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
            {filteredProfiles.length === 0 ? (
              <CommandEmpty>No profiles found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredProfiles.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={`${profile.sitename || ""} ${profile.fullname || ""} ${profile.standard_code || ""}`.toLowerCase()}
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
                    <span className="truncate overflow-hidden whitespace-nowrap">
                      {profile.sitename || "No site name"} - {profile.fullname || "No full name"}
                    </span>
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