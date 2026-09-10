import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { getAllInventory } from '../services/inventoryService';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { notification } = useAuth();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        const inventory = await getAllInventory();
        const lowItems = inventory.filter(item => item.filledQuantity <= (item.minimumStock || 15));
        setLowStockCount(lowItems.length);
      } catch (err) {
        console.warn('Alert scan error:', err);
      }
    };

    fetchStockAlerts();
    const interval = setInterval(fetchStockAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-between max-w-none">
      
      <div>
        {/* Top Header & Navigation Bar */}
        <Header lowStockCount={lowStockCount} />

        {/* Toast Notification Banner */}
        {notification && (
          <div className="mb-6">
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm text-xs font-bold transition-all ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {notification.type === 'info' && <Info className="w-4 h-4 text-indigo-600 shrink-0" />}
                <span>{notification.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* 100% Full Width Edge-to-Edge Page Canvas */}
        <main className="w-full max-w-none">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default MainLayout;
