'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const OtpPage = () => {
  const { setCurrentView } = useApp();
  const [otp, setOtp] = useState(['8', '9', '2', '4', '1', '0']);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('user-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-1">Mobile OTP Verification</h2>
          <p className="text-xs text-slate-400">
            Enter the 6-digit verification code sent to <strong className="text-white">+91 98765 43210</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          
          {/* 6-Digit Inputs */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  setOtp(prev => {
                    const next = [...prev];
                    next[idx] = val;
                    return next;
                  });
                }}
                className="w-11 h-12 bg-slate-900 border border-slate-700 text-center text-lg font-bold text-amber-300 rounded-xl focus:outline-none focus:border-amber-400"
              />
            ))}
          </div>

          <div className="text-xs text-slate-400">
            {timer > 0 ? (
              <span>Resend OTP code in <strong className="text-amber-400 font-mono">{timer}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={() => setTimer(30)}
                className="text-amber-400 font-bold hover:underline"
              >
                Resend Verification Code
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <span>Verify & Activate Profile</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={() => setCurrentView('auth-register')}
          className="text-xs text-slate-400 hover:text-white"
        >
          Change Mobile Number
        </button>

      </div>
    </div>
  );
};
