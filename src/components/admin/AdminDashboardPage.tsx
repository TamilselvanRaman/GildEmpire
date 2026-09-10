'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Wallet, 
  Layers, 
  Award, 
  Share2, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { deposits, group, auditLogs, setCurrentView } = useApp();

  const pendingDeposits = deposits.filter(d => d.status === 'Pending');

  return (
    <div className="space-y-6">
      
      {/* Admin Title Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-700 uppercase font-mono">
              Operational Command Center
            </span>
            <span className="text-xs text-slate-400">Enterprise Engine v2.4</span>
          </div>
          <h1 className="text-2xl font-extrabold">Admin Executive Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time status of 50-member groups, verified deposits, daily 1g gold cycles, and cryptographic audit trails.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setCurrentView('admin-reward-flow-control')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Daily Gold Spin Controller</span>
          </button>
        </div>
      </div>

      {/* 8 Top KPI Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Registered Users</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">1,248</h3>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this week</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Verified Deposited Users</p>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">1,150</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">₹57,50,000 Volume</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active 50-Member Groups</p>
          <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">23 Batches</h3>
          <p className="text-[10px] text-indigo-700 font-medium mt-0.5">1,150 Total Slots</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs gold-gradient-border">
          <p className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">Gold Distributed</p>
          <h3 className="text-2xl font-extrabold text-amber-700 mt-1">322 Grams</h3>
          <p className="text-[10px] text-amber-800 font-semibold mt-0.5">24K Hallmarked Coins</p>
        </div>

      </div>

      {/* Grid: Pending Review Alerts & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pending Deposit Queue Alerts */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pending Deposit Verification Queue ({pendingDeposits.length})</span>
            </h3>
            <button onClick={() => setCurrentView('admin-deposits')} className="text-xs text-blue-600 font-bold hover:underline">
              View Queue
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {pendingDeposits.map(dep => (
              <div key={dep.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{dep.memberName} ({dep.memberId})</p>
                  <p className="font-mono text-slate-500 text-[11px]">{dep.referenceId} | ₹{dep.amount}</p>
                </div>
                <button
                  onClick={() => setCurrentView('admin-deposit-review')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px]"
                >
                  Review Proof
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real-Time Enterprise Audit Stream */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Audit Engine Logs</span>
            </h3>
            <button onClick={() => setCurrentView('admin-audit-logs')} className="text-xs text-amber-400 font-mono font-bold hover:underline">
              Full Logs
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="text-amber-400 font-bold">{log.action}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans">{log.actor} ({log.role}) $\rightarrow$ {log.newStatus}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
