import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue' // red, blue, green, amber, purple
}) => {
  const colorMap = {
    red: { bg: 'bg-red-50', text: 'text-gas-red', border: 'border-red-100' },
    navy: { bg: 'bg-slate-50', text: 'text-gas-navy', border: 'border-slate-200' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  };

  const selectedColor = colorMap[color] || colorMap.navy;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-150 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center text-xs font-medium">
          <span className={trend.isPositive ? 'text-emerald-600' : 'text-red-600'}>
            {trend.value}
          </span>
          <span className="text-gray-400 ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
