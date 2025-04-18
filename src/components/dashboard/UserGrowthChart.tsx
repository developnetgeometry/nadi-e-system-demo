
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';

const data = [
  { month: 'Jan', users: 4000 },
  { month: 'Feb', users: 5000 },
  { month: 'Mar', users: 7000 },
  { month: 'Apr', users: 8500 },
  { month: 'May', users: 10000 },
  { month: 'Jun', users: 12000 },
  { month: 'Jul', users: 16000 },
  { month: 'Aug', users: 18000 },
  { month: 'Sep', users: 20000 },
  { month: 'Oct', users: 22000 },
  { month: 'Nov', users: 23500 },
  { month: 'Dec', users: 24580 },
];

const UserGrowthChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
          </linearGradient>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280" 
          fontSize={12} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
        />
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
          iconType="circle" 
          wrapperStyle={{ paddingTop: '10px' }}
        />
        <Area
          type="monotone"
          dataKey="users"
          name="Total Users"
          stroke="#0EA5E9"
          fillOpacity={1}
          fill="url(#colorUsers)"
          strokeWidth={3}
          style={{ filter: 'url(#shadow)' }}
          activeDot={{ 
            r: 8, 
            strokeWidth: 2, 
            stroke: '#fff',
            fill: '#0EA5E9',
            className: 'animate-pulse'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
