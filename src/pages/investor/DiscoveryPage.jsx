import React, { useState, useEffect } from 'react';
import { API } from '../../api';



const SECTORS = ['All', 'Fintech', 'Agritech', 'Healthtech', 'Edtech', 'Cleantech'];
const STAGES  = ['All Stages', 'Pre-Seed', 'Seed', 'Series A'];
const TICKETS = ['Any Size', '$100K–$500K', '$500K–$2M', '$2M+'];

export default function InvestorDiscoveryPage() {
  const [startups, setStartups] = useState([]);
  const [sector, setSector]     = useState('All');
  const [stage, setStage]       = useState('All Stages');
  const [ticket, setTicket]     = useState('Any Size');
  const [loading, setLoading]   = useState(true);

  // For optimistic updates since saving happens via API now
  const [saved, setSaved]       = useState(new Set());
  const [requested, setRequested] = useState(new Set());

  useEffect(() => {
    async function loadStartups() {
      setLoading(true);
      try {
        const data = await API.investor.discover(sector, stage);
        setStartups(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStartups();
  }, [sector, stage]);

  const filtered = startups.filter(s => {
    if (ticket !== 'Any Size' && s.the_ask !== ticket) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Sticky Filter Bar ─────────────────────── */}
      <div
        className="sticky top-0 z-30 bg-[#FCFCFC]"
        style={{ borderBottom: '1px solid #E5E7EB' }}
      >
        {/* Sector row */}
        <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {SECTORS.map(s => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`chip shrink-0 ${s === sector ? 'chip-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stage + Ticket row */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
          {STAGES.map(s => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`chip shrink-0 text-[11px] ${s === stage ? 'chip-active' : ''}`}
            >
              {s}
            </button>
          ))}
          <div className="w-px bg-[#E5E7EB] mx-1 self-stretch" />
          {TICKETS.map(t => (
            <button
              key={t}
              onClick={() => setTicket(t)}
              className={`chip shrink-0 text-[11px] ${t === ticket ? 'chip-active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ─────────────────────────── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1A1A1A]">
          {filtered.length} startup{filtered.length !== 1 ? 's' : ''}
        </p>
        <p className="text-[11px] text-[#9CA3AF]">AfriConnect Deal Flow</p>
      </div>

      {/* ── Cards ─────────────────────────────────── */}
      <div className="px-4 pb-6 space-y-3">
        {loading ? (
          <div className="card p-8 text-center mt-4">
            <p className="text-[#9CA3AF] text-sm">Finding opportunities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center mt-4">
            <p className="text-[#9CA3AF] text-sm">No startups match your filters.</p>
            <button
              className="btn-outline mt-4 text-xs"
              onClick={() => { setSector('All'); setStage('All Stages'); setTicket('Any Size'); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filtered.map(startup => (
            <StartupCard
              key={startup.id}
              startup={startup}
              isSaved={startup.has_been_saved || saved.has(startup.id)}
              isRequested={startup.has_requested_deck || requested.has(startup.id)}
              onSave={async () => {
                setSaved(prev => new Set([...prev, startup.id]));
                await API.investor.saveFounder(startup.id).catch();
              }}
              onRequest={async () => {
                setRequested(prev => new Set([...prev, startup.id]));
                await API.partnerships.requestDeck(startup.id, '').catch();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StartupCard({ startup, isSaved, isRequested, onSave, onRequest }) {
  return (
    <article className="card card-hover overflow-hidden">
      <div className="p-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base">{(startup.startup_name || '?')[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#1A1A1A]">{startup.startup_name}</h3>
              </div>
              <p className="text-xs text-[#9CA3AF]">{startup.founder_name}</p>
            </div>
          </div>

          <span className="tag">{startup.sector}</span>
        </div>


        {/* Pitch */}
        <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{startup.pitch}</p>

        {/* Traction */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'Ask',        value: startup.the_ask ? `${startup.currency || '$'}${startup.the_ask.toLocaleString()}` : 'TBD' },
          ].map(({ label, value, green }) => (
            <div key={label} className="flex-1 rounded-xl p-2.5 bg-[#F9FAFB] border border-[#E5E7EB]">
              <p className={`text-xs font-bold tabular-nums ${green ? 'text-[#16A34A]' : 'text-[#1A1A1A]'}`}>{value}</p>
              <p className="text-[10px] text-[#9CA3AF]">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF] mb-4">
          <span>{startup.stage}</span>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <button
            onClick={onRequest}
            disabled={isRequested}
            className={`
              flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95
              ${isRequested
                ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] cursor-default'
                : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:border-[#1A1A1A]'
              }
            `}
          >
            {isRequested ? '✓ Deck Requested' : 'Request Pitch Deck'}
          </button>

          <button
            onClick={onSave}
            disabled={isSaved}
            className={`
              flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
              ${isSaved
                ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] cursor-default'
                : 'bg-[#1A1A1A] text-white hover:bg-[#333]'
              }
            `}
          >
            {isSaved ? '✓ Saved' : 'Save Founder'}
          </button>
        </div>
      </div>
    </article>
  );
}
