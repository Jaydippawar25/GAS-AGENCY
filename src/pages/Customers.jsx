import React, { useState, useEffect } from 'react';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import FilterBar from '../components/FilterBar';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getAllCustomers, createCustomer, updateCustomer } from '../services/customerService';
import { getAgencySettings } from '../services/settingsService';
import { checkRefillEligibility } from '../utils/refillUtils';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus } from 'lucide-react';

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [agencySettings, setAgencySettings] = useState({});

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [refillStatusFilter, setRefillStatusFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { showNotification } = useAuth();

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const [custData, settingsData] = await Promise.all([
        getAllCustomers(),
        getAgencySettings()
      ]);
      setCustomers(custData);
      setAgencySettings(settingsData);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (cust) => {
    setSelectedCustomer(cust);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.id) {
        await updateCustomer(formData.id, formData);
        showNotification('Customer updated successfully!', 'success');
      } else {
        await createCustomer(formData);
        showNotification('New customer added successfully!', 'success');
      }
      fetchCustomerData();
    } catch (err) {
      showNotification(err.message || 'Failed to save customer.', 'error');
      throw err;
    }
  };

  // Filter Customer List
  const filteredCustomers = customers.filter((cust) => {
    if (companyFilter !== 'ALL' && cust.company !== companyFilter) return false;

    if (refillStatusFilter !== 'ALL') {
      const eligibility = checkRefillEligibility(
        cust.lastPurchaseDate,
        cust.nextEligibleDate,
        agencySettings.refillDurationDays || 25
      );
      if (refillStatusFilter === 'AVAILABLE' && !eligibility.isEligible) return false;
      if (refillStatusFilter === 'PENDING' && eligibility.isEligible) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cust.name?.toLowerCase().includes(q) ||
        cust.consumerId?.toLowerCase().includes(q) ||
        cust.mobile?.includes(q) ||
        cust.address?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  if (loading) {
    return <LoadingSpinner label="Loading customer database records..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gas-navy">Customer Database & Refill Registry</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage customer accounts, verify unique Consumer IDs, and track 25-day refill eligibility.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-gas-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Name, Consumer ID, or Mobile..."
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-gas-navy focus:outline-none"
        >
          <option value="ALL">All Providers</option>
          <option value="HP Gas">HP Gas</option>
          <option value="Indane Gas">Indane Gas</option>
          <option value="Bharat Gas">Bharat Gas</option>
        </select>

        <select
          value={refillStatusFilter}
          onChange={(e) => setRefillStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-gas-navy focus:outline-none"
        >
          <option value="ALL">All Refill Statuses</option>
          <option value="AVAILABLE">Refill Available (Eligible)</option>
          <option value="PENDING">Refill Pending (Waiting)</option>
        </select>
      </FilterBar>

      {/* Table */}
      {filteredCustomers.length > 0 ? (
        <CustomerTable
          customers={filteredCustomers}
          onEditCustomer={handleEditCustomer}
          refillDurationDays={agencySettings.refillDurationDays || 25}
        />
      ) : (
        <EmptyState
          title="No Customer Records Found"
          description="No customers matched your search terms. Click 'Add New Customer' to register a new LPG connection."
          icon={Users}
          actionButton={
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 bg-gas-navy text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors"
            >
              Add First Customer
            </button>
          }
        />
      )}

      {/* Add / Edit Customer Form Modal */}
      <CustomerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSubmit={handleFormSubmit}
      />

    </div>
  );
};

export default Customers;
