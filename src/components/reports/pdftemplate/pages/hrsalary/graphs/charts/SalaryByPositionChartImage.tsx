// SalaryByPositionChartImage.tsx
import React, { FC } from "react";
import { SalaryByPositionChart } from "./SalaryByPositionChart";
import { useChartImageGenerator } from "../hooks/useChartImageGenerator";
import { SalaryData } from "../ChartGenerator";

interface SalaryByPositionChartImageProps {
  data: SalaryData[];
  onReady: (img: string) => void;
  width?: number;
  height?: number;
}

export const SalaryByPositionChartImage: FC<SalaryByPositionChartImageProps> = ({
  data,
  onReady,
  width = 650,
  height = 420
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
      <SalaryByPositionChart data={data} width={width} height={height} />
    </div>
  );
};
