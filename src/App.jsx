import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Overview from './pages/Overview.jsx';
import Simulation from './pages/Simulation.jsx';
import Infrastructure from './pages/Infrastructure.jsx';
import Settings from './pages/Settings.jsx';

// Route protection checker
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('nexus_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/overview" 
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/simulation" 
          element={
            <ProtectedRoute>
              <Simulation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/infrastructure" 
          element={
            <ProtectedRoute>
              <Infrastructure />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Redirect Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
