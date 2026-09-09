import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading data...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-gas-red animate-spin`} />
      {label && <p className="text-xs font-semibold text-gray-500 mt-3">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
