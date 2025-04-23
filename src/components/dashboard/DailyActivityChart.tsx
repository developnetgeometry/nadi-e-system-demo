
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { day: 'Mon', active: 2400, total: 4000 },
  { day: 'Tue', active: 1398, total: 3000 },
  { day: 'Wed', active: 9800, total: 12000 },
  { day: 'Thu', active: 3908, total: 5000 },
  { day: 'Fri', active: 4800, total: 6000 },
  { day: 'Sat', active: 3800, total: 4000 },
  { day: 'Sun', active: 4300, total: 5000 },
];

const DailyActivityChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="totalSessions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D8B4FE" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#D8B4FE" stopOpacity={0.4} />
          </linearGradient>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
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
          cursor={{ fill: 'rgba(236, 237, 244, 0.4)' }}
        />
        <Legend 
          iconType="circle" 
          wrapperStyle={{ paddingTop: '10px' }}
        />
        <Bar 
          name="Active Users" 
          dataKey="active" 
          fill="url(#activeUsers)" 
          radius={[6, 6, 0, 0]} 
          barSize={30}
          style={{ filter: 'url(#shadow)' }}
        />
        <Bar 
          name="Total Sessions" 
          dataKey="total" 
          fill="url(#totalSessions)" 
          radius={[6, 6, 0, 0]} 
          barSize={30}
          style={{ filter: 'url(#shadow)' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyActivityChart;
