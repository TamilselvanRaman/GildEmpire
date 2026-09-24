'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  Lock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resent'>('loading');
  const [message, setMessage] = useState<string>('Verifying your security credentials...');
  const [userInfo, setUserInfo] = useState<{ email?: string; fullName?: string; memberId?: string } | null>(null);

  // State for resending verification link
  const [resendEmail, setResendEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resentData, setResentData] = useState<{ message: string; url?: string } | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check the link from your email or request a fresh link below.');
      return;
    }

    const validToken = token;

    async function verify() {
      try {
        const res = await fetch(`/api/verify-email?token=${encodeURIComponent(validToken)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email address successfully verified!');
          if (data.user) {
            setUserInfo(data.user);
            setResendEmail(data.user.email || '');

            if (typeof window !== 'undefined') {
              const stored = localStorage.getItem('infinity_gold_user_session');
              if (stored) {
                try {
                  const parsed = JSON.parse(stored);
                  if (parsed && parsed.email?.toLowerCase() === data.user.email?.toLowerCase()) {
                    parsed.emailVerified = true;
                    parsed.accountStatus = 'Active';
                    localStorage.setItem('infinity_gold_user_session', JSON.stringify(parsed));
                  }
                } catch (e) {}
              }
            }
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email address. The link may have expired or is invalid.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('Network connection issue verifying email. Please check your internet connection and try again.');
      }
    }

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || !resendEmail.includes('@')) {
      setResendError('Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setResendError(null);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResentData({
          message: data.message || `A new verification link has been dispatched to ${resendEmail}.`,
          url: data.verificationUrl,
        });
        setStatus('resent');
      } else {
        setResendError(data.error || 'Failed to resend verification email. Please try again.');
      }
    } catch (err) {
      setResendError('Server error while sending verification link.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061222] via-[#0A192F] to-[#040D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Radial Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00C2B8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Corporate Security Container */}
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#0B1E39]/85 backdrop-blur-2xl border border-amber-400/40 rounded-[2.5rem] p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative z-10 overflow-hidden"
      >
        {/* Top Decorative Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600"></div>

        {/* Corporate Header & Hallmark Badge */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/60">
              <ShieldCheck className="w-9 h-9 text-slate-950 stroke-[2.2]" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0B1E39] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0B1E39] rounded-full"></span>
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>InfinityGram Sovereign Security</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gold Scheme Verification
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Official Account Security & Member Authentication
            </p>
          </div>
        </div>

        {/* Dynamic State Panels */}
        <AnimatePresence mode="wait">
          
          {/* 1. Loading State */}
          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-10 space-y-4"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
                <Lock className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Authenticating Verification Token</h2>
                <p className="text-xs text-slate-300 mt-1">{message}</p>
              </div>

              <div className="pt-2 flex justify-center items-center space-x-2 text-[11px] text-amber-400/80 font-mono font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>SOC-2 256-Bit SSL Handshake in progress...</span>
              </div>
            </motion.div>
          )}

          {/* 2. Success State */}
          {status === 'success' && (
            <motion.div 
              key="success"
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
                  VERIFICATION SUCCESSFUL
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Email Confirmed & Active!</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm mx-auto">
                  {userInfo?.fullName ? `Welcome to InfinityGram Gold Scheme, ${userInfo.fullName}!` : 'Your email address has been verified successfully.'} You are now authorized to participate in 50-member groups.
                </p>
              </div>

              {/* Verified Account Details Box */}
              {userInfo?.email && (
                <div className="bg-[#071322]/90 border border-amber-400/30 rounded-2xl p-4 text-left space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Verified Email:</span>
                    <strong className="text-amber-300 font-bold">{userInfo.email}</strong>
                  </div>
                  {userInfo.memberId && (
                    <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                      <span>Member ID:</span>
                      <strong className="text-emerald-400 font-bold">{userInfo.memberId}</strong>
                    </div>
                  )}
                </div>
              )}

              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <span>Proceed to Portal Sign In</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </motion.div>
          )}

          {/* 3. Resent Link Confirmation State */}
          {status === 'resent' && (
            <motion.div 
              key="resent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-18 h-18 bg-amber-500/20 border-2 border-amber-400/60 rounded-full flex items-center justify-center mx-auto shadow-xl text-amber-300">
                <Mail className="w-9 h-9 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  NEW LINK DISPATCHED
                </span>
                <h2 className="text-xl font-black text-white mt-2">Check Your Inbox</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm mx-auto">
                  {resentData?.message || `A fresh verification link has been dispatched to ${resendEmail}.`} Please check your primary inbox or spam folder.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setStatus('error')}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#081E26] hover:bg-[#0D3B43] text-slate-300 border border-slate-700 text-xs font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Another Link</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. Expired Token / Verification Error State */}
          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-2 space-y-6"
            >
              {/* Sovereign Red Alert Badge */}
              <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
                <div className="w-12 h-12 bg-red-500/20 border border-red-400/50 rounded-full flex items-center justify-center mx-auto text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-red-200">Verification Link Expired or Invalid</h3>
                  <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Resend Link Form */}
              <form onSubmit={handleResend} className="space-y-4 border-t border-slate-800/80 pt-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Request Fresh Verification Link
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Enter your registered email address to receive an immediate token:
                  </p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-400/70" />
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter registered email address..."
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#071322] border border-amber-400/30 rounded-xl text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                  />
                </div>

                {resendError && (
                  <div className="text-xs p-3 rounded-xl border bg-red-950/60 border-red-500/40 text-red-300 font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{resendError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-4 px-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Dispatching New Verification Link...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-slate-950" />
                      <span>Send New Verification Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <Link 
                  href="/login" 
                  className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-300 font-bold transition-colors"
                >
                  <span>Return to Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Corporate Trust & Encryption Footer */}
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
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#061222] text-slate-100 flex justify-center items-center">
          <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
