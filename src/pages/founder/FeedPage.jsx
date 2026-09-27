import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api';

/* ─── Helpers ───────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── Component ─────────────────────────────────────── */
export default function FounderFeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.full_name?.split(' ')[0] ?? 'Founder';

  const [feed, setFeed] = useState(null);
  const [pendingPartnerCount, setPendingPartnerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [feedData, partnersData] = await Promise.all([
          API.founder.getFeed(),
          API.partnerships.getAll().catch(() => ({ partnerships: [] }))
        ]);
        setFeed(feedData);

        const pending = (partnersData.partnerships || []).filter(
          p => !['ACCEPTED', 'DECLINED'].includes(p.status?.toUpperCase())
        );
        setPendingPartnerCount(pending.length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const opportunities = feed?.opportunities ?? [];
  const recentActivity = feed?.recent_investor_activity ?? [];
  const featuredInvestors = feed?.featured_investors ?? [];
  const completionPercent = feed?.profile_completion_percent ?? null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-8 pb-28">

      {/* ── Welcome banner ─────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
          {getGreeting()}
        </p>
        <h1 className="text-3xl font-bold text-[#1A1A1A] leading-tight mb-2">
          {firstName}
        </h1>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          Your profile is currently active. You're ready to connect with investors.
        </p>

        {/* Profile completion bar */}
        {completionPercent !== null && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-widest">
                Profile Completion
              </span>
              <span className="text-[11px] font-bold text-[#1A1A1A]">{completionPercent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1A1A1A] transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Pending Partnerships Alert */}
        {!loading && pendingPartnerCount > 0 && (
          <div
            onClick={() => navigate('/founder/connect')}
            className="mt-6 p-4 rounded-xl bg-black text-white flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
          >
            <div>
              <p className="text-sm font-bold">New Partnership Requests</p>
              <p className="text-xs text-gray-300 mt-0.5">You have {pendingPartnerCount} investor {pendingPartnerCount === 1 ? 'request' : 'requests'} waiting.</p>
            </div>
            <span className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-lg">View</span>
          </div>
        )}
      </div>

      {/* ── Quick actions ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/founder/traction')}
          className="card p-5 text-left active:scale-95 transition-transform hover:border-[#1A1A1A] flex flex-col justify-between h-28"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">Traction</span>
          <span className="text-sm font-bold text-[#1A1A1A]">View Activity</span>
        </button>
        <button
          onClick={() => navigate('/founder/connect')}
          className="card p-5 text-left active:scale-95 transition-transform hover:border-[#1A1A1A] flex flex-col justify-between h-28"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">Network</span>
          <span className="text-sm font-bold text-[#1A1A1A]">Discover</span>
        </button>
      </div>

      {/* ── Recent Investor Activity ─────────────────── */}
      {!loading && recentActivity.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            Recent Activity
          </p>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="card p-4 text-sm text-[#1A1A1A]">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Featured Investors ───────────────────────── */}
      {!loading && featuredInvestors.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            Featured Investors
          </p>
          <div className="space-y-2">
            {featuredInvestors.map((inv, i) => (
              <div key={i} className="card p-4 text-sm text-[#1A1A1A]">
                {typeof inv === 'string' ? inv : JSON.stringify(inv)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Open Opportunities ───────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
          Open Opportunities
        </p>
        <div className="space-y-4">
          {loading ? (
            <div className="card p-6 text-center text-sm text-[#9CA3AF]">
              Loading...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="card p-6 text-center text-sm text-[#9CA3AF]">
              No open opportunities right now.
            </div>
          ) : (
            opportunities.map((o, i) => (
              <div key={i} className="card p-5 flex flex-col justify-between">
                <div className="mb-4">
                  {o.label && <span className="tag-dark text-[10px] mb-3 inline-block">{o.label}</span>}
                  <p className="text-base font-bold text-[#1A1A1A] leading-tight">{o.title ?? o}</p>
                </div>
                {o.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {o.tags.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
                {o.deadline && (
                  <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                    <p className="text-xs text-[#6B7280] font-medium">Closes {o.deadline}</p>
                    <button className="btn-primary py-2 px-5 text-xs font-bold shrink-0">Apply</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
