import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import EmptyState from '../EmptyState';
import { History } from 'lucide-react';

const InventoryHistory = ({ transactions = [] }) => {
  if (!transactions.length) {
    return (
      <EmptyState
        title="No Inventory Transactions Logged"
        description="Transaction logs will record automatically when stock is added or gas is sold."
        icon={History}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gas-navy" />
          <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">Inventory Transaction History</h3>
        </div>
        <span className="text-xs text-gray-500 font-semibold">{transactions.length} Total Logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Company & Weight</th>
              <th className="py-3 px-4">Operation</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Filled Stock (Before → After)</th>
              <th className="py-3 px-4">Empty Stock (Before → After)</th>
              <th className="py-3 px-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {transactions.map((tx) => {
              const isSale = tx.transactionType === 'SALE';
              const isStockIn = tx.transactionType === 'STOCK_IN';

              return (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-gray-600">
                    {formatDate(tx.createdAt)}
                  </td>

                  <td className="py-3 px-4 font-bold text-gas-navy">
                    {tx.company} ({tx.weight} KG)
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] ${
                        isSale
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : isStockIn
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {tx.transactionType}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-900">
                    {tx.quantity}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-gray-500">{tx.previousFilled}</span>
                    <span className="mx-1 text-gray-400">→</span>
                    <span className="font-bold text-emerald-700">{tx.newFilled}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-gray-500">{tx.previousEmpty}</span>
                    <span className="mx-1 text-gray-400">→</span>
                    <span className="font-bold text-gray-800">{tx.newEmpty}</span>
                  </td>

                  <td className="py-3 px-4 text-gray-500 italic max-w-xs truncate">
                    {tx.notes || '-'}
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

export default InventoryHistory;
