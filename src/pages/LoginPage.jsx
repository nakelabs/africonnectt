import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'investor' ? '/investor/discover' : '/founder/feed');
    } catch (e) {
      setErrorMsg(e.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-[#FCFCFC]">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1A1A1A] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10">
          <Link to="/" className="text-white text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">AfriConnect</Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-white font-bold text-[3rem] leading-[1.1] mb-6">
            Where Africa's<br />
            boldest founders<br />
            meet capital.
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-md">
            A curated platform connecting Africa's boldest founders with the right investors.
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
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Welcome back</h2>
            <p className="text-[#6B7280] text-sm">Log in to your account to continue.</p>
          </div>

          {/* Fields */}
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMsg && <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</p>}

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full py-4 rounded-2xl text-sm font-bold bg-[#1A1A1A] text-white transition-all duration-200 active:scale-95 hover:bg-[#333] disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entering…
              </span>
            ) : (
              'Enter'
            )}
          </button>

          <p className="text-center text-[13px] text-[#6B7280] mt-8">
            Don't have an account? <Link to="/signup" className="text-[#1A1A1A] font-bold underline underline-offset-2 hover:text-black transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
