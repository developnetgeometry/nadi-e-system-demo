// VacancyDistributionChartImage.tsx
import React, { FC } from "react";
import { StaffVacancy } from "@/hooks/report/use-hr-salary-data";
import { VacancyDistributionChart } from "./VacancyDistributionChart";
import { useChartImageGenerator } from "../hooks/useChartImageGenerator";

interface VacancyDistributionChartImageProps {
  data: StaffVacancy[];
  onReady: (img: string) => void;
  width?: number;
  height?: number;
}

export const VacancyDistributionChartImage: FC<VacancyDistributionChartImageProps> = ({
  data,
  onReady,
  width = 520,
  height = 380
}) => {
  const chartRef = useChartImageGenerator({ onImageReady: onReady });

  return (
    <div
      ref={chartRef}
      style={{
        width,
        height,
        backgroundColor: "white",
        padding: "10px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    >
      <VacancyDistributionChart data={data} width={width} height={height} />
    </div>
  );
};
