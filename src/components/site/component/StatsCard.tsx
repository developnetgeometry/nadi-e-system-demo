import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string; // New optional subtitle prop
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle, // Accept subtitle as a prop
  icon: Icon,
  iconBgColor = "bg-muted",
  iconTextColor = "text-muted-foreground",
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={clsx("p-2 rounded-md", iconBgColor)}>
          <Icon className={clsx("h-6 w-6", iconTextColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>} {/* Subtitle */}
      </CardContent>
    </Card>
  );
};