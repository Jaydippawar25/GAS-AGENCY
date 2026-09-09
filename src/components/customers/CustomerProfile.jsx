import React from 'react';
import StatusBadge from '../StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { checkRefillEligibility } from '../../utils/refillUtils';
import { User, Phone, MapPin, Building2, ShoppingBag, Calendar, CheckCircle, Clock } from 'lucide-react';

const CustomerProfile = ({ customer, refillDurationDays = 25 }) => {
  if (!customer) return null;

  const eligibility = checkRefillEligibility(
    customer.lastPurchaseDate,
    customer.nextEligibleDate,
    refillDurationDays
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gas-navy to-slate-800 text-white p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-xl font-bold border border-white/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{customer.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-xs font-mono font-bold">
                  ID: {customer.consumerId}
                </span>
                <span className="text-xs text-gray-300 font-medium">({customer.company})</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-gray-300 block">Refill Status</span>
            <div className="mt-1">
              <StatusBadge type="refill" status={eligibility.isEligible} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Details Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h4>
          
          <div className="flex items-center space-x-2.5 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-semibold">{customer.mobile}</span>
          </div>

          <div className="flex items-start space-x-2.5 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{customer.address || 'No address provided'}</span>
          </div>

          <div className="flex items-center space-x-2.5 text-sm text-gray-700">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{customer.company}</span>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Purchase Summary</h4>

          <div className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-500">Total Purchase Count:</span>
            <span className="font-bold text-gas-navy">{customer.totalPurchases || 0} Orders</span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-500">Total Cylinders Bought:</span>
            <span className="font-bold text-emerald-700">{customer.totalCylinders || 0} Units</span>
          </div>

          <div className="flex items-center justify-between text-sm py-1">
            <span className="text-gray-500">Customer Registered:</span>
            <span className="font-medium text-gray-700">{formatDate(customer.createdAt)}</span>
          </div>
        </div>

        {/* Refill Calculation Metrics */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-gas-navy uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-gas-red" />
            <span>Refill Rule Status</span>
          </h4>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Last Purchase Date:</span>
              <span className="font-semibold text-gray-800">{formatDate(customer.lastPurchaseDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Configured Interval:</span>
              <span className="font-semibold text-gray-800">{refillDurationDays} Days</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-gray-700 font-bold">Next Eligible Refill:</span>
              <span className="font-bold text-emerald-700">{eligibility.nextEligibleFormatted}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 italic pt-1">
            {eligibility.message}
          </p>
        </div>

      </div>

    </div>
  );
};

export default CustomerProfile;
