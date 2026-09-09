import React from 'react';
import Modal from '../Modal';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/priceUtils';
import { downloadSaleReceiptPDF } from '../../utils/exportUtils';
import { Printer, Download, CheckCircle, Flame } from 'lucide-react';

const SaleReceipt = ({ isOpen, onClose, sale, agencySettings = {} }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadSaleReceiptPDF(sale, agencySettings);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sale Completed Successfully!" maxWidth="max-w-md">
      <div className="space-y-4">
        
        {/* Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Stock deducted & customer refill log updated successfully.</span>
        </div>

        {/* Thermal Printable Receipt Preview Box */}
        <div id="printable-receipt" className="bg-amber-50/40 p-6 rounded-xl border border-amber-200 font-mono text-xs text-gray-800 space-y-3 shadow-inner">
          
          {/* Agency Header */}
          <div className="text-center border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-center items-center space-x-1 font-sans text-gas-red font-bold text-base">
              <Flame className="w-5 h-5" />
              <span>{agencySettings.agencyName || 'GAS AGENCY DISTRIBUTOR'}</span>
            </div>
            <p className="text-[11px] text-gray-500 font-sans mt-0.5">{agencySettings.address || 'Authorized LPG Gas Distributor'}</p>
            <p className="text-[11px] text-gray-500 font-sans">Phone: {agencySettings.phone || '+91 9876543210'}</p>
          </div>

          <div className="text-center font-bold uppercase tracking-wider py-1 text-gas-navy border-b border-dashed border-gray-400">
            OFFICIAL SALE RECEIPT
          </div>

          {/* Details */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Receipt No:</span>
              <span className="font-bold text-gray-900">{sale.id ? sale.id.substring(0, 8).toUpperCase() : 'REC-1001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-semibold">{formatDate(sale.saleDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer:</span>
              <span className="font-bold text-gray-900">{sale.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Consumer ID:</span>
              <span className="font-bold text-amber-900">{sale.consumerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Company:</span>
              <span className="font-semibold">{sale.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cylinder Weight:</span>
              <span className="font-semibold">{sale.weight} KG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity:</span>
              <span className="font-bold">{sale.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Unit Price:</span>
              <span>{formatCurrency(sale.unitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-semibold">{sale.paymentMethod || 'Cash'}</span>
            </div>
          </div>

          <div className="border-t border-b border-dashed border-gray-400 py-2 flex justify-between items-center text-sm">
            <span className="font-bold text-gas-navy">TOTAL PAID:</span>
            <span className="font-bold text-emerald-700 text-base">{formatCurrency(sale.totalPrice)}</span>
          </div>

          {/* Refill Calculation Summary */}
          <div className="bg-emerald-100/60 p-2 rounded text-center text-emerald-900 font-sans text-xs">
            <span className="font-bold block">Next Eligible Refill Date:</span>
            <span className="text-sm font-extrabold">{formatDate(sale.nextEligibleDate)}</span>
          </div>

          <div className="text-center text-[10px] text-gray-500 pt-2 font-sans">
            Thank you for choosing our gas agency!
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 text-xs font-semibold text-gas-navy bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1 border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-gas-navy hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-gas-red hover:bg-red-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default SaleReceipt;
