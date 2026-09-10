import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import InventoryForm from '../components/inventory/InventoryForm';
import { getAllInventory, addInventoryItem } from '../services/inventoryService';
import { getRecentSales } from '../services/salesService';
import { getAllCustomers } from '../services/customerService';
import { getMonthlySalesTrend, getAllSalesRecords } from '../services/reportService';
import { getAgencySettings } from '../services/settingsService';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/priceUtils';
import { checkRefillEligibility } from '../utils/refillUtils';
import { useAuth } from '../context/AuthContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Flame, 
  PlusCircle, 
  ShoppingCart, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  FileSpreadsheet,
  Plus,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agencySettings, setAgencySettings] = useState({});

  // Add New Gas Modal State
  const [isAddGasModalOpen, setIsAddGasModalOpen] = useState(false);

  const { showNotification } = useAuth();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [invData, salesData, allSalesData, custData, settingsData] = await Promise.all([
        getAllInventory(),
        getRecentSales(5),
        getAllSalesRecords(),
        getAllCustomers(),
        getAgencySettings()
      ]);

      setInventory(invData);
      setRecentSales(salesData);
      setAllSales(allSalesData);
      setCustomers(custData);
      setAgencySettings(settingsData);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddGasSubmit = async (formData) => {
    try {
      await addInventoryItem(formData);
      showNotification(`New gas category "${formData.company} (${formData.weight} KG)" added successfully!`, 'success');
      fetchDashboardData();
    } catch (err) {
      showNotification(err.message || 'Failed to save new gas item.', 'error');
      throw err;
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading gas agency dashboard..." size="lg" />;
  }

  // Stock calculations: Total Filled, Total Empty, Total Combined Stock
  let totalFilled = 0;
  let totalEmpty = 0;

  inventory.forEach((item) => {
    const filled = Number(item.filledQuantity || 0);
    const empty = Number(item.emptyQuantity || 0);
    totalFilled += filled;
    totalEmpty += empty;
  });

  const totalCylinderStock = totalFilled + totalEmpty;

  // Sales totals
  let totalRevenue = 0;
  let totalCylindersSold = 0;
  allSales.forEach((s) => {
    totalRevenue += Number(s.totalPrice || 0);
    totalCylindersSold += Number(s.quantity || 0);
  });

  // Refill counts
  let refillAvailableCount = 0;
  let refillPendingCount = 0;
  customers.forEach((cust) => {
    const eligibility = checkRefillEligibility(
      cust.lastPurchaseDate,
      cust.nextEligibleDate,
      agencySettings.refillDurationDays || 25
    );
    if (eligibility.isEligible) refillAvailableCount += 1;
    else refillPendingCount += 1;
  });

  const lowStockItems = inventory.filter(i => i.filledQuantity <= (i.minimumStock || 15));

  // Weekly dispatch chart data
  const weeklyData = [
    { day: 'Mon', count: 24 },
    { day: 'Tue', count: 35 },
    { day: 'Wed', count: 42 },
    { day: 'Thu', count: 58 },
    { day: 'Fri', count: 36 },
    { day: 'Sat', count: 48 },
    { day: 'Sun', count: 20 },
  ];

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: TOP MAIN CONTENT & RIGHT SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: HERO BANNER, DATE SELECTOR, UNIFIED STOCK CARDS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Official Gas Agency Unified Navy Welcome Banner */}
          <div className="bg-[#1E3A5F] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden border border-slate-700/50">
            <div className="z-10">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
                LPG Distributor Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Hello, Gas Agency Admin!</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Welcome back to your Gas Agency Inventory Portal
              </p>
            </div>
            
            <div className="w-24 h-24 bg-white/10 rounded-full blur-2xl absolute -right-4 -bottom-4 pointer-events-none" />
            <div className="hidden sm:flex items-center space-x-3 z-10">
              <button
                onClick={() => setIsAddGasModalOpen(true)}
                className="px-4 py-2.5 bg-white text-[#1E3A5F] hover:bg-slate-100 text-xs font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-1.5 hover:scale-105 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>+ Add New Gas</span>
              </button>

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-lg border border-white/10">
                <Flame className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 2. Date Filter Pill Row */}
          <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-extrabold text-[#1E3A5F]">September 2026</span>
              <div className="flex items-center space-x-1 bg-slate-200/70 p-1 rounded-xl">
                <button className="w-6 h-6 rounded-lg bg-white text-[#1E3A5F] flex items-center justify-center shadow-xs">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-6 h-6 rounded-lg bg-white text-[#1E3A5F] flex items-center justify-center shadow-xs">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-gray-500">Refill Rule:</span>
              <span className="bg-[#1E3A5F] text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-sm">
                {agencySettings.refillDurationDays || 25} Days Enforced
              </span>
            </div>
          </div>

          {/* 3. UNIFIED COLOR SCHEME: 3 TOTAL GAS OVERVIEW CARDS (EXACT SAME SINGLE COLOR) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">TOTAL GAS INVENTORY OVERVIEW</h3>
              <span className="text-xs font-bold text-[#1E3A5F]">Active Stock Summary</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Total Gas Stock (Unified Single Navy Color) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all border-t-4 border-t-[#1E3A5F]">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    Combined
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total Gas Stock</span>
                  <h4 className="text-2xl font-black text-[#1E3A5F] mt-1">{totalCylinderStock} Cylinders</h4>
                </div>
                <div className="bg-[#1E3A5F] text-white text-center py-2 rounded-xl text-xs font-extrabold shadow-sm">
                  Filled ({totalFilled}) + Empty ({totalEmpty})
                </div>
              </div>

              {/* Card 2: Filled Gas Stock (Unified Single Navy Color) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all border-t-4 border-t-[#1E3A5F]">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    Available
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Filled Gas Stock</span>
                  <h4 className="text-2xl font-black text-[#1E3A5F] mt-1">{totalFilled} Cylinders</h4>
                </div>
                <div className="bg-[#1E3A5F] text-white text-center py-2 rounded-xl text-xs font-extrabold shadow-sm">
                  Ready For Dispatch Sale
                </div>
              </div>

              {/* Card 3: Empty Gas Stock (Unified Single Navy Color) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all border-t-4 border-t-[#1E3A5F]">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1E3A5F] bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    Collected
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Empty Gas Stock</span>
                  <h4 className="text-2xl font-black text-[#1E3A5F] mt-1">{totalEmpty} Cylinders</h4>
                </div>
                <div className="bg-[#1E3A5F] text-white text-center py-2 rounded-xl text-xs font-extrabold shadow-sm">
                  Awaiting Bottling Refill
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK FUNCTIONS (ALL 4 BOXES HAVE EXACTLY THE SAME SINGLE COLOR) */}
        <div className="lg:col-span-4 bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#1E3A5F]">Other Functions & Operations</h3>
              <button
                onClick={() => setIsAddGasModalOpen(true)}
                className="text-[11px] font-black text-[#1E3A5F] bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-xl transition-colors border border-slate-300 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#D32F2F]" />
                <span>Add Gas</span>
              </button>
            </div>
            
            {/* Quick Functions Grid (ALL 4 BOXES USE THE EXACT SAME SINGLE COLOR #1E3A5F) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Box 1: Sell Gas (Single Theme Color) */}
              <NavLink
                to="/sales"
                className="bg-[#1E3A5F] text-white p-4 rounded-2xl shadow-md hover:bg-[#244570] hover:scale-105 transition-all flex flex-col justify-between h-24 border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <span className="text-xs font-black leading-tight text-white">Sell Gas Cylinder</span>
              </NavLink>

              {/* Box 2: Add New Gas (Single Theme Color) */}
              <button
                onClick={() => setIsAddGasModalOpen(true)}
                className="bg-[#1E3A5F] text-white p-4 rounded-2xl shadow-md hover:bg-[#244570] hover:scale-105 transition-all flex flex-col justify-between h-24 text-left border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <PlusCircle className="w-5 h-5 text-white" />
                  <span className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <span className="text-xs font-black leading-tight text-white">+ Add New Gas</span>
              </button>

              {/* Box 3: Customers (Single Theme Color) */}
              <NavLink
                to="/customers"
                className="bg-[#1E3A5F] text-white p-4 rounded-2xl shadow-md hover:bg-[#244570] hover:scale-105 transition-all flex flex-col justify-between h-24 border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <Users className="w-5 h-5 text-white" />
                  <span className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <span className="text-xs font-black leading-tight text-white">Customers</span>
              </NavLink>

              {/* Box 4: Export Reports (Single Theme Color) */}
              <NavLink
                to="/reports"
                className="bg-[#1E3A5F] text-white p-4 rounded-2xl shadow-md hover:bg-[#244570] hover:scale-105 transition-all flex flex-col justify-between h-24 border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                  <span className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <span className="text-xs font-black leading-tight text-white">Export Reports</span>
              </NavLink>

            </div>
          </div>

          {/* Recharts Weekly Dispatches Bar Chart */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-700">Weekly Cylinder Dispatches</span>
              <span className="text-[10px] font-bold text-white bg-[#1E3A5F] px-2 py-0.5 rounded-md">Weekly</span>
            </div>

            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1E3A5F', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                  <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: RECENT DISPATCHES TABLE & LOW STOCK WARNINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1E3A5F] uppercase tracking-wider">Recent Cylinder Dispatches</h3>
            <NavLink to="/sales" className="text-xs font-bold text-[#1E3A5F] hover:underline">
              View All Sales →
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Consumer ID</th>
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3">Weight</th>
                  <th className="py-3 px-3">Qty</th>
                  <th className="py-3 px-3">Total Paid</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-gray-800">{s.customerName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#1E3A5F]">{s.consumerId}</td>
                    <td className="py-3 px-3 font-medium text-gray-600">{s.company}</td>
                    <td className="py-3 px-3 font-semibold">{s.weight} KG</td>
                    <td className="py-3 px-3 font-bold">{s.quantity}</td>
                    <td className="py-3 px-3 font-extrabold text-[#1E3A5F]">{formatCurrency(s.totalPrice)}</td>
                    <td className="py-3 px-3 text-gray-400">{formatDate(s.saleDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-[#D32F2F]">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">Low Stock Alerts</h3>
              </div>
              <span className="bg-red-100 text-[#D32F2F] text-[10px] font-bold px-2.5 py-1 rounded-full">
                {lowStockItems.length} Warnings
              </span>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">{item.company}</span>
                    <span className="text-gray-500 font-medium">{item.weight} KG Cylinder</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#D32F2F] font-bold text-sm block">{item.filledQuantity} Filled</span>
                    <span className="text-[10px] text-gray-400">Min: {item.minimumStock || 15}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <NavLink
            to="/inventory"
            className="mt-4 w-full py-3 bg-[#1E3A5F] hover:bg-slate-900 text-white font-bold rounded-2xl text-xs text-center transition-all shadow-md"
          >
            Manage Stock Inventory →
          </NavLink>
        </div>

      </div>

      {/* Add New Gas Category Modal Form */}
      <InventoryForm
        isOpen={isAddGasModalOpen}
        onClose={() => setIsAddGasModalOpen(false)}
        mode="ADD_NEW_GAS"
        onSubmit={handleAddGasSubmit}
      />

    </div>
  );
};

export default Dashboard;
