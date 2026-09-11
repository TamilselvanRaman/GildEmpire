'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, AlertCircle, CheckCircle2, Info, ArrowLeft, ShieldCheck } from 'lucide-react';

export const SystemNoticePage: React.FC = () => {
  const { setCurrentView } = useApp();

  const notices = [
    {
      id: 'NTC-101',
      title: '50-Member Group Batch A Daily Selection Completed',
      date: '11 Sep 2026',
      category: 'Reward Announcement',
      type: 'success',
      content: 'Day 15 of 50-Member Group Batch A was drawn at 07:00 AM IST. 1 Gram of 24K Gold Coin awarded to Member MB-2041 (Vikram Seth). Audit Hash verified.',
    },
    {
      id: 'NTC-102',
      title: 'Scheduled Vault Database Upgrade',
      date: '10 Sep 2026',
      category: 'System Notice',
      type: 'info',
      content: 'Database index optimization scheduled for 15 Sep 2026 between 02:00 AM – 03:00 AM IST. Site functionality will remain active with minor latency.',
    },
    {
      id: 'NTC-103',
      title: '5% Instant Referral Cash Bonus Rule Active',
      date: '08 Sep 2026',
      category: 'Program Update',
      type: 'success',
      content: 'Members earning 5% instant cash bonus (₹500 for ₹10,000 deposit) upon referred contact deposit verification can now withdraw earnings 24/7.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-sans select-none">
      
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex items-center justify-between shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
            <Bell className="w-3.5 h-3.5 text-blue-400" />
            <span>SYSTEM NOTICES & ANNOUNCEMENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Announcements & Audit Logs
          </h1>
        </div>

        <button
          onClick={() => setCurrentView('user-dashboard')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-4">
        {notices.map(n => (
          <div key={n.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                {n.category} &bull; {n.date}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{n.id}</span>
            </div>
            <h3 className="text-base font-black text-[#0B1E39]">{n.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{n.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
