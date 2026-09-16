'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Users,
  Coins,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { setCurrentView, loginUser } = useApp();
  const [mobileEmail, setMobileEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mobileEmail.trim()) {
      setErrorMessage('Please enter your registered mobile or email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setLoggingIn(true);
    const res = await loginUser(mobileEmail, password);
    setLoggingIn(false);
    if (res && !res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full sovereign-card overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl border border-slate-200/80 relative z-10"
      >
        
        {/* Left Side: Corporate Visual & Member Benefits (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 bg-[#0B1E39] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F6FED]/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => setCurrentView('public-landing')}
            >
              <img src="/logo.png" alt="InfinityGram Logo" className="h-8 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,194,184,0.4)] group-hover:scale-105 transition-transform" />
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#00C2B8] transition-colors flex items-center">
                Infinity<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#a855f7]">Gram</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audited Member Portal</span>
              </div>

              <h2 className="text-2xl font-black text-white leading-snug tracking-tight">
                Secure Access to Your 50-Member Group & Rewards
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Log in to monitor your verified ₹10,000 deposit, view your 50-member slot position, and track daily 1 Gram Gold reward dispatches.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-3 text-xs text-slate-200 font-semibold bg-[#112745]/60 p-2.5 rounded-xl border border-slate-700/50">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Transparent 50-Slot Pool Status</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200 font-semibold bg-[#112745]/60 p-2.5 rounded-xl border border-slate-700/50">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily 1g 916 Gold Coin Dispatch</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-300 flex items-center space-x-2 font-medium relative z-10 mt-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit Cryptographic SSL Secured</span>
          </div>
        </div>

        {/* Right Side: Login Form (Full width on mobile) */}
        <div className="col-span-12 md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between space-y-6 bg-white">
          <div>
            {/* Mobile Header Brand Bar */}
            <div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setCurrentView('public-landing')}
              >
                <img src="/logo.png" alt="InfinityGram Logo" className="h-7 w-auto object-contain" />
                <span className="text-lg font-black tracking-tight text-[#0B1E39]">
                  Infinity<span className="text-[#00C2B8]">Gram</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('public-landing')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1 bg-slate-100 px-3 py-1.5 rounded-full"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-[#0B1E39] tracking-tight">Member Login</h3>
              <button
                type="button"
                onClick={() => setCurrentView('public-landing')}
                className="hidden md:flex text-xs text-slate-400 hover:text-slate-700 font-semibold items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">Enter your registered mobile or email to access dashboard</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-[#0B1E39] font-bold mb-1.5 text-xs">Mobile Number or Email</label>
              <input
                type="text"
                required
                value={mobileEmail}
                onChange={(e) => setMobileEmail(e.target.value)}
                placeholder="+91 98765 43210 or user@infinitygram.in"
                className="w-full bg-[#FAFAFC] border border-slate-200 text-[#0B1E39] p-3.5 rounded-xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-blue-500/10 font-sans transition-all text-xs font-semibold"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[#0B1E39] font-bold text-xs">Account Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentView('auth-forgot')}
                  className="text-[#2F6FED] hover:underline text-xs font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#FAFAFC] border border-slate-200 text-[#0B1E39] p-3.5 pr-11 rounded-xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-blue-500/10 font-sans transition-all text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#2F6FED] focus:ring-0" />
                <span className="text-slate-600 font-medium">Keep me logged in on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white font-black py-4 px-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.45)] border border-blue-400/30 flex items-center justify-center space-x-2.5 text-xs uppercase tracking-wider cursor-pointer hover:scale-[1.005] active:scale-[0.995] transition-all disabled:opacity-80"
            >
              {loggingIn ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold text-white">Authenticating...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span className="font-extrabold text-white tracking-wide">Login to Member Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Don't have a member account yet?{' '}
            <button
              onClick={() => setCurrentView('auth-register')}
              className="text-[#2F6FED] font-extrabold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
