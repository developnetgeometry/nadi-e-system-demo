import React from "react";
import { FilterPopover } from "./component/FilterPopover";
import { FilterCommand } from "./component/FilterCommand";
import { BookOpen } from "lucide-react";

export interface ProgramOption {
  id: string | number;
  name: string;
}

interface ProgramFilterProps {
  programFilter: (string | number)[];
  setProgramFilter: (value: (string | number)[]) => void;
  programOptions: ProgramOption[];
  isLoading?: boolean;
}

export const ProgramFilter: React.FC<ProgramFilterProps> = ({
  programFilter,
  setProgramFilter,
  programOptions,
  isLoading = false,
}) => {
  const items = programOptions.map(option => ({
    id: option.id,
    name: option.name,
    label: option.name
  }));
  return (
    <FilterPopover
      isActive={programFilter.length > 0}
      icon={BookOpen}
      label="Program"
      value={programFilter.length > 0 ? programFilter.length : undefined}
    >
      <FilterCommand
        items={items}
        selectedItems={programFilter}
        searchPlaceholder="Search programs..."
        emptyMessage="No programs found."
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={id => {
          const idStr = String(id);
          setProgramFilter(
            programFilter.includes(idStr)
              ? programFilter.filter(itemId => String(itemId) !== idStr)
              : [...programFilter, idStr]
          );
        }}
      />
    </FilterPopover>
  );
};
