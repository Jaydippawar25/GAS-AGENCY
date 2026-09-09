import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/priceUtils';

const CompanyChart = ({ data = [] }) => {
  const COLORS = ['#2563EB', '#F97316', '#059669'];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
          Company Breakdown
        </h3>
        <p className="text-xs text-gray-500">HP Gas vs Indane Gas vs Bharat Gas market share</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="cylindersSold"
              nameKey="company"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ company, cylindersSold }) => `${company}: ${cylindersSold}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} Cylinders (${formatCurrency(props.payload.totalSales)})`,
                props.payload.company
              ]}
              contentStyle={{ backgroundColor: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompanyChart;
