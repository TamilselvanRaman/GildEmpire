'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Terminal,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLoginPage = () => {
  const { setCurrentView, loginAdmin } = useApp();
  const [adminEmail, setAdminEmail] = useState('admin@gildempire.in');
  const [adminKey, setAdminKey] = useState('SovereignKey#2026');
  const [showKey, setShowKey] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [authStage, setAuthStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedShortcut, setCopiedShortcut] = useState(false);

  // Preset demo accounts for enterprise testing
  const presets = [
    { label: 'Super Admin', email: 'admin@gildempire.in', key: 'SovereignKey#2026', role: 'Full Access' },
    { label: 'Operations Lead', email: 'ops.lead@gildempire.in', key: 'OpsSecret#2026', role: 'Audit & Rewards' },
  ];

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    loginAdmin(adminEmail, adminKey);
  };

  const handleCopyShortcut = () => {
    navigator.clipboard.writeText('Ctrl + Alt + A');
    setCopiedShortcut(true);
    setTimeout(() => setCopiedShortcut(false), 2000);
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Subtle Architectural Dot Grid & Ambient Light Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Corporate Branding Nav */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 relative z-10 shrink-0">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentView('public-landing')}>
          <div className="w-10 h-10 rounded-xl bg-[#0B1E39] text-amber-400 flex items-center justify-center font-black shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base text-[#0B1E39] tracking-tight font-mono">GILD<span className="text-amber-600">EMPIRE</span></span>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Executive Admin Gateway (/admin/login)</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/90 border border-slate-200/90 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Security Vault: <strong className="text-emerald-700 font-mono text-[11px]">OPTIMAL (SOC-2)</strong></span>
          </div>
        </div>
      </header>

      {/* Main Single View Login Card */}
      <main className="w-full max-w-md mx-auto my-auto relative z-10 shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200/90 hover:border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,30,57,0.08)] space-y-6 relative overflow-hidden"
        >
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

          {/* Header Badge & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-800 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Sovereign Executive Gateway</span>
            </div>

            <h1 className="text-2xl font-black text-[#0B1E39] tracking-tight">
              Admin Gateway Login
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
              Authorized admin credentials required to open executive control panel.
            </p>
          </div>

          {/* Preset Account Quick Selector */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-extrabold uppercase tracking-wider px-0.5">
              <span className="flex items-center space-x-1.5 text-amber-700">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Test Credentials</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setAdminEmail(preset.email);
                    setAdminKey(preset.key);
                    setErrorMessage('');
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                    adminEmail === preset.email
                      ? 'bg-amber-50 border-amber-400 text-[#0B1E39] shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <p className="font-extrabold text-[#0B1E39] text-[11px] truncate flex items-center justify-between">
                    <span>{preset.label}</span>
                    {adminEmail === preset.email && <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />}
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans truncate">{preset.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs flex items-start space-x-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-[#0B1E39] font-extrabold mb-1 text-[11px] uppercase tracking-wider">
                Admin Identity / Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@gildempire.in"
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 p-3.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-sans font-semibold text-xs placeholder:text-slate-400"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[#0B1E39] font-extrabold text-[11px] uppercase tracking-wider">
                  Master Security Key
                </label>
                <span className="text-[10px] text-slate-400 font-medium">AES-256 Encrypted</span>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter master key"
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 p-3.5 pl-4 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-sans font-semibold text-xs placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-200 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.005] active:scale-[0.995] disabled:opacity-80 border border-amber-500/30"
            >
              {loggingIn ? (
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold text-amber-400">{authStage}</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                  <span>Authenticate & Open Admin Panel</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Shortcut Box */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              <span>Shortcut:</span>
              <button
                type="button"
                onClick={handleCopyShortcut}
                className="inline-flex items-center space-x-1 bg-slate-100 border border-slate-200 text-amber-800 px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold hover:border-amber-400 transition-colors cursor-pointer"
                title="Click to copy shortcut"
              >
                <span>Ctrl + Alt + A</span>
                {copiedShortcut ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>

            <button
              onClick={() => setCurrentView('public-landing')}
              className="text-slate-500 hover:text-[#0B1E39] font-bold transition-colors cursor-pointer flex items-center space-x-0.5"
            >
              <span>Public Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </motion.div>
      </main>

      {/* Corporate Compliance Footer */}
      <footer className="w-full max-w-5xl mx-auto py-2 text-center sm:flex sm:items-center sm:justify-between text-[11px] text-slate-500 font-medium relative z-10 shrink-0 border-t border-slate-200/60 space-y-1 sm:space-y-0">
        <div className="flex items-center justify-center space-x-3">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Cryptographic Vault</span>
          </span>
          <span>•</span>
          <span>SOC-2 Type II Certified</span>
        </div>
        <div>
          © {new Date().getFullYear()} GildEmpire Sovereign Platform. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
};
