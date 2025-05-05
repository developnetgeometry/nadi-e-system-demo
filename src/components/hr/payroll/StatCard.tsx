import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorVariant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  colorVariant = "default",
  className,
}: StatCardProps) {
  const colorClasses = {
    default: "",
    success: "text-nadi-success",
    warning: "text-nadi-warning",
    danger: "text-nadi-alert",
  };

  const trendColors = trend?.isPositive
    ? "text-nadi-success"
    : "text-nadi-alert";

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          <span className={colorClasses[colorVariant]}>{value}</span>
        </div>
        {trend && (
          <div className={cn("text-xs mt-1", trendColors)}>
            {trend.isPositive ? "+" : "-"}
            {trend.value}% from previous period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
