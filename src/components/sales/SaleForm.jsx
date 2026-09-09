import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import StatusBadge from '../StatusBadge';
import { findCustomerByConsumerId } from '../../services/customerService';
import { checkRefillEligibility } from '../../utils/refillUtils';
import { validateStockAvailability } from '../../utils/validationUtils';
import { getDefaultUnitPrice, formatCurrency } from '../../utils/priceUtils';
import { Search, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

const SaleForm = ({ isOpen, onClose, inventory = [], refillDurationDays = 25, onCompleteSale }) => {
  const [consumerIdInput, setConsumerIdInput] = useState('');
  const [customer, setCustomer] = useState(null);
  const [customerSearching, setCustomerSearching] = useState(false);
  const [customerError, setCustomerError] = useState('');

  const [company, setCompany] = useState('HP Gas');
  const [weight, setWeight] = useState(14);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(950);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');

  const [stockInfo, setStockInfo] = useState({ filled: 0, isValid: true, message: '' });
  const [eligibilityInfo, setEligibilityInfo] = useState({ isEligible: true, message: '' });

  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUnitPrice(getDefaultUnitPrice(weight));
  }, [weight]);

  useEffect(() => {
    const companyCodeMap = { 'HP Gas': 'HP', 'Indane Gas': 'INDANE', 'Bharat Gas': 'BHARAT', 'Reliance Gas': 'RELIANCE', 'Adani Gas': 'ADANI' };
    const code = companyCodeMap[company] || company.split(' ')[0].toUpperCase();
    const targetInvId = `${code}_${weight}`;

    const invItem = inventory.find(i => i.id === targetInvId || (i.company === company && Number(i.weight) === Number(weight)));
    const filled = invItem ? Number(invItem.filledQuantity || 0) : 0;

    const validation = validateStockAvailability(filled, quantity);
    setStockInfo({
      filled,
      isValid: validation.isValid,
      message: validation.message
    });
  }, [company, weight, quantity, inventory]);

  const handleConsumerLookup = async () => {
    if (!consumerIdInput.trim()) return;

    setCustomerSearching(true);
    setCustomerError('');
    setCustomer(null);

    try {
      const found = await findCustomerByConsumerId(consumerIdInput.trim());
      if (found) {
        setCustomer(found);
        setCompany(found.company || 'HP Gas');

        const eligibility = checkRefillEligibility(
          found.lastPurchaseDate,
          found.nextEligibleDate,
          refillDurationDays
        );
        setEligibilityInfo(eligibility);
      } else {
        setCustomerError(`Customer with Consumer ID "${consumerIdInput.toUpperCase()}" not found. Please register customer first.`);
      }
    } catch (err) {
      setCustomerError('Error looking up customer details.');
    } finally {
      setCustomerSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!customer) {
      setSubmitError('Please lookup and select a valid customer.');
      return;
    }

    if (!eligibilityInfo.isEligible) {
      setSubmitError(`Sale Blocked! ${eligibilityInfo.message}`);
      return;
    }

    if (!stockInfo.isValid) {
      setSubmitError(`Sale Blocked! ${stockInfo.message}`);
      return;
    }

    setSubmitting(true);
    try {
      await onCompleteSale({
        consumerId: customer.consumerId,
        company,
        weight: Number(weight),
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        paymentMethod,
        notes
      });
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to complete transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Gas Cylinder Dispatch Sale" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">

        {/* Consumer ID Lookup Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-xs font-black text-[#1E3A5F] uppercase tracking-wider mb-1.5">
            Step 1: Enter Consumer ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={consumerIdInput}
              onChange={(e) => setConsumerIdInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConsumerLookup(); } }}
              placeholder="e.g. HP12345, IND98765, BH77889"
              className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleConsumerLookup}
              disabled={customerSearching}
              className="px-5 py-2.5 bg-[#1E3A5F] text-white text-xs font-black rounded-xl hover:bg-slate-900 transition-colors flex items-center space-x-1.5 shrink-0 shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>{customerSearching ? 'Searching...' : 'Lookup Customer'}</span>
            </button>
          </div>

          {customerError && (
            <div className="mt-2.5 p-3 bg-red-50 border border-red-200 text-[#D32F2F] text-xs font-extrabold rounded-xl flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{customerError}</span>
            </div>
          )}
        </div>

        {/* Customer Refill Eligibility Banner */}
        {customer && (
          <div className={`p-4 rounded-2xl border ${
            eligibilityInfo.isEligible 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-black flex items-center space-x-2">
                  <span>{customer.name}</span>
                  <span className="font-mono text-xs bg-white/80 px-2 py-0.5 rounded-md border border-gray-300 font-bold">
                    {customer.consumerId}
                  </span>
                </h4>
                <p className="text-xs font-semibold mt-0.5">Mobile: {customer.mobile} • Provider: {customer.company}</p>
              </div>

              <StatusBadge type="refill" status={eligibilityInfo.isEligible} />
            </div>

            <div className="mt-2 pt-2 border-t border-black/10 text-xs font-bold flex justify-between items-center">
              <span>Refill Rule ({refillDurationDays} Days Interval):</span>
              <span className="font-extrabold">{eligibilityInfo.message}</span>
            </div>
          </div>
        )}

        {/* Step 2: Sale & Cylinder Selection */}
        {customer && (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Step 2: Select Cylinder & Quantity</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gas Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                >
                  <option value="HP Gas">HP Gas</option>
                  <option value="Indane Gas">Indane Gas</option>
                  <option value="Bharat Gas">Bharat Gas</option>
                  <option value="Reliance Gas">Reliance Gas</option>
                  <option value="Adani Gas">Adani Gas</option>
                </select>
              </div>

              {/* Expanded Cylinder Weight Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cylinder Weight Category</label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-extrabold text-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                >
                  <option value={2}>2 KG (Domestic Portable)</option>
                  <option value={5}>5 KG (Domestic Medium)</option>
                  <option value={14}>14 KG (Domestic Standard)</option>
                  <option value={19}>19 KG (Commercial Heavy)</option>
                  <option value={33}>33 KG (Commercial Jumbo)</option>
                  <option value={47.5}>47.5 KG (Industrial Bulk)</option>
                </select>
              </div>
            </div>

            {/* Inventory Stock Availability Feedback */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-extrabold ${
              stockInfo.isValid ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-red-50 border-red-200 text-[#D32F2F]'
            }`}>
              <div className="flex items-center space-x-2">
                {stockInfo.isValid ? (
                  <CheckCircle className="w-4 h-4 text-[#15803D]" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-[#D32F2F]" />
                )}
                <span>Filled Stock Available: <strong className="text-gray-900 text-sm">{stockInfo.filled} cylinders</strong></span>
              </div>
              {!stockInfo.isValid && <span>{stockInfo.message}</span>}
            </div>

            {/* Quantity & Unit Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={stockInfo.filled || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-extrabold text-gray-900 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-extrabold text-gray-900 focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Total Price Card */}
            <div className="bg-[#1E3A5F] text-white p-4.5 rounded-2xl flex items-center justify-between shadow-lg border border-slate-700">
              <div>
                <span className="text-xs text-amber-300 font-extrabold uppercase block">Total Amount Payable</span>
                <span className="text-xs text-slate-300 font-semibold">({quantity} x {formatCurrency(unitPrice)})</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {formatCurrency(unitPrice * quantity)}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sale Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Doorstep delivery requested"
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
              />
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-[#D32F2F] text-xs font-extrabold rounded-xl">
            {submitError}
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !customer || !eligibilityInfo.isEligible || !stockInfo.isValid}
            className="px-6 py-2.5 text-sm font-black text-white bg-[#D32F2F] hover:bg-red-700 rounded-xl shadow-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing Sale...' : 'Complete & Issue Receipt'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default SaleForm;
