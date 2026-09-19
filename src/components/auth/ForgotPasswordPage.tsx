'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowLeft,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPasswordPage = () => {
  const { setCurrentView } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetData, setResetData] = useState<{ message: string; targetEmail?: string; resetUrl?: string } | null>(null);

  const isEmail = inputValue.includes('@');
  const isPhone = /^[0-9+\s-]{8,}$/.test(inputValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter your registered mobile number or email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputValue.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetData({
          message: data.message || `Password reset instructions sent to ${inputValue}.`,
          targetEmail: data.targetEmail || inputValue,
          resetUrl: data.resetUrl,
        });
        setSent(true);
      } else {
        setError(data.error || 'Failed to dispatch password reset email. Please check details.');
      }
    } catch (err) {
      setError('Network error sending password reset request. Please check internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061222] via-[#0A192F] to-[#040D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Radial Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00C2B8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Corporate Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#0B1E39]/85 backdrop-blur-2xl border border-amber-400/40 rounded-[2.5rem] p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative z-10 overflow-hidden"
      >
        {/* Top 24K Gold Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600"></div>

        {/* Corporate Header & Hallmark Security Badge */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/60">
              <KeyRound className="w-9 h-9 text-slate-950 stroke-[2.2]" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-[#0B1E39] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-[#0B1E39] rounded-full"></span>
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>InfinityGram Security Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Recover Password
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed max-w-xs mx-auto">
              Enter your registered mobile or email to receive password reset authorization link.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive States */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div 
              key="sent-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 border-2 border-emerald-400/60 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 text-emerald-300 relative">
                <CheckCircle2 className="w-11 h-11" />
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  RESET LINK DISPATCHED
                </span>
                <h2 className="text-2xl font-black text-white mt-2.5">Check Your Email Inbox!</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                  {resetData?.message || `We have dispatched official password reset instructions to ${inputValue}.`} Please open the link in your email to set a new password.
                </p>
              </div>

              {/* Direct Verification Link (For Sandbox Mode) */}
              {resetData?.resetUrl && (
                <div className="p-4 bg-[#071322] border border-amber-400/40 rounded-2xl text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Direct Reset Access (Test Mode)
                    </span>
                  </div>
                  <a
                    href={resetData.resetUrl}
                    className="text-xs text-amber-400 underline break-all hover:text-amber-300 flex items-center gap-1.5 transition-colors pt-1"
                  >
                    <span>{resetData.resetUrl}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}

              {/* Clean Single View Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setCurrentView('auth-login')}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
                </button>

                <button
                  onClick={() => { setSent(false); setResetData(null); }}
                  className="w-full text-xs text-slate-400 hover:text-amber-300 font-semibold py-2 transition-colors"
                >
                  Didn't receive instructions? Try another email
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-extrabold uppercase tracking-wider text-slate-200">
                    Mobile Number or Email
                  </label>
                  {inputValue && (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {isEmail ? '✉️ Email Format' : isPhone ? '📱 Mobile Format' : 'Input Recognized'}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
                    {isPhone ? <Phone className="w-4.5 h-4.5" /> : <Mail className="w-4.5 h-4.5" />}
                  </div>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="+91 98765 43210 or name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-[#071322] border border-amber-400/30 rounded-2xl text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-medium pt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-950" />
                    <span>Dispatching Security Token...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('auth-login')}
                  className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-300 font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Security & SSL Footer */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Need help?</span>
            <a href="mailto:infinitygram916@gmail.com" className="text-amber-400 hover:underline font-semibold">
              Support Desk
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

