
import React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
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

export const BarChart: React.FC<BarChartProps> = ({
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
          <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            {!hideGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
            <XAxis dataKey={indexBy} />
            <YAxis />
            <Tooltip />
            {!hideLegend && <Legend />}
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
