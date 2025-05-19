import React from "react";
import { LucideIcon } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { FilterCommand } from "./FilterCommand";

type SingleSelectFilterProps = {
  selectedItem: string | number | null;
  setSelectedItem: (item: string | number | null) => void;
  items: { id: string | number; label: string }[];
  icon: LucideIcon;
  label: string;
  searchPlaceholder: string;
  emptyMessage: string;
  isLoading?: boolean;
};

export const SingleSelectFilter = ({
  selectedItem,
  setSelectedItem,
  items,
  icon,
  label,
  searchPlaceholder,
  emptyMessage,
  isLoading = false
}: SingleSelectFilterProps) => {
  const handleSelect = (id: string | number) => {
    setSelectedItem(selectedItem === id ? null : id);
  };  // Find the selected item label if any item is selected
  const selectedItemLabel = selectedItem !== null
    ? items.find(item => item.id === selectedItem)?.label
    : undefined;

  // Map the items to the format expected by FilterCommand
  const commandItems = items.map(item => ({
    id: item.id,
    name: item.label, // Using label as name for FilterCommand
    label: item.label
  }));

  return (
    <FilterPopover
      isActive={selectedItem !== null}
      icon={icon}
      label={label}
      value={selectedItemLabel}
    >
      <FilterCommand
        items={commandItems}
        selectedItems={selectedItem !== null ? [selectedItem] : []}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        isMultiSelect={false}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
