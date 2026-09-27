import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FounderFeedPage from './pages/founder/FeedPage';
import FounderProfilePage from './pages/founder/ProfilePage';
import FounderTractionPage from './pages/founder/TractionPage';
import InvestorDiscoveryPage from './pages/investor/DiscoveryPage';
import InvestorSavedPage from './pages/investor/SavedPage';
import InvestorProfilePage from './pages/investor/ProfilePage';
import ConnectPage from './pages/ConnectPage';

function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'investor' ? '/investor/discover' : '/founder/feed'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Founder routes */}
      <Route path="/founder" element={
        <ProtectedRoute requiredRole="founder">
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="feed" replace />} />
        <Route path="feed"     element={<FounderFeedPage />} />
        <Route path="profile"  element={<FounderProfilePage />} />
        <Route path="traction" element={<FounderTractionPage />} />
        <Route path="connect"  element={<ConnectPage />} />
      </Route>

      {/* Investor routes */}
      <Route path="/investor" element={
        <ProtectedRoute requiredRole="investor">
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="discover" replace />} />
        <Route path="discover" element={<InvestorDiscoveryPage />} />
        <Route path="saved"    element={<InvestorSavedPage />} />
        <Route path="connect"  element={<ConnectPage />} />
        <Route path="profile"  element={<InvestorProfilePage />} />
      </Route>

      {/* Landing / Root */}
      <Route path="/" element={
        user
          ? <Navigate to={role === 'investor' ? '/investor/discover' : '/founder/feed'} replace />
          : <LandingPage />
      } />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          user
            ? <Navigate to={role === 'investor' ? '/investor/discover' : '/founder/feed'} replace />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
