import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const CGPALineChart = ({ data = [] }) => {
  // Filter out semesters that are upcoming or have no results yet
  const chartData = data
    .filter(d => d.cgpa !== null && d.cgpa !== undefined)
    .map(d => ({
      name: d.semester,
      CGPA: d.cgpa,
      SGPA: d.sgpa
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-200">
        <p className="text-sm text-gray-500 font-medium">No academic progression data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="CGPA" 
            stroke="#2563EB" 
            strokeWidth={3} 
            dot={{ stroke: '#2563EB', strokeWidth: 2, r: 4, fill: '#FFFFFF' }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="SGPA" 
            stroke="#93C5FD" 
            strokeWidth={2} 
            strokeDasharray="4 4"
            dot={{ stroke: '#93C5FD', strokeWidth: 1, r: 3, fill: '#FFFFFF' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
