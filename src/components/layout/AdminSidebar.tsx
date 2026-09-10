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
  const { currentView, setCurrentView } = useApp();

  const adminMenu = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-deposits', label: 'Deposit Queue', icon: Wallet },
    { id: 'admin-groups', label: '50-Member Groups', icon: Layers },
    { id: 'admin-slots', label: 'Slot Control Grid', icon: Grid },
    { id: 'admin-rewards', label: '50-Day Gold Admin', icon: Award },
    { id: 'admin-referrals', label: 'Referral Admin', icon: Share2 },
    { id: 'admin-notifications', label: 'Notifications Broadcast', icon: Bell },
    { id: 'admin-reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'admin-audit-logs', label: 'Enterprise Audit Logs', icon: FileCheck2 },
    { id: 'admin-team', label: 'Admin Users & Roles', icon: UserCheck },
    { id: 'admin-settings', label: 'System Rules & Config', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#0B1E39] text-slate-300 min-h-screen border-r border-[#1A2E4A] flex flex-col justify-between p-4 hidden md:flex sticky top-0">
      
      <div className="space-y-6">
        {/* Admin Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#2F6FED] flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Audited Admin</h3>
            <p className="text-[10px] text-[#1E9E64] font-mono font-bold">Sovereign Audit Engine</p>
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
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-[#2F6FED] text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-[#142d52] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Switch Back */}
      <div className="pt-4 border-t border-[#1A2E4A]">
        <button
          onClick={() => setCurrentView('user-dashboard')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-[#142d52] hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch to Member View</span>
        </button>
      </div>

    </aside>
  );
};
