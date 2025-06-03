import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sun,
  Stethoscope,
  RefreshCcw,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useLeaveBalance } from "@/hooks/hr/use-leave-balance";

const leaveIcons: Record<string, { icon: JSX.Element; color: string }> = {
  Annual: {
    icon: <Sun className="w-6 h-6 text-yellow-500" />,
    color: "text-yellow-500",
  },
  Medical: {
    icon: <Stethoscope className="w-6 h-6 text-red-500" />,
    color: "text-red-500",
  },
  Replacement: {
    icon: <RefreshCcw className="w-6 h-6 text-blue-500" />,
    color: "text-blue-500",
  },
  Emergency: {
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    color: "text-orange-500",
  },
  Default: {
    icon: <Calendar className="w-6 h-6 text-gray-500" />,
    color: "text-gray-500",
  },
};

export function LeaveBalanceCards() {
  const { leaveBalances, isLoading } = useLeaveBalance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-24" />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (leaveBalances.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No leave balance records found for this year.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {leaveBalances.map((balance) => {
        const leaveTypeName = balance.nd_leave_type?.name || "Unknown";
        const iconConfig = leaveIcons[leaveTypeName] || leaveIcons.Default;
        const remaining = balance.balance - balance.used;

        return (
          <Card key={balance.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {leaveTypeName} Leave
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {remaining} / {balance.balance}
                </div>
                <div>{iconConfig.icon}</div>
              </div>
              <div className="grid grid-cols-2 text-xs text-muted-foreground">
                <div>Used: {balance.used}</div>
                <div>Carried: {balance.carried_forward}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
