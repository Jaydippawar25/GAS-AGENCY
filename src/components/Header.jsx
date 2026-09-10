import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Flame, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  User, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ lowStockCount = 0 }) => {
  const { currentUser } = useAuth();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="bg-[#1E3A5F]/95 backdrop-blur-md text-white rounded-3xl px-4 py-3 mb-6 shadow-xl border border-white/10 sticky top-2 z-50 w-full overflow-visible transition-all duration-200 hover:shadow-2xl">
      
      {/* Header Main Row */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D32F2F] to-[#EF4444] flex items-center justify-center text-white shadow-md shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold tracking-wide text-white leading-tight">
              GAS AGENCY
            </h1>
            <p className="text-[9px] text-amber-300 font-semibold uppercase tracking-wider">Inventory Portal</p>
          </div>
        </div>

        {/* Desktop Top Navigation Tabs (Sticky Fixed + Hover Effects) */}
        <nav className="hidden lg:flex items-center bg-[#0F172A]/50 p-1 rounded-2xl border border-white/10 space-x-1 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-white text-[#1E3A5F] shadow-lg font-extrabold'
                      : 'text-blue-100 hover:bg-white/20 hover:text-white font-semibold'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Search, Notification & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Search Box */}
          <div className="hidden xl:flex items-center bg-[#0F172A]/40 px-3 py-1.5 rounded-2xl border border-white/10 w-40 focus-within:w-52 focus-within:bg-white/10 transition-all">
            <Search className="w-3.5 h-3.5 text-blue-200 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-white placeholder-blue-200/60 focus:outline-none w-full font-medium"
            />
          </div>

          {/* Notifications Bell */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/10 relative hover:scale-105"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {lowStockCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D32F2F] ring-2 ring-[#1E3A5F]" />
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-4 text-gray-800 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alerts</span>
                  <span className="bg-red-100 text-[#D32F2F] px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {lowStockCount} Low Stock
                  </span>
                </div>
                <div className="pt-3">
                  {lowStockCount > 0 ? (
                    <div className="flex items-start space-x-3 text-xs bg-red-50/60 p-3 rounded-2xl border border-red-100">
                      <ShieldAlert className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">Inventory Alert</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">{lowStockCount} weight category low on filled cylinders.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-2">No active warnings.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 bg-white/10 pl-2.5 pr-1 py-1 rounded-2xl border border-white/10 shrink-0">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-bold text-white leading-tight">
                {currentUser?.name || 'Gas Admin'}
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-300">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#D32F2F] to-[#EF4444] text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>

        </div>

      </div>

      {/* Medium Screen Navigation Tabs */}
      <div className="hidden md:flex lg:hidden mt-2 pt-2 border-t border-white/10 justify-center">
        <nav className="flex items-center bg-[#0F172A]/50 p-1 rounded-2xl border border-white/10 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-white text-[#1E3A5F] shadow-md font-extrabold'
                      : 'text-blue-100 hover:bg-white/20 hover:text-white'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile Top Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 mt-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-[#1E3A5F] shadow-md font-extrabold'
                        : 'bg-white/10 text-blue-100 hover:bg-white/25'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
