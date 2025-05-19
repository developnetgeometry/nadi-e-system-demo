import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter } from "lucide-react";
import { CardStat } from "./ui/CardStat";
import { CardSkeleton } from "./ui/CardSkeleton";

type FilterStatusCardProps = {
  loading: boolean;
  hasActiveFilters: boolean;
  duspCount: number;
  duspTotal: number;
  phaseCount: number;
  phaseTotal: number;
  monthLabel: string | null;
  yearLabel: string | number | null;
  filteredSitesCount: number;
};

export const FilterStatusCard = ({
  loading,
  hasActiveFilters,
  duspCount,
  duspTotal,
  phaseCount,
  phaseTotal,
  monthLabel,
  yearLabel,
  filteredSitesCount,
}: FilterStatusCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Filter Status</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <>
            <CardStat
              icon={Filter}
              iconColor="text-indigo-500"
              iconBgColor="bg-indigo-50"
              title="Filter Coverage"
              value={hasActiveFilters ? "Active" : "None"}
            />
            
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">DUSPs</span>
                <span className="font-medium">{duspCount}/{duspTotal}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">Phases</span>
                <span className="font-medium">{phaseCount}/{phaseTotal}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">Month</span>
                <span className="font-medium">{monthLabel || "All"}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">Year</span>
                <span className="font-medium">{yearLabel || "All"}</span>
              </div>
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-xs text-gray-600">
                {hasActiveFilters ? `${filteredSitesCount} sites match filters` : "No active filters"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
