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

interface ManPowerPieChartProps {
  data: any[];
  width?: number;
  height?: number;
}

export const ManPowerPieChart: FC<ManPowerPieChartProps> = ({ 
  data, 
  width = 650, 
  height = 420,
}) => {
  // Debug: log the data received by the chart
  console.log('[ManPowerPieChart] data:', data);

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
  const totalVacancies = data.reduce((sum, item) => sum + item.vacant, 0);


  return (
    <div
      style={{ width, height, backgroundColor: 'white', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {data.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', paddingTop: 100 }}>No data available</div>
        ) : (
          <PieChart margin={{ top: 60, right: 10, left: 10, bottom: 10 }}>
            <text x={width / 2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
              Vacancy Distribution (Total: {totalVacancies})
            </text>
            <Pie
              data={data}
              cx="50%"
              cy="55%"
              dataKey="vacant"
              nameKey="position"
              label={createPieLabelRenderer({ data, nameKey: 'position', dataKey: 'vacant' })}
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
                return `${value} (${item.vacant})`;
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default ManPowerPieChart;