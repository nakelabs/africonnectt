import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import TopBar from '../components/TopBar';

export default function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-dvh bg-brand-bg">
      {!isLogin && <TopBar />}

      {/* Main scroll area — top padding for TopBar (56px), bottom for BottomNav (64px + safe) */}
      <main
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          isLogin ? '' : 'pt-14 pb-20'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Outlet />
      </main>

      {!isLogin && <BottomNav />}
    </div>
  );
}
