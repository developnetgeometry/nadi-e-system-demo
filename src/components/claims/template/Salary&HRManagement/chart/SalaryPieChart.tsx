import React, { FC } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
  PieLabelRenderProps,
} from "recharts";
import { getDefaultColor } from "./chart-util.ts"; // Adjust the import path as necessary

interface SalaryPieChartProps {
  data: any[];
  width?: number;
  height?: number;
}

// Rename to SalaryPieChart for clarity and to match import usage
const SalaryPieChart: FC<SalaryPieChartProps> = ({ 
  data, 
  width = 650, 
  height = 420,
}) => {
  const createPieLabelRenderer = ({ data, nameKey, dataKey }: any) => (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
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
    <div
      style={{ width, height, backgroundColor: 'white', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {data.length === 0 ? (
          <PieChart>
            <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="central" fontSize={16} fill="#aaa">
              No data available
            </text>
          </PieChart>
        ) : (
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
              formatter={(value: string, entry: any, index: number) => {
                const item = data[index];
                return `${value} (${item.count})`;
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export { SalaryPieChart };
