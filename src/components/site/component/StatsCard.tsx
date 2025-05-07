import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string; // Optional subtitle
  icon?: React.ComponentType<{ className?: string }>; // Optional icon
  iconBgColor?: string; // Optional icon background color
  iconTextColor?: string; // Optional icon text color
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon, // Optional icon
  iconBgColor = "bg-muted", // Default background color
  iconTextColor = "text-muted-foreground", // Default text color
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && ( // Render icon only if provided
          <div className={clsx("p-2 rounded-md", iconBgColor)}>
            <Icon className={clsx("h-6 w-6", iconTextColor)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>} {/* Render subtitle if provided */}
      </CardContent>
    </Card>
  );
};