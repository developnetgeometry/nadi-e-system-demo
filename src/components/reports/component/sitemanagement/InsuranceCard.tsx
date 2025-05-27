import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Shield, CalendarClock } from "lucide-react";
import { CardStat } from "../../ui/CardStat";
import { CardSkeleton } from "../../ui/CardSkeleton";
import { StatItem } from "../../ui/StatItem";

import { SiteInsuranceData } from "@/hooks/report/use-site-management-data";

type InsuranceCardProps = {
  loading: boolean;
  siteCount: number;
  insuredSiteCount: number;
  insuranceData?: SiteInsuranceData[]; // Add the full insurance data
};

export const InsuranceCard = ({
  loading,
  siteCount,
  insuredSiteCount,
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
