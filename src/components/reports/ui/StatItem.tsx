import React from "react";
import { LucideIcon } from "lucide-react";

type StatItemProps = {
  icon?: LucideIcon;
  iconColor?: string;
  label: string;
  value: React.ReactNode;
};

export const StatItem = ({ icon: Icon, iconColor = "text-gray-500", label, value }: StatItemProps) => {
  return (
    <div className="flex items-center gap-1">
      {Icon && <Icon className={`h-3 w-3 ${iconColor}`} />}
      <span>{label}: {value}</span>
    </div>
  );
};
