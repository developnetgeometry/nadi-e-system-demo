// ChartImageRenderer.tsx
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Cell,
  Text,
  PieLabelRenderProps,
  CartesianGrid
} from "recharts";
import {
  StaffDistribution,
  StaffVacancy
} from "@/hooks/report/use-hr-salary-data";

// Default colors for charts based on the images provided
const DEFAULT_COLORS = ['#0000FF', '#FFA500', '#008000', '#FF0000', '#800080'];

// Specific colors for the salary bar chart (matching the first image)
const SALARY_CHART_COLORS = {
  'Manager': '#0000FF',       // Blue for Manager 
  'Assistant Manager': '#FFA500', // Orange for Assistant Manager
  'Part-timer': '#008000'     // Green for Part-timer
};

const getDefaultColor = (index: number): string => {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

interface ChartImageRendererProps {
  type: 'staffDistribution' | 'salaryByPosition' | 'vacancyDistribution';
  data: StaffDistribution[] | StaffVacancy[] | any[];
  onReady: (img: string) => void;
  width?: number;
  height?: number;
}

export const ChartImageRenderer = ({
  type,
  data,
  onReady,
  width = 500,
  height = 300
}: ChartImageRendererProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!chartRef.current) return;

      html2canvas(chartRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
      }).then((canvas) => {
        const base64Image = canvas.toDataURL("image/png");
        onReady(base64Image);
      });
    }, 500); // Allow time for render

    return () => clearTimeout(timer);
  }, [data, type, onReady]);


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


  const renderChart = () => {
    switch (type) {
      case 'staffDistribution':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 15, right: 10, left: 10, bottom: 10 }}>
              <text x={width / 2} y={10} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight="bold">
                Number of Staff by Designation (Total: {(data as StaffDistribution[]).reduce((sum, item) => sum + item.count, 0)})
              </text>
              <Pie
                data={data as StaffDistribution[]}
                cx="50%"
                cy="50%"
                // outerRadius={90}
                // innerRadius={0}
                // paddingAngle={2}
                // fill="#8884d8"
                dataKey="count"
                nameKey="position"
                label={createPieLabelRenderer({ data, nameKey: 'position', dataKey: 'count' })}
                labelLine={false}
                isAnimationActive={false}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {(data as StaffDistribution[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getDefaultColor(index)} />
                ))}
              </Pie>

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                // wrapperStyle={{ top: 35, fontSize: 12, fontWeight: 'bold' }}
                iconSize={12}
                iconType="circle"
                formatter={(value, entry, index) => {
                  // Format legend items to include count in parentheses
                  const item = (data as StaffDistribution[])[index];
                  return `${value} (${item.count})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'salaryByPosition':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 30, right: 30, left: 50, bottom: 40 }}
            >
              <text x={width / 2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                Salary Amount (RM) by Designation
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
                  value: 'Salary Average (RM)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12, fontWeight: 'bold' }
                }} />
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingTop: 20 }}
              />
              <Bar
                dataKey="salary"
                name="Salary (RM)"
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
                {(data as any[]).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SALARY_CHART_COLORS[entry.position as keyof typeof SALARY_CHART_COLORS] || getDefaultColor(index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'vacancyDistribution':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 60, right: 10, left: 10, bottom: 10 }}>
              <text x={width / 2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                Vacancy Distribution (Total: {(data as StaffVacancy[]).reduce((sum, item) => sum + item.open, 0)})
              </text>
              <Pie
                data={data as StaffVacancy[]}
                cx="50%"
                cy="55%"
                // outerRadius={90}
                // innerRadius={0}
                // paddingAngle={2}
                // fill="#8884d8"
                dataKey="open"
                nameKey="position"
                label={createPieLabelRenderer({ data, nameKey: 'position', dataKey: 'count' })}
                labelLine={false}
                isAnimationActive={false}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {(data as StaffVacancy[]).map((entry, index) => (
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
                  // Format legend items to include count in parentheses
                  const item = (data as StaffVacancy[])[index];
                  return `${value} (${item.open})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={chartRef}
      style={{
        width: width,
        height: height,
        backgroundColor: "white",
        padding: "10px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    >
      {renderChart()}
    </div>
  );
};
