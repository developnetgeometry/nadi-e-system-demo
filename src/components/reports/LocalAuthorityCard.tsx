import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Shield } from "lucide-react";
import { CardStat } from "./ui/CardStat";
import { CardSkeleton } from "./ui/CardSkeleton";
import { StatItem } from "./ui/StatItem";

type LocalAuthorityCardProps = {
  loading: boolean;
  siteCount: number;
  laRecordSiteCount: number;
  compliantCount: number;
  pendingCount: number;
  inProgressCount: number;
};

export const LocalAuthorityCard = ({
  loading,
  siteCount,
  laRecordSiteCount,
  compliantCount,
  pendingCount,
  inProgressCount,
}: LocalAuthorityCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Local Authority</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <CardStat
            icon={Shield}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-50"
            title="Sites with LA Record"
            value={laRecordSiteCount}
            progressValue={laRecordSiteCount}
            progressMax={siteCount}
            progressColor="bg-purple-500"
            stats={
              <>
                <StatItem 
                  icon={CheckCircle} 
                  iconColor="text-green-500" 
                  label="Compliant" 
                  value={compliantCount} 
                />
                <StatItem 
                  icon={AlertCircle} 
                  iconColor="text-orange-500" 
                  label="Pending" 
                  value={pendingCount} 
                />
                <StatItem 
                  icon={Clock} 
                  iconColor="text-blue-500" 
                  label="In Progress" 
                  value={inProgressCount} 
                />
              </>
            }
            footer={
              siteCount ? 
                `${Math.round((compliantCount / Math.max(1, laRecordSiteCount)) * 100)}% Compliance` : 
                '0% Compliance'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
