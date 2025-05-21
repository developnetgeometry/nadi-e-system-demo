import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { StaffDistribution } from "@/hooks/report/use-hr-salary-data";

interface StaffDistributionCardProps {
  loading: boolean;
  employeeDistribution: StaffDistribution[];
}

export const StaffDistributionCard: React.FC<StaffDistributionCardProps> = ({
  loading,
  employeeDistribution,
}) => {
  // Calculate total staff from distribution
  const totalStaff = employeeDistribution.reduce((sum, item) => sum + item.count, 0);
  
  // Format distribution data for chart
  const chartData = employeeDistribution.map(item => ({
    name: item.position,
    value: item.count,
    color: item.color
  }));
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-3">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Employee Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="h-[250px] flex items-center justify-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-blue-50">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-600 font-medium">Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-gray-600 mt-2">
              Total NADI Involvement: {totalStaff} staff members
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
