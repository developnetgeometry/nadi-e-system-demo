
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  colors?: string[];
  height?: number;
  hideLegend?: boolean;
  innerRadius?: number;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  colors = ['#5F26B4', '#31C6E8', '#FFB438', '#FF5724', '#00C49F', '#FFBB28'],
  height = 300,
  hideLegend = false,
  innerRadius = 0,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={80}
              paddingAngle={innerRadius ? 4 : 0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
            {!hideLegend && <Legend layout="horizontal" verticalAlign="bottom" align="center" />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChart;
