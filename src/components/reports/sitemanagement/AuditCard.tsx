import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, ClipboardCheck, Clock } from "lucide-react";
import { CardStat } from "../ui/CardStat";
import { CardSkeleton } from "../ui/CardSkeleton";
import { StatItem } from "../ui/StatItem";

type AuditCardProps = {
  loading: boolean;
  siteCount: number;
  auditedSiteCount: number;
};

export const AuditCard = ({
  loading,
  siteCount,
  auditedSiteCount,
}: AuditCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Audit</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <CardStat
            icon={ClipboardCheck}
            iconColor="text-green-500"
            iconBgColor="bg-green-50"
            title="Sites with Audits"
            value={auditedSiteCount}
            progressValue={auditedSiteCount}
            progressMax={siteCount}
            progressColor="bg-green-500"            stats={<></>}
            footer={
              siteCount ? 
                `${Math.round((auditedSiteCount / Math.max(1, siteCount)) * 100)}% Coverage` : 
                '0% Coverage'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
