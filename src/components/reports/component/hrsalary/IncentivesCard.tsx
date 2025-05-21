import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface IncentivesCardProps {
  loading: boolean;
  sitesWithIncentives: number;
  averageIncentive?: number;
}

export const IncentivesCard: React.FC<IncentivesCardProps> = ({
  loading,
  sitesWithIncentives,
  averageIncentive,
}) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-2">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Performance Incentives</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="text-center">
              <Skeleton className="h-12 w-12 mx-auto rounded-full" />
              <Skeleton className="h-5 w-24 mx-auto mt-2" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-amber-50">
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-gray-600 font-medium">Site</span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">{sitesWithIncentives}</div>
              <div className="text-sm text-gray-500 mt-1">Active NADI Site</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
