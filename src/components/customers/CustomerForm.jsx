import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { isValidMobile, isValidConsumerId } from '../../utils/validationUtils';

const CustomerForm = ({ isOpen, onClose, customer, onSubmit }) => {
  const [name, setName] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('HP Gas');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setConsumerId(customer.consumerId || '');
      setMobile(customer.mobile || '');
      setCompany(customer.company || 'HP Gas');
      setAddress(customer.address || '');
    } else {
      setName('');
      setConsumerId('');
      setMobile('');
      setCompany('HP Gas');
      setAddress('');
    }
    setError('');
  }, [customer, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }

    if (!isValidConsumerId(consumerId)) {
      setError('Consumer ID must be 4-20 alphanumeric characters (e.g. HP12345).');
      return;
    }

    if (!isValidMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        id: customer?.id,
        name: name.trim(),
        consumerId: consumerId.trim().toUpperCase(),
        mobile: mobile.trim(),
        company,
        address: address.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Add New Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-gas-red text-xs font-semibold p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Consumer ID */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Consumer ID <span className="text-gas-red">*</span> (Must be unique)
          </label>
          <input
            type="text"
            value={consumerId}
            onChange={(e) => setConsumerId(e.target.value.toUpperCase())}
            placeholder="e.g. HP12345, IND98765, BH77889"
            required
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono uppercase focus:ring-2 focus:ring-gas-navy focus:outline-none"
          />
          <p className="text-[11px] text-gray-400 mt-0.5">Unique identifier assigned by gas company.</p>
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Customer Name <span className="text-gas-red">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
          />
        </div>

        {/* Mobile & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number <span className="text-gas-red">*</span>
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength="10"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Gas Provider Company</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
            >
              <option value="HP Gas">HP Gas</option>
              <option value="Indane Gas">Indane Gas</option>
              <option value="Bharat Gas">Bharat Gas</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full residential or commercial address..."
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gas-navy focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-bold text-white bg-gas-red hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CustomerForm;
