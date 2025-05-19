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

type InsuranceCardProps = {
  loading: boolean;
  siteCount: number;
  insuredSiteCount: number;
  activeCount: number;
  expiringCount: number;
  expiredCount: number;
};

export const InsuranceCard = ({
  loading,
  siteCount,
  insuredSiteCount,
  activeCount,
  expiringCount,
  expiredCount,
}: InsuranceCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Site Insurance</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <CardStat
            icon={Shield}
            iconColor="text-blue-500"
            iconBgColor="bg-blue-50"
            title="Sites with Insurance"
            value={insuredSiteCount}
            progressValue={insuredSiteCount}
            progressMax={siteCount}
            progressColor="bg-blue-500"
            stats={
              <>
                <StatItem 
                  icon={CheckCircle} 
                  iconColor="text-green-500" 
                  label="Active" 
                  value={activeCount} 
                />
                <StatItem 
                  icon={Clock} 
                  iconColor="text-amber-500" 
                  label="Expiring" 
                  value={expiringCount} 
                />
                <StatItem 
                  icon={AlertCircle} 
                  iconColor="text-red-500" 
                  label="Expired" 
                  value={expiredCount} 
                />
              </>
            }
            footer={
              siteCount ? 
                `${Math.round((insuredSiteCount / Math.max(1, siteCount)) * 100)}% Coverage` : 
                '0% Coverage'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
