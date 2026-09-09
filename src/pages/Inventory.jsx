import React, { useState, useEffect } from 'react';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryForm from '../components/inventory/InventoryForm';
import InventoryHistory from '../components/inventory/InventoryHistory';
import FilterBar from '../components/FilterBar';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllInventory, updateInventoryStock, addInventoryItem, getInventoryTransactions } from '../services/inventoryService';
import { useAuth } from '../context/AuthContext';
import { Package, History, PlusCircle, Flame } from 'lucide-react';

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('TABLE'); // TABLE or HISTORY

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [weightFilter, setWeightFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('UPDATE_STOCK'); // UPDATE_STOCK or ADD_NEW_GAS
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showNotification } = useAuth();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invData, txData] = await Promise.all([
        getAllInventory(),
        getInventoryTransactions()
      ]);
      setInventory(invData);
      setTransactions(txData);
    } catch (err) {
      console.error('Inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setModalMode('ADD_NEW_GAS');
    setIsModalOpen(true);
  };

  const handleEditStock = (item) => {
    setSelectedItem(item);
    setModalMode('UPDATE_STOCK');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.mode === 'ADD_NEW_GAS') {
        await addInventoryItem(formData);
        showNotification(`New gas category "${formData.company} (${formData.weight} KG)" added successfully!`, 'success');
      } else {
        await updateInventoryStock(formData);
        showNotification('Inventory stock updated successfully!', 'success');
      }
      fetchInventoryData();
    } catch (err) {
      showNotification(err.message || 'Failed to save inventory item.', 'error');
      throw err;
    }
  };

  // Filter Inventory Logic
  const filteredInventory = inventory.filter((item) => {
    if (companyFilter !== 'ALL' && item.company !== companyFilter) return false;
    if (weightFilter !== 'ALL' && Number(item.weight) !== Number(weightFilter)) return false;

    const filled = Number(item.filledQuantity || 0);
    const minStock = Number(item.minimumStock || 15);
    let status = 'IN_STOCK';
    if (filled === 0) status = 'OUT_OF_STOCK';
    else if (filled <= minStock) status = 'LOW_STOCK';

    if (statusFilter !== 'ALL' && status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.company.toLowerCase().includes(q) ||
        String(item.weight).includes(q)
      );
    }

    return true;
  });

  if (loading) {
    return <LoadingSpinner label="Loading gas inventory catalog..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar with Prominent + Add New Gas Button */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A5F]">Gas Cylinder Inventory Catalog</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage filled and empty cylinder stocks across HP, Indane, Bharat, Reliance, and custom gas providers.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-gradient-to-tr from-[#D32F2F] to-[#EF4444] hover:from-red-700 hover:to-red-600 text-white text-xs font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 shrink-0 hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Gas</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('TABLE')}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                activeTab === 'TABLE' ? 'bg-white text-[#1E3A5F] shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Stock Catalog ({filteredInventory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                activeTab === 'HISTORY' ? 'bg-white text-[#1E3A5F] shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History ({transactions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'TABLE' && (
        <>
          {/* Filters Bar */}
          <FilterBar>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search company or weight (e.g. HP, Reliance, 14KG)..."
            />

            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 text-xs font-medium focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
            >
              <option value="ALL">All Companies</option>
              <option value="HP Gas">HP Gas</option>
              <option value="Indane Gas">Indane Gas</option>
              <option value="Bharat Gas">Bharat Gas</option>
              <option value="Reliance Gas">Reliance Gas</option>
            </select>

            <select
              value={weightFilter}
              onChange={(e) => setWeightFilter(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 text-xs font-medium focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
            >
              <option value="ALL">All Weights</option>
              <option value="2">2 KG</option>
              <option value="5">5 KG</option>
              <option value="14">14 KG</option>
              <option value="19">19 KG</option>
              <option value="47.5">47.5 KG</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 text-xs font-medium focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </FilterBar>

          {/* Main Inventory Table */}
          <InventoryTable inventory={filteredInventory} onEditStock={handleEditStock} />
        </>
      )}

      {activeTab === 'HISTORY' && (
        <InventoryHistory transactions={transactions} />
      )}

      {/* Add / Update Gas Modal Form */}
      <InventoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        mode={modalMode}
        onSubmit={handleFormSubmit}
      />

    </div>
  );
};

export default Inventory;
