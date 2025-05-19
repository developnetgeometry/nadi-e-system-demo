import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { CardStat } from "../ui/CardStat";
import { CardSkeleton } from "../ui/CardSkeleton";

type LocalAuthorityCardProps = {
  loading: boolean;
  siteCount: number;
  laRecordSiteCount: number;
};

export const LocalAuthorityCard = ({
  loading,
  siteCount,
  laRecordSiteCount,
}: LocalAuthorityCardProps) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Local Authority</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">        {loading ? (
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
            stats={<></>}
            footer={
              siteCount ? 
                `${Math.round((laRecordSiteCount / Math.max(1, siteCount)) * 100)}% Coverage` : 
                '0% Coverage'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
