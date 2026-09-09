import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import CustomerProfile from '../components/customers/CustomerProfile';
import PurchaseHistory from '../components/customers/PurchaseHistory';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getCustomerById } from '../services/customerService';
import { getCustomerSales } from '../services/salesService';
import { getAgencySettings } from '../services/settingsService';
import { ArrowLeft, UserX } from 'lucide-react';

const CustomerDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [agencySettings, setAgencySettings] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const custData = await getCustomerById(id);
        const settingsData = await getAgencySettings();

        if (custData) {
          setCustomer(custData);
          const salesData = await getCustomerSales(custData.consumerId);
          setSalesHistory(salesData);
        }
        setAgencySettings(settingsData);
      } catch (err) {
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Fetching customer profile and purchase history..." size="lg" />;
  }

  if (!customer) {
    return (
      <EmptyState
        title="Customer Profile Not Found"
        description="The customer profile you requested could not be located in the database."
        icon={UserX}
        actionButton={
          <NavLink
            to="/customers"
            className="mt-2 px-4 py-2 bg-gas-navy text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customers List</span>
          </NavLink>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/customers"
          className="inline-flex items-center space-x-1 text-xs font-bold text-gas-navy hover:text-gas-red transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </NavLink>

        <span className="text-xs text-gray-500 font-semibold">Customer ID: {customer.id}</span>
      </div>

      {/* Customer Profile Card */}
      <CustomerProfile
        customer={customer}
        refillDurationDays={agencySettings.refillDurationDays || 25}
      />

      {/* Purchase History */}
      <PurchaseHistory
        sales={salesHistory}
        agencySettings={agencySettings}
      />

    </div>
  );
};

export default CustomerDetails;
