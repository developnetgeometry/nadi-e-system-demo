import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { CardSkeleton } from "../../ui/CardSkeleton";

interface ProviderCardProps {
  loading?: boolean;
  providers: { name: string; count: number }[];
  totalConnections: number;
}

export const ProviderCard = ({
  loading = false,
  providers,
  totalConnections,
}: ProviderCardProps) => {
  if (loading) {
    return <CardSkeleton />;
  }

  // Colors for different providers
  const providerColors: Record<string, string> = {
    "TM": "bg-blue-500",
    "Maxis": "bg-green-500",
    "Celcom": "bg-purple-500",
    "Digi": "bg-yellow-500",
    "TIME": "bg-indigo-500",
    "YTL": "bg-pink-500"
  };

  // Default color for providers not in the mapping
  const defaultColor = "bg-gray-500";

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">
          Internet Service Providers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-green-50">
            <Globe className="h-6 w-6 text-green-500" />
          </div>
          <span className="text-gray-600 font-medium">
            Provider Distribution
          </span>
        </div>

        <div className="space-y-4">
          {providers.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">No provider data available</div>
          ) : (
            providers.map((provider, idx) => {
              const percentage = Math.round((provider.count / totalConnections) * 100);
              const color = providerColors[provider.name] || defaultColor;
              
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{provider.name}</span>
                    <span className="text-sm text-gray-500">{provider.count} sites ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${color} h-2 rounded-full`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
