import React from 'react';
import StatusBadge from '../StatusBadge';
import { PlusCircle, Edit3, ShieldAlert } from 'lucide-react';

const InventoryTable = ({ inventory, onEditStock }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Gas Company</th>
              <th className="py-3.5 px-4">Cylinder Weight</th>
              <th className="py-3.5 px-4">Filled Cylinders</th>
              <th className="py-3.5 px-4">Empty Cylinders</th>
              <th className="py-3.5 px-4">Total Cylinders</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {inventory.map((item) => {
              const filled = Number(item.filledQuantity || 0);
              const empty = Number(item.emptyQuantity || 0);
              const total = filled + empty;
              const minStock = Number(item.minimumStock || 15);

              let status = 'IN_STOCK';
              if (filled === 0) {
                status = 'OUT_OF_STOCK';
              } else if (filled <= minStock) {
                status = 'LOW_STOCK';
              }

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Company */}
                  <td className="py-3.5 px-4 font-bold text-gas-navy flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      item.company === 'HP Gas' ? 'bg-blue-600' :
                      item.company === 'Indane Gas' ? 'bg-orange-500' : 'bg-emerald-600'
                    }`} />
                    <span>{item.company}</span>
                  </td>

                  {/* Weight */}
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs border border-slate-200">
                      {item.weight} KG
                    </span>
                  </td>

                  {/* Filled */}
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    <div className="flex items-center space-x-1.5">
                      <span>{filled}</span>
                      {status === 'LOW_STOCK' && (
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" title="Low Filled Stock" />
                      )}
                    </div>
                  </td>

                  {/* Empty */}
                  <td className="py-3.5 px-4 font-semibold text-gray-500">
                    {empty}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {total}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge type="stock" status={status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onEditStock(item)}
                      className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-gas-navy hover:text-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-slate-200"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Update Stock</span>
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

export default InventoryTable;
