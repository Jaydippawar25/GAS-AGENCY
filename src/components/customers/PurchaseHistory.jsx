import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/priceUtils';
import StatusBadge from '../StatusBadge';
import EmptyState from '../EmptyState';
import { ShoppingBag, Printer } from 'lucide-react';
import { downloadSaleReceiptPDF } from '../../utils/exportUtils';

const PurchaseHistory = ({ sales = [], agencySettings = {} }) => {
  if (!sales.length) {
    return (
      <EmptyState
        title="No Purchase History Found"
        description="This customer has not made any gas cylinder purchases yet."
        icon={ShoppingBag}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">Complete Customer Purchase History</h3>
        <span className="text-xs text-gray-500 font-semibold">{sales.length} Total Orders</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Cylinder Weight</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-semibold text-gray-700">
                  {formatDate(sale.saleDate)}
                </td>

                <td className="py-3.5 px-4 font-bold text-gas-navy">
                  {sale.company}
                </td>

                <td className="py-3.5 px-4 font-semibold text-gray-800">
                  {sale.weight} KG
                </td>

                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {sale.quantity}
                </td>

                <td className="py-3.5 px-4 text-gray-600">
                  {formatCurrency(sale.unitPrice)}
                </td>

                <td className="py-3.5 px-4 font-bold text-emerald-700">
                  {formatCurrency(sale.totalPrice)}
                </td>

                <td className="py-3.5 px-4">
                  <StatusBadge type="payment" status={sale.paymentMethod || 'Cash'} />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => downloadSaleReceiptPDF(sale, agencySettings)}
                    className="inline-flex items-center space-x-1 text-xs text-gas-navy hover:text-gas-red bg-slate-100 hover:bg-red-50 px-2.5 py-1 rounded border border-slate-200 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistory;
