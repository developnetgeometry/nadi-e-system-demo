import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { CardSkeleton } from "../../ui/CardSkeleton";

interface WebsiteMigrationCardProps {
  loading: boolean;
  totalSites: number;
  migratedSites: number;
}

export const WebsiteMigrationCard = ({ loading, totalSites, migratedSites }: WebsiteMigrationCardProps) => {
  // Calculate completion percentage
  const completionPercentage = totalSites > 0 ? Math.round((migratedSites / totalSites) * 100) : 0;

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Website Migration</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-full bg-purple-50">
                <Globe className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-gray-600 font-medium">Migration Status</span>
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-800">{migratedSites}</span>
                <span className="text-lg text-gray-500 font-medium">/{totalSites}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3 max-w-[200px]">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 mt-2">
                {`${completionPercentage}% Completion`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
