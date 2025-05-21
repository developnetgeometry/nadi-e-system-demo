import React from "react";
import { Network } from "lucide-react";
import { FilterPopover } from "./component/FilterPopover";
import { FilterCommand } from "./component/FilterCommand";

type TPFilterProps = {
  selectedItems: (string | number)[];
  setSelectedItems: (items: (string | number)[]) => void;
  tpOptions: { id: string | number; name: string }[];
  isLoading?: boolean;
};

export const TPFilter: React.FC<TPFilterProps> = ({
  selectedItems,
  setSelectedItems,
  tpOptions,
  isLoading = false
}) => {  const handleSelect = (id: string | number) => {
    const idStr = String(id);
    const isSelected = selectedItems.some(itemId => String(itemId) === idStr);
    
    setSelectedItems(
      isSelected
        ? selectedItems.filter(itemId => String(itemId) !== idStr)
        : [...selectedItems, id]
    );
  };
    // Format TP items for display
  const items = tpOptions.map(tp => ({
    id: tp.id,
    name: tp.name,
    label: tp.name
  }));

  return (
    <FilterPopover
      isActive={selectedItems.length > 0}
      icon={Network}
      label="TP"
      value={selectedItems.length > 0 ? selectedItems.length : undefined}
    >
      <FilterCommand
        items={items}
        selectedItems={selectedItems}
        searchPlaceholder="Search telco providers..."
        emptyMessage="No providers found."
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
