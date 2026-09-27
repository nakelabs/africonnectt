import React, { useState, useEffect } from 'react';
import { API } from '../../api';

function ConversionBar({ label, numerator, denominator }) {
  const pct = denominator > 0 ? Math.min((numerator / denominator) * 100, 100) : 0;
  const isGood = pct >= 10;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-[#6B7280]">{label}</p>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-[#F9FAFB] text-[#9CA3AF]'}`}>
            {isGood ? 'Strong' : 'Keep growing'}
          </span>
          <p className="text-xs font-bold text-[#1A1A1A] tabular-nums">{pct.toFixed(1)}%</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isGood ? 'bg-emerald-500' : 'bg-[#1A1A1A]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function FounderTractionPage() {
  const [traction, setTraction] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    async function loadTraction() {
      try {
        const data = await API.founder.getTraction();
        setTraction(data);
      } catch (e) {
        setError(e.message || 'Failed to load traction data');
      } finally {
        setLoading(false);
      }
    }
    loadTraction();
  }, []);

  if (loading) return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-28 animate-pulse">
      <div className="h-8 w-40 bg-[#F3F4F6] rounded" />
      <div className="h-28 bg-[#F3F4F6] rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-[#F3F4F6] rounded-2xl" />
        <div className="h-24 bg-[#F3F4F6] rounded-2xl" />
      </div>
      <div className="h-40 bg-[#F3F4F6] rounded-2xl" />
    </div>
  );

  if (error) return (
    <div className="max-w-lg mx-auto px-4 py-8 text-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  const views    = traction?.profile_views    ?? 0;
  const interest = traction?.investor_interest ?? 0;
  const decks    = traction?.deck_requests    ?? 0;
  const hasData  = views > 0 || interest > 0 || decks > 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-28">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Traction</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">Real-time investor activity on your profile.</p>
      </div>

      {!hasData ? (
        /* ── Empty state ── */
        <div className="rounded-3xl border-2 border-dashed border-[#E5E7EB] p-10 text-center">
          <p className="text-3xl mb-3">📡</p>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-1">No activity yet</h2>
          <p className="text-sm text-[#9CA3AF] font-light leading-relaxed">
            Your profile has 0 views so far. Share your profile link to start getting discovered by investors.
          </p>
        </div>
      ) : (
        <>
          {/* ── Primary metric — large hero tile ── */}
          <div className="rounded-3xl bg-[#1A1A1A] p-6 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-1">Investor Interest</p>
            <p className="text-5xl font-bold tabular-nums tracking-tight">{interest}</p>
            <p className="text-xs text-white/40 mt-2 font-light">investors have signalled interest in your startup</p>
          </div>

          {/* ── Secondary metrics ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-5">
              <p className="text-2xl font-bold tabular-nums text-[#1A1A1A]">{views}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">Profile Views</p>
            </div>
            <div className="card p-5">
              <p className="text-2xl font-bold tabular-nums text-[#1A1A1A]">{decks}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">Deck Requests</p>
            </div>
          </div>

          {/* ── Conversion section ── */}
          {views > 0 && (
            <div className="card p-5 space-y-5">
              <span className="section-label">Conversion Rates</span>
              <ConversionBar label="Views → Investor Interest" numerator={interest} denominator={views} />
              <ConversionBar label="Views → Deck Request"      numerator={decks}    denominator={views} />
            </div>
          )}

          {/* ── Breakdown list ── */}
          <div className="card p-5">
            <span className="section-label block mb-4">Breakdown</span>
            <div className="divide-y divide-[#F3F4F6]">
              {[
                { label: 'Profile Views',          val: views    },
                { label: 'Investor Interest Signals', val: interest },
                { label: 'Pitch Deck Requests',    val: decks    },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <p className="text-sm text-[#6B7280]">{label}</p>
                  <p className="text-sm font-bold text-[#1A1A1A] tabular-nums">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
