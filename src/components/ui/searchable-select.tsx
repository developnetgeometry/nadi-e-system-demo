import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps<T> {
  options: T[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  searchBy: (item: T) => string[]; // Function to determine searchable fields
  getLabel: (item: T) => string; // Function to get the display label
  getValue: (item: T) => string | number; // Function to get the value
  disabled?: boolean;
}

export function SearchableSelect<T>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchBy,
  getLabel,
  getValue,
  disabled = false,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter options based on the search query
  const filteredOptions = options.filter((item) =>
    searchBy(item).some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  // Get the label of the selected value
  const selectedItem = options.find((item) => getValue(item) === value);
  const selectedLabel = selectedItem ? getLabel(selectedItem) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-300 text-black font-normal hover:bg-gray-50 hover:text-black"
          disabled={disabled}
        >
          <span className="truncate overflow-hidden whitespace-nowrap">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={searchBy(item).join(" ").toLowerCase()}
                  onSelect={() => {
                    onChange(getValue(item));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === getValue(item) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate overflow-hidden whitespace-nowrap">{getLabel(item)}</span>
                </CommandItem>

              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}