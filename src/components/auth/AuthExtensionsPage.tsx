'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mail, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Key, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export type AuthMode = 'verify-email' | 'change-password' | 'account-locked';

interface Props {
  mode?: AuthMode;
}

export const AuthExtensionsPage: React.FC<Props> = ({ mode = 'verify-email' }) => {
  const { setCurrentView, user } = useApp();
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);

  // Email verification state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Change password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-ext-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      setOtpSent(true);
      setTimeout(() => {
        setCurrentView('user-dashboard');
      }, 1500);
    }
  };

  // Change Password Handler
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPass.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
      setCurrentView('user-settings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div 
          onClick={() => setCurrentView('public-landing')}
          className="inline-flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#2F6FED] text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-[#0B1E39] font-mono tracking-tight">GildEmpire</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-slate-200/80 sm:px-10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

          {/* MODE 1: VERIFY EMAIL */}
          {activeMode === 'verify-email' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                  <Mail className="w-7 h-7 text-amber-600" />
                </div>
                <h2 className="text-xl font-black text-[#0B1E39]">Verify Your Email Address</h2>
                <p className="text-xs text-slate-500 font-medium">
                  We sent a 6-digit authentication code to <span className="font-bold text-slate-900">{user?.email || 'member@gildempire.in'}</span>.
                </p>
              </div>

              {otpSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-black text-emerald-800">Email Address Verified Successfully!</p>
                  <p className="text-[11px] text-emerald-600">Redirecting to member dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-between items-center space-x-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-ext-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-black text-[#0B1E39] bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Verify Email & Activate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => setResendTimer(30)}
                  className="text-xs font-bold text-[#2F6FED] hover:underline cursor-pointer"
                >
                  Didn&apos;t receive code? Resend Email Code
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: CHANGE PASSWORD */}
          {activeMode === 'change-password' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-inner">
                  <Key className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-[#0B1E39]">Change Security Password</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Update your GildEmpire portal account login password.
                </p>
              </div>

              {changeSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-black text-emerald-800">Password Updated Successfully!</p>
                  <p className="text-[11px] text-emerald-600">Returning to security settings...</p>
                </div>
              ) : (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      New Security Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Update Account Password
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: ACCOUNT LOCKED */}
          {activeMode === 'account-locked' && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[#0B1E39]">Account Temporarily Locked</h2>
                <p className="text-xs text-slate-500 font-medium">
                  For your asset security, your account was locked after 5 consecutive failed password attempts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-rose-900">
                  <span>Lockout Cooldown:</span>
                  <span className="font-mono font-black text-rose-600">14:59 min</span>
                </div>
                <p className="text-[11px] text-rose-700 font-medium">
                  You may attempt to log in again after the timer expires, or verify your identity via email reset link.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('auth-forgot')}
                  className="w-full bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Unlock via Password Reset Email
                </button>

                <button
                  onClick={() => setCurrentView('public-contact')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Contact Support Audit Desk
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
