import { CardHover, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCardProps } from "@/types/dashboard";
import clsx from "clsx";

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-muted",
  iconTextColor = "text-muted-foreground",
  description,
}: StatsCardProps & { iconBgColor?: string; iconTextColor?: string }) => {
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
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </CardHover>
  );
};
