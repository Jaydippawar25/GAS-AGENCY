import React, { useState, useEffect } from 'react';
import { getAgencySettings, updateAgencySettings } from '../services/settingsService';
import { seedInitialDatabase } from '../firebase/seedData';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Building2, Clock, ShieldAlert, Database, Save, RotateCcw, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [agencyName, setAgencyName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [refillDurationDays, setRefillDurationDays] = useState(25);
  const [defaultMinimumStock, setDefaultMinimumStock] = useState(15);

  const { showNotification } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await getAgencySettings();
        setAgencyName(settings.agencyName || 'Standard Gas Agency Distributors');
        setAddress(settings.address || 'Main Road, Station Area');
        setPhone(settings.phone || '9876543210');
        setRefillDurationDays(settings.refillDurationDays !== undefined ? settings.refillDurationDays : 25);
        setDefaultMinimumStock(settings.defaultMinimumStock || 15);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAgencySettings({
        agencyName: agencyName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        refillDurationDays: Number(refillDurationDays) || 25,
        defaultMinimumStock: Number(defaultMinimumStock) || 15
      });
      showNotification('Agency settings updated successfully!', 'success');
    } catch (err) {
      showNotification('Failed to update agency settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSeedData = async () => {
    if (!window.confirm('Re-seed database with default inventory items (HP, Indane, Bharat), settings, and sample customers?')) {
      return;
    }

    setSeeding(true);
    try {
      const res = await seedInitialDatabase();
      if (res.success) {
        showNotification('Database initial data seeded successfully!', 'success');
      } else {
        showNotification('Database seeding notice: Using initial default dataset.', 'info');
      }
    } catch (err) {
      showNotification('Seeding error: ' + err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading agency system settings..." size="lg" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gas-navy">Agency System Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure distributor details, 25-day refill eligibility rules, and default inventory thresholds.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: Agency Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Building2 className="w-5 h-5 text-gas-red" />
            <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
              1. Agency Business Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Agency / Distributor Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone / Mobile</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Official Address (Printed on Receipts)</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="2"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Refill Duration Setting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Clock className="w-5 h-5 text-gas-red" />
            <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
              2. Configurable Refill Waiting Rule
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Refill Waiting Duration (Days)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="90"
                value={refillDurationDays}
                onChange={(e) => setRefillDurationDays(e.target.value)}
                required
                className="w-32 border border-gray-300 rounded-lg p-2.5 text-base font-bold text-gas-navy focus:ring-2 focus:ring-gas-navy focus:outline-none"
              />
              <span className="text-sm font-semibold text-gray-600">Days interval between cylinder purchases</span>
            </div>

            {/* Quick Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-semibold text-gray-500">Preset presets:</span>
              {[15, 20, 25, 30, 45].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRefillDurationDays(preset)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all border ${
                    Number(refillDurationDays) === preset
                      ? 'bg-gas-navy text-white border-gas-navy shadow-sm'
                      : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border-gray-200'
                  }`}
                >
                  {preset} Days {preset === 25 ? '(Default Standard)' : ''}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <strong>Note:</strong> When a sale is processed for a customer, the system automatically checks if 
              <strong className="text-gas-navy"> {refillDurationDays} days</strong> have elapsed since their last purchase. If not, the sale form blocks the transaction.
            </p>
          </div>
        </div>

        {/* Section 3: Inventory Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-gas-red" />
            <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">
              3. Inventory Low-Stock Alert Settings
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Default Minimum Stock Threshold
            </label>
            <input
              type="number"
              min="1"
              value={defaultMinimumStock}
              onChange={(e) => setDefaultMinimumStock(e.target.value)}
              className="w-32 border border-gray-300 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-gas-navy focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default threshold count for triggering low stock notifications on the top header bar and dashboard.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetSeedData}
            disabled={seeding}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            <Database className="w-4 h-4 text-gas-red" />
            <span>{seeding ? 'Seeding Data...' : 'Re-Seed Default Database Items'}</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gas-red hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default Settings;
