import { CardHover, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-muted",
  iconTextColor = "text-muted-foreground",
}: StatsCardProps) => {
  return (
    <CardHover>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={clsx("p-2 rounded-md", iconBgColor)}>
          <Icon className={clsx("h-6 w-6", iconTextColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </CardHover>
  );
};