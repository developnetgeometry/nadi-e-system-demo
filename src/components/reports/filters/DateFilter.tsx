import React from "react";
import { SingleSelectFilter } from "./component/SingleSelectFilter";
import { NADISite } from "@/hooks/report/use-report-filters";
import { Building2, Calendar } from "lucide-react";

type DateFilterProps = {
  // Month filter
  monthFilter: string | number | null;
  setMonthFilter: (value: string | number | null) => void;
  monthOptions: { id: string | number; label: string }[];
  
  // Year filter
  yearFilter: string | number | null;
  setYearFilter: (value: string | number | null) => void;
  yearOptions: { id: string | number; label: string }[];
  
  isLoading?: boolean;
};

export const DateFilter: React.FC<DateFilterProps> = ({
  monthFilter,
  setMonthFilter,
  monthOptions,
  yearFilter,
  setYearFilter,
  yearOptions,
  isLoading = false
}) => {
  return (
    <>
      {/* Month Filter */}
      <SingleSelectFilter
        selectedItem={monthFilter}
        setSelectedItem={setMonthFilter}
        items={monthOptions}
        icon={Calendar}
        label="Month"
        searchPlaceholder="Search months..."
        emptyMessage="No month found."
        isLoading={isLoading}
      />

      {/* Year Filter */}
      <SingleSelectFilter
        selectedItem={yearFilter}
        setSelectedItem={setYearFilter}
        items={yearOptions}
        icon={Calendar}
        label="Year"
        searchPlaceholder="Search years..."
        emptyMessage="No year found."
        isLoading={isLoading}
      />
    </>
  );
};
