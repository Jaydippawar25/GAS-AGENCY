import React from 'react';
import { Flame } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-gas-red" />
          <span className="font-semibold text-gray-700">Gas Agency Inventory & Refill System</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
            ● System Active
          </span>
          <span>HP • Indane • Bharat Gas Portal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
