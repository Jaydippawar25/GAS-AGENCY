import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const InventoryForm = ({ isOpen, onClose, item, mode = 'UPDATE_STOCK', onSubmit }) => {
  // Fields for ADD_NEW_GAS mode
  const [company, setCompany] = useState('HP Gas');
  const [customCompany, setCustomCompany] = useState('');
  const [weight, setWeight] = useState(14);
  const [initialFilled, setInitialFilled] = useState(50);
  const [initialEmpty, setInitialEmpty] = useState(10);

  // Fields for UPDATE_STOCK mode
  const [filledToAdd, setFilledToAdd] = useState(0);
  const [emptyToAdd, setEmptyToAdd] = useState(0);
  const [minimumStock, setMinimumStock] = useState(15);
  const [transactionType, setTransactionType] = useState('STOCK_IN');
  const [notes, setNotes] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'UPDATE_STOCK' && item) {
      setMinimumStock(item.minimumStock || 15);
      setFilledToAdd(0);
      setEmptyToAdd(0);
      setTransactionType('STOCK_IN');
      setNotes('');
    } else {
      setCompany('HP Gas');
      setCustomCompany('');
      setWeight(14);
      setInitialFilled(50);
      setInitialEmpty(10);
      setMinimumStock(15);
      setNotes('');
    }
    setError('');
  }, [item, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'ADD_NEW_GAS') {
        const targetCompany = company === 'Other' ? customCompany.trim() : company;
        if (!targetCompany) {
          setError('Please provide a valid Gas Company name.');
          setLoading(false);
          return;
        }

        await onSubmit({
          mode: 'ADD_NEW_GAS',
          company: targetCompany,
          weight: Number(weight),
          filledQuantity: Number(initialFilled),
          emptyQuantity: Number(initialEmpty),
          minimumStock: Number(minimumStock),
          notes: notes.trim() || `Added new ${targetCompany} (${weight} KG) category`
        });
      } else {
        await onSubmit({
          mode: 'UPDATE_STOCK',
          inventoryId: item.id,
          company: item.company,
          weight: item.weight,
          filledToAdd: Number(filledToAdd),
          emptyToAdd: Number(emptyToAdd),
          minimumStock: Number(minimumStock),
          transactionType,
          notes
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save inventory item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'ADD_NEW_GAS' ? 'Add New Gas Cylinder Category' : `Update Stock: ${item?.company} (${item?.weight} KG)`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-gas-red text-xs font-bold p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* MODE 1: ADD NEW GAS CATEGORY */}
        {mode === 'ADD_NEW_GAS' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gas Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                >
                  <option value="HP Gas">HP Gas</option>
                  <option value="Indane Gas">Indane Gas</option>
                  <option value="Bharat Gas">Bharat Gas</option>
                  <option value="Reliance Gas">Reliance Gas</option>
                  <option value="Adani Gas">Adani Gas</option>
                  <option value="Other">Other / Custom Provider</option>
                </select>
              </div>

              {/* Custom Company Name Input */}
              {company === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Total Gas, Auto LPG"
                    required
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                  />
                </div>
              )}

              {/* Cylinder Weight */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cylinder Weight (KG)</label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                >
                  <option value={2}>2 KG (Domestic Small)</option>
                  <option value={5}>5 KG (Domestic Medium)</option>
                  <option value={14}>14 KG (Domestic Standard)</option>
                  <option value={19}>19 KG (Commercial Commercial)</option>
                  <option value={47.5}>47.5 KG (Industrial Heavy)</option>
                </select>
              </div>
            </div>

            {/* Initial Quantities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Filled Cylinders</label>
                <input
                  type="number"
                  min="0"
                  value={initialFilled}
                  onChange={(e) => setInitialFilled(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Empty Cylinders</label>
                <input
                  type="number"
                  min="0"
                  value={initialEmpty}
                  onChange={(e) => setInitialEmpty(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          /* MODE 2: UPDATE EXISTING STOCK */
          <>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase block">Current Filled</span>
                <span className="text-base font-bold text-emerald-700">{item.filledQuantity}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase block">Current Empty</span>
                <span className="text-base font-bold text-gray-700">{item.emptyQuantity}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase block">Current Total</span>
                <span className="text-base font-bold text-[#1E3A5F]">{(item.filledQuantity || 0) + (item.emptyQuantity || 0)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Transaction Operation</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
              >
                <option value="STOCK_IN">STOCK IN (Receiving New Shipment)</option>
                <option value="RETURN">RETURN (Receiving Returned Cylinders)</option>
                <option value="DAMAGE">DAMAGE / DEFECT (Damaged Cylinder Logging)</option>
                <option value="ADJUSTMENT">MANUAL ADJUSTMENT (Audit Correction)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Add Filled Cylinders (+ / -)
                </label>
                <input
                  type="number"
                  value={filledToAdd}
                  onChange={(e) => setFilledToAdd(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                  placeholder="e.g. 50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Add Empty Cylinders (+ / -)
                </label>
                <input
                  type="number"
                  value={emptyToAdd}
                  onChange={(e) => setEmptyToAdd(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                  placeholder="e.g. 20"
                />
              </div>
            </div>
          </>
        )}

        {/* Common Minimum Alert & Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Minimum Low-Stock Alert Level
          </label>
          <input
            type="number"
            value={minimumStock}
            onChange={(e) => setMinimumStock(e.target.value)}
            min="1"
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Reference</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Initial inventory registration"
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#D32F2F] hover:bg-red-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'ADD_NEW_GAS' ? 'Add New Gas Item' : 'Save Stock Update'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default InventoryForm;
