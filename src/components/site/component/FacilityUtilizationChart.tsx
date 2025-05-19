
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

const rawData = [
  { name: 'Meeting Room', usage: 23, maintenance: 2 },
  { name: 'Conference Room', usage: 11, maintenance: 3 },
  { name: 'Computer Lab 1', usage: 23, maintenance: 1 },
  { name: 'Study Room', usage: 4, maintenance: 4 },
  { name: 'Computer Lab 2', usage: 12, maintenance: 6 },
  { name: 'Conrefence Room', usage: 23, maintenance: 10 },
  { name: 'Computer Lab 3', usage: 30, maintenance: 3 },
];

const MAX_DAYS = 30;

const data = rawData.map((item) => ({
  ...item,
  usage: Math.min(100, Math.floor((item.usage / MAX_DAYS) * 100)),
  maintenance: Math.min(100, Math.floor((item.maintenance / MAX_DAYS) * 100)),
}));

const FacilityUtilization: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="usage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="maintenance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4} />
          </linearGradient>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
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
          tickFormatter={(value) => value && `${value}%`}
        />
        <Tooltip 
          formatter={(value, name) => [`${value}%`, name]}
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
          name="usage" 
          dataKey="usage" 
          fill="url(#usage)" 
          radius={[6, 6, 0, 0]} 
          barSize={30}
          style={{ filter: 'url(#shadow)' }}
        />
        <Bar 
          name="maintenance" 
          dataKey="maintenance" 
          fill="url(#maintenance)" 
          radius={[6, 6, 0, 0]} 
          barSize={30}
          style={{ filter: 'url(#shadow)' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FacilityUtilization;