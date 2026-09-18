'use client';

import React, { useState } from 'react';
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
  BarChart3, 
  UserCheck, 
  Sliders,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSidebar = () => {
  const { currentView, setCurrentView, logout } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const handleSelectView = (viewId: ViewMode) => {
    setCurrentView(viewId);
    setIsMobileOpen(false);

    if (typeof window !== 'undefined') {
      const viewToPathMap: Record<string, string> = {
        'admin-dashboard': '/admin/dashboard',
        'admin-users': '/admin/users',
        'admin-deposits': '/admin/deposits',
        'admin-groups': '/admin/groups',
        'admin-slots': '/admin/slots',
        'admin-rewards': '/admin/rewards',
        'admin-referrals': '/admin/referrals',
        'admin-reports': '/admin/reports',
        'admin-team': '/admin/team',
        'admin-settings': '/admin/settings',
      };
      const targetPath = viewToPathMap[viewId];
      if (targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  const activeItem = adminMenu.find(item => 
    currentView === item.id || 
    (item.id === 'admin-deposits' && currentView.startsWith('admin-deposit')) || 
    (item.id === 'admin-groups' && currentView.startsWith('admin-group')) || 
    (item.id === 'admin-rewards' && currentView.startsWith('admin-reward'))
  ) || adminMenu[0];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MOBILE TOP NAVIGATION BAR (< md screens) */}
      {/* ============================================================ */}
      <div className="md:hidden bg-[#081E26] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div 
          className="flex items-center space-x-2.5 cursor-pointer"
          onClick={() => handleSelectView('admin-dashboard')}
        >
          <img src="/logo.png" alt="InfinityGram Logo" className="h-7 w-auto object-contain" />
          <div>
            <h3 className="text-xs font-black text-white tracking-wider uppercase leading-none">InfinityGram Admin</h3>
            <p className="text-[10px] text-[#00C2B8] font-mono font-bold leading-tight">{activeItem.label}</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE SLIDE-OVER DRAWER MENU (< md screens) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-4/5 max-w-xs bg-[#EFF6FF] text-slate-800 h-full flex flex-col justify-between p-5 z-10 shadow-2xl border-r border-blue-200 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    <div>
                      <h3 className="text-xs font-black text-[#081E26] tracking-wider uppercase">InfinityGram</h3>
                      <p className="text-[10px] text-[#00C2B8] font-mono font-bold">Admin Mobile Console</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg bg-blue-200/60 text-slate-700 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Drawer Nav Links */}
                <nav className="space-y-1.5">
                  {adminMenu.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id || 
                      (item.id === 'admin-deposits' && currentView.startsWith('admin-deposit')) || 
                      (item.id === 'admin-groups' && currentView.startsWith('admin-group')) || 
                      (item.id === 'admin-rewards' && currentView.startsWith('admin-reward'));

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectView(item.id as ViewMode)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#2F6FED] text-white shadow-md shadow-blue-500/20 font-extrabold' 
                            : 'text-[#0B1E39] hover:bg-blue-200/60 hover:text-[#2F6FED]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 opacity-70 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Logout */}
              <div className="pt-4 border-t border-blue-200/80">
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                    setCurrentView('auth-admin-login');
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200 bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout Admin Session</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 3. DESKTOP STICKY SIDEBAR (>= md screens) */}
      {/* ============================================================ */}
      <aside className="w-64 bg-[#EFF6FF] text-slate-800 h-screen sticky top-0 border-r border-blue-200/80 flex-col justify-between p-4 hidden md:flex overflow-y-auto shrink-0 z-40 shadow-sm select-none">
        
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
              const isActive = currentView === item.id || 
                (item.id === 'admin-deposits' && currentView.startsWith('admin-deposit')) || 
                (item.id === 'admin-groups' && currentView.startsWith('admin-group')) || 
                (item.id === 'admin-rewards' && currentView.startsWith('admin-reward'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectView(item.id as ViewMode)}
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

        {/* Admin Actions: Logout */}
        <div className="pt-4 border-t border-blue-200/80 space-y-2">
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
    </>
  );
};
