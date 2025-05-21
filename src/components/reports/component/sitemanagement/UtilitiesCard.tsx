import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";
import { CardStat } from "../../ui/CardStat";
import { CardSkeleton } from "../../ui/CardSkeleton";
import { StatItem } from "../../ui/StatItem";

type UtilitiesCardProps = {
  loading: boolean;
  siteCount: number;
  utilitySiteCount: number;
  totalBills: number;
  totalAmount: number;
  utilityTypes: string[];
};

export const UtilitiesCard = ({
  loading,
  siteCount,
  utilitySiteCount,
  totalBills,
  totalAmount,
  utilityTypes,
}: UtilitiesCardProps) => {
  const formattedAmount = totalAmount.toLocaleString();
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Utilities</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <>
            <CardStat
              icon={Zap}
              iconColor="text-red-500"
              iconBgColor="bg-red-50"
              title="Sites with Utilities"
              value={utilitySiteCount}
            />
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Bills</span>
                <span className="font-medium">{totalBills}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (totalBills / Math.max(1, siteCount)) * 100)}%` }}
                />
              </div>
            </div>
              <div className="mt-3 flex justify-end text-xs text-gray-500">
              <StatItem 
                icon={Clock} 
                iconColor="text-blue-500" 
                label="RM" 
                value={formattedAmount} 
              />
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-sm text-gray-600">
                {utilityTypes.length ? utilityTypes.join(", ") : "Water, Electricity, Sewage, Internet"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
