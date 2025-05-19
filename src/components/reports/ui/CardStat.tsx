import React from "react";
import { LucideIcon } from "lucide-react";

type CardStatProps = {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  value: React.ReactNode;
  progressValue?: number;
  progressColor?: string;
  progressMax?: number;
  footer?: React.ReactNode;
  stats?: React.ReactNode;
};

export const CardStat = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  value,
  progressValue,
  progressColor = "bg-blue-500",
  progressMax = 100,
  footer,
  stats,
}: CardStatProps) => {
  const progressPercent = 
    progressValue !== undefined && progressMax ? 
      Math.min(100, (progressValue / Math.max(1, progressMax)) * 100) : 
      undefined;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <span className="text-gray-600 font-medium">{title}</span>
        </div>
        <div className="text-3xl font-bold text-gray-800">
          {value}
        </div>
      </div>

      {progressPercent !== undefined && (
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div 
            className={`${progressColor} h-2 rounded-full`} 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
      
      {stats && (
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          {stats}
        </div>
      )}
      
      {footer && (
        <div className="mt-3 text-right">
          <span className="text-sm font-medium text-gray-600">
            {footer}
          </span>
        </div>
      )}
    </>
  );
};
