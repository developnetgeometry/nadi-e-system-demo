import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { CardSkeleton } from "../../ui/CardSkeleton";

interface ConnectionTypeCardProps {
  loading?: boolean;
  connectionTypes: { type: string; count: number }[];
  totalConnections: number;
}

export const ConnectionTypeCard = ({
  loading = false,
  connectionTypes,
  totalConnections,
}: ConnectionTypeCardProps) => {
  if (loading) {
    return <CardSkeleton />;
  }

  // Colors for the connection types
  const typeColors: Record<string, string> = {
    "Fiber": "bg-green-500",
    "Wireless": "bg-blue-500",
    "DSL": "bg-yellow-500",
    "Satellite": "bg-purple-500",
    "4G": "bg-pink-500",
    "5G": "bg-indigo-500"
  };

  // Default color for types not in the mapping
  const defaultColor = "bg-gray-500";

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">
          Connection Types
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-purple-50">
            <Network className="h-6 w-6 text-purple-500" />
          </div>
          <span className="text-gray-600 font-medium">
            Internet Connection Distribution
          </span>
        </div>

        <div className="space-y-4">
          {connectionTypes.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">No connection data available</div>
          ) : (
            connectionTypes.map((conn, idx) => {
              const percentage = Math.round((conn.count / totalConnections) * 100);
              const color = typeColors[conn.type] || defaultColor;
              
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{conn.type}</span>
                    <span className="text-sm text-gray-500">{conn.count} sites ({percentage}%)</span>
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
