import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryStatsCardProps } from "@/types/inventory";

export const InventoryStatsCard = ({
  title,
  value,
  color,
  description,
}: InventoryStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {color ? (
          <div className={`text-2xl font-bold text-${color}`}>{value}</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
