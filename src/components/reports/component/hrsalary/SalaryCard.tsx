import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SalaryCardProps {
  loading: boolean;
  averageSalary: number;
  activeNadiSites: number;
}

export const SalaryCard: React.FC<SalaryCardProps> = ({
  loading,
  averageSalary,
  activeNadiSites,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 lg:col-span-2">
      <CardHeader className="p-4 bg-white border-b">
        <CardTitle className="text-lg font-medium text-gray-800">Salary</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-full bg-green-50">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-gray-600 font-medium">Site</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{activeNadiSites}</div>
                <div className="text-sm text-gray-500 mt-1">Active NADI Site</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
