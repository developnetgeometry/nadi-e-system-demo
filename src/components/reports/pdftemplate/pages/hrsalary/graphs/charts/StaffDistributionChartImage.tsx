// StaffDistributionChartImage.tsx
import React, { FC } from "react";
import { StaffDistribution } from "@/hooks/report/use-hr-salary-data";
import { StaffDistributionChart } from "./StaffDistributionChart";
import { useChartImageGenerator } from "../hooks/useChartImageGenerator";

interface StaffDistributionChartImageProps {
  data: StaffDistribution[];
  onReady: (img: string) => void;
  width?: number;
  height?: number;
}

export const StaffDistributionChartImage: FC<StaffDistributionChartImageProps> = ({
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
      <StaffDistributionChart data={data} width={width} height={height} />
    </div>
  );
};
