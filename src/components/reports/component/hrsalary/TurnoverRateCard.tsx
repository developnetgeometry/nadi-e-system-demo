import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TurnoverRate } from "@/hooks/report/use-hr-salary-data";

interface TurnoverRateCardProps {
  loading: boolean;
  turnoverRates: TurnoverRate[];
  averageTurnoverRate: number;
}

export const TurnoverRateCard: React.FC<TurnoverRateCardProps> = ({
  loading,
  turnoverRates,
  averageTurnoverRate,
}) => {

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-3">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Turnover Rate</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="mt-3 text-center">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto mt-1" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-red-50">
                <UserMinus className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-gray-600 font-medium">Annual Rate</span>
            </div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-gray-800">{averageTurnoverRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mt-1">Last 12 months</div>
            </div>
            
          </>
        )}
      </CardContent>
    </Card>
  );
};
