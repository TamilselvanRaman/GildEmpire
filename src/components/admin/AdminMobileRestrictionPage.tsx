'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Laptop, 
  Monitor, 
  ShieldAlert, 
  ArrowLeft, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminMobileRestrictionPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#0B1E39] text-white flex flex-col justify-between p-6 sm:p-10 font-sans select-none relative overflow-hidden">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2F6FED] text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wider uppercase">Audited Admin</h2>
            <p className="text-[10px] text-amber-400 font-mono font-bold">Sovereign Audit Engine</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('user-dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Member Portal</span>
        </button>
      </div>

      {/* Main Center Card */}
      <div className="max-w-md mx-auto w-full my-auto py-12 relative z-10 text-center space-y-6">
        
        {/* Animated Icon Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-[#15345E] to-[#0F284B] border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/10 mx-auto">
            <Laptop className="w-12 h-12 text-amber-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-2 rounded-xl border-2 border-[#0B1E39] shadow-md">
            <Lock className="w-4 h-4" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>RESTRICTED VIEWPORT ACCESS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Please Open on Laptop or Desktop Screen
          </h1>

          <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto font-medium pt-1">
            The Audited Admin Control Panel is optimized exclusively for laptop and desktop monitors to safely render multi-column group slot matrices, daily gold draw timelines, and UTR verification tables.
          </p>
        </div>

        {/* Device Resolution Requirement Box */}
        <div className="bg-[#102747]/90 backdrop-blur-md p-4 rounded-2xl border border-[#1A3860] space-y-3 text-left shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-rose-400" />
              <span>Current Device:</span>
            </span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
              Mobile Screen (&lt; 1024px)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Required Device:</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Laptop / Desktop (&ge; 1024px)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setCurrentView('user-dashboard')}
            className="w-full bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Switch to Member Mobile Portal</span>
          </button>

          <button
            onClick={() => setCurrentView('public-landing')}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs py-3 px-6 rounded-2xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Go to Public Website</span>
          </button>
        </div>

      </div>

      {/* Footer System Audit Note */}
      <div className="relative z-10 text-center text-[10px] text-slate-500 font-mono">
        <p>SOC-2 VAULT SECURITY COMPLIANCE ENGINE &bull; GILDEMPIRE SOVEREIGN v4.2</p>
      </div>

    </div>
  );
};
