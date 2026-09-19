'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  ChevronRight, 
  ArrowLeft, 
  Wallet, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Award, 
  Share2, 
  Settings, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserHeader = () => {
  const { currentView, setCurrentView, user, deposits, logout, openDepositModal, closeDepositModal, isDepositModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userBalance = deposits
    .filter(d => d.status === 'Verified' && d.memberId === user.memberId)
    .reduce((acc, curr) => acc + curr.amount, 0);

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

  return (
    <>
      <header className="bg-[#0D3B43] text-white border-b border-[#E1A238]/40 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_25px_rgba(8,30,38,0.5)] transition-all select-none">
        
        {/* Left Section: Mobile Brand / Breadcrumb & Page Title */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 pr-2">
          <button 
            onClick={() => setCurrentView('user-dashboard')}
            className="p-2 rounded-xl bg-[#081E26] hover:bg-[#00C2B8] hover:text-[#081E26] text-[#F2C868] transition-all duration-300 cursor-pointer border border-[#E1A238]/40 shadow-xs shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-extrabold mb-0.5">
              <span 
                onClick={() => setCurrentView('public-landing')} 
                className="text-[#00C2B8] hover:underline cursor-pointer font-black text-[10px] sm:text-[11px] uppercase tracking-wider truncate"
              >
                InfinityGram
              </span>
              <ChevronRight className="w-3 h-3 text-[#E1A238] shrink-0" />
              <span className="text-[#F2C868] font-black uppercase text-[9px] sm:text-[10px] tracking-widest font-mono truncate">
                {currentView.replace('user-', '').replace('-', ' ')}
              </span>
            </div>

            <h2 className="text-sm sm:text-lg font-serif font-black text-white flex items-center space-x-2 tracking-tight truncate">
              <span className="truncate">{getViewTitle(currentView)}</span>
              {user.depositStatus === 'Verified' && (
                <span className="hidden sm:inline-flex items-center space-x-1.5 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8] animate-pulse"></span>
                  <span>{user.accountStatus || 'Active'}</span>
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Right Section: Digital Wallet, Profile & Top-Right 3-Line Hamburger Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Digital Wallet Button / Pill */}
          <button 
            onClick={() => setCurrentView('user-wallet')} 
            className="flex items-center space-x-2 bg-transparent sm:bg-[#081E26] hover:bg-[#0D3B43] border-0 sm:border sm:border-[#E1A238]/40 p-1 sm:px-4 sm:py-2 rounded-xl cursor-pointer transition-all duration-300 shadow-none sm:shadow-xs group"
            title="Open Digital Wallet & Balance Statement"
          >
            <div className="w-8 h-8 sm:w-7 sm:h-7 rounded-xl bg-[#00C2B8] text-[#081E26] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[9px] text-[#F2C868] font-extrabold uppercase tracking-widest leading-tight font-mono">Digital Wallet</p>
              <p className="text-xs font-black text-white font-mono leading-tight group-hover:text-[#00C2B8] transition-colors">
                ₹{userBalance.toLocaleString('en-IN')}.00
              </p>
            </div>
          </button>

          {/* Member Profile Avatar */}
          <div 
            onClick={() => setCurrentView('user-settings')} 
            className="hidden sm:flex items-center space-x-3 bg-[#081E26] hover:bg-[#0D3B43] p-1.5 pr-4 rounded-xl cursor-pointer transition-all border border-[#E1A238]/40 shadow-xs group"
            title="Manage Member Profile & Settings"
          >
            <div className="relative">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                alt={user.fullName || 'Member'} 
                className="w-8 h-8 rounded-lg object-cover border border-[#E1A238] shadow-xs" 
              />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C2B8] border-2 border-[#081E26] absolute -bottom-0.5 -right-0.5"></span>
            </div>

            <div className="text-left">
              <p className="text-xs font-serif font-black text-white group-hover:text-[#00C2B8] transition-colors leading-tight">
                {user.fullName || 'Member Profile'}
              </p>
              <p className="text-[9px] font-mono text-[#F2C868] leading-tight">
                {user.memberId || 'SOVEREIGN'}
              </p>
            </div>
          </div>

          {/* 3-LINE HAMBURGER MENU BUTTON (Mobile / Tablet Navigation Drawer Only) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#081E26] hover:bg-[#00C2B8] hover:text-[#081E26] text-[#F2C868] border border-[#E1A238]/40 transition-all cursor-pointer shadow-md flex items-center justify-center group"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>

        </div>
      </header>

      {/* 📱 MOBILE 3-LINE SLIDE-OVER DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#081E26] text-white w-full max-w-xs h-full border-l border-[#0D3B43] flex flex-col justify-between p-6 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                
                {/* Drawer Header & Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-[#0D3B43]">
                  <div className="flex items-center space-x-2.5">
                    <img src="/logo.png" alt="InfinityGram Logo" className="h-7 w-auto object-contain" />
                    <span className="text-lg font-black text-white">
                      Infinity<span className="text-[#00C2B8]">Gram</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#0D3B43] border border-slate-700/60 cursor-pointer"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Logged In Member Card */}
                {user.fullName && (
                  <div className="bg-[#0D3B43]/60 p-3.5 rounded-2xl border border-[#E1A238]/30 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00C2B8] text-[#081E26] font-black text-base flex items-center justify-center shrink-0 border border-[#E1A238]">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-white text-xs truncate">{user.fullName}</p>
                      <p className="text-[10px] font-mono text-[#F2C868] truncate">{user.memberId || 'SOVEREIGN MEMBER'}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div>
                  <p className="text-[10px] font-mono font-black text-[#F2C868] uppercase tracking-widest px-2 mb-2">Navigation Menu</p>
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
                        <button
                          key={item.id}
                          onClick={() => {
                            if (isDepositItem) {
                              alert('🔒 Deposit Payment Currently Disabled: Deposit module and payment processing are disabled by system administrator.');
                            } else {
                              closeDepositModal();
                              setCurrentView(item.id as ViewMode);
                            }
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                            isDepositItem
                              ? 'bg-[#081E26]/60 text-slate-400 border border-amber-500/30'
                              : isActive 
                                ? 'bg-gradient-to-r from-[#00C2B8] to-[#009890] text-[#081E26] font-black shadow-lg border border-[#00C2B8]' 
                                : 'text-slate-200 hover:bg-[#0D3B43] hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <Icon className={`w-4.5 h-4.5 shrink-0 ${isDepositItem ? 'text-amber-400/80' : isActive ? 'text-[#081E26]' : item.highlight ? 'text-[#E1A238]' : 'text-slate-400'}`} />
                            <span className={`truncate ${isDepositItem ? 'text-slate-400 line-through decoration-amber-500/60' : ''}`}>{item.label}</span>
                          </div>

                          {isDepositItem ? (
                            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50">
                              🔒 DISABLED
                            </span>
                          ) : item.badge && (
                            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#0D3B43] text-[#F2C868] border border-[#E1A238]/30">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Bottom Actions: Security & Logout */}
              <div className="pt-4 border-t border-[#0D3B43] space-y-3">
                <div className="flex items-center space-x-2 text-[11px] text-[#00C2B8] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#00C2B8] shrink-0" />
                  <span>256-Bit Encrypted Portal</span>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-extrabold text-xs transition-all border border-rose-800/40 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout Account</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
