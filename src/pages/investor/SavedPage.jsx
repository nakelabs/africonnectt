import React, { useState, useEffect } from 'react';
import { API } from '../../api';

const STATUS_FILTERS = ['All', 'Deck Requested', 'Partnered', 'Pending'];

export default function InvestorSavedPage() {
  const [filter, setFilter]       = useState('All');
  const [saved, setSaved]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText]   = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    async function loadSaved() {
      try {
        const data = await API.investor.getSaved();
        setSaved(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load saved founders');
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  // Filter by partnership_status from API
  const filtered = saved.filter(f => {
    if (filter === 'Deck Requested') return f.partnership_status === 'DECK_REQUEST';
    if (filter === 'Partnered')      return f.partnership_status === 'ACCEPTED';
    if (filter === 'Pending')        return !f.partnership_status;
    return true;
  });

  const unsave = async (id) => {
    setSaved(prev => prev.filter(f => f.id !== id));
    await API.investor.removeFounder(id).catch(console.error);
  };

  const saveNote = async (id) => {
    setSavingNote(true);
    try {
      await API.investor.updateNote(id, noteText);
      setSaved(prev => prev.map(f => f.id === id ? { ...f, investor_note: noteText } : f));
      setNoteTarget(null);
      setNoteText('');
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  const requestDeck = async (id) => {
    try {
      await API.partnerships.requestDeck(id, 'I would like to request your latest pitch deck.');
      setSaved(prev => prev.map(f => f.id === id ? { ...f, partnership_status: 'DECK_REQUEST' } : f));
    } catch (e) {
      console.error(e);
      alert('Failed to request deck: ' + e.message);
    }
  };

  const initPartnership = async (id) => {
    try {
      await API.partnerships.initiate(id, 'I would like to formally initiate a partnership.');
      setSaved(prev => prev.map(f => f.id === id ? { ...f, partnership_status: 'MEETING_REQUEST' } : f));
    } catch (e) {
      console.error(e);
      alert('Failed to initiate partnership: ' + e.message);
    }
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4 pb-28">

      {/* ── Header ─────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Saved Founders</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          Startups you've expressed interest in — your private deal pipeline.
        </p>
      </div>

      {/* ── Summary strip ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total Saved',    value: saved.length },
          { label: 'Deck Requested', value: saved.filter(f => f.partnership_status === 'DECK_REQUEST').length },
          { label: 'Partnered',      value: saved.filter(f => f.partnership_status === 'ACCEPTED').length },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-xl font-bold text-[#1A1A1A]">{s.value}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter chips ───────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip shrink-0 ${f === filter ? 'chip-active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Founder cards ──────────────────────────── */}
      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-[#9CA3AF]">Loading your pipeline...</p>
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-[#9CA3AF]">No saved founders in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(founder => {
            const isDecked    = founder.partnership_status === 'DECK_REQUEST';
            const isPartnered = founder.partnership_status === 'ACCEPTED';
            const initials    = (founder.startup_name || '?')[0].toUpperCase();

            return (
              <div key={founder.id} className="card overflow-hidden">
                <div className="p-4">

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">{initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">{founder.startup_name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{founder.founder_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="tag">{founder.sector}</span>
                      {isPartnered && (
                        <span className="text-[10px] font-semibold text-[#16A34A]">● Partnered</span>
                      )}
                      {!isPartnered && isDecked && (
                        <span className="text-[10px] font-semibold text-[#6B7280]">Deck Requested</span>
                      )}
                    </div>
                  </div>

                  {/* Pitch */}
                  <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{founder.pitch}</p>

                  {/* Stats */}
                  <div className="flex gap-2 mb-3">
                    {[
                      { label: 'Ask',   value: founder.the_ask ? `$${founder.the_ask.toLocaleString()}` : 'TBD' },
                      { label: 'Stage', value: founder.stage },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex-1 rounded-xl p-2 bg-[#F9FAFB] border border-[#E5E7EB]">
                        <p className="text-xs font-bold tabular-nums text-[#1A1A1A]">{value}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Private note */}
                  {noteTarget === founder.id ? (
                    <div className="mb-3">
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add a private note about this founder…"
                        rows={2}
                        className="input-field text-xs resize-none"
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button
                          onClick={() => saveNote(founder.id)}
                          disabled={savingNote}
                          className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50"
                        >
                          {savingNote ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setNoteTarget(null)} className="btn-outline text-xs py-1.5 px-3">Cancel</button>
                      </div>
                    </div>
                  ) : founder.investor_note ? (
                    <div
                      className="mb-3 px-3 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] cursor-pointer"
                      onClick={() => { setNoteTarget(founder.id); setNoteText(founder.investor_note); }}
                    >
                      <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-0.5">Private Note</p>
                      <p className="text-xs text-[#6B7280]">{founder.investor_note}</p>
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => requestDeck(founder.id)}
                      disabled={isDecked || isPartnered}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95
                        ${isDecked || isPartnered
                          ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] cursor-default'
                          : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:border-[#1A1A1A]'
                        }`}
                    >
                      {isDecked ? '✓ Deck Requested' : 'Request Deck'}
                    </button>

                    <button
                      onClick={() => initPartnership(founder.id)}
                      disabled={isPartnered}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
                        ${isPartnered
                          ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] cursor-default'
                          : 'bg-[#1A1A1A] text-white hover:bg-[#333]'
                        }`}
                    >
                      {isPartnered ? '✓ Partnered' : 'Initiate Partnership'}
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                    <span className="text-[10px] text-[#9CA3AF]">Stage: {founder.stage}</span>
                    <div className="flex gap-3">
                      <button
                        className="text-[11px] font-semibold text-[#6B7280] underline underline-offset-2"
                        onClick={() => { setNoteTarget(founder.id); setNoteText(founder.investor_note || ''); }}
                      >
                        {founder.investor_note ? 'Edit note' : 'Add note'}
                      </button>
                      <button
                        className="text-[11px] font-semibold text-[#EF4444] underline underline-offset-2"
                        onClick={() => unsave(founder.id)}
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
