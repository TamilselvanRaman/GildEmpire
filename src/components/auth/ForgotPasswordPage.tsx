'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { setCurrentView } = useApp();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-1">Forgot Account Password?</h2>
          <p className="text-xs text-slate-400">Enter your registered mobile or email address to receive password reset instructions.</p>
        </div>

        {sent ? (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300">We sent verification code instructions to your contact.</p>
            <button
              onClick={() => setCurrentView('auth-reset')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs"
            >
              Set New Password
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Mobile Number or Email</label>
              <input
                type="text"
                required
                placeholder="+91 98765 43210 or user@example.com"
                className="w-full bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.45)] border border-blue-400/30 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer hover:scale-[1.005] active:scale-[0.995] transition-all"
            >
              <span className="font-extrabold text-white">Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        )}

        <div className="text-center">
          <button onClick={() => setCurrentView('auth-login')} className="text-xs text-slate-400 hover:text-white">
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};
