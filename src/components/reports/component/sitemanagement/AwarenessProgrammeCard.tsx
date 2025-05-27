import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, Zap } from "lucide-react";
import { CardStat } from "../../ui/CardStat";
import { CardSkeleton } from "../../ui/CardSkeleton";
import { StatItem } from "../../ui/StatItem";

type AwarenessProgrammeCardProps = {
  loading: boolean;
  siteCount: number;
  programmesSiteCount: number;
  totalProgrammes: number;
};

export const AwarenessProgrammeCard = ({
  loading,
  siteCount,
  programmesSiteCount,
  totalProgrammes,
}: AwarenessProgrammeCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Awareness & Promotion</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <>
            <CardStat
              icon={Zap}
              iconColor="text-amber-500"
              iconBgColor="bg-amber-50"
              title="Sites with Programmes"
              value={programmesSiteCount}
              progressValue={programmesSiteCount}
              progressMax={siteCount}
              progressColor="bg-amber-500"
              footer={
                siteCount ? 
                  `${Math.round((programmesSiteCount / Math.max(1, siteCount)) * 100)}% Coverage` : 
                  '0% Coverage'
              }
            />
            
            {/* <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Programmes</span>
                <span className="font-medium">{totalProgrammes}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (programmesSiteCount / Math.max(1, siteCount)) * 100)}%` }}
                />
              </div>
            </div> */}
          </>
        )}
      </CardContent>
    </Card>
  );
};
