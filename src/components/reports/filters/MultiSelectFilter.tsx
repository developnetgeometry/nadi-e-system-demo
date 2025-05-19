import React from "react";
import { LucideIcon } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { FilterCommand } from "./FilterCommand";

type MultiSelectFilterProps = {
  selectedItems: (string | number)[];
  setSelectedItems: (items: (string | number)[]) => void;
  items: { id: string | number; name: string; label?: string }[];
  icon: LucideIcon;
  label: string;
  searchPlaceholder: string;
  emptyMessage: string;
  isLoading?: boolean;
};

export const MultiSelectFilter = ({
  selectedItems,
  setSelectedItems,
  items,
  icon,
  label,
  searchPlaceholder,
  emptyMessage,
  isLoading = false
}: MultiSelectFilterProps) => {
  const handleSelect = (id: string | number) => {
    setSelectedItems(
      selectedItems.includes(id)
        ? selectedItems.filter(itemId => itemId !== id)
        : [...selectedItems, id]
    );
  };

  return (
    <FilterPopover
      isActive={selectedItems.length > 0}
      icon={icon}
      label={label}
      value={selectedItems.length > 0 ? selectedItems.length : undefined}
    >
      <FilterCommand
        items={items}
        selectedItems={selectedItems}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
