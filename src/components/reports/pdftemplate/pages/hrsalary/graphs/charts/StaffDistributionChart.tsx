// StaffDistributionChart.tsx
import { FC } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
  PieLabelRenderProps,
} from "recharts";
import { StaffDistribution } from "@/hooks/report/use-hr-salary-data";
import { getDefaultColor } from "../utils/colorUtils";

interface StaffDistributionChartProps {
  data: StaffDistribution[];
  width?: number;
  height?: number;
}

export const StaffDistributionChart: FC<StaffDistributionChartProps> = ({ 
  data, 
  width = 500, 
  height = 300 
}) => {
  const createPieLabelRenderer = ({ data, nameKey, dataKey }) => ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const RADIAN = Math.PI / 180;
    const item = data[index];
    const labelText = item[nameKey];
    const formattedPercent = `${(percent * 100).toFixed(0)}%`;

    const radiusOuter = outerRadius + 10;
    const radiusInner = innerRadius + (outerRadius - innerRadius) * 0.5;

    const outerX = cx + radiusOuter * Math.cos(-midAngle * RADIAN);
    const outerY = cy + radiusOuter * Math.sin(-midAngle * RADIAN);

    const innerX = cx + radiusInner * Math.cos(-midAngle * RADIAN);
    const innerY = cy + radiusInner * Math.sin(-midAngle * RADIAN);

    return (
      <>
        {/* Outer Label (Name/Position) */}
        <text
          x={outerX}
          y={outerY}
          textAnchor={outerX > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
          fill="#000"
        >
          {labelText}
        </text>

        {/* Inner Label (Percentage) */}
        <text
          x={innerX}
          y={innerY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
          fill="#fff"
        >
          {formattedPercent}
        </text>
      </>
    );
  };
  const totalStaff = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 15, right: 10, left: 10, bottom: 10 }}>
        <text x={width / 2} y={10} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight="bold">
          Number of Staff by Designation (Total: {totalStaff})
        </text>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          dataKey="count"
          nameKey="position"
          label={createPieLabelRenderer({ data, nameKey: 'position', dataKey: 'count' })}
          labelLine={false}
          isAnimationActive={false}
          strokeWidth={2}
          stroke="#ffffff"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || getDefaultColor(index)} />
          ))}
        </Pie>

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={12}
          iconType="circle"
          formatter={(value, entry, index) => {
            const item = data[index];
            return `${value} (${item.count})`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
