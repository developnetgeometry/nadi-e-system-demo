import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, FileText } from "lucide-react";
import { CardStat } from "../../ui/CardStat";
import { CardSkeleton } from "../../ui/CardSkeleton";
import { StatItem } from "../../ui/StatItem";

type AgreementCardProps = {
  loading: boolean;
  siteCount: number;
  agreementSiteCount: number;
};

export const AgreementCard = ({
  loading,
  siteCount,
  agreementSiteCount,
}: AgreementCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Site Agreement</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <CardStat
            icon={FileText}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-50"
            title="Sites with Agreements"
            value={agreementSiteCount}
            progressValue={agreementSiteCount}
            progressMax={siteCount}
            progressColor="bg-purple-500"            stats={<></>}
            footer={
              siteCount ? 
                `${Math.round((agreementSiteCount / Math.max(1, siteCount)) * 100)}% Coverage` : 
                '0% Coverage'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
