import React, { useState, useEffect } from 'react';
import SaleForm from '../components/sales/SaleForm';
import SaleReceipt from '../components/sales/SaleReceipt';
import FilterBar from '../components/FilterBar';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getRecentSales, executeGasSale } from '../services/salesService';
import { getAllInventory } from '../services/inventoryService';
import { getAgencySettings } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/priceUtils';
import { downloadSaleReceiptPDF } from '../utils/exportUtils';
import { ShoppingCart, PlusCircle, Printer, Eye } from 'lucide-react';

const Sales = () => {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [agencySettings, setAgencySettings] = useState({});

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [weightFilter, setWeightFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const { showNotification } = useAuth();

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [salesData, invData, settingsData] = await Promise.all([
        getRecentSales(100),
        getAllInventory(),
        getAgencySettings()
      ]);
      setSales(salesData);
      setInventory(invData);
      setAgencySettings(settingsData);
    } catch (err) {
      console.error('Error fetching sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleCompleteSale = async (saleParams) => {
    try {
      const result = await executeGasSale(saleParams);
      showNotification('Gas sale completed successfully!', 'success');
      fetchSalesData();
      
      // Open Printable Receipt Modal
      setCompletedSale(result.sale);
      setIsReceiptModalOpen(true);
    } catch (err) {
      showNotification(err.message || 'Failed to complete sale transaction.', 'error');
      throw err;
    }
  };

  const handleViewReceipt = (saleItem) => {
    setCompletedSale(saleItem);
    setIsReceiptModalOpen(true);
  };

  // Filter Sales Logic
  const filteredSales = sales.filter((sale) => {
    if (companyFilter !== 'ALL' && sale.company !== companyFilter) return false;
    if (weightFilter !== 'ALL' && Number(sale.weight) !== Number(weightFilter)) return false;
    if (paymentFilter !== 'ALL' && sale.paymentMethod !== paymentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sale.customerName?.toLowerCase().includes(q) ||
        sale.consumerId?.toLowerCase().includes(q) ||
        sale.mobile?.includes(q)
      );
    }

    return true;
  });

  if (loading) {
    return <LoadingSpinner label="Loading gas cylinder sales records..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gas-navy">Gas Cylinder Sales Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Process gas cylinder dispatches, verify 25-day refill rules, and issue sales receipts.
          </p>
        </div>

        <button
          onClick={() => setIsSellModalOpen(true)}
          className="px-5 py-2.5 bg-gas-red hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Sell Gas Cylinder</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Customer, Consumer ID, or Mobile..."
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-gas-navy focus:outline-none"
        >
          <option value="ALL">All Companies</option>
          <option value="HP Gas">HP Gas</option>
          <option value="Indane Gas">Indane Gas</option>
          <option value="Bharat Gas">Bharat Gas</option>
        </select>

        <select
          value={weightFilter}
          onChange={(e) => setWeightFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-gas-navy focus:outline-none"
        >
          <option value="ALL">All Weights</option>
          <option value="2">2 KG</option>
          <option value="5">5 KG</option>
          <option value="14">14 KG</option>
          <option value="19">19 KG</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-gas-navy focus:outline-none"
        >
          <option value="ALL">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
      </FilterBar>

      {/* Sales Table */}
      {filteredSales.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Consumer ID</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-600 text-xs">
                      {formatDate(sale.saleDate)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gas-navy">
                      {sale.customerName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-900 text-xs">
                      <span className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {sale.consumerId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {sale.company}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {sale.weight} KG
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {sale.quantity}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 text-xs">
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
                        onClick={() => handleViewReceipt(sale)}
                        className="inline-flex items-center space-x-1 text-xs text-gas-navy hover:text-gas-red bg-slate-100 hover:bg-red-50 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
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
      ) : (
        <EmptyState
          title="No Sales Records Found"
          description="No sales match your current search or filter criteria. Click 'Sell Gas Cylinder' to process a new sale."
          icon={ShoppingCart}
          actionButton={
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="mt-2 px-4 py-2 bg-gas-red text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
            >
              Process New Gas Sale
            </button>
          }
        />
      )}

      {/* Sell Gas Modal */}
      <SaleForm
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        inventory={inventory}
        refillDurationDays={agencySettings.refillDurationDays || 25}
        onCompleteSale={handleCompleteSale}
      />

      {/* Sale Receipt Modal */}
      <SaleReceipt
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={completedSale}
        agencySettings={agencySettings}
      />

    </div>
  );
};

export default Sales;
