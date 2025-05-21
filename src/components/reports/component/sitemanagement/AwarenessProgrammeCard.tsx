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
  completedCount: number;
  upcomingCount: number;
};

export const AwarenessProgrammeCard = ({
  loading,
  siteCount,
  programmesSiteCount,
  totalProgrammes,
  completedCount,
  upcomingCount,
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
          <CardStat
            icon={Zap}
            iconColor="text-amber-500"
            iconBgColor="bg-amber-50"
            title="Total Programmes"
            value={totalProgrammes}
            progressValue={programmesSiteCount}
            progressMax={siteCount}
            progressColor="bg-amber-500"
            stats={
              <>
                <StatItem 
                  icon={CheckCircle} 
                  iconColor="text-green-500" 
                  label="Completed" 
                  value={completedCount} 
                />
                <StatItem 
                  icon={Clock} 
                  iconColor="text-blue-500" 
                  label="Upcoming" 
                  value={upcomingCount} 
                />
              </>
            }
            footer={
              siteCount ? 
                `${programmesSiteCount} Sites with Programmes` : 
                '0 Sites with Programmes'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
