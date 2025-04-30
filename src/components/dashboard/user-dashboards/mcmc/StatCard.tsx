import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue?: string;
  bgColor?: string;
  className?: string;
}

const StatCard = ({
  icon,
  title,
  value,
  subValue,
  bgColor = "bg-blue-500",
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn("flex items-start gap-4 p-4 animate-fade-in", className)}
    >
      <div className={cn("stat-circle", bgColor)}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {subValue && <span className="text-gray-400">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
