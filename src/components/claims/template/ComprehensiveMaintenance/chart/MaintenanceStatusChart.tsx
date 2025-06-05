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
  slaTypes?: string[]; // Add this prop for dynamic SLA types
}

export const MaintenanceStatusChart: FC<MaintenanceStatusChartProps> = ({
  data,
  width = 650,
  height = 380,
  slaTypes,
}) => {
  // Generate a color palette for SLA types
  const defaultColors = [
    "#4169E1", // blue
    "#DC143C", // red
    "#FFA500", // orange
    "#008000", // green
    "#800080", // purple
    "#00CED1", // teal
    "#FFD700", // gold
    "#A52A2A", // brown
    "#FF69B4", // pink
    "#808080", // gray
  ];
  // If slaTypes not provided, infer from data
  const allSlaTypes =
    slaTypes ||
    (data.length > 0
      ? Object.keys(data[0]).filter((k) => k !== "status")
      : []);
  const colorMap = allSlaTypes.reduce(
    (acc, sla, idx) => {
      acc[sla] = defaultColors[idx % defaultColors.length];
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <div style={{ width, height, backgroundColor: "white" }}>
      <h4
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Number of Maintenance Dockets by Status ({allSlaTypes.join(" / ")})
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="status"
            label={{
              value: "Docket Status",
              position: "insideBottom",
              offset: -20,
            }}
          />
          <YAxis
            label={{
              value: "Number of Dockets",
              angle: -90,
              position: "insideLeft",
              offset: -5,
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
          {allSlaTypes.map((sla) => (
            <Bar
              key={sla}
              dataKey={sla}
              name={sla}
              fill={colorMap[sla]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaintenanceStatusChart;
