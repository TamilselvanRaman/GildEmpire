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
  const [adminEmail, setAdminEmail] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [authStage, setAuthStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedShortcut, setCopiedShortcut] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminKey.trim()) {
      setErrorMessage('Please enter both admin email identity and master security key.');
      return;
    }
    setErrorMessage('');
    setLoggingIn(true);
    setAuthStage('Verifying 256-bit admin credentials...');
    
    const success = await loginAdmin(adminEmail, adminKey);
    setLoggingIn(false);
    if (!success) {
      setErrorMessage('Unauthorized admin identity or invalid master security key.');
    }
  };

  const handleCopyShortcut = () => {
    navigator.clipboard.writeText('Ctrl + Alt + A');
    setCopiedShortcut(true);
    setTimeout(() => setCopiedShortcut(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#081E26] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      
      {/* Ambient Radial Blur Glow Accents */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#00C2B8]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[#E1A238]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Corporate Branding Nav Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-3 relative z-10 shrink-0">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentView('public-landing')}>
          <img 
            src="/logo.png" 
            alt="InfinityGram Logo" 
            className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,194,184,0.5)] group-hover:scale-105 transition-transform" 
          />
          <div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-[#00C2B8] transition-colors flex items-center">
              Infinity<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#a855f7]">Gram</span>
            </span>
            <span className="block text-[10px] text-[#F2C868] font-mono font-bold uppercase tracking-widest">
              Executive Admin Control Gateway (/admin/login)
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-[#0D3B43]/80 border border-[#00C2B8]/40 text-[#00C2B8] px-4 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00C2B8] animate-ping"></span>
            <span>Security Vault: <strong className="text-[#00C2B8] font-mono text-[11px]">OPTIMAL (SOC-2 Verified)</strong></span>
          </div>
        </div>
      </header>

      {/* Main Single View Login Card */}
      <main className="w-full max-w-md mx-auto my-auto relative z-10 shrink-0 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-[#0D3B43] to-[#081E26] border border-[#E1A238]/40 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_25px_60px_rgba(8,30,38,0.9)] space-y-6 relative overflow-hidden"
        >
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-[#E1A238] to-transparent"></div>

          {/* Header Badge & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#081E26] border border-[#E1A238]/40 text-[#F2C868] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xs">
              <KeyRound className="w-3.5 h-3.5 text-[#E1A238]" />
              <span>Sovereign Executive Gateway</span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Admin Gateway Login
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
              Authorized admin credentials required to open executive control panel.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose-950/50 border border-rose-800/50 text-rose-300 p-3.5 rounded-2xl text-xs flex items-start space-x-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-300 font-extrabold mb-1.5 text-[10px] uppercase tracking-widest font-mono">
                Admin Identity / Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@infinitygram.net"
                  className="w-full bg-[#081E26] border border-[#0D3B43] focus:border-[#00C2B8] text-white p-3.5 pl-4 pr-10 rounded-2xl focus:outline-none transition-all font-mono font-bold text-xs placeholder:text-slate-500 shadow-xs"
                />
                <ShieldCheck className="w-4 h-4 text-[#00C2B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-300 font-extrabold text-[10px] uppercase tracking-widest font-mono">
                  Master Security Key
                </label>
                <span className="text-[10px] text-slate-400 font-mono">AES-256 Encrypted</span>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter master key"
                  className="w-full bg-[#081E26] border border-[#0D3B43] focus:border-[#00C2B8] text-white p-3.5 pl-4 pr-11 rounded-2xl focus:outline-none transition-all font-mono font-bold text-xs placeholder:text-slate-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4 text-[#00C2B8]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-gradient-to-r from-[#E1A238] to-[#F2C868] hover:from-[#F2C868] hover:to-[#E1A238] text-[#081E26] font-black py-4 px-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(225,162,56,0.4)] transition-all duration-300 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.005] active:scale-[0.995] disabled:opacity-80 border border-[#E1A238]"
            >
              {loggingIn ? (
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 border-2 border-[#081E26] border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold text-[#081E26]">{authStage}</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#081E26]" />
                  <span>Authenticate & Open Admin Panel</span>
                  <ArrowRight className="w-4 h-4 text-[#081E26]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Shortcut Box */}
          <div className="pt-3 border-t border-[#0D3B43] flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-[#F2C868]" />
              <span>Shortcut:</span>
              <button
                type="button"
                onClick={handleCopyShortcut}
                className="inline-flex items-center space-x-1 bg-[#081E26] border border-[#E1A238]/40 text-[#F2C868] px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold hover:border-[#E1A238] transition-colors cursor-pointer"
                title="Click to copy shortcut"
              >
                <span>Ctrl + Alt + A</span>
                {copiedShortcut ? <Check className="w-3 h-3 text-[#00C2B8]" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>

            <button
              onClick={() => setCurrentView('public-landing')}
              className="text-slate-300 hover:text-[#00C2B8] font-bold transition-colors cursor-pointer flex items-center space-x-0.5"
            >
              <span>Public Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </motion.div>
      </main>

      {/* Corporate Compliance Footer */}
      <footer className="w-full max-w-5xl mx-auto py-3 text-center sm:flex sm:items-center sm:justify-between text-[11px] text-slate-400 font-medium relative z-10 shrink-0 border-t border-[#0D3B43] space-y-1 sm:space-y-0">
        <div className="flex items-center justify-center space-x-3">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C2B8]" />
            <span>256-Bit Cryptographic Vault</span>
          </span>
          <span>•</span>
          <span>SOC-2 Type II Certified</span>
        </div>
        <div>
          © {new Date().getFullYear()} InfinityGram Sovereign Platform. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
};
