'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
  Award, 
  Share2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export const UserDashboardPage = () => {
  const { user, group, deposits, setCurrentView } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 relative z-10 font-sans pb-10">
      
      {/* Executive Dark Sovereign Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden rounded-[2.5rem] border border-[#1A3860] shadow-2xl"
      >
        {/* Background Radial Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="space-y-4 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Batch A: Active 50-Day Cycle</span>
            </span>
            <span className="text-xs font-mono font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Assigned Slot #14</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Good Morning, {user.fullName}
            </h1>
            <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
              You are an active participant in <strong className="text-white font-extrabold">{group.groupName}</strong>. 
              14 members have received 1 Gram 24K Gold over 14 days. 36 members remain in today's active pool.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => setCurrentView('user-my-group')}
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs font-black px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-md cursor-pointer hover:-translate-y-0.5"
          >
            <span>Inspect 50-Slot Grid</span>
            <ArrowRight className="w-4 h-4 text-blue-300" />
          </button>

          <button
            onClick={() => setCurrentView('user-reward-spin')}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 text-xs font-black px-7 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
          >
            <Sparkles className="w-4.5 h-4.5 text-amber-950 fill-amber-950" />
            <span>Daily Gold Selection</span>
          </button>
        </div>
      </motion.div>

      {/* 4 High-Trust Corporate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Account Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 flex items-center justify-between group hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Account Status</p>
            <h3 className="text-xl font-black text-[#0B1E39] tracking-tight">{user.accountStatus}</h3>
            <div className="pt-1">
              <span className="text-[10px] text-[#1E9E64] font-extrabold inline-flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-[#1E9E64]" />
                <span>Audited KYC Verified</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 2: Deposit Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 flex items-center justify-between group hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Deposit Status</p>
            <h3 className="text-xl font-black text-[#0B1E39] tracking-tight">₹5,000 Verified</h3>
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-tight pt-1">
              Ref: {deposits[0]?.referenceId.substring(0, 14)}...
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 group-hover:bg-[#2F6FED] group-hover:text-white transition-all duration-300 shadow-xs">
            <Wallet className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 3: Group Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 flex items-center justify-between group hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">50-Member Group</p>
            <h3 className="text-xl font-black text-[#0B1E39] tracking-tight">36 Active / 50</h3>
            <div className="pt-1">
              <span className="text-[10px] text-amber-700 font-extrabold inline-flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Users className="w-3 h-3 text-amber-600" />
                <span>14 Winners Awarded</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 group-hover:bg-[#0B1E39] group-hover:text-white transition-all duration-300 shadow-xs">
            <Users className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 4: Gold Reward Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 flex items-center justify-between group hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-200/40 rounded-full blur-[25px] pointer-events-none"></div>
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Gold Reward Status</p>
            <h3 className="text-xl font-black text-[#0B1E39] tracking-tight">In Active Pool</h3>
            <p className="text-[10px] text-amber-600 font-black pt-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Eligible for Day 15 Spin</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center shrink-0 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-all duration-300 relative z-10">
            <Award className="w-7 h-7" />
          </div>
        </motion.div>

      </div>

      {/* Corporate 50-Day Cycle Progress Center */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] p-8 sm:p-10 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <h3 className="text-lg font-black text-[#0B1E39]">50-Day 1 Gram Gold Cycle Progression</h3>
              <span className="text-[10px] font-mono font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider">
                Day 15 of 50
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              14 members have received 1 Gram 24K Gold. 36 members remain in active selection pool.
            </p>
          </div>

          <button 
            onClick={() => setCurrentView('user-my-group')} 
            className="text-xs font-black text-[#2F6FED] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Inspect All 50 Slots</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced Metallic Visual Progress Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Day 1 (50 Members Pool)</span>
            </span>
            <span className="font-mono font-black text-[#0B1E39] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              14 Grams Awarded (28%)
            </span>
            <span className="flex items-center space-x-1.5">
              <span>Day 50 (Final Member)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </span>
          </div>

          <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-1 flex shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-[#2F6FED] via-amber-400 to-amber-500 rounded-full transition-all duration-1000 shadow-md relative"
              style={{ width: '28%' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Key Milestone Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="text-left border-l-2 border-blue-500 pl-2">
              <p className="text-slate-800 font-extrabold">Day 1</p>
              <p className="text-[9px] text-slate-400 font-medium">Cycle Initiated</p>
            </div>
            <div className="text-left border-l-2 border-emerald-500 pl-2">
              <p className="text-emerald-700 font-extrabold">Day 14 (Won)</p>
              <p className="text-[9px] text-slate-400 font-medium">Sneha R. Awarded</p>
            </div>
            <div className="text-left border-l-2 border-amber-500 pl-2">
              <p className="text-amber-800 font-extrabold">Day 15 (Live)</p>
              <p className="text-[9px] text-amber-600 font-medium">Today's Active Selection</p>
            </div>
            <div className="text-right border-r-2 border-slate-300 pr-2">
              <p className="text-slate-800 font-extrabold">Day 50</p>
              <p className="text-[9px] text-slate-400 font-medium">Full Group Awarded</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout: Recent Activity & Referral Network */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Activity Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-[#0B1E39] uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#2F6FED]" />
              <span>Recent Account Activity</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Live Audit Log</span>
          </div>
          
          <div className="space-y-6 text-xs font-medium">
            
            {/* Timeline Item 1 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold border border-amber-200/80 shadow-xs group-hover:scale-110 transition-transform">
                <Sparkles className="w-5.5 h-5.5 text-amber-500 fill-amber-400" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#0B1E39] text-sm">Day 14 Gold Reward Selection Completed</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">06:05 PM</span>
                </div>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  Member #MB-1014 (<strong className="text-slate-700">Sneha Reddy</strong>) was awarded 1 Gram 24K Gold. Active selection pool updated to 36 members.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold border border-emerald-200/80 shadow-xs group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#0B1E39] text-sm">Deposit Reference Verified</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">14 Aug 2026</span>
                </div>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  ₹5,000 UPI reference <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-700 font-bold">#UPI-982341209384</code> verified by financial desk.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0 font-bold border border-blue-200/80 shadow-xs group-hover:scale-110 transition-transform">
                <Users className="w-5.5 h-5.5 text-[#2F6FED]" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#0B1E39] text-sm">Assigned to Slot #14 in Batch A</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">14 Aug 2026</span>
                </div>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  Successfully added to <strong className="text-slate-700">GildEmpire 50 Gold Club</strong> structured group cycle.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Column: Referral Network Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-[#0B1E39] uppercase tracking-wider flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#2F6FED]" />
                <span>Your Referral Network</span>
              </h3>
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
                5% Cash Bonus
              </span>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-[1.8rem] border border-slate-200 space-y-3 shadow-inner">
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Unique Member Referral Code</p>
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 font-mono text-sm font-black text-[#0B1E39] shadow-xs">
                <span className="tracking-wider">{user.referralId}</span>
                <button 
                  onClick={handleCopyCode}
                  className="text-[#2F6FED] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl font-sans text-[10px] font-black flex items-center space-x-1.5 transition-all uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Total Invites</p>
                <p className="text-2xl font-black text-[#0B1E39]">4</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
                <p className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest mb-1">Verified Members</p>
                <p className="text-2xl font-black text-[#1E9E64]">2</p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('user-referral-dashboard')}
              className="w-full bg-[#0B1E39] hover:bg-[#142d52] text-white text-xs font-black py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Manage Referral Wallet & Earnings</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

