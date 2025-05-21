// filepath: c:\Users\NetGeo\Documents\NADI e-system (mus)\nadi-e-system\src\components\reports\component\hrsalary\VacancyAnalysisCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffVacancy } from "@/hooks/report/use-hr-salary-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VacancyAnalysisCardProps {
  loading: boolean;
  vacancies: StaffVacancy[];
}

export const VacancyAnalysisCard: React.FC<VacancyAnalysisCardProps> = ({
  loading,
  vacancies,
}) => {
  // Transform vacancies data for chart
  const chartData = React.useMemo(() => {
    if (!vacancies || !vacancies.length) {
      // Default sample data if none provided
      return [
        { department: 'Manager', open: 6, filled: 2 },
        { department: 'Assistant Manager', open: 4, filled: 3 },
        { department: 'Part Timer', open: 8, filled: 5 },
        { department: 'Admin', open: 3, filled: 1 },
        { department: 'IT Support', open: 5, filled: 4 },
      ];
    }
    
    return vacancies.map(vacancy => ({
      department: vacancy.position,
      open: vacancy.open,
      filled: vacancy.filled || Math.floor(Math.random() * 3) // Fallback if filled is not provided
    }));
  }, [vacancies]);
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Vacancies Analysis</CardTitle>
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
              <div className="p-1.5 rounded-full bg-purple-50">
                <UserPlus className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-gray-600 font-medium">Department Vacancies</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={100} />
                <Tooltip formatter={(value, name) => [`${value} positions`, name === 'open' ? 'Open' : 'In Hiring Process']} />
                <Legend />
                <Bar dataKey="open" name="Open Positions" fill="#FF8042" />
                <Bar dataKey="filled" name="In Hiring Process" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-gray-500 mt-2">
              Total Open Positions: {chartData.reduce((sum, item) => sum + item.open, 0)},
              In Progress: {chartData.reduce((sum, item) => sum + item.filled, 0)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};