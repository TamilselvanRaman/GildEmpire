'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { setCurrentView } = useApp();
  const [mobileEmail, setMobileEmail] = useState('rajesh.sharma@gildempire.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('user-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full sovereign-card overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 bg-white">
        
        {/* Left Side: Brand & Product Visual */}
        <div className="md:col-span-5 bg-[#0B1E39] text-white p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1A2E4A]">
          <div>
            <div className="flex items-center space-x-2.5 mb-8 cursor-pointer" onClick={() => setCurrentView('public-landing')}>
              <div className="w-10 h-10 rounded-xl bg-[#2F6FED] flex items-center justify-center text-white font-bold">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white font-mono">GildEmpire</span>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-[#1E9E64] bg-[#1E9E64]/20 px-3 py-1 rounded-full border border-[#1E9E64]/40 uppercase tracking-widest">
                Audited Member Portal
              </span>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Secure Access to Your 50-Group & Rewards
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Log in to monitor your verified ₹5,000 deposit, view your 50-member slot position, and track daily 1 Gram Gold reward dispatches.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1A2E4A] text-xs text-slate-300 flex items-center space-x-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1E9E64]" />
            <span>256-Bit Cryptographic SSL Secured</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div>
            <h3 className="text-xl font-extrabold text-[#0B1E39] mb-1">Member Login</h3>
            <p className="text-xs text-slate-500 font-medium">Enter your registered mobile or email to proceed</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-[#0B1E39] font-bold mb-1">Mobile Number or Email</label>
              <input
                type="text"
                required
                value={mobileEmail}
                onChange={(e) => setMobileEmail(e.target.value)}
                placeholder="+91 98765 43210 or user@gildempire.in"
                className="w-full bg-[#FAFAFC] border border-slate-200 text-[#0B1E39] p-3.5 rounded-xl focus:outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#0B1E39] font-bold">Account Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentView('auth-forgot')}
                  className="text-[#2F6FED] hover:underline text-[11px] font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#FAFAFC] border border-slate-200 text-[#0B1E39] p-3.5 rounded-xl focus:outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#2F6FED] focus:ring-0" />
                <span>Keep me logged in on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn-sovereign-blue py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-xs"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
            Don't have a member account yet?{' '}
            <button
              onClick={() => setCurrentView('auth-register')}
              className="text-[#2F6FED] font-bold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
