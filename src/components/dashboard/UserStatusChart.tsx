
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  LabelList 
} from 'recharts';

const data = [
  { name: 'Active', value: 18429, color: '#10B981', gradientId: 'activeGradient' },
  { name: 'Inactive', value: 4350, color: '#F59E0B', gradientId: 'inactiveGradient' },
  { name: 'Pending', value: 1200, color: '#3B82F6', gradientId: 'pendingGradient' },
  { name: 'Suspended', value: 601, color: '#EF4444', gradientId: 'suspendedGradient' },
];

const COLORS = data.map(item => item.color);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontWeight="bold"
      fontSize="14"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const UserStatusChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="suspendedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={90}
          innerRadius={45}
          paddingAngle={4}
          dataKey="value"
          strokeWidth={3}
          stroke="#ffffff"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#${entry.gradientId})`}
              className="filter drop-shadow-lg"
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value.toLocaleString()} users`, null]}
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: 'none',
            padding: '10px 14px'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '6px' }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            paddingTop: '20px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UserStatusChart;
