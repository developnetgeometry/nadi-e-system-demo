// filepath: c:\Users\NetGeo\Documents\NADI e-system (mus)\nadi-e-system\src\components\reports\component\hrsalary\TurnoverTrendCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TurnoverRate } from "@/hooks/report/use-hr-salary-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TurnoverTrendCardProps {
  loading: boolean;
  turnoverRates: TurnoverRate[];
  averageTurnoverRate: number;
}

export const TurnoverTrendCard: React.FC<TurnoverTrendCardProps> = ({
  loading,
  turnoverRates,
  averageTurnoverRate,
}) => {
  // Format the data for the chart if available
  const chartData = React.useMemo(() => {
    if (!turnoverRates || !turnoverRates.length) {
      // No data: return empty array
      return [];
    }
    return turnoverRates.map(item => ({
      month: item.month,
      rate: Number(item.rate.toFixed(1))
    }));
  }, [turnoverRates]);

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Turnover Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-red-50">
                <UserMinus className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-gray-600 font-medium">Monthly Turnover Analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Turnover Rate']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#FF5252" 
                  name="Turnover Rate (%)" 
                  dot={{ stroke: '#FF5252', strokeWidth: 2, r: 4 }} 
                  activeDot={{ stroke: '#FF5252', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {chartData.length > 0 && (
              <div className="text-xs text-center text-gray-500 mt-2">
                Average Turnover Rate: {averageTurnoverRate.toFixed(1)}%
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};