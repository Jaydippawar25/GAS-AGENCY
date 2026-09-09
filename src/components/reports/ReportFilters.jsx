import React from 'react';
import { Download, FileSpreadsheet, FileText, Printer, Filter } from 'lucide-react';

const ReportFilters = ({
  dateFilter,
  setDateFilter,
  companyFilter,
  setCompanyFilter,
  weightFilter,
  setWeightFilter,
  selectedYear,
  setSelectedYear,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onPrint
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 text-[#1E3A5F] font-black text-sm uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#D32F2F]" />
          <span>Report Configuration & Filters</span>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportPDF}
            className="px-3.5 py-2 bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white border border-red-200 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          
          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 bg-emerald-50 text-[#15803D] hover:bg-[#15803D] hover:text-white border border-emerald-200 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 bg-blue-50 text-blue-800 hover:bg-blue-700 hover:text-white border border-blue-200 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3.5 py-2 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white border border-slate-300 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        
        {/* Time Period Filter */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Time Period</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today's Sales</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_YEAR">This Year ({selectedYear})</option>
          </select>
        </div>

        {/* Year Selector */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>

        {/* Company Filter */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Gas Provider Company</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          >
            <option value="ALL">All Companies (HP, Indane, Bharat, Reliance)</option>
            <option value="HP Gas">HP Gas</option>
            <option value="Indane Gas">Indane Gas</option>
            <option value="Bharat Gas">Bharat Gas</option>
            <option value="Reliance Gas">Reliance Gas</option>
          </select>
        </div>

        {/* Expanded Cylinder Weight Filter */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Cylinder Weight Category</label>
          <select
            value={weightFilter}
            onChange={(e) => setWeightFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2.5 font-extrabold text-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
          >
            <option value="ALL">All Cylinder Weights</option>
            <option value="2">2 KG (Portable)</option>
            <option value="5">5 KG (Small)</option>
            <option value="14">14 KG (Domestic)</option>
            <option value="19">19 KG (Commercial)</option>
            <option value="33">33 KG (Jumbo)</option>
            <option value="47.5">47.5 KG (Industrial Bulk)</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default ReportFilters;
