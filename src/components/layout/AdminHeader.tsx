'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Search, Bell, Activity, AlertCircle } from 'lucide-react';

export const AdminHeader = () => {
  const { currentView, setCurrentView, deposits } = useApp();
  const pendingDepositsCount = deposits.filter(d => d.status === 'Pending').length;

  return (
    <header className="bg-[#0B1E39] text-white border-b border-[#1A2E4A] px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-30">
      
      {/* Search & Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Member ID, UTR, Name..."
            className="w-full bg-[#102747] border border-[#1A3860] text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div className="text-xs text-slate-400">
          <span className="text-[#2F6FED] font-mono font-bold">GILDEMPIRE SOVEREIGN:</span>
          <span className="ml-2 font-semibold text-white">Batch A Day 15 Active</span>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex items-center space-x-4">
        
        {/* Pending Review Alert Pill */}
        {pendingDepositsCount > 0 && (
          <button 
            onClick={() => setCurrentView('admin-deposits')} 
            className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{pendingDepositsCount} Pending Deposit Review</span>
          </button>
        )}

        {/* Audit Status */}
        <div className="flex items-center space-x-2 text-xs bg-[#102747] px-3 py-1.5 rounded-xl border border-[#1A3860]">
          <Activity className="w-4 h-4 text-[#1E9E64]" />
          <span className="text-slate-200 font-mono text-[11px]">Audited Engine: OK</span>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center space-x-2 bg-[#102747] border border-[#1A3860] px-3 py-1.5 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-[#2F6FED] flex items-center justify-center text-white font-bold text-xs">
            G
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">Super Admin</p>
            <p className="text-[10px] text-slate-400 leading-tight">admin.op@gildempire.in</p>
          </div>
        </div>

      </div>

    </header>
  );
};
