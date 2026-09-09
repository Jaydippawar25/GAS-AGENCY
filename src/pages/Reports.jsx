import React, { useState, useEffect } from 'react';
import ReportFilters from '../components/reports/ReportFilters';
import ReportSummary from '../components/reports/ReportSummary';
import SalesChart from '../components/reports/SalesChart';
import CompanyChart from '../components/reports/CompanyChart';
import WeightChart from '../components/reports/WeightChart';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { 
  getAllSalesRecords, 
  getMonthlySalesTrend, 
  getCompanyBreakdown, 
  getWeightBreakdown, 
  filterSalesRecords 
} from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/priceUtils';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import { BarChart3, Printer } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [rawSales, setRawSales] = useState([]);

  // Filters
  const [dateFilter, setDateFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [weightFilter, setWeightFilter] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(2026);

  const { showNotification } = useAuth();

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const sales = await getAllSalesRecords();
        setRawSales(sales);
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Generating agency analytics and reports..." size="lg" />;
  }

  // Filter sales based on current user selection
  const filteredSales = filterSalesRecords(rawSales, {
    dateFilter,
    company: companyFilter,
    weight: weightFilter
  });

  // Calculate analytical summaries
  let totalRevenue = 0;
  let totalCylinders = 0;

  filteredSales.forEach(s => {
    totalRevenue += Number(s.totalPrice || 0);
    totalCylinders += Number(s.quantity || 0);
  });

  const monthlyTrendData = getMonthlySalesTrend(rawSales, selectedYear);
  const companyData = getCompanyBreakdown(filteredSales);
  const weightData = getWeightBreakdown(filteredSales);

  // Export handlers
  const handleExportPDF = () => {
    try {
      const headers = ['Date', 'Customer', 'Consumer ID', 'Company', 'Weight', 'Qty', 'Unit Price', 'Total Paid', 'Payment'];
      const data = filteredSales.map(s => [
        formatDate(s.saleDate),
        s.customerName,
        s.consumerId,
        s.company,
        `${s.weight} KG`,
        s.quantity,
        formatCurrency(s.unitPrice),
        formatCurrency(s.totalPrice),
        s.paymentMethod || 'Cash'
      ]);

      const summaryRows = [
        { label: 'Total Revenue Generated', value: formatCurrency(totalRevenue) },
        { label: 'Total Gas Cylinders Sold', value: `${totalCylinders} Units` },
        { label: 'Total Transaction Orders', value: filteredSales.length }
      ];

      exportToPDF({
        title: 'GAS AGENCY OFFICIAL SALES REPORT',
        subtitle: `Filter Period: ${dateFilter} | Provider: ${companyFilter} | Weight: ${weightFilter}`,
        headers,
        data,
        summaryRows,
        fileName: `Gas_Agency_Report_${dateFilter}_${selectedYear}.pdf`
      });

      showNotification('PDF report downloaded successfully!', 'success');
    } catch (err) {
      showNotification('Failed to generate PDF report.', 'error');
    }
  };

  const handleExportExcel = () => {
    try {
      const data = filteredSales.map(s => ({
        'Sale Date': formatDate(s.saleDate),
        'Customer Name': s.customerName,
        'Consumer ID': s.consumerId,
        'Mobile Number': s.mobile,
        'Gas Company': s.company,
        'Cylinder Weight (KG)': s.weight,
        'Quantity Sold': s.quantity,
        'Unit Price (INR)': s.unitPrice,
        'Total Price (INR)': s.totalPrice,
        'Payment Method': s.paymentMethod || 'Cash'
      }));

      exportToExcel(data, `Gas_Agency_Sales_${dateFilter}_${selectedYear}.xlsx`, 'Sales Report');
      showNotification('Excel report downloaded successfully!', 'success');
    } catch (err) {
      showNotification('Failed to export Excel report.', 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      const data = filteredSales.map(s => ({
        'Sale Date': formatDate(s.saleDate),
        'Customer Name': s.customerName,
        'Consumer ID': s.consumerId,
        'Mobile': s.mobile,
        'Company': s.company,
        'Weight': `${s.weight} KG`,
        'Quantity': s.quantity,
        'Unit Price': s.unitPrice,
        'Total Price': s.totalPrice,
        'Payment Method': s.paymentMethod || 'Cash'
      }));

      exportToCSV(data, `Gas_Agency_Sales_${dateFilter}.csv`);
      showNotification('CSV report downloaded successfully!', 'success');
    } catch (err) {
      showNotification('Failed to export CSV report.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gas-navy">Sales & Inventory Analytics Reports</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Generate custom reports for daily, monthly, yearly sales, company market share, and weight metrics.
          </p>
        </div>
      </div>

      {/* Filter Controls & Export Buttons */}
      <ReportFilters
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        weightFilter={weightFilter}
        setWeightFilter={setWeightFilter}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Summary Stat Cards */}
      <ReportSummary
        totalRevenue={totalRevenue}
        totalCylinders={totalCylinders}
        totalOrders={filteredSales.length}
        companyBreakdown={companyData}
      />

      {/* Charts Grid */}
      <div className="space-y-6">
        <SalesChart data={monthlyTrendData} year={selectedYear} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyChart data={companyData} />
          <WeightChart data={weightData} />
        </div>
      </div>

      {/* Detailed Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gas-navy uppercase tracking-wider">Detailed Sales Breakdown</h3>
          <span className="text-xs text-gray-500 font-semibold">{filteredSales.length} Records Found</span>
        </div>

        {filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-gray-200 font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Consumer ID</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-gray-600">{formatDate(s.saleDate)}</td>
                    <td className="py-3 px-4 font-bold text-gas-navy">{s.customerName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{s.consumerId}</td>
                    <td className="py-3 px-4 font-medium">{s.company}</td>
                    <td className="py-3 px-4 font-semibold">{s.weight} KG</td>
                    <td className="py-3 px-4 font-bold">{s.quantity}</td>
                    <td className="py-3 px-4 text-gray-600">{formatCurrency(s.unitPrice)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{formatCurrency(s.totalPrice)}</td>
                    <td className="py-3 px-4">{s.paymentMethod || 'Cash'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Sales Records Found for Selected Filter"
            description="No sales transaction records match your selected date, company, or weight filters."
            icon={BarChart3}
          />
        )}
      </div>

    </div>
  );
};

export default Reports;
