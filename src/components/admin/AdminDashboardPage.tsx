'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Wallet, 
  Layers, 
  Award, 
  AlertCircle, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { deposits, group, allGroups, auditLogs, setCurrentView } = useApp();

  const pendingDeposits = deposits.filter(d => d.status === 'Pending');
  const verifiedDeposits = deposits.filter(d => d.status === 'Verified');
  const verifiedVolumeINR = verifiedDeposits.reduce((acc, d) => acc + d.amount, 0);
  const activeBatchesCount = (allGroups || []).filter(g => g.status === 'active' || g.status === 'recruiting').length || 1;
  const totalOccupiedSlots = (allGroups || []).reduce((acc, g) => acc + g.slots.filter(s => s.status === 'Occupied').length, 0);
  const totalGoldDistributed = (allGroups || []).reduce((acc, g) => acc + g.totalGoldDistributedGrams, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Executive Command Hero Banner */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#1A3860] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Top Gold Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Operational Command Center • Enterprise v2.4</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Executive Overview
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
            Real-time status of 50-member groups, verified deposits, daily 1g gold cycles, and cryptographic audit trails.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setCurrentView('admin-reward-flow-control')}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 px-5 rounded-xl shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Daily Gold Spin Controller</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 4 Top KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Total Enrolled Members</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0B1E39] mt-2 tracking-tight">{totalOccupiedSlots} Members</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across Active Group Batches</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Verified Deposited Volume</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#2F6FED] mt-2 tracking-tight">{verifiedDeposits.length} Verified</h3>
          <p className="text-[11px] text-slate-500 font-mono font-bold mt-1">₹{verifiedVolumeINR.toLocaleString('en-IN')} Verified Volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Active 50-Member Groups</p>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-indigo-700 mt-2 tracking-tight">{activeBatchesCount} Batch{activeBatchesCount > 1 ? 'es' : ''}</h3>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">{totalOccupiedSlots} Active Member Slots</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-5 rounded-2xl border border-amber-300/80 shadow-xs hover:border-amber-400 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] text-amber-900 font-extrabold uppercase tracking-wider">Gold Distributed</p>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-amber-800 mt-2 tracking-tight">{totalGoldDistributed} Grams</h3>
          <p className="text-[11px] text-amber-900 font-extrabold mt-1">24K Hallmarked Gold Coins</p>
        </div>

      </div>

      {/* Grid: Pending Review Queue & Real-Time Audit Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pending Deposit Queue */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-[#0B1E39] flex items-center space-x-2">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>Pending Deposit Verification Queue ({pendingDeposits.length})</span>
            </h3>
            <button 
              onClick={() => setCurrentView('admin-deposits')} 
              className="text-xs text-[#2F6FED] font-extrabold hover:underline flex items-center space-x-1"
            >
              <span>View Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {pendingDeposits.length === 0 ? (
              <div className="p-6 text-center text-slate-400 font-medium">No pending deposit reviews at this moment.</div>
            ) : (
              pendingDeposits.map(dep => (
                <div key={dep.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                  <div>
                    <p className="font-extrabold text-[#0B1E39] text-xs">{dep.memberName} <span className="font-mono text-slate-500 font-bold">({dep.memberId})</span></p>
                    <p className="font-mono text-slate-500 text-[11px] mt-0.5"><strong className="text-slate-700">{dep.referenceId}</strong> | ₹{dep.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('admin-deposit-review')}
                    className="bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-[11px] shadow-xs cursor-pointer transition-all"
                  >
                    Review Proof
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Enterprise Audit Stream */}
        <div className="lg:col-span-6 bg-[#0B1528] text-white p-6 rounded-2xl border border-[#1E2E4A] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2E4A] pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Activity className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Enterprise Audit Engine Logs</span>
            </h3>
            <button 
              onClick={() => setCurrentView('admin-audit-logs')} 
              className="text-xs text-amber-400 font-mono font-bold hover:underline flex items-center space-x-1"
            >
              <span>Full Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="bg-[#060D1A] p-3.5 rounded-xl border border-[#1E2E4A]/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-extrabold">{log.action}</span>
                  <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">
                  <span className="font-bold text-white">{log.actor}</span> <span className="text-slate-400">({log.role})</span> → <span className="text-emerald-400 font-medium">{log.newStatus}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
