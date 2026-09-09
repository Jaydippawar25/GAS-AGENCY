import React from 'react';
import StatCard from '../StatCard';
import { formatCurrency } from '../../utils/priceUtils';
import { IndianRupee, PackageCheck, Flame, ShoppingBag } from 'lucide-react';

const ReportSummary = ({ totalRevenue, totalCylinders, totalOrders, companyBreakdown = [] }) => {
  const hpData = companyBreakdown.find(c => c.company === 'HP Gas') || { cylindersSold: 0, totalSales: 0 };
  const indaneData = companyBreakdown.find(c => c.company === 'Indane Gas') || { cylindersSold: 0, totalSales: 0 };
  const bharatData = companyBreakdown.find(c => c.company === 'Bharat Gas') || { cylindersSold: 0, totalSales: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Sales Revenue"
        value={formatCurrency(totalRevenue)}
        subtitle={`Across ${totalOrders} order transactions`}
        icon={IndianRupee}
        color="green"
      />
      <StatCard
        title="Total Cylinders Sold"
        value={`${totalCylinders} Units`}
        subtitle="Cumulative volume sold"
        icon={PackageCheck}
        color="red"
      />
      <StatCard
        title="HP Gas Revenue"
        value={formatCurrency(hpData.totalSales)}
        subtitle={`${hpData.cylindersSold} HP Cylinders`}
        icon={Flame}
        color="blue"
      />
      <StatCard
        title="Indane & Bharat Revenue"
        value={formatCurrency(indaneData.totalSales + bharatData.totalSales)}
        subtitle={`Indane: ${indaneData.cylindersSold} | Bharat: ${bharatData.cylindersSold}`}
        icon={ShoppingBag}
        color="amber"
      />
    </div>
  );
};

export default ReportSummary;
