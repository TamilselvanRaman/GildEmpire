'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, Mail, ArrowRight, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resent'>('loading');
  const [message, setMessage] = useState<string>('Verifying your email address...');
  const [userInfo, setUserInfo] = useState<{ email?: string; fullName?: string } | null>(null);

  // State for resending verification link
  const [resendEmail, setResendEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resentData, setResentData] = useState<{ message: string; url?: string } | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check the link from your email or request a new one below.');
      return;
    }

    const validToken = token;

    async function verify() {
      try {
        const res = await fetch(`/api/verify-email?token=${encodeURIComponent(validToken)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email successfully verified!');
          if (data.user) {
            setUserInfo(data.user);
            setResendEmail(data.user.email || '');
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email address. The link may have expired or is invalid.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('Network error verifying email. Please check your internet connection.');
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
          message: data.message || `A new verification link has been sent to ${resendEmail}.`,
          url: data.verificationUrl,
        });
        // Switch main screen status to 'resent' to eliminate duplicate red/green error boxes
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 font-bold text-2xl shadow-lg shadow-amber-500/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            InfinityGram Gold Scheme
          </h1>
          <p className="text-slate-400 text-sm mt-1">Account Security & Email Verification</p>
        </div>

        {/* 1. Verification Loading State */}
        {status === 'loading' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-200 mb-2">Verifying Link</h2>
            <p className="text-slate-400 text-sm">{message}</p>
          </div>
        )}

        {/* 2. Verification Success State */}
        {status === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Email Verified!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {userInfo?.fullName ? `Welcome aboard, ${userInfo.fullName}!` : 'Your email address has been successfully confirmed.'} You can now log in and access all premium gold scheme features.
            </p>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
            >
              Proceed to Login <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* 3. New Link Resent Success State (Replaces old red error box completely) */}
        {status === 'resent' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Mail className="w-9 h-9 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-amber-400 mb-2">New Verification Link Sent!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {resentData?.message || `A new verification email has been dispatched to ${resendEmail}.`} Please check your inbox.
            </p>

            {/* Direct Verification Link (For Testing / Sandbox) */}
            {resentData?.url && (
              <div className="mb-6 p-4 bg-slate-950 border border-amber-500/30 rounded-xl text-left">
                <span className="text-xs font-semibold text-amber-400 block mb-1">🔗 Direct Link (Ready to Verify):</span>
                <a
                  href={resentData.url}
                  className="text-xs text-yellow-300 underline break-all hover:text-yellow-200 flex items-center gap-1 mt-1"
                >
                  {resentData.url} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            )}

            <div className="space-y-3">
              {resentData?.url && (
                <a
                  href={resentData.url}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  Open Verification Link <ArrowRight className="w-5 h-5" />
                </a>
              )}
              
              <button
                onClick={() => setStatus('error')}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors"
              >
                Request Another Link
              </button>
            </div>
          </div>
        )}

        {/* 4. Initial Verification Error / Expired Token State */}
        {status === 'error' && (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">Verification Link Expired</h2>
              <p className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl p-3 mb-6">
                {message}
              </p>
            </div>

            {/* Resend Link Form */}
            <form onSubmit={handleResend} className="space-y-4 border-t border-slate-800 pt-6">
              <label className="block text-xs font-medium text-slate-400">
                Enter your registered email address to receive a fresh link:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              {resendError && (
                <div className="text-xs p-3 rounded-lg border bg-red-950/40 border-red-900/50 text-red-400">
                  {resendError}
                </div>
              )}

              <button
                type="submit"
                disabled={isResending}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold py-3 px-4 rounded-xl border border-amber-500/30 transition-all duration-200 hover:border-amber-500/60 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> Send New Verification Link
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link href="/login" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
