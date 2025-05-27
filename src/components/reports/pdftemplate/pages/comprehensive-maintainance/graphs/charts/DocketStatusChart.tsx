// DocketStatusChart.tsx
import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartImageGenerator } from '../hooks/useChartImageGenerator';
import { DocketStatusData } from "@/hooks/report/use-cm-byphase-pdf-data";



interface DocketStatusChartProps {
  data: DocketStatusData[];
  width?: number;
  height?: number;
  onReady?: (img: string) => void;
}

export const DocketStatusChart: FC<DocketStatusChartProps> = ({ 
  data, 
  width = 650, 
  height = 380,
  onReady
}) => {
  const chartRef = onReady ? useChartImageGenerator({ onImageReady: onReady }) : undefined;

  // Colors for the bars
  const minorColor = "#4169E1"; // Royal Blue
  const majorColor = "#DC143C"; // Crimson

  return (
    <div ref={chartRef} style={{ width, height, backgroundColor: "white" }}>
      <h4 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>
        Number of Dockets by Status (Minor & Major)
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="status" 
            label={{ value: 'Docket Status', position: 'insideBottom', offset: -20 }} 
          />
          <YAxis 
            label={{ value: 'Number of Dockets', angle: -90, position: 'insideLeft', offset: -5 }} 
          />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <Bar dataKey="minor" name="Minor" fill={minorColor} />
          <Bar dataKey="major" name="Major" fill={majorColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
