import React from "react";
import { FilterPopover } from "./component/FilterPopover";
import { FilterCommand } from "./component/FilterCommand";
import { Landmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface PillarOption {
  id: string | number;
  name: string;
}

interface PillarFilterProps {
  pillarFilter: (string | number)[];
  setPillarFilter: (value: (string | number)[]) => void;
  pillarOptions: PillarOption[];
  isLoading?: boolean;
}

export const PillarFilter: React.FC<PillarFilterProps> = ({
  pillarFilter,
  setPillarFilter,
  pillarOptions,
  isLoading = false,
}) => {
  const items = pillarOptions.map(option => ({
    id: option.id,
    name: option.name,
    label: option.name
  }));

  if (isLoading) {
    return <Skeleton className="w-40 h-10 rounded" />;
  }

  return (
    <FilterPopover
      isActive={pillarFilter.length > 0}
      icon={Landmark}
      label="Pillar"
      value={pillarFilter.length > 0 ? pillarFilter.length : undefined}
    >
      <FilterCommand
        items={items}
        selectedItems={pillarFilter}
        searchPlaceholder="Search pillars..."
        emptyMessage="No pillars found."
        isLoading={isLoading}
        isMultiSelect={true}
        onSelect={id => {
          const idStr = String(id);
          setPillarFilter(
            pillarFilter.includes(idStr)
              ? pillarFilter.filter(itemId => String(itemId) !== idStr)
              : [...pillarFilter, idStr]
          );
        }}
      />
    </FilterPopover>
  );
};
