'use client';

import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export const UserSidebar = () => {
  const { currentView, setCurrentView } = useApp();

  const menuItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-wallet', label: 'Digital Wallet', icon: Wallet, badge: '₹3.5k' },
    { id: 'user-deposit-overview', label: 'Deposit Module', icon: Wallet },
    { id: 'user-my-group', label: '50-Slot Group', icon: Users, badge: 'Day 15' },
    { id: 'user-rewards-overview', label: '1g Gold Rewards', icon: Award, highlight: true },
    { id: 'user-referral-dashboard', label: 'Referral System', icon: Share2, badge: '5%' },
    { id: 'user-settings', label: 'Settings', icon: Settings },
    { id: 'user-help', label: 'Help / FAQ', icon: HelpCircle },
  ];

  return (
    <aside className="w-68 bg-[#0B1E39] text-white min-h-screen border-r border-[#1A2E4A] flex flex-col justify-between p-5 hidden md:flex sticky top-0 shrink-0 select-none">
      
      <div className="space-y-6">
        
        {/* Sleek Corporate Brand Header */}
        <div 
          onClick={() => setCurrentView('public-landing')}
          className="flex items-center space-x-3.5 px-2 py-3 cursor-pointer group rounded-2xl hover:bg-[#102747]/60 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-amber-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                GildEmpire
              </h3>
              <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                50 Gold
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sovereign Portal</p>
          </div>
        </div>

        {/* Corporate Menu Navigation */}
        <div className="pt-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Main Navigation</p>
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id === 'user-deposit-overview' && currentView.startsWith('user-deposit')) || 
                (item.id === 'user-my-group' && currentView.startsWith('user-group')) || 
                (item.id === 'user-rewards-overview' && currentView.startsWith('user-reward'));

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewMode)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all relative group cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#2F6FED] to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/40' 
                      : 'text-slate-300 hover:bg-[#102747] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                    <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                    }`} />
                    <span className="tracking-tight truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#102747] text-amber-300 border border-amber-400/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trust Badge & Logout */}
      <div className="pt-4 border-t border-[#1A2E4A] space-y-3">
        <div className="flex items-center space-x-2 px-3 py-1 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E64] shrink-0" />
          <span className="truncate">256-Bit Encrypted Portal</span>
        </div>

        <button
          onClick={() => setCurrentView('auth-login')}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all border border-transparent hover:border-rose-900/40 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout Account</span>
        </button>
      </div>

    </aside>
  );
};


