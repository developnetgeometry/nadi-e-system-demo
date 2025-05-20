import React from "react";
import { Building } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { FilterCommand } from "./FilterCommand";
import { DUSP } from "@/hooks/report/use-report-filters";

type DuspFilterProps = {
  duspFilter: (string | number)[];
  setDuspFilter: (value: (string | number)[]) => void;
  dusps: DUSP[];
  isLoading?: boolean;
};

export const DuspFilter = ({
  duspFilter,
  setDuspFilter,
  dusps,
  isLoading = false
}: DuspFilterProps) => {
  const handleSelect = (id: string | number) => {
    setDuspFilter(
      duspFilter.includes(id)
        ? duspFilter.filter(itemId => itemId !== id)
        : [...duspFilter, id]
    );
  };

  // Create a combined list of items including the "Not Assigned" option
  const items = [
    { id: "unassigned", name: "Not Assigned", label: "Not Assigned" },
    ...dusps.map(dusp => ({
      id: dusp.id,
      name: dusp.name,
      label: dusp.name
    }))
  ];

  return (
    <FilterPopover
      isActive={duspFilter.length > 0}
      icon={Building}
      label="DUSP"
      value={duspFilter.length > 0 ? duspFilter.length : undefined}
    >      <FilterCommand
        items={items}
        selectedItems={duspFilter}
        searchPlaceholder="Search DUSP..."
        emptyMessage="No DUSP found."
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
