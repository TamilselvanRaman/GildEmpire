'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { LayoutDashboard, Users, Award, Wallet, CreditCard, Settings } from 'lucide-react';

export const MobileBottomNav = () => {
  const { currentView, setCurrentView } = useApp();

  const navItems = [
    { id: 'user-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'user-my-group', label: '50-Group', icon: Users },
    { id: 'user-rewards-overview', label: '1g Gold', icon: Award },
    { id: 'user-wallet', label: 'Wallet', icon: Wallet },
    { id: 'user-deposit-overview', label: 'Deposit', icon: CreditCard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B1E39]/95 backdrop-blur-xl text-white border-t border-[#1A3860] px-2 py-2 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(11,30,57,0.4)]">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id || 
          (item.id === 'user-deposit-overview' && currentView.startsWith('user-deposit')) || 
          (item.id === 'user-my-group' && currentView.startsWith('user-group')) || 
          (item.id === 'user-rewards-overview' && currentView.startsWith('user-reward')) ||
          (item.id === 'user-wallet' && currentView.startsWith('user-wallet'));

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as ViewMode)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
              isActive 
                ? 'text-white bg-[#2F6FED] shadow-lg shadow-blue-500/30 border border-blue-400/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400'}`} />
            <span className={`text-[10px] mt-0.5 font-bold tracking-tight ${isActive ? 'text-white font-black' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
