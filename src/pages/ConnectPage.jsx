import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../api';

const STATUS_LABELS = {
  PENDING:         'Pending Response',
  ACCEPTED:        'Accepted',
  DECLINED:        'Declined',
};

const STATUS_COLORS = {
  PENDING:         'text-[#D97706]',
  ACCEPTED:        'text-[#16A34A]',
  DECLINED:        'text-[#EF4444]',
};

export default function ConnectPage() {
  const { role } = useAuth();
  const isInvestor = role === 'investor';

  const [partnerships, setPartnerships] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [accepting, setAccepting]       = useState(null);
  const [declining, setDeclining]       = useState(null);
  const [msgTarget, setMsgTarget]       = useState(null); // partnership id with message open
  const [msgText, setMsgText]           = useState('');
  const [sending, setSending]           = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await API.partnerships.getAll();
        setPartnerships(data.partnerships ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        setError(e.message || 'Failed to load partnerships');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      await API.partnerships.accept(id, 'I am pleased to accept this partnership.');
      setPartnerships(prev =>
        prev.map(p => p.id === id ? { ...p, status: 'ACCEPTED' } : p)
      );
    } catch (e) {
      console.error(e);
      alert('Failed to accept: ' + e.message);
    } finally {
      setAccepting(null);
    }
  };

  const handleDecline = async (id) => {
    setDeclining(id);
    try {
      await API.partnerships.decline(id).catch(e => console.warn('Decline endpoint might not exist', e));
      setPartnerships(prev =>
        prev.map(p => p.id === id ? { ...p, status: 'DECLINED' } : p)
      );
    } catch (e) {
      console.error(e);
      alert('Failed to decline: ' + e.message);
    } finally {
      setDeclining(null);
    }
  };

  const handleSendMessage = async (id) => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      await API.partnerships.sendMessage(id, msgText.trim());
      setMsgText('');
      setMsgTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  // Pending = founders who haven't responded yet
  const pending  = partnerships.filter(p => !['ACCEPTED', 'DECLINED'].includes(p.status?.toUpperCase()));
  const accepted = partnerships.filter(p => p.status?.toUpperCase() === 'ACCEPTED');
  const others   = partnerships.filter(p => p.status?.toUpperCase() === 'DECLINED');

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 pb-28">

      {/* ── Header ─────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Partnerships</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          {isInvestor
            ? 'Founders you are actively partnered with or have reached out to.'
            : 'Investors who want to partner with you.'}
        </p>
      </div>

      {/* ── Summary tiles ───────────────────────────── */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total',    value: total },
            { label: 'Pending',  value: pending.length  },
            { label: 'Active',   value: accepted.length },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <p className="text-xl font-bold text-[#1A1A1A]">{s.value}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ─────────────────────────────────── */}
      {loading ? (
        <div className="card p-8 text-center text-sm text-[#9CA3AF]">Loading partnerships...</div>
      ) : error ? (
        <div className="card p-8 text-center text-sm text-red-500">{error}</div>
      ) : partnerships.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[#9CA3AF]">
          No partnerships yet.
        </div>
      ) : (
        <div className="space-y-3">

          {/* Pending requests */}
          {pending.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
                Awaiting Response
              </p>
              <div className="space-y-2">
                {pending.map(p => (
                  <PartnershipCard
                    key={p.id}
                    partnership={p}
                    isInvestor={isInvestor}
                    onAccept={() => handleAccept(p.id)}
                    accepting={accepting === p.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active partnerships */}
          {accepted.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
                Active
              </p>
              <div className="space-y-2">
                {accepted.map(p => (
                  <div key={p.id}>
                    <PartnershipCard
                      partnership={p}
                      isInvestor={isInvestor}
                      onAccept={() => handleAccept(p.id)}
                      accepting={accepting === p.id}
                      onDecline={() => handleDecline(p.id)}
                      declining={declining === p.id}
                      onMessage={() => { setMsgTarget(p.id); setMsgText(''); }}
                    />
                    {msgTarget === p.id && (
                      <div className="mt-1 px-4 pb-4 card -mt-2 pt-0 rounded-t-none border-t-0">
                        <textarea
                          autoFocus
                          value={msgText}
                          onChange={e => setMsgText(e.target.value)}
                          placeholder="Write a message..."
                          rows={2}
                          className="input-field text-xs resize-none mt-3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSendMessage(p.id)}
                            disabled={sending || !msgText.trim()}
                            className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50"
                          >
                            {sending ? 'Sending...' : 'Send'}
                          </button>
                          <button
                            onClick={() => setMsgTarget(null)}
                            className="btn-outline py-1.5 px-3 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declined */}
          {others.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
                Declined
              </p>
              <div className="space-y-2">
                {others.map(p => (
                  <PartnershipCard
                    key={p.id}
                    partnership={p}
                    isInvestor={isInvestor}
                    onAccept={() => {}}
                    accepting={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PartnershipCard({ partnership: p, isInvestor, onAccept, accepting, onDecline, declining, onMessage }) {
  const statusUp   = p.status?.toUpperCase();
  const isAccepted = statusUp === 'ACCEPTED';
  const isDeclined = statusUp === 'DECLINED';
  const isPending  = !isAccepted && !isDeclined;

  // Investors see founder info; founders see investor info
  const primaryName   = isInvestor ? p.founder_name  : p.investor_name;
  const secondaryName = isInvestor ? p.startup_name  : p.investor_name;
  const initial       = (primaryName || '?')[0].toUpperCase();

  const typeLabel = p.partnership_type === 'DECK_REQUEST'
    ? 'Requested your deck'
    : p.partnership_type === 'MEETING_REQUEST'
    ? 'Requested a meeting'
    : p.partnership_type;

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1A1A] truncate">{primaryName}</p>
          <p className="text-xs text-[#9CA3AF] truncate">{secondaryName}</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">{typeLabel}</p>

          {/* Notes */}
          {p.investor_note && (
            <p className="text-[11px] text-[#9CA3AF] mt-1 italic">"{p.investor_note}"</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Status badge */}
          <span className={`text-[10px] font-semibold ${STATUS_COLORS[statusUp] ?? 'text-[#D97706]'}`}>
            {STATUS_LABELS[statusUp] ?? (p.status || 'PENDING')}
          </span>

          {/* Timestamp */}
          {p.created_at && (
            <span className="text-[10px] text-[#C4C9D4]">
              {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          )}

          {/* Action button */}
          {!isInvestor && isPending && (
            <div className="flex gap-2">
              <button
                onClick={onDecline}
                disabled={declining || accepting}
                className="btn-outline py-1 px-3 text-xs rounded-lg disabled:opacity-50 !border-[#E5E7EB] !text-[#6B7280] hover:!text-[#EF4444]"
              >
                {declining ? '...' : 'Decline'}
              </button>
              <button
                onClick={onAccept}
                disabled={accepting || declining}
                className="btn-primary py-1 px-3 text-xs rounded-lg disabled:opacity-50"
              >
                {accepting ? '...' : 'Accept'}
              </button>
            </div>
          )}
          {isAccepted && (
            <button
              onClick={onMessage}
              className="btn-outline py-1 px-3 text-xs rounded-lg"
            >
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
