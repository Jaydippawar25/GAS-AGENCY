import React from 'react';
import { NavLink } from 'react-router-dom';
import StatusBadge from '../StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { checkRefillEligibility } from '../../utils/refillUtils';
import { Eye, Edit, UserCheck } from 'lucide-react';

const CustomerTable = ({ customers, onEditCustomer, refillDurationDays = 25 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Consumer ID</th>
              <th className="py-3.5 px-4">Mobile</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Total Purchases</th>
              <th className="py-3.5 px-4">Last Purchase</th>
              <th className="py-3.5 px-4">Next Eligible Date</th>
              <th className="py-3.5 px-4">Refill Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {customers.map((cust) => {
              const eligibility = checkRefillEligibility(
                cust.lastPurchaseDate,
                cust.nextEligibleDate,
                refillDurationDays
              );

              return (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Name */}
                  <td className="py-3.5 px-4 font-bold text-gas-navy">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-gas-navy flex items-center justify-center font-bold text-xs">
                        {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <NavLink to={`/customers/${cust.id}`} className="hover:underline hover:text-gas-red">
                          {cust.name}
                        </NavLink>
                        {cust.address && (
                          <p className="text-[11px] text-gray-400 font-normal truncate max-w-xs">{cust.address}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Consumer ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs">
                      {cust.consumerId}
                    </span>
                  </td>

                  {/* Mobile */}
                  <td className="py-3.5 px-4 font-medium text-gray-600">
                    {cust.mobile}
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 font-semibold text-gray-700">
                    {cust.company || 'HP Gas'}
                  </td>

                  {/* Total Purchases */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {cust.totalPurchases || 0} Cylinders
                  </td>

                  {/* Last Purchase */}
                  <td className="py-3.5 px-4 text-xs font-medium text-gray-600">
                    {formatDate(cust.lastPurchaseDate)}
                  </td>

                  {/* Next Eligible Date */}
                  <td className="py-3.5 px-4 text-xs font-bold text-emerald-700">
                    {eligibility.nextEligibleFormatted}
                  </td>

                  {/* Refill Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge type="refill" status={eligibility.isEligible} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <NavLink
                      to={`/customers/${cust.id}`}
                      className="inline-flex items-center p-1.5 text-gray-600 hover:text-gas-navy hover:bg-slate-100 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </NavLink>
                    <button
                      onClick={() => onEditCustomer(cust)}
                      className="inline-flex items-center p-1.5 text-gray-600 hover:text-gas-red hover:bg-red-50 rounded-md transition-colors"
                      title="Edit Customer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
