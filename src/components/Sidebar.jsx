import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Flame,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Gas Agency Vertical Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-28 bg-[#1E3A5F] text-white rounded-3xl p-4 shrink-0 self-stretch z-20 shadow-xl border border-white/10">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center pt-2 pb-4 border-b border-white/15">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D32F2F] to-[#FF5252] flex items-center justify-center text-white shadow-lg mb-2">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[11px] font-black tracking-widest text-amber-300 text-center leading-tight">
            GAS AGENCY
          </span>
        </div>

        {/* Navigation Icon Tabs with Text Labels */}
        <nav className="flex flex-col items-center space-y-3.5 my-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group w-20 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#1E3A5F] shadow-xl font-extrabold scale-105'
                      : 'text-blue-100 hover:bg-white/15 hover:text-white font-semibold'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom System Status & Logout */}
        <div className="flex flex-col items-center pt-3 border-t border-white/15">
          <button
            onClick={logout}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-red-600/30 text-blue-200 hover:text-red-300 flex items-center justify-center transition-all border border-white/10"
            title="System Active"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#1E3A5F] text-white p-4 rounded-2xl mb-4 shadow-lg w-full">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D32F2F] to-[#FF5252] flex items-center justify-center text-white shadow-md">
            <Flame className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-white">GAS AGENCY PORTAL</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/10 text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1E3A5F] text-white rounded-3xl p-4 mb-4 shadow-2xl border border-white/10 space-y-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#1E3A5F] shadow-lg'
                      : 'text-blue-100 hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Sidebar;
