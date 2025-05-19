import React from "react";
import { Building } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { FilterCommand } from "./FilterCommand";
import { DUSP } from "@/hooks/report/use-report-filters";

type DuspFilterProps = {
  duspFilter: string | number | null;
  setDuspFilter: (value: string | number | null) => void;
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
    setDuspFilter(duspFilter === id ? null : id);
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

  // Find the selected item name if any
  const selectedItemName = duspFilter !== null
    ? (duspFilter === 'unassigned' ? 'Not Assigned' : dusps.find(d => d.id === duspFilter)?.name)
    : undefined;

  return (
    <FilterPopover
      isActive={duspFilter !== null}
      icon={Building}
      label="DUSP"
      value={selectedItemName}
    >
      <FilterCommand
        items={items}
        selectedItems={duspFilter !== null ? [duspFilter] : []}
        searchPlaceholder="Search DUSP..."
        emptyMessage="No DUSP found."
        isLoading={isLoading}
        isMultiSelect={false}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
