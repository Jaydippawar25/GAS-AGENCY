import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedInitialDatabase } from '../firebase/seedData';

const AuthContext = createContext(null);

export const DEFAULT_ADMIN_USER = {
  uid: 'agency-admin-uid',
  email: 'admin@gasagency.com',
  name: 'Gas Agency Admin',
  role: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEFAULT_ADMIN_USER);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Attempt auto database seed check in background
    seedInitialDatabase().catch(console.warn);
  }, []);

  const login = async () => {
    setCurrentUser(DEFAULT_ADMIN_USER);
    showNotification('System active', 'info');
    return DEFAULT_ADMIN_USER;
  };

  const logout = async () => {
    showNotification('Session active', 'info');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ id: Date.now(), message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    notification,
    showNotification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
