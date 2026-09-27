import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const founderTabs = [
  { to: '/founder/feed',     label: 'Home'     },
  { to: '/founder/traction', label: 'Traction' },
  { to: '/founder/connect',  label: 'Connect'  },
  { to: '/founder/profile',  label: 'Profile', isProfile: true },
];

const investorTabs = [
  { to: '/investor/discover', label: 'Discover'     },
  { to: '/investor/saved',    label: 'Saved'        },
  { to: '/investor/connect',  label: 'Partnerships' },
  { to: '/investor/profile',  label: 'Profile', isProfile: true },
];

export default function BottomNav() {
  const { role, user } = useAuth();
  const tabs = role === 'investor' ? investorTabs : founderTabs;
  const initial = (user?.full_name || user?.name)?.[0]?.toUpperCase() ?? '?';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{
        borderTop: '1px solid #E5E7EB',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map(({ to, label, isProfile }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center min-w-[64px] px-2 py-1"
          >
            {({ isActive }) =>
              isProfile ? (
                /* ── Avatar tab ── */
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200"
                    style={{
                      background: isActive ? '#1A1A1A' : '#F3F4F6',
                      color:      isActive ? '#FFFFFF' : '#6B7280',
                      outline: isActive ? '2px solid #1A1A1A' : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                  >
                    {initial}
                  </div>
                  <span
                    className="text-[10px] font-semibold transition-colors duration-200"
                    style={{ color: isActive ? '#1A1A1A' : '#9CA3AF' }}
                  >
                    {label}
                  </span>
                </div>
              ) : (
                /* ── Regular tab ── */
                <>
                  <span
                    className="block w-8 h-0.5 mb-2 rounded-full transition-all duration-200"
                    style={{ background: isActive ? '#1A1A1A' : 'transparent' }}
                  />
                  <span
                    className="text-xs font-semibold transition-colors duration-200"
                    style={{ color: isActive ? '#1A1A1A' : '#9CA3AF' }}
                  >
                    {label}
                  </span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
