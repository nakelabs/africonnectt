import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API } from '../../api';

const STAGES = ['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth'];
const STAGE_LABELS = {
  idea: 'Idea', pre_seed: 'Pre-Seed', seed: 'Seed',
  series_a: 'Series A', series_b: 'Series B', series_c: 'Series C', growth: 'Growth',
};

export default function FounderProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullPitch, setShowFullPitch] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Edit form state
  const [form, setForm] = useState({});

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await API.founder.getProfile();
        setProfile(data);
        setForm({
          full_name: data.full_name ?? '',
          startup_name: data.startup_name ?? '',
          startup_pitch: data.startup_pitch ?? '',
          startup_sector: data.startup_sector ?? '',
          stage: data.stage ?? '',
          the_ask: data.the_ask ?? '',
          experience: data.experience ?? '',
          education: data.education ?? '',
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
        full_name: form.full_name || null,
        startup_name: form.startup_name || null,
        startup_pitch: form.startup_pitch || null,
        startup_sector: form.startup_sector || null,
        stage: form.stage || null,
        the_ask: form.the_ask ? parseFloat(form.the_ask) : null,
        experience: form.experience || null,
        education: form.education || null,
      };
      const updated = await API.founder.updateProfile(payload);
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
  if (error) return <div className="p-8 text-center text-sm text-red-500">{error}</div>;
  if (!profile) return null;

  const pitch = profile.startup_pitch || '';
  const initials = (profile.full_name || 'U')[0].toUpperCase();

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

        <div className="card p-5 space-y-4">
          <span className="section-label">Identity</span>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Full Name</label>
            <input type="text" className="input-field" {...field('full_name')} placeholder="Your full name" />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <span className="section-label">Startup</span>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Startup Name</label>
            <input type="text" className="input-field" {...field('startup_name')} placeholder="e.g. PayEase Africa" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Elevator Pitch</label>
              <span className="text-[10px] text-[#9CA3AF]">{form.startup_pitch.length}/300</span>
            </div>
            <textarea
              className="input-field resize-none text-sm"
              rows={3}
              maxLength={300}
              {...field('startup_pitch')}
              placeholder="One sentence mission..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Sector</label>
              <input type="text" className="input-field" {...field('startup_sector')} placeholder="e.g. Fintech" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Stage</label>
              <select className="input-field bg-white" {...field('stage')}>
                <option value="">Select...</option>
                {STAGES.map(s => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">The Ask (USD)</label>
            <input type="number" className="input-field" {...field('the_ask')} placeholder="e.g. 500000" min="0" />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <span className="section-label">Background</span>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Experience</label>
            <textarea
              className="input-field resize-none text-sm"
              rows={3}
              {...field('experience')}
              placeholder="Describe your relevant experience..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Education</label>
            <textarea
              className="input-field resize-none text-sm"
              rows={2}
              {...field('education')}
              placeholder="Your educational background..."
            />
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
          <p className="text-sm text-[#6B7280] mt-0.5 leading-snug">Founder at {profile.startup_name}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">{profile.email}</p>

          {/* Profile completion */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest">Profile Completion</span>
              <span className="text-[10px] font-bold text-[#1A1A1A]">{profile.profile_completion_percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1A1A1A] transition-all duration-500"
                style={{ width: `${profile.profile_completion_percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Traction Metrics ─────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        <MetricTile value={profile.traction_views} label="Profile Views" />
        <MetricTile value={profile.traction_interest} label="Investor Interest" highlight />
        <MetricTile value={profile.traction_deck_requests} label="Deck Requests" />
      </div>

      {/* ── Startup Showcase ─────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Startup</span>
          {profile.startup_sector && <span className="tag">{profile.startup_sector}</span>}
        </div>

        <h2 className="font-bold text-[#1A1A1A] text-base">{profile.startup_name}</h2>

        {pitch && (
          <>
            <p className="text-sm text-[#1A1A1A] leading-relaxed mt-2">
              {showFullPitch ? pitch : pitch.slice(0, 120) + (pitch.length > 120 ? '…' : '')}
            </p>
            {pitch.length > 120 && (
              <button
                onClick={() => setShowFullPitch(v => !v)}
                className="text-[11px] text-[#6B7280] font-semibold mt-2 underline underline-offset-2"
              >
                {showFullPitch ? 'Show less' : 'Read more'}
              </button>
            )}
          </>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            ['Stage', STAGE_LABELS[profile.stage] ?? profile.stage],
            ['Currency', profile.currency],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} className="rounded-xl p-2.5 bg-[#F9FAFB] border border-[#E5E7EB]">
              <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider">{label}</p>
              <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{val}</p>
            </div>
          ))}
        </div>

        {profile.the_ask && (
          <>
            <div className="border-t border-[#E5E7EB] my-4" />
            <div className="rounded-xl p-4 bg-[#F9FAFB] border border-[#E5E7EB]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">The Ask</p>
              <p className="text-[#1A1A1A] font-bold text-lg">
                {profile.currency}{profile.the_ask.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Experience ──────────────────────────────── */}
      {profile.experience && (
        <div className="card p-5">
          <span className="section-label block mb-3">Experience</span>
          <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line">{profile.experience}</p>
        </div>
      )}

      {/* ── Education ───────────────────────────────── */}
      {profile.education && (
        <div className="card p-5">
          <span className="section-label block mb-3">Education</span>
          <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line">{profile.education}</p>
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
