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
  colorVariant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  colorVariant = "default",
  className,
  backgroundColor,
  textColor,
}: StatCardProps) {
  const colorClasses = {
    default: "",
    primary: "text-blue-600",
    success: "text-nadi-success",
    warning: "text-nadi-warning",
    danger: "text-nadi-alert",
  };

  const trendColors = trend?.isPositive
    ? "text-nadi-success"
    : "text-nadi-alert";

  return (
    <Card className={cn("shadow-sm", backgroundColor, className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle
          className={cn("text-sm font-medium text-muted-foreground", textColor)}
        >
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          <span className={cn(colorClasses[colorVariant], textColor)}>
            {value}
          </span>
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
