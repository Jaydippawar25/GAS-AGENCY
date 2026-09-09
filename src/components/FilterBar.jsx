import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ children }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-2 text-gray-500 text-xs font-semibold uppercase tracking-wider shrink-0">
        <Filter className="w-4 h-4 text-gas-navy" />
        <span>Filter Options</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
        {children}
      </div>
    </div>
  );
};

export default FilterBar;
