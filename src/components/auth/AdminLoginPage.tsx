'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, ArrowRight, Award, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage = () => {
  const { setCurrentView } = useApp();
  const [adminEmail, setAdminEmail] = useState('admin@gildempire.in');
  const [adminKey, setAdminKey] = useState('••••••••••••');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setTimeout(() => {
      setCurrentView('admin-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#071325] text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0B1E39] border border-[#1A3860] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sovereign Executive Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Gateway Login
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Authorized admin credentials required to open the control panel.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
              Admin Identity / Email
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#102747] border border-[#1A3860] text-white font-mono font-bold p-4 rounded-2xl focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
              Admin Master Security Key
            </label>
            <input
              type="password"
              required
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full bg-[#102747] border border-[#1A3860] text-white font-mono font-bold p-4 rounded-2xl focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            {loggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating Admin Key...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Login & Open Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & shortcut badge */}
        <div className="pt-4 border-t border-[#1A3860] text-center space-y-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Press <kbd className="bg-[#102747] text-amber-300 border border-[#1A3860] px-1.5 py-0.5 rounded font-mono">Ctrl + Alt + A</kbd> anywhere to access
          </p>
          <button
            onClick={() => setCurrentView('public-landing')}
            className="text-xs text-slate-400 hover:text-white font-extrabold transition-colors cursor-pointer"
          >
            ← Return to Public Home Page
          </button>
        </div>

      </div>

    </div>
  );
};
