import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../api';

/* Helpers */
function fmt(n) {
  if (n == null) return 'N/A';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

const SECTOR_COLORS = {
  Fintech:    '#E8F5E9',
  Healthtech: '#E3F2FD',
  Agritech:   '#FFF8E1',
  Edtech:     '#F3E5F5',
  Cleantech:  '#E0F2F1',
  'E-commerce': '#FBE9E7',
};
function sectorColor(s) { return SECTOR_COLORS[s] || '#F5F5F5'; }

/* Sub-components */
function Stat({ label, value, loading }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-1.5">
      <span className="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900">
        {loading
          ? <span className="inline-block w-20 h-8 bg-zinc-200 rounded animate-pulse" />
          : value}
      </span>
      <span className="text-[11px] uppercase tracking-widest font-medium text-zinc-400">{label}</span>
    </div>
  );
}

function OpportunityCard({ opp }) {
  return (
    <div style={{ borderTop: '3px solid #1A1A1A' }}
      className="bg-white p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900 leading-snug tracking-tight">{opp.title}</h3>
        <span
          className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: sectorColor(opp.sector), color: '#1A1A1A' }}
        >
          {opp.sector || 'Other'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 inline-block" />
          {opp.stage || 'Undisclosed'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          {opp.ask_amount ? fmt(opp.ask_amount) : 'Ask undisclosed'}
        </span>
      </div>
    </div>
  );
}

/* Page */
export default function LandingPage() {
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    API.public.getLandingFeed()
      .then(d  => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const opportunities = stats?.active_opportunities ?? [];

  return (
    <div className="min-h-dvh bg-white text-zinc-900 font-sans selection:bg-zinc-100">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur z-50">
        <span className="text-base font-semibold tracking-tight">AfriConnect</span>
        <div className="flex items-center gap-3">
          <Link to="/login"   className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Log in</Link>
          <Link to="/signup"  className="text-sm font-medium bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors">Join</Link>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="px-6 md:px-12 pt-24 pb-28 max-w-5xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-6">
          Africa's Premier Deal-Flow Platform
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05] mb-8 text-zinc-900 max-w-3xl">
          Where African Innovation Meets Global Capital.
        </h1>
        <p className="text-lg md:text-xl font-light text-zinc-500 leading-relaxed max-w-2xl mb-12">
          AfriConnect is a dedicated ecosystem designed to bridge the gap between high-potential African startups and global investors. We streamline the deal-flow process, replacing cold emails and fragmented networking with a unified platform for discovering, evaluating, and closing investment opportunities.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/signup"
            className="bg-zinc-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </section>

      {/* 2. LIVE STATS */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">
          <Stat label="Active Investors"    value={stats?.total_investors ?? '0'}    loading={loading} />
          <Stat label="Active Partnerships" value={stats?.active_partnerships ?? '0'} loading={loading} />
          <Stat label="Total Raised"        value={stats?.total_raised != null ? fmt(stats.total_raised) : '0'} loading={loading} />
          <Stat label="Open Opportunities"  value={opportunities.length || '0'}       loading={loading} />
        </div>
      </section>


      {/* 3. THE PROBLEM */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-4">The Status Quo</p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 max-w-2xl">
              Cross-border fundraising is broken. We're fixing the friction.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6 text-lg">✕</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">For Founders</h3>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">
                Months spent sending cold emails into the void. Access to global capital networks is heavily gated, and time is wasted pitching to misaligned investors who don't understand the local market.
              </p>
            </div>
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6 text-lg">✕</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">For Investors</h3>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">
                Dealing with a high noise-to-signal ratio. It's incredibly difficult to discover quality deal flow, verify traction in emerging markets, and conduct fragmented due diligence from thousands of miles away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. TRUST & VERIFICATION */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-4">Security & Verification</p>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Built on absolute trust.
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-8">
              Trust is the single biggest barrier to cross-border investment. That's why every founder and investor on AfriConnect goes through a rigorous manual verification process before they can access the platform.
            </p>
            <ul className="space-y-4">
              {[
                'KYC & Identity Verification',
                'Business Entity & Traction Audits',
                'Investor Mandate & Fund Verification'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-medium text-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. VALUE PROP */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-4">Why AfriConnect</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-16 max-w-lg">
            Every feature built for one purpose: closing the deal.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Verified Profiles',
                body: 'Every founder and investor goes through a rigorous verification process. We ensure you engage only with serious, committed operators, eliminating noise and fake accounts.',
              },
              {
                num: '02',
                title: 'Precision Matching',
                body: 'Utilize our advanced filtering by sector, growth stage, ticket size, and geographic focus. Instantly surface investment opportunities or capital sources that perfectly align with your specific mandate.',
              },
              {
                num: '03',
                title: 'Seamless Partnerships',
                body: 'Manage the entire investment lifecycle in one centralized hub. From initial contact and due diligence to secure document sharing and signing term sheets, track every crucial milestone effortlessly.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="flex flex-col gap-4">
                <span className="text-xs font-semibold text-zinc-300 tracking-widest">{num}</span>
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">{title}</h3>
                <p className="text-sm font-light text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="py-24 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">
              From Discovery to Partnership in Three Steps
            </h2>
            <p className="text-sm text-zinc-400 font-light">Designed to remove friction at every stage.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* connector line (desktop only) */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-zinc-200 z-0" />

            {[
              { step: '01', title: 'Build Your Profile', body: 'Founders showcase their traction, metrics, and vision. Investors define their investment thesis and capital availability.' },
              { step: '02', title: 'Explore & Discover',  body: 'Access a dynamic, curated marketplace. Investors can explore promising startups, while founders can identify active investors aligned with their sector.' },
              { step: '03', title: 'Initiate a Handshake', body: 'Connect with intent. Send a partnership signal, and upon mutual interest, securely unlock confidential data rooms, direct messaging, and key contact details.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left px-6 py-8">
                <div className="w-12 h-12 rounded-full border-2 border-zinc-200 bg-white flex items-center justify-center mb-6">
                  <span className="text-xs font-bold text-zinc-900 tracking-widest">{step}</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-sm font-light text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer bar */}
      <footer className="px-6 md:px-12 py-6 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-400">AfriConnect · Bridging Innovation and Capital.</span>
        <span className="text-xs text-zinc-300">&copy; {new Date().getFullYear()} AfriConnect</span>
      </footer>

    </div>
  );
}
