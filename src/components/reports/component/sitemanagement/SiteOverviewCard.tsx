import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CardStat } from "../../ui/CardStat";
import { CardSkeleton } from "../../ui/CardSkeleton";

type SiteOverviewCardProps = {
  loading: boolean;
  siteCount: number;
  activeSiteCount: number;
  uniquePhaseCount: number;
  uniqueDuspCount: number;
  totalSiteCount: number;
};

export const SiteOverviewCard = ({
  loading,
  siteCount,
  activeSiteCount,
  uniquePhaseCount,
  uniqueDuspCount,
  totalSiteCount,
}: SiteOverviewCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Sites Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <>
            <CardStat
              icon={Building2}
              iconColor="text-amber-500"
              iconBgColor="bg-amber-50"
              title="Total NADI Sites"
              value={siteCount}
            />
            
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">Active</span>
                <span className="font-medium">{activeSiteCount}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">Phases</span>
                <span className="font-medium">{uniquePhaseCount}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                <span className="text-xs text-gray-500">DUSPs</span>
                <span className="font-medium">{uniqueDuspCount}</span>
              </div>
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-xs text-gray-600">
                Filtered from {totalSiteCount} total sites
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
