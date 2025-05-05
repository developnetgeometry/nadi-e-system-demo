
import React from 'react';
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartProps {
  title: string;
  data: Array<Record<string, any>>;
  categories: string[];
  indexBy: string;
  colors?: string[];
  height?: number;
  hideGrid?: boolean;
  hideLegend?: boolean;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  categories,
  indexBy,
  colors = ['#5F26B4', '#31C6E8', '#FFB438'],
  height = 300,
  hideGrid = false,
  hideLegend = false,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            {!hideGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
            <XAxis dataKey={indexBy} />
            <YAxis />
            <Tooltip />
            {!hideLegend && <Legend />}
            {categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChart;
