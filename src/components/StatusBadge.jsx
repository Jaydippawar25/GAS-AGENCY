import React from 'react';

const StatusBadge = ({ type, status }) => {
  let badgeStyle = 'bg-gray-100 text-gray-800 border-gray-200';
  let label = status;

  if (type === 'stock') {
    if (status === 'IN_STOCK' || status === 'Optimal') {
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'In Stock';
    } else if (status === 'LOW_STOCK' || status === 'Low Stock') {
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse';
      label = 'Low Stock';
    } else if (status === 'OUT_OF_STOCK' || status === 'Out of Stock') {
      badgeStyle = 'bg-red-50 text-gas-red border-red-200 font-bold';
      label = 'Out of Stock';
    }
  }

  if (type === 'refill') {
    if (status === true || status === 'AVAILABLE' || status === 'Eligible') {
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      label = '● Refill Available';
    } else {
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      label = '● Refill Pending';
    }
  }

  if (type === 'payment') {
    if (status === 'UPI') {
      badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (status === 'Cash') {
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (status === 'Card') {
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
