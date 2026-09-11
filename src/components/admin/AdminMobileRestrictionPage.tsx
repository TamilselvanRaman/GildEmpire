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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6 sm:p-10 font-sans select-none relative overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2F6FED] text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#0B1E39] tracking-wider uppercase">Audited Admin</h2>
            <p className="text-[10px] text-emerald-700 font-mono font-bold">Sovereign Audit Engine</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('user-dashboard')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-[#0B1E39] hover:text-[#2F6FED] hover:border-slate-300 shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Member Portal</span>
        </button>
      </div>

      {/* Main Center Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8 relative z-10 text-center space-y-6">
        
        {/* Animated Icon Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 rounded-3xl bg-white border-2 border-amber-400 text-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/10 mx-auto">
            <Laptop className="w-12 h-12 text-amber-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-xl border-2 border-white shadow-md">
            <Lock className="w-4 h-4" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-extrabold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>RESTRICTED VIEWPORT ACCESS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E39] tracking-tight leading-tight">
            Please Open on Laptop or Desktop Screen
          </h1>

          <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto font-medium pt-1">
            The Audited Admin Control Panel is optimized exclusively for laptop and desktop monitors to safely render multi-column group slot matrices, daily gold draw timelines, and UTR verification tables.
          </p>
        </div>

        {/* Device Resolution Requirement Box */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-rose-500" />
              <span>Current Device:</span>
            </span>
            <span className="text-xs font-mono font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              Mobile Screen (&lt; 1024px)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-emerald-600" />
              <span>Required Device:</span>
            </span>
            <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Laptop / Desktop (&ge; 1024px)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setCurrentView('user-dashboard')}
            className="w-full bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Switch to Member Mobile Portal</span>
          </button>

          <button
            onClick={() => setCurrentView('public-landing')}
            className="w-full bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs py-3 px-6 rounded-2xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
          >
            <span>Go to Public Website</span>
          </button>
        </div>

      </div>

      {/* Footer System Audit Note */}
      <div className="relative z-10 text-center text-[10px] text-slate-400 font-mono font-semibold">
        <p>SOC-2 VAULT SECURITY COMPLIANCE ENGINE &bull; GILDEMPIRE SOVEREIGN v4.2</p>
      </div>

    </div>
  );
};
