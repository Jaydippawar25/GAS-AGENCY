import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  title = 'No records found',
  description = 'Try adjusting your search or filter parameters.',
  icon: Icon = PackageOpen,
  actionButton
}) => {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center my-4">
      <div className="p-3 bg-red-50 text-gas-red rounded-full mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-gas-navy">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
