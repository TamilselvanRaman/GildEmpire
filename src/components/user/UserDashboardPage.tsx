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
    <div className="space-y-6 relative z-10 font-sans pb-10 text-white">
      
      {/* Executive Dark Sovereign Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] text-white p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden rounded-[2.5rem] border border-[#E1A238]/40 shadow-2xl"
      >
        {/* Background Radial Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E1A238]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="space-y-4 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00C2B8] animate-ping"></span>
              <span>Batch A: Active 50-Day Cycle</span>
            </span>
            <span className="text-xs font-mono font-extrabold text-[#F2C868] bg-[#E1A238]/20 border border-[#E1A238]/40 px-3 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#E1A238]" />
              <span>Assigned Slot #14</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Good Morning, {user.fullName}
            </h1>
            <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
              You are an active participant in <strong className="text-[#F2C868] font-extrabold">{group.groupName}</strong>. 
              14 members have received 1 Gram 24K Gold over 14 days. 36 members remain in today's active pool.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => setCurrentView('user-my-group')}
            className="bg-[#081E26] hover:bg-[#081E26]/80 text-[#00C2B8] border border-[#00C2B8]/40 text-xs font-black px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-md cursor-pointer hover:-translate-y-0.5"
          >
            <span>Inspect 50-Slot Grid</span>
            <ArrowRight className="w-4 h-4 text-[#00C2B8]" />
          </button>

          <button
            onClick={() => setCurrentView('user-reward-spin')}
            className="bg-gradient-to-r from-[#E1A238] to-[#F2C868] hover:from-[#F2C868] hover:to-[#E1A238] text-[#081E26] text-xs font-black px-7 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(225,162,56,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
          >
            <Sparkles className="w-4.5 h-4.5 text-[#081E26] fill-[#081E26]" />
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
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Account Status</p>
            <h3 className="text-xl font-black text-white tracking-tight">{user.accountStatus}</h3>
            <div className="pt-1">
              <span className="text-[10px] text-[#00C2B8] font-extrabold inline-flex items-center space-x-1 bg-[#081E26] px-2.5 py-1 rounded-full border border-[#00C2B8]/40">
                <CheckCircle2 className="w-3 h-3 text-[#00C2B8]" />
                <span>Audited KYC Verified</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#00C2B8] flex items-center justify-center shrink-0 border border-[#00C2B8]/40 group-hover:scale-110 group-hover:bg-[#00C2B8] group-hover:text-[#081E26] transition-all duration-300 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 2: Deposit Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Deposit Status</p>
            <h3 className="text-xl font-black text-white tracking-tight">₹5,000 Verified</h3>
            <p className="text-[10px] text-[#F2C868] font-mono font-bold tracking-tight pt-1">
              Ref: {deposits[0]?.referenceId.substring(0, 14)}...
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#E1A238] flex items-center justify-center shrink-0 border border-[#E1A238]/40 group-hover:scale-110 group-hover:bg-[#E1A238] group-hover:text-[#081E26] transition-all duration-300 shadow-xs">
            <Wallet className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 3: Group Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">50-Member Group</p>
            <h3 className="text-xl font-black text-white tracking-tight">36 Active / 50</h3>
            <div className="pt-1">
              <span className="text-[10px] text-[#F2C868] font-extrabold inline-flex items-center space-x-1 bg-[#081E26] px-2.5 py-1 rounded-full border border-[#E1A238]/40">
                <Users className="w-3 h-3 text-[#E1A238]" />
                <span>14 Winners Awarded</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#F2C868] flex items-center justify-center shrink-0 border border-[#E1A238]/40 group-hover:scale-110 group-hover:bg-[#F2C868] group-hover:text-[#081E26] transition-all duration-300 shadow-xs">
            <Users className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 4: Gold Reward Status */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#E1A238]/20 rounded-full blur-[25px] pointer-events-none"></div>
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Gold Reward Status</p>
            <h3 className="text-xl font-black text-white tracking-tight">In Active Pool</h3>
            <p className="text-[10px] text-[#F2C868] font-black pt-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E1A238] fill-[#E1A238]" />
              <span>Eligible for Day 15 Spin</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E1A238] to-[#F2C868] text-[#081E26] flex items-center justify-center shrink-0 shadow-[0_10px_20px_-10px_rgba(225,162,56,0.5)] group-hover:scale-110 transition-all duration-300 relative z-10">
            <Award className="w-7 h-7" />
          </div>
        </motion.div>

      </div>

      {/* Corporate 50-Day Cycle Progress Center */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-8 sm:p-10 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <h3 className="text-lg font-black text-white">50-Day 1 Gram Gold Cycle Progression</h3>
              <span className="text-[10px] font-mono font-black bg-[#081E26] text-[#F2C868] px-3 py-1 rounded-full border border-[#E1A238]/40 uppercase tracking-wider">
                Day 15 of 50
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              14 members have received 1 Gram 24K Gold. 36 members remain in active selection pool.
            </p>
          </div>

          <button 
            onClick={() => setCurrentView('user-my-group')} 
            className="text-xs font-black text-[#00C2B8] hover:text-[#00C2B8]/80 bg-[#081E26] hover:bg-[#081E26]/80 px-5 py-2.5 rounded-xl border border-[#00C2B8]/30 transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Inspect All 50 Slots</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced Metallic Visual Progress Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00C2B8]"></span>
              <span>Day 1 (50 Members Pool)</span>
            </span>
            <span className="font-mono font-black text-[#F2C868] bg-[#081E26] px-3 py-1 rounded-full border border-[#E1A238]/30">
              14 Grams Awarded (28%)
            </span>
            <span className="flex items-center space-x-1.5">
              <span>Day 50 (Final Member)</span>
              <span className="w-2 h-2 rounded-full bg-[#E1A238]"></span>
            </span>
          </div>

          <div className="h-5 w-full bg-[#081E26] rounded-full overflow-hidden border border-[#0D3B43] p-1 flex shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-[#00C2B8] via-[#E1A238] to-[#F2C868] rounded-full transition-all duration-1000 shadow-md relative"
              style={{ width: '28%' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Key Milestone Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="text-left border-l-2 border-[#00C2B8] pl-2">
              <p className="text-white font-extrabold">Day 1</p>
              <p className="text-[9px] text-slate-300 font-medium">Cycle Initiated</p>
            </div>
            <div className="text-left border-l-2 border-[#00C2B8] pl-2">
              <p className="text-[#00C2B8] font-extrabold">Day 14 (Won)</p>
              <p className="text-[9px] text-slate-300 font-medium">Sneha R. Awarded</p>
            </div>
            <div className="text-left border-l-2 border-[#E1A238] pl-2">
              <p className="text-[#F2C868] font-extrabold">Day 15 (Live)</p>
              <p className="text-[9px] text-[#F2C868] font-medium">Today's Active Selection</p>
            </div>
            <div className="text-right border-r-2 border-[#0D3B43] pr-2">
              <p className="text-white font-extrabold">Day 50</p>
              <p className="text-[9px] text-slate-300 font-medium">Full Group Awarded</p>
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
          className="lg:col-span-7 bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#081E26]">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#00C2B8]" />
              <span>Recent Account Activity</span>
            </h3>
            <span className="text-[10px] font-bold text-[#F2C868] uppercase tracking-widest bg-[#081E26] border border-[#E1A238]/30 px-3 py-1 rounded-full">Live Audit Log</span>
          </div>
          
          <div className="space-y-6 text-xs font-medium">
            
            {/* Timeline Item 1 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-[#081E26] text-[#E1A238] flex items-center justify-center shrink-0 font-bold border border-[#E1A238]/40 shadow-xs group-hover:scale-110 transition-transform">
                <Sparkles className="w-5.5 h-5.5 text-[#E1A238] fill-[#E1A238]" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-white text-sm">Day 14 Gold Reward Selection Completed</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">06:05 PM</span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Member #MB-1014 (<strong className="text-[#F2C868]">Sneha Reddy</strong>) was awarded 1 Gram 24K Gold. Active selection pool updated to 36 members.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-[#081E26] text-[#00C2B8] flex items-center justify-center shrink-0 font-bold border border-[#00C2B8]/40 shadow-xs group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5.5 h-5.5 text-[#00C2B8]" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-white text-sm">Deposit Reference Verified</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">14 Aug 2026</span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  ₹5,000 UPI reference <code className="bg-[#081E26] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#00C2B8] font-bold border border-[#00C2B8]/30">#UPI-982341209384</code> verified by financial desk.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-start space-x-4 group">
              <div className="w-11 h-11 rounded-2xl bg-[#081E26] text-[#F2C868] flex items-center justify-center shrink-0 font-bold border border-[#E1A238]/40 shadow-xs group-hover:scale-110 transition-transform">
                <Users className="w-5.5 h-5.5 text-[#F2C868]" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-white text-sm">Assigned to Slot #14 in Batch A</p>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">14 Aug 2026</span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Successfully added to <strong className="text-[#F2C868]">InfinityGram 50 Gold Club</strong> structured group cycle.
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
          <div className="bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#081E26]">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#00C2B8]" />
                <span>Your Referral Network</span>
              </h3>
              <span className="text-[10px] font-black text-[#F2C868] bg-[#081E26] border border-[#E1A238]/30 px-3 py-1 rounded-full uppercase">
                5% Cash Bonus
              </span>
            </div>

            <div className="bg-[#081E26] p-5 rounded-[1.8rem] border border-[#0D3B43] space-y-3 shadow-inner">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Unique Member Referral Code</p>
              <div className="flex items-center justify-between bg-[#0D3B43] px-4 py-3 rounded-2xl border border-[#E1A238]/30 font-mono text-sm font-black text-white shadow-xs">
                <span className="tracking-wider text-[#F2C868]">{user.referralId}</span>
                <button 
                  onClick={handleCopyCode}
                  className="text-[#00C2B8] hover:text-white bg-[#081E26] hover:bg-[#081E26]/80 px-3.5 py-2 rounded-xl font-sans text-[10px] font-black flex items-center space-x-1.5 transition-all uppercase tracking-wider cursor-pointer active:scale-95 border border-[#00C2B8]/30"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00C2B8]" />
                      <span className="text-[#00C2B8]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#00C2B8]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              <div className="bg-[#081E26] p-4 rounded-2xl border border-[#0D3B43] shadow-xs">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Total Invites</p>
                <p className="text-2xl font-black text-white">4</p>
              </div>
              <div className="bg-[#081E26] p-4 rounded-2xl border border-[#00C2B8]/30 shadow-xs">
                <p className="text-[10px] text-[#00C2B8] font-extrabold uppercase tracking-widest mb-1">Verified Members</p>
                <p className="text-2xl font-black text-[#00C2B8]">2</p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('user-referral-dashboard')}
              className="w-full btn-infinity-cyan text-xs font-black py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Manage Referral Wallet & Earnings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

