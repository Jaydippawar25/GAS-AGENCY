import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../../utils/priceUtils';

const WeightChart = ({ data = [] }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
          Cylinder Weight Breakdown
        </h3>
        <p className="text-xs text-gray-500">Distribution across 2 KG, 5 KG, 14 KG & 19 KG</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
            <XAxis type="number" tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis dataKey="weight" type="category" tickLine={false} tick={{ fontSize: 12, fill: '#1E3A5F', fontWeight: 'bold' }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} Cylinders Sold (${formatCurrency(props.payload.totalSales)})`,
                'Volume'
              ]}
              contentStyle={{ backgroundColor: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
            />
            <Bar dataKey="cylindersSold" fill="#F9A825" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;
