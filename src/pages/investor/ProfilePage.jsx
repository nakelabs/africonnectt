import React, { useState, useEffect } from 'react';
import { API } from '../../api';

export default function InvestorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState('');

  // Edit form state
  const [form, setForm] = useState({});

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await API.investor.getProfile();
        setProfile(data);
        setForm({
          full_name:          data.full_name          ?? '',
          firm_name:          data.firm_name          ?? '',
          investment_thesis:  data.investment_thesis  ?? '',
          preferred_sectors:  data.preferred_sectors  ?? '',
          min_ticket_size:    data.min_ticket_size     ?? '',
          max_ticket_size:    data.max_ticket_size     ?? '',
        });
      } catch (e) {
        setError(e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        full_name:         form.full_name         || null,
        firm_name:         form.firm_name         || null,
        investment_thesis: form.investment_thesis || null,
        preferred_sectors: form.preferred_sectors || null,
        min_ticket_size:   form.min_ticket_size ? parseFloat(form.min_ticket_size) : null,
        max_ticket_size:   form.max_ticket_size ? parseFloat(form.max_ticket_size) : null,
      };
      const updated = await API.investor.updateProfile(payload);
      setProfile(updated);
      setEditing(false);
    } catch (e) {
      setSaveError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  if (loading) return <div className="p-8 text-center text-sm text-[#9CA3AF]">Loading profile...</div>;
  if (error)   return <div className="p-8 text-center text-sm text-red-500">{error}</div>;
  if (!profile) return null;

  const initials = (profile.full_name || 'I')[0].toUpperCase();
  const ticketRange = [
    profile.min_ticket_size ? `$${profile.min_ticket_size.toLocaleString()}` : null,
    profile.max_ticket_size ? `$${profile.max_ticket_size.toLocaleString()}` : null,
  ].filter(Boolean).join(' – ') || null;

  /* ─── EDIT MODE ──────────────────────────────────────── */
  if (editing) {
    return (
      <div className="px-4 py-4 max-w-lg mx-auto space-y-4 pb-28">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#1A1A1A]">Edit Profile</h1>
          <button
            onClick={() => { setEditing(false); setSaveError(''); }}
            className="text-xs text-[#6B7280] underline underline-offset-2"
          >
            Cancel
          </button>
        </div>

        {/* Identity */}
        <div className="card p-5 space-y-4">
          <span className="section-label">Identity</span>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Full Name</label>
            <input type="text" className="input-field" {...field('full_name')} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Firm / Individual Name</label>
            <input type="text" className="input-field" {...field('firm_name')} placeholder="e.g. Savanna Ventures" />
          </div>
        </div>

        {/* Investment Details */}
        <div className="card p-5 space-y-4">
          <span className="section-label">Investment Focus</span>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Investment Thesis</label>
            <textarea
              className="input-field resize-none text-sm"
              rows={4}
              {...field('investment_thesis')}
              placeholder="What industries or problems do you care about?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Preferred Sectors</label>
            <textarea
              className="input-field resize-none text-sm"
              rows={2}
              {...field('preferred_sectors')}
              placeholder="e.g. Fintech, Healthtech, Agritech"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Min Ticket (USD)</label>
              <input
                type="number"
                className="input-field"
                {...field('min_ticket_size')}
                placeholder="e.g. 50000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Max Ticket (USD)</label>
              <input
                type="number"
                className="input-field"
                {...field('max_ticket_size')}
                placeholder="e.g. 500000"
                min="0"
              />
            </div>
          </div>
        </div>

        {saveError && <p className="text-sm text-red-500 text-center">{saveError}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-sm font-bold bg-[#1A1A1A] text-white active:scale-95 transition-transform disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </div>
    );
  }

  /* ─── VIEW MODE ──────────────────────────────────────── */
  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-3 pb-28">

      {/* ── Header Card ─────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="h-20 w-full bg-[#1A1A1A]" />
        <div className="px-4 pb-5 -mt-8">
          <div className="flex items-end justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl border-4 border-white bg-[#1A1A1A] flex items-center justify-center">
              <span className="text-white text-xl font-bold">{initials}</span>
            </div>
            <div className="flex gap-2 mt-10">
              <button className="btn-outline py-1.5 px-3 text-xs">Share</button>
              <button
                onClick={() => setEditing(true)}
                className="btn-primary py-1.5 px-3 text-xs"
              >
                Edit
              </button>
            </div>
          </div>

          <h1 className="text-base font-bold text-[#1A1A1A] leading-snug">{profile.full_name}</h1>
          {profile.firm_name && (
            <p className="text-sm text-[#6B7280] mt-0.5 leading-snug">{profile.firm_name}</p>
          )}
          <p className="text-xs text-[#9CA3AF] mt-1">{profile.email}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="tag-dark">Verified Investor</span>
          </div>
        </div>
      </div>

      {/* ── Activity Stats ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        <MetricTile value={profile.deals_reviewed}      label="Deals Reviewed" />
        <MetricTile value={profile.active_partnerships} label="Partnerships" highlight />
        <MetricTile value={profile.portfolio_companies != null ? profile.portfolio_companies : '—'} label="Portfolio" />
      </div>

      {/* ── Investment Focus ─────────────────────────── */}
      <div className="card p-5">
        <span className="section-label mb-3 block">Investment Focus</span>

        {profile.investment_thesis && (
          <p className="text-sm text-[#1A1A1A] leading-relaxed mb-4">{profile.investment_thesis}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {[
            ['Ticket Size', ticketRange],
            ['Currency',    profile.currency],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} className="rounded-xl p-2.5 bg-[#F9FAFB] border border-[#E5E7EB]">
              <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider">{label}</p>
              <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Preferred Sectors ────────────────────────── */}
      {profile.preferred_sectors && (
        <div className="card p-5">
          <span className="section-label block mb-3">Preferred Sectors</span>
          <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line">
            {profile.preferred_sectors}
          </p>
        </div>
      )}

      {/* ── Portfolio Companies ──────────────────────── */}
      {profile.portfolio_companies && typeof profile.portfolio_companies === 'string' && (
        <div className="card p-5">
          <span className="section-label block mb-3">Portfolio Companies</span>
          <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line">
            {profile.portfolio_companies}
          </p>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}

function MetricTile({ value, label, highlight }) {
  return (
    <div className={`card p-3 flex flex-col gap-1 ${highlight ? 'border-[#1A1A1A]' : ''}`}>
      <p className="text-xl font-bold tabular-nums text-[#1A1A1A]">{value ?? '—'}</p>
      <p className="text-[10px] text-[#9CA3AF] leading-tight">{label}</p>
    </div>
  );
}
