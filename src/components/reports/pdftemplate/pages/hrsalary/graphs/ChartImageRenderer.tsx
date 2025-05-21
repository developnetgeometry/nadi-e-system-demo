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
  Tooltip,
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

// Custom formatter for currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('MYR', 'RM');
};

// Custom label renderer for the pie chart - directly on the pie slices
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, x, y } = props;
  // Calculate the position for the label - directly on the pie slice
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const labelX = cx + radius * Math.cos(-midAngle * RADIAN);
  const labelY = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Only show value in the pie slices if there's enough space
  if (percent > 0.15) {
    return (
      <text 
        x={labelX} 
        y={labelY} 
        fill="#FFFFFF"
        textAnchor="middle" 
        dominantBaseline="central"
        fontWeight="bold"
      >
        {value}
      </text>
    );
  }
  return null;
};

// Custom tooltip for salary chart
const SalaryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        border: '1px solid #ccc',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0 }}>{`${label}: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
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

  const renderChart = () => {
    switch (type) {        case 'staffDistribution':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 60, right: 10, left: 10, bottom: 10 }}>
              <text x={width/2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                Number of Staff by Designation (Total: {(data as StaffDistribution[]).reduce((sum, item) => sum + item.count, 0)})
              </text>              <Pie
                data={data as StaffDistribution[]}
                cx="50%"
                cy="55%"
                outerRadius={90}
                innerRadius={0}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="count"
                nameKey="position"
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={false}
                strokeWidth={1}
                stroke="#ffffff"
              >
                {(data as StaffDistribution[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getDefaultColor(index)} />
                ))}
              </Pie>              <Legend 
                layout="horizontal" 
                verticalAlign="top"
                align="center"
                wrapperStyle={{ top: 35, fontSize: 12, fontWeight: 'bold' }}
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
        );case 'salaryByPosition':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 30, right: 30, left: 50, bottom: 40 }}
            >
              <text x={width/2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
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
                }}
              />
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <Tooltip 
                content={<SalaryTooltip />}
              />
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
              >                {(data as any[]).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SALARY_CHART_COLORS[entry.position as keyof typeof SALARY_CHART_COLORS] || getDefaultColor(index)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );      case 'vacancyDistribution':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 60, right: 10, left: 10, bottom: 10 }}>
              <text x={width/2} y={20} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                Vacancy Distribution (Total: {(data as StaffVacancy[]).reduce((sum, item) => sum + item.open, 0)})
              </text>              <Pie
                data={data as StaffVacancy[]}
                cx="50%"
                cy="55%"
                outerRadius={90}
                innerRadius={0}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="open"
                nameKey="position"
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={false}
                strokeWidth={1}
                stroke="#ffffff"
              >
                {(data as StaffVacancy[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getDefaultColor(index)} />
                ))}
              </Pie>              <Legend 
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
        position: "absolute", 
        left: "-9999px",
        backgroundColor: "#ffffff",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      {renderChart()}
    </div>
  );
};
