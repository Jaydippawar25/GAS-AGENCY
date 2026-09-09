import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/priceUtils';

const SalesChart = ({ data = [], year = 2026 }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
            Monthly Sales Trend ({year})
          </h3>
          <p className="text-xs text-gray-500">Revenue & volume breakdown across all 12 months</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="shortName" tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `₹${v / 1000}k`} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip
              formatter={(value, name) => [
                name === 'totalSales' ? formatCurrency(value) : `${value} Cylinders`,
                name === 'totalSales' ? 'Total Sales Revenue' : 'Cylinders Sold'
              ]}
              contentStyle={{ backgroundColor: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="totalSales" name="Sales Revenue (₹)" fill="#D32F2F" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="cylindersSold" name="Cylinders Sold (Qty)" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
