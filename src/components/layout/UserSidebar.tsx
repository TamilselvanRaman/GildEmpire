'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Award, 
  Share2, 
  HelpCircle, 
  Settings, 
  LogOut,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Infinity as InfinityIcon,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserSidebar = () => {
  const { currentView, setCurrentView, user, logout, closeDepositModal } = useApp();

  const menuItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-wallet', label: 'Digital Wallet', icon: Wallet },
    { id: 'user-deposit-overview', label: 'Deposit Module', icon: Wallet },
    { id: 'user-my-group', label: '50-Slot Group', icon: Users },
    { id: 'user-rewards-overview', label: '1g Gold Rewards', icon: Award, highlight: true },
    { id: 'user-referral-dashboard', label: 'Referral System', icon: Share2, badge: '5%' },
    { id: 'user-settings', label: 'Settings', icon: Settings },
    { id: 'user-help', label: 'Help / FAQ', icon: HelpCircle },
  ];

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'N';

  return (
    <aside className="w-68 bg-[#081E26] text-white min-h-screen border-r border-[#0D3B43] flex flex-col justify-between p-5 hidden md:flex sticky top-0 shrink-0 select-none z-50">
      
      <div className="space-y-6">
        
        {/* Sleek InfinityGram Corporate Brand Header Image & Name */}
        <div 
          onClick={() => {
            closeDepositModal();
            setCurrentView('public-landing');
          }}
          className="flex items-center space-x-2.5 p-3 cursor-pointer group rounded-2xl bg-[#0D3B43]/40 hover:bg-[#0D3B43] border border-[#E1A238]/20 transition-all duration-300 select-none"
        >
          <img 
            src="/logo.png" 
            alt="InfinityGram Official Logo" 
            className="h-7 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,194,184,0.4)] group-hover:scale-105 transition-transform" 
          />
          <span className="text-lg font-black tracking-tight text-white group-hover:text-[#00C2B8] transition-colors flex items-center">
            Infinity<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#a855f7]">Gram</span>
          </span>
        </div>

        {/* Corporate Menu Navigation */}
        <div className="pt-2">
          <p className="text-[10px] font-mono font-black text-[#F2C868] uppercase tracking-widest px-3 mb-3">Main Navigation</p>
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isDepositItem = item.id === 'user-deposit-overview';
              const isActive = !isDepositItem && (
                currentView === item.id || 
                (item.id === 'user-my-group' && currentView.startsWith('user-group')) || 
                (item.id === 'user-rewards-overview' && currentView.startsWith('user-reward'))
              );

              return (
                <div key={item.id} className="relative group/tooltip">
                  <button
                    onClick={() => {
                      if (!isDepositItem) {
                        closeDepositModal();
                        setCurrentView(item.id as ViewMode);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all relative cursor-pointer ${
                      isDepositItem
                        ? 'bg-[#081E26]/60 text-slate-400 border border-amber-500/30 hover:border-amber-400/70 hover:bg-amber-500/10'
                        : isActive 
                          ? 'bg-gradient-to-r from-[#00C2B8] to-[#009890] text-[#081E26] shadow-lg shadow-[#00C2B8]/25 font-black border border-[#00C2B8]' 
                          : 'text-slate-200 hover:bg-[#0D3B43] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                      <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform ${
                        isDepositItem 
                          ? 'text-amber-400/80' 
                          : isActive 
                            ? 'text-[#081E26]' 
                            : item.highlight 
                              ? 'text-[#E1A238]' 
                              : 'text-slate-400 group-hover:text-white'
                      }`} />
                      <span className={`tracking-tight truncate ${isDepositItem ? 'text-slate-400 line-through decoration-amber-500/60' : ''}`}>
                        {item.label}
                      </span>
                    </div>

                    {isDepositItem ? (
                      <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>DISABLED</span>
                      </span>
                    ) : item.badge && (
                      <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#081E26]/30 text-[#081E26]' 
                          : 'bg-[#0D3B43] text-[#F2C868] border border-[#E1A238]/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Hover Tooltip Popup specifically for Deposit Module */}
                  {isDepositItem && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-68 p-3.5 bg-[#0B1E39] border-2 border-amber-400 text-white text-[11px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-all z-[9999] space-y-1 font-sans">
                      <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-black text-[10px] uppercase">
                        <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>Payment Currently Disabled</span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        Deposit module & payment processing are disabled by administrator system configuration.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trust Badge & Logout */}
      <div className="pt-4 border-t border-[#0D3B43] space-y-3.5">
        <div className="flex items-center space-x-2.5 px-2 py-0.5 text-xs text-[#00C2B8] font-semibold tracking-tight">
          <ShieldCheck className="w-4 h-4 text-[#00C2B8] shrink-0" />
          <span className="truncate">256-Bit Encrypted Portal</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-2 py-2 rounded-2xl hover:bg-[#0D3B43]/60 transition-all duration-200 cursor-pointer group text-left border border-transparent hover:border-[#0D3B43]/80"
        >
          <div className="w-9 h-9 rounded-full bg-[#030F13] border border-slate-700/80 flex items-center justify-center font-black text-sm text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
            {userInitial}
          </div>
          <span className="text-[#FF5252] font-black text-sm tracking-wide group-hover:text-red-400 transition-colors">
            Logout Account
          </span>
        </button>
      </div>

    </aside>
  );
};



