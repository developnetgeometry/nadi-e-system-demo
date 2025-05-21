import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffMetricsCardProps {
  loading: boolean;
  totalStaff: number;
  activeNadiSites: number;
  sitesWithIncentives: number;
  employeeDistribution?: { position: string; count: number; color: string }[];
}

export const StaffMetricsCard: React.FC<StaffMetricsCardProps> = ({
  loading,
  totalStaff,
  activeNadiSites,
  sitesWithIncentives,
  employeeDistribution = [],
}) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-3">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Number of Employees</CardTitle>
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
              <Skeleton className="h-4 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-blue-50">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-gray-600 font-medium">Staff Count</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{totalStaff}</span>
              </li>
              {employeeDistribution.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.position}:</span>
                  <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};
