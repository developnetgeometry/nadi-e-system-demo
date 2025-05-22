import { FC } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useChartImageGenerator } from '../hooks/useChartImageGenerator';

export interface IncentiveDistributionData {
  position: string;
  count: number;
  color?: string;
}

interface IncentiveDistributionChartProps {
  data: IncentiveDistributionData[];
  width?: number;
  height?: number;
  onReady?: (img: string) => void;
}

export const IncentiveDistributionChart: FC<IncentiveDistributionChartProps> = ({
  data = [],
  width = 650,
  height = 420,
  onReady
}) => {
  const createPieLabelRenderer = ({ data, nameKey, dataKey }: any) => ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const item = data[index];
    const labelText = item[nameKey];
    const formattedPercent = `${(percent * 100).toFixed(0)}%`;
    // Outer label (position)
    const radiusOuter = outerRadius + 10;
    const outerX = cx + radiusOuter * Math.cos(-midAngle * RADIAN);
    const outerY = cy + radiusOuter * Math.sin(-midAngle * RADIAN);
    // Inner label (percent)
    const radiusInner = innerRadius + (outerRadius - innerRadius) * 0.5;
    const innerX = cx + radiusInner * Math.cos(-midAngle * RADIAN);
    const innerY = cy + radiusInner * Math.sin(-midAngle * RADIAN);
    return (
      <>
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

  // Use image generator only if onReady is provided
  const chartRef = onReady ? useChartImageGenerator({ onImageReady: onReady }) : undefined;

  return (
    <div
      ref={chartRef}
      style={onReady ? { width, height, backgroundColor: 'white', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' } : { width, height, minWidth: 200, minHeight: 150 }}
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
              outerRadius={90}
              innerRadius={0}
              paddingAngle={2}
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
