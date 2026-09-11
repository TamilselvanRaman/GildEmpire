'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Layers, 
  Grid, 
  Share2, 
  Award, 
  Bell, 
  BarChart3, 
  FileCheck2, 
  UserCheck, 
  Sliders,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar = () => {
  const { currentView, setCurrentView, logout } = useApp();

  const adminMenu = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-deposits', label: 'Deposit Queue', icon: Wallet },
    { id: 'admin-groups', label: '50-Member Groups', icon: Layers },
    { id: 'admin-slots', label: 'Slot Control Grid', icon: Grid },
    { id: 'admin-rewards', label: 'Reward Program', icon: Award },
    { id: 'admin-referrals', label: 'Referral Admin', icon: Share2 },
    { id: 'admin-reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'admin-team', label: 'Admin Users & Roles', icon: UserCheck },
    { id: 'admin-settings', label: 'System Rules & Config', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#EFF6FF] text-slate-800 h-screen sticky top-0 border-r border-blue-200/80 flex flex-col justify-between p-4 hidden md:flex overflow-y-auto shrink-0 z-40 shadow-sm select-none">
      
      <div className="space-y-6">
        {/* Admin Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-1 cursor-pointer group" onClick={() => setCurrentView('admin-dashboard')}>
          <img src="/logo.png" alt="InfinityGram Logo" className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" />
          <div>
            <h3 className="text-xs font-black text-[#081E26] tracking-wider uppercase">InfinityGram</h3>
            <p className="text-[10px] text-[#00C2B8] font-mono font-bold">Audit Control Console</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {adminMenu.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'admin-deposits' && currentView.startsWith('admin-deposit')) || (item.id === 'admin-groups' && currentView.startsWith('admin-group')) || (item.id === 'admin-rewards' && currentView.startsWith('admin-reward'));

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewMode)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#2F6FED] text-white shadow-md shadow-blue-500/20 font-extrabold' 
                    : 'text-[#0B1E39] hover:bg-blue-200/60 hover:text-[#2F6FED]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Actions: Switch View & Logout */}
      <div className="pt-4 border-t border-blue-200/80 space-y-2">
        <button
          onClick={() => setCurrentView('user-dashboard')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-200/60 hover:text-[#2F6FED] transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-blue-600/80" />
          <span>Switch to Member View</span>
        </button>

        <button
          onClick={() => {
            logout();
            setCurrentView('auth-admin-login');
          }}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer border border-rose-200/80 shadow-xs"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Logout Admin</span>
        </button>
      </div>

    </aside>
  );
};
