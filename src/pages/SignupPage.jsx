import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const { signupFounder, signupInvestor } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('founder');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Identity
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Founder Specific
  const [startupName, setStartupName] = useState('');
  const [pitch, setPitch] = useState('');
  const [sector, setSector] = useState('');
  const [stage, setStage] = useState('');
  const [ask, setAsk] = useState('');

  // Step 2: Investor Specific
  const [firmName, setFirmName] = useState('');
  const [thesis, setThesis] = useState('');
  const [ticketSize, setTicketSize] = useState('');
  const [geoFocus, setGeoFocus] = useState('');

  const handleComplete = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        email,
        password,
        full_name: name,
        role,
        ...(role === 'founder' ? {
          startup_name: startupName || null,
          startup_pitch: pitch || null,
          startup_sector: sector || null,
          stage: stage || null,
          the_ask: parseFloat(ask.replace(/[^0-9.]/g, '')) || null,
        } : {
          firm_name: firmName || null,
          investment_thesis: thesis || null,
          max_investment_amount: ticketSize.includes('2M+') ? 2000000 :
                                 ticketSize.includes('500k') ? 500000 :
                                 ticketSize.includes('150k') ? 150000 :
                                 ticketSize.includes('50k') ? 50000 : null,
        })
      };

      const signupFn = role === 'founder' ? signupFounder : signupInvestor;
      const user = await signupFn(payload);
      navigate(user.role === 'investor' ? '/investor/discover' : '/founder/feed');
    } catch (e) {
      setErrorMsg(e.message || 'Failed to sign up');
      setIsLoading(false);
    }
  };

  const SECTORS = ['Fintech', 'Healthtech', 'Agritech', 'Edtech', 'Cleantech', 'E-commerce', 'Other'];
  
  const STAGES = ['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth'];
  const STAGE_LABELS = {
    idea: 'Idea', pre_seed: 'Pre-Seed', seed: 'Seed',
    series_a: 'Series A', series_b: 'Series B', series_c: 'Series C', growth: 'Growth',
  };

  const TICKETS = ['$50k – $150k', '$150k – $500k', '$500k – $2M', '$2M+'];
  const GEOGRAPHIES = ['West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Pan-African'];

  return (
    <div className="min-h-dvh flex bg-[#FCFCFC]">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1A1A1A] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10">
          <Link to="/" className="text-white text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">AfriConnect</Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-white font-bold text-[3rem] leading-[1.1] mb-6">
            Join the continent's<br />
            premier deal-flow<br />
            network.
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-md">
            Verified profiles, precision matching, and seamless partnerships.
          </p>
        </div>
        <div className="relative z-10 text-xs text-[#6B7280]">
          &copy; {new Date().getFullYear()} AfriConnect. All rights reserved.
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 relative overflow-y-auto h-dvh">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Wordmark */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="text-[#1A1A1A] text-2xl font-black tracking-tighter">AfriConnect</Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Create Account</h2>
            <p className="text-[#6B7280] text-sm">Join as a verified founder or investor.</p>
          </div>
        
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-[#1A1A1A]" />
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#1A1A1A]' : 'bg-[#E5E7EB]'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-6 slide-in">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Step 1: Your Identity</h2>
            
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">
                I am joining as a...
              </label>
              <div className="flex gap-3">
                {(['founder', 'investor']).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`
                      flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all duration-200 active:scale-95
                      ${role === r
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D1D5DB]'
                      }
                    `}
                  >
                    <p className="text-sm font-bold capitalize">{r}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={name} onChange={e => setName(e.target.value)}
                  className="input-field" 
                  placeholder="First and Last Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Professional Email</label>
                <input 
                  type="email" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field" 
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Secure Password</label>
                <input 
                  type="password" 
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name || !email || !password}
              className="w-full py-4 mt-6 rounded-2xl text-sm font-bold bg-[#1A1A1A] text-white active:scale-95 transition-transform disabled:opacity-50"
            >
              Continue
            </button>
            <p className="text-center text-xs text-[#9CA3AF] mt-4">
              Already have an account? <Link to="/login" className="text-[#1A1A1A] font-semibold underline underline-offset-2">Log in</Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 slide-in">
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Step 2: Business Core
            </h2>
            <p className="text-xs text-[#9CA3AF] -mt-4">
              {role === 'founder' ? 'Tell us about the startup you are building.' : 'Define your investment mandates.'}
            </p>

            {role === 'founder' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Startup Name</label>
                  <input 
                    type="text" 
                    value={startupName} onChange={e => setStartupName(e.target.value)}
                    className="input-field" placeholder="e.g. PayEase Africa"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Elevator Pitch</label>
                    <span className="text-[10px] text-[#9CA3AF]">{pitch.length}/150</span>
                  </div>
                  <textarea 
                    value={pitch} onChange={e => setPitch(e.target.value)}
                    maxLength={150} rows={2}
                    className="input-field resize-none text-sm" placeholder="One sentence mission..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Sector</label>
                    <select value={sector} onChange={e => setSector(e.target.value)} className="input-field bg-white">
                      <option value="" disabled>Select...</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Stage</label>
                    <select value={stage} onChange={e => setStage(e.target.value)} className="input-field bg-white">
                      <option value="" disabled>Select...</option>
                      {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">The Ask</label>
                  <input 
                    type="text" 
                    value={ask} onChange={e => setAsk(e.target.value)}
                    className="input-field" placeholder="e.g. $500K Seed Round"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Firm / Individual Name</label>
                  <input 
                    type="text" 
                    value={firmName} onChange={e => setFirmName(e.target.value)}
                    className="input-field" placeholder="e.g. Savanna Ventures"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Investment Thesis</label>
                  <textarea 
                    value={thesis} onChange={e => setThesis(e.target.value)}
                    rows={3}
                    className="input-field resize-none text-sm" placeholder="What industries or problems do you care about?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Ticket Size</label>
                    <select value={ticketSize} onChange={e => setTicketSize(e.target.value)} className="input-field bg-white">
                      <option value="" disabled>Select...</option>
                      {TICKETS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Geo Focus</label>
                    <select value={geoFocus} onChange={e => setGeoFocus(e.target.value)} className="input-field bg-white">
                      <option value="" disabled>Select...</option>
                      {GEOGRAPHIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-4 px-6 rounded-2xl text-sm font-bold border border-[#E5E7EB] bg-white text-[#1A1A1A] active:scale-95 transition-transform"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 py-4 rounded-2xl text-sm font-bold bg-[#1A1A1A] text-white active:scale-95 transition-transform disabled:opacity-50"
              >
                {isLoading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
            {errorMsg && <p className="text-center text-sm text-red-500 mt-3">{errorMsg}</p>}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
