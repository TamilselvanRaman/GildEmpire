'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, AlertCircle, ShieldCheck, LogOut } from 'lucide-react';

export const AdminHeader = () => {
  const { setCurrentView, deposits, logout } = useApp();
  const pendingDepositsCount = deposits.filter(d => d.status === 'Pending').length;

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200/90 px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40 select-none backdrop-blur-md">
      
      {/* Breadcrumb & System Status Tag */}
      <div className="flex items-center space-x-2.5 bg-[#081E26] text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#00C2B8] animate-pulse shrink-0"></span>
        <span className="text-[#F2C868] font-bold">INFINITYGRAM SOVEREIGN</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-200 text-[11px]">BATCH A (DAY 15 ACTIVE)</span>
      </div>

      {/* Admin Actions */}
      <div className="flex items-center space-x-3">
        
        {/* Pending Review Alert Pill */}
        {pendingDepositsCount > 0 && (
          <button 
            onClick={() => setCurrentView('admin-deposits')} 
            className="flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-extrabold hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{pendingDepositsCount} Pending Deposit Review</span>
          </button>
        )}

        {/* Audit Status */}
        <div className="flex items-center space-x-2 text-xs bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 hidden lg:flex">
          <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-700 font-mono text-[11px] font-semibold">Audited Engine: OK</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <img src="/logo.png" alt="InfinityGram Logo" className="w-7 h-7 object-contain" />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black text-[#081E26] leading-tight">Super Admin</p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">admin.op@infinitygram.in</p>
          </div>
        </div>

        {/* Explicit Header Logout Button */}
        <button
          onClick={() => {
            logout();
            setCurrentView('auth-admin-login');
          }}
          className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs hover:border-rose-300"
          title="Logout Admin Session"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>

    </header>
  );
};
