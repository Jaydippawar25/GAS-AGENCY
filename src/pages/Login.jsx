import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gas-navy via-slate-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-gas-navy text-white p-8 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gas-red/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex p-3 bg-gas-red rounded-2xl shadow-lg mb-3">
            <Flame className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white">GAS AGENCY</h2>
          <p className="text-xs text-gray-300 font-medium mt-1">Inventory & Refill Management Portal</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-gas-red text-xs font-semibold rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gasagency.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gas-navy focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gas-navy focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gas-red hover:bg-red-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Helpers */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@gasagency.com', 'admin123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-gas-navy font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gas-red" />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff@gasagency.com', 'staff123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-gas-navy font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Staff Demo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-gray-50 py-3 text-center text-[11px] text-gray-500 border-t border-gray-100">
          HP • Indane • Bharat Gas Inventory & Sale System
        </div>

      </div>
    </div>
  );
};

export default Login;
