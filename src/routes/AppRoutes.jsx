import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Sales from '../pages/Sales';
import Customers from '../pages/Customers';
import CustomerDetails from '../pages/CustomerDetails';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const RouteWrapper = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteWrapper>
            <Dashboard />
          </RouteWrapper>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RouteWrapper>
            <Dashboard />
          </RouteWrapper>
        }
      />
      <Route
        path="/inventory"
        element={
          <RouteWrapper>
            <Inventory />
          </RouteWrapper>
        }
      />
      <Route
        path="/sales"
        element={
          <RouteWrapper>
            <Sales />
          </RouteWrapper>
        }
      />
      <Route
        path="/customers"
        element={
          <RouteWrapper>
            <Customers />
          </RouteWrapper>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <RouteWrapper>
            <CustomerDetails />
          </RouteWrapper>
        }
      />
      <Route
        path="/reports"
        element={
          <RouteWrapper>
            <Reports />
          </RouteWrapper>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteWrapper>
            <Settings />
          </RouteWrapper>
        }
      />

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
