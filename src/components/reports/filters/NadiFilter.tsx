import React from "react";
import { Building2 } from "lucide-react";
import { NADISite } from "@/hooks/report/use-report-filters";
import { FilterPopover } from "./FilterPopover";
import { FilterCommand } from "./FilterCommand";

type NadiFilterProps = {
  selectedItems: (string | number)[];
  setSelectedItems: (items: (string | number)[]) => void;
  nadiSites: NADISite[];
  isLoading?: boolean;
};

export const NadiFilter: React.FC<NadiFilterProps> = ({
  selectedItems,
  setSelectedItems,
  nadiSites,
  isLoading = false
}) => {
  const handleSelect = (id: string | number) => {
    setSelectedItems(
      selectedItems.includes(id)
        ? selectedItems.filter(itemId => itemId !== id)
        : [...selectedItems, id]
    );
  };
  
  // Format NADI items to include standard_code if available
  const formattedItems = nadiSites.map(site => ({
    id: site.id,
    name: site.sitename,
    label: site.sitename + (site.standard_code ? ` (${site.standard_code})` : '')
  }));

  return (
    <FilterPopover
      isActive={selectedItems.length > 0}
      icon={Building2}
      label="NADI"
      value={selectedItems.length > 0 ? selectedItems.length : undefined}
    >
      <FilterCommand
        items={formattedItems}
        selectedItems={selectedItems}
        searchPlaceholder="Search NADI sites..."
        emptyMessage="No NADI sites found."
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={handleSelect}
      />
    </FilterPopover>
  );
};
