'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ArrowLeft, Wallet } from 'lucide-react';

export const UserHeader = () => {
  const { currentView, setCurrentView, user } = useApp();

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'user-dashboard': return 'Executive Wealth Dashboard';
      case 'user-deposit-overview': return 'Deposit Module & Reconciliation';
      case 'user-my-group': return '50-Slot Sovereign Gold Group';
      case 'user-rewards-overview': 
      case 'user-reward-spin': return '1g Gold Rewards Selection';
      case 'user-referral-dashboard': return 'Referral Network & Earnings';
      case 'user-wallet': return 'Digital Wallet & Audit Statement';
      case 'user-settings': return 'Account Settings & Security';
      case 'user-help': return 'Help Center & Member FAQs';
      default: return view.replace('user-', '').replace('-', ' ');
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_25px_-5px_rgba(11,30,57,0.04)] transition-all">
      
      {/* Left Section: Breadcrumb & Page Title */}
      <div className="flex items-center space-x-3.5">
        <button 
          onClick={() => setCurrentView('user-dashboard')}
          className="p-2 rounded-2xl bg-slate-100/80 hover:bg-[#0B1E39] hover:text-white text-slate-600 transition-all duration-300 cursor-pointer border border-slate-200/80 shadow-2xs hover:scale-105 active:scale-95"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-extrabold mb-0.5">
            <span 
              onClick={() => setCurrentView('user-dashboard')} 
              className="text-[#2F6FED] hover:underline cursor-pointer font-black text-[11px] uppercase tracking-wider"
            >
              Audited Member Portal
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-600 font-black uppercase text-[10px] tracking-widest">
              {currentView.replace('user-', '').replace('-', ' ')}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-[#0B1E39] flex items-center space-x-2.5 tracking-tight">
            <span>{getViewTitle(currentView)}</span>
            <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{user.accountStatus}</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Right Section: EXACTLY 2 ITEMS (Wallet & Profile) */}
      <div className="flex items-center space-x-3">
        
        {/* 1. Digital Wallet Pill */}
        <div 
          onClick={() => setCurrentView('user-wallet')} 
          className="flex items-center space-x-2.5 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 hover:from-blue-100/80 hover:to-white border border-blue-200/90 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300 shadow-2xs hover:shadow-md group"
          title="Open Digital Wallet & Balance Statement"
        >
          <div className="w-7 h-7 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-tight">Digital Wallet</p>
            <p className="text-xs font-black text-[#0B1E39] font-mono leading-tight group-hover:text-[#2F6FED] transition-colors">
              ₹3,500.00
            </p>
          </div>
        </div>

        {/* 2. Member Profile Pill */}
        <div 
          onClick={() => setCurrentView('user-settings')} 
          className="flex items-center space-x-3 bg-white hover:bg-blue-50/60 p-1.5 pr-4 rounded-2xl cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md group"
          title="Manage Member Profile & Settings"
        >
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="w-8.5 h-8.5 rounded-xl object-cover border-2 border-[#2F6FED] group-hover:scale-105 transition-transform shadow-xs" 
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-black text-[#0B1E39] group-hover:text-[#2F6FED] transition-colors leading-tight">
              {user.fullName}
            </p>
            <span className="text-[9px] font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200/60 uppercase">
              {user.memberId}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};

