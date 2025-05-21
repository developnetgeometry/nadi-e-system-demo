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

interface VacancyCardProps {
  loading: boolean;
  vacancies: StaffVacancy[];
}

export const VacancyCard: React.FC<VacancyCardProps> = ({
  loading,
  vacancies,
}) => {
  // Calculate total vacancies
  const totalVacancies = vacancies.reduce((sum, vacancy) => sum + vacancy.open, 0);
  
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-2">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Vacancies</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-purple-50">
                <UserPlus className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-gray-600 font-medium">Open Positions</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{totalVacancies}</span>
              </li>
              {vacancies.map((vacancy, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-600">{vacancy.position}:</span>
                  <span className="font-medium">{vacancy.open}</span>
                </li>
              ))}
            </ul>
            
          </>
        )}
      </CardContent>
    </Card>
  );
};
