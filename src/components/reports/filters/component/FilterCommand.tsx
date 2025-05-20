import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type FilterCommandItem = {
  id: string | number;
  name: string;
  label?: string;
};

type FilterCommandProps = {
  items: FilterCommandItem[];
  selectedItems: (string | number)[];
  searchPlaceholder: string;
  emptyMessage: string;
  isLoading?: boolean;
  isMultiSelect?: boolean;
  onSelect: (id: string | number) => void;
};

export const FilterCommand = ({
  items,
  selectedItems,
  searchPlaceholder,
  emptyMessage,
  isLoading = false,
  isMultiSelect = false,
  onSelect
}: FilterCommandProps) => {
  return (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <CommandItem disabled>Loading options...</CommandItem>
          ) : (
            items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => onSelect(item.id)}
              >                <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                  (isMultiSelect
                    ? selectedItems.some(selectedId => String(selectedId) === String(item.id))
                    : String(selectedItems[0]) === String(item.id)
                  ) ? "bg-primary border-primary" : "opacity-50"
                )}
              >
                  {(isMultiSelect
                    ? selectedItems.some(selectedId => String(selectedId) === String(item.id))
                    : String(selectedItems[0]) === String(item.id)
                  ) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                </div>
                {item.label || item.name}
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
