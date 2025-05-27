// IncentiveByPositionChart.tsx
import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Cell,
  CartesianGrid
} from "recharts";
import { SALARY_CHART_COLORS, getDefaultColor } from "../utils/colorUtils";
import { useChartImageGenerator } from '../hooks/useChartImageGenerator';

export interface IncentiveData {
  position: string;
  incentive: number;
  color?: string;
}

interface IncentiveByPositionChartProps {
  data: IncentiveData[];
  width?: number;
  height?: number;
  onReady?: (img: string) => void;
}

export const IncentiveByPositionChart: FC<IncentiveByPositionChartProps> = ({ 
  data, 
  width = 650, 
  height = 420,
  onReady
}) => {
  // Use image generator only if onReady is provided
  const chartRef = onReady ? useChartImageGenerator({ onImageReady: onReady }) : undefined;

  // Always render a container with minWidth/minHeight to avoid Recharts 0x0 error
  return (
    <div
      ref={chartRef}
      style={onReady ? { width, height, backgroundColor: 'white', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' } : { width, height, minWidth: 200, minHeight: 150 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {data.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', paddingTop: 100 }}>
            No data available
          </div>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 50, bottom: 40 }}
          >
            <text x={width / 2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
              Performance Incentives (RM) by Designation
            </text>
            <XAxis 
              dataKey="position" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={true}
              height={40}
            />
            <YAxis 
              tickFormatter={(value) => value === 0 ? '0' : `RM ${value}`} 
              tick={{ fontSize: 12 }}
              domain={[0, 'dataMax + 1000']}
              tickCount={6}
              width={60}
              axisLine={true}
              label={{ 
                value: 'Incentive Average (RM)', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fontSize: 12, fontWeight: 'bold' } 
              }} 
            />
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Bar 
              dataKey="incentive" 
              name="Incentive (RM)" 
              barSize={60}
              label={{
                position: 'top',
                formatter: (value: number) => `RM ${value}`,
                fontSize: 12,
                fontWeight: 'bold',
                fill: '#000',
                dy: -10
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SALARY_CHART_COLORS[entry.position] || entry.color || getDefaultColor(index)}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
