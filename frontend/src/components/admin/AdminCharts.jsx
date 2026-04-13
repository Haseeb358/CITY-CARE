import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend
} from 'recharts';

export const ComplaintsOverTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
  }

  // Format data for Recharts
  const chartData = data.map(item => {
    // Convert YYYY-MM-DD to a more readable format e.g., Apr 10
    const parts = item._id.split('-');
    const dateStr = parts.length === 3 ? `${new Date(item._id).toLocaleString('en-US', { month: 'short' })} ${parts[2]}` : item._id;
    return { name: dateStr, value: item.count };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
          <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
          <LineTooltip 
            contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Colors for donut chart
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7', '#6b7280'];

export const ComplaintsByStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
  }

  const chartData = data.map(item => ({
    name: item._id, // e.g. "Pending"
    value: item.count
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            stroke="none"
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} />
          <Legend wrapperStyle={{ color: '#aaa', fontSize: '13px' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
