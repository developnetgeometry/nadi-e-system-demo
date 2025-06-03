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

interface MaintenanceStatusChartProps {
  data: any[]; // Adjust type as needed for your maintenance data
  width?: number;
  height?: number;
}

export const MaintenanceStatusChart: FC<MaintenanceStatusChartProps> = ({
  data,
  width = 650,
  height = 380,
}) => {
  // Example colors
  const minorColor = "#4169E1";
  const majorColor = "#DC143C";
  console.log("Chart data for MaintenanceStatusChart:", data);

  return (
    <div style={{ width, height, backgroundColor: "white" }}>
      <h4 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold" }}>
        Number of Maintenance Dockets by Status (Minor & Major)
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
          <Bar dataKey="minor" name="Minor" fill={minorColor} isAnimationActive={false} />
          <Bar dataKey="major" name="Major" fill={majorColor} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaintenanceStatusChart;
