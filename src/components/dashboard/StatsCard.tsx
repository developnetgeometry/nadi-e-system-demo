import { CardHover, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCardProps } from "@/types/dashboard";

export const StatsCard = ({ title, value, icon: Icon, description }: StatsCardProps) => {
  return (
    <CardHover>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </CardHover>
  );
};