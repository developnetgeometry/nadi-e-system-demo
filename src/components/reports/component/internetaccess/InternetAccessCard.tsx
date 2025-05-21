import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";
import { CardSkeleton } from "../../ui/CardSkeleton";
import { CardStat } from "../../ui/CardStat";

interface InternetAccessCardProps {
  loading?: boolean;
  totalSites: number;
  sitesWithInternet: number;
}

export const InternetAccessCard = ({
  loading = false,
  totalSites,
  sitesWithInternet,
}: InternetAccessCardProps) => {
  if (loading) {
    return <CardSkeleton height={200} />;
  }

  const percentageWithInternet = totalSites > 0 
    ? Math.round((sitesWithInternet / totalSites) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-500 text-white">
            <Wifi className="h-6 w-6" />
          </div>
          Internet Access
        </CardTitle>
      </CardHeader>      <CardContent className="p-8 bg-white">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <div className="text-gray-500 font-medium mb-2">Sites with Internet</div>
            <div className="text-6xl font-bold text-blue-600">
              {sitesWithInternet}
            </div>
            <div className="mt-2 text-sm text-gray-500 font-medium">
              out of {totalSites} total NADI sites
            </div>
          </div>
          
          <div className="flex flex-col items-start bg-blue-50 p-5 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">
              {percentageWithInternet}%
            </div>
            <div className="text-sm text-gray-600">Connectivity Rate</div>
          </div>
        </div>
          <div className="w-full mt-8">
          <div className="flex justify-between text-sm mb-1">
            <span>0%</span>
            <span className="font-medium text-gray-700">Internet Coverage</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out relative"
              style={{ width: `${percentageWithInternet}%` }}
            >
              {percentageWithInternet > 15 && (
                <span className="absolute right-2 top-0 bottom-0 flex items-center text-xs text-white font-bold">
                  {percentageWithInternet}%
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
