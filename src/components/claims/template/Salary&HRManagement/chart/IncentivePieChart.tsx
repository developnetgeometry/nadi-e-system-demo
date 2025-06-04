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

interface IncentivePieChartProps {
  data: any[];
  width?: number;
  height?: number;

}

export const IncentivePieChart: FC<IncentivePieChartProps> = ({
  data = [],
  width = 650,
  height = 420,

}) => {
  console.log('[IncentivePieChart] data:', data);
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

  // Safely calculate total
  const total = Array.isArray(data) ? data.reduce((sum, item) => sum + (item.count || 0), 0) : 0;

  return (
    <div
      style={{ width, height, backgroundColor: 'white', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' } }
    >
      <ResponsiveContainer width="100%" height="100%">
        {data.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', paddingTop: 100 }}>No data available</div>
        ) : (
          <PieChart margin={{ top: 15, right: 10, left: 10, bottom: 10 }}>
            <text
              x={width / 2}
              y={10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={15}
              fontWeight="bold"
            >
              Incentive Distribution (Total: {total})
            </text>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              dataKey="count"
              nameKey="position"
            //   outerRadius={90}
            //   innerRadius={0}
            //   paddingAngle={2}
              label={createPieLabelRenderer({ data, nameKey: "position", dataKey: "count" })}
              labelLine={false}
              isAnimationActive={false}
              strokeWidth={2}
              stroke="#ffffff"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#36A2EB"} />
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
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default IncentivePieChart;
