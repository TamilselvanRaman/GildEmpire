'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ArrowLeft, Wallet, LogOut } from 'lucide-react';

export const UserHeader = () => {
  const { currentView, setCurrentView, user, logout } = useApp();

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
      case 'user-[#0B1E39]': return 'Help Center & Member FAQs';
      default: return view.replace('user-', '').replace('-', ' ');
    }
  };

  return (
    <header className="bg-[#0D3B43] text-white border-b border-[#E1A238]/40 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_25px_rgba(8,30,38,0.5)] transition-all select-none">
      
      {/* Left Section: Breadcrumb & Page Title */}
      <div className="flex items-center space-x-3.5">
        <button 
          onClick={() => setCurrentView('user-dashboard')}
          className="p-2 rounded-2xl bg-[#081E26] hover:bg-[#00C2B8] hover:text-[#081E26] text-[#F2C868] transition-all duration-300 cursor-pointer border border-[#E1A238]/40 shadow-xs hover:scale-105 active:scale-95"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-extrabold mb-0.5">
            <span 
              onClick={() => setCurrentView('user-dashboard')} 
              className="text-[#00C2B8] hover:underline cursor-pointer font-black text-[11px] uppercase tracking-wider"
            >
              InfinityGram Gold Prospectus
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#E1A238]" />
            <span className="text-[#F2C868] font-black uppercase text-[10px] tracking-widest font-mono">
              {currentView.replace('user-', '').replace('-', ' ')}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center space-x-2.5 tracking-tight">
            <span>{getViewTitle(currentView)}</span>
            <span className="inline-flex items-center space-x-1.5 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8] animate-ping"></span>
              <span>{user.accountStatus}</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Right Section: Digital Wallet, Profile & Logout */}
      <div className="flex items-center space-x-3">
        
        {/* 1. Digital Wallet Pill */}
        <div 
          onClick={() => setCurrentView('user-wallet')} 
          className="flex items-center space-x-2.5 bg-[#081E26] hover:bg-[#0D3B43] border border-[#E1A238]/40 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300 shadow-xs group"
          title="Open Digital Wallet & Balance Statement"
        >
          <div className="w-7 h-7 rounded-xl bg-[#00C2B8] text-[#081E26] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[9px] text-[#F2C868] font-extrabold uppercase tracking-widest leading-tight font-mono">Digital Wallet</p>
            <p className="text-xs font-black text-white font-mono leading-tight group-hover:text-[#00C2B8] transition-colors">
              ₹3,500.00
            </p>
          </div>
        </div>

        {/* 2. Member Profile Pill */}
        <div 
          onClick={() => setCurrentView('user-settings')} 
          className="flex items-center space-x-3 bg-[#081E26] hover:bg-[#0D3B43] p-1.5 pr-4 rounded-2xl cursor-pointer transition-all duration-300 border border-[#E1A238]/40 shadow-xs group"
          title="Manage Member Profile & Settings"
        >
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="w-8.5 h-8.5 rounded-xl object-cover border-2 border-[#E1A238] group-hover:scale-105 transition-transform shadow-xs" 
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C2B8] border-2 border-[#081E26] absolute -bottom-0.5 -right-0.5"></span>
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-serif font-black text-white group-hover:text-[#00C2B8] transition-colors leading-tight">
              {user.fullName}
            </p>
            <p className="text-[9px] font-mono text-[#F2C868] leading-tight">
              {user.memberId}
            </p>
          </div>
        </div>

        {/* 3. Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Logout Account"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>

    </header>
  );
};
