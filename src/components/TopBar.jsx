import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const { user, role, logout } = useAuth();
  
  // Get first letter of the user's name
  const userInitial = (user?.full_name || user?.name)?.[0]?.toUpperCase() ?? '?';
  const profileLink = role === 'investor' ? '/investor/profile' : '/founder/profile';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white"
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      <div className="flex items-center justify-between px-5 h-14">

        {/* Branding */}
        <div className="flex flex-col leading-tight">
          <Link to="/" className="text-sm font-bold text-[#1A1A1A] tracking-tight hover:opacity-80">
            AfriConnect
          </Link>
        </div>

        {/* Right: role badge, standard logout + profile avatar */}
        <div className="flex items-center gap-3">
          {role && (
            <span
              className="text-[11px] font-semibold px-3 py-1 rounded-full border border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider"
            >
              {role === 'investor' ? 'Investor' : 'Founder'}
            </span>
          )}

          {user && (
            <button 
              onClick={logout} 
              className="text-[10px] uppercase tracking-widest font-semibold text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
            >
              Log out
            </button>
          )}

          {/* Profile indicator */}
          {user && (
            <Link
              to={profileLink}
              aria-label="Profile"
              className="relative w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            >
              {userInitial}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
