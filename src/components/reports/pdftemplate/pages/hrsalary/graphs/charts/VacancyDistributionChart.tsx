// VacancyDistributionChart.tsx
import { FC } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { StaffVacancy } from "@/hooks/report/use-hr-salary-data";
import { getDefaultColor } from "../utils/colorUtils";

interface VacancyDistributionChartProps {
  data: StaffVacancy[];
  width?: number;
  height?: number;
}

export const VacancyDistributionChart: FC<VacancyDistributionChartProps> = ({ 
  data, 
  width = 520, 
  height = 380 
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
  const totalVacancies = data.reduce((sum, item) => sum + item.open, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 60, right: 10, left: 10, bottom: 10 }}>        <text x={width / 2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
          Vacancy Distribution (Total: {totalVacancies})
        </text>
        <Pie
          data={data}
          cx="50%"
          cy="55%"
          dataKey="open"
          nameKey="position"
          label={createPieLabelRenderer({ data, nameKey: 'position', dataKey: 'open' })}
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
          verticalAlign="top"
          align="center"
          wrapperStyle={{ top: 35, fontSize: 12, fontWeight: 'bold' }}
          iconSize={12}
          iconType="circle"
          formatter={(value, entry, index) => {
            const item = data[index];
            return `${value} (${item.open})`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
