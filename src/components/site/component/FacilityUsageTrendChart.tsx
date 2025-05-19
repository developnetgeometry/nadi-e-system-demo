
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
  { day: 'Mon', usage: 23 },
  { day: 'Tue', usage: 11 },
  { day: 'Wed', usage: 23 },
  { day: 'Thu', usage: 4 },
  { day: 'Fri', usage: 12 },
  { day: 'Sat', usage: 23 },
  { day: 'Sun', usage: 30 },
];

const TOTAL_FACILITIES = 30;

const data = rawData.map((item) => ({
  ...item,
  usage: Math.min(100, Math.floor((item.usage / TOTAL_FACILITIES) * 100)),
}));

const FacilityUsageTrend: React.FC = () => {
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
        <Bar 
          name="usage" 
          dataKey="usage" 
          fill="url(#usage)" 
          radius={[6, 6, 0, 0]} 
          barSize={30}
          style={{ filter: 'url(#shadow)' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FacilityUsageTrend;