'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, Users, ArrowUpRight, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReferralDashboardPage = () => {
  const { user, referrals } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://infinitygram.in/register?ref=${user.referralId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans text-white">
      
      {/* Executive Dark Sovereign Referral Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/40 space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A238]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E1A238]" />
              <span>InfinityGram Referral Wealth Network</span>
            </span>
            <span className="text-[10px] font-black text-[#00C2B8] bg-[#00C2B8]/20 border border-[#00C2B8]/40 px-3 py-1 rounded-full uppercase tracking-wider">
              5% Instant Cash Bonus (₹250 / Member)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Invite Colleagues to 50-Member Gold Groups
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
            Share your verified referral link with trusted members. Earn ₹250 instant wallet bonus upon their deposit confirmation.
          </p>
        </div>

        {/* Link Generator Box */}
        <div className="bg-[#081E26] p-5 rounded-2xl border border-[#0D3B43] space-y-3 relative z-10 shadow-inner">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
            Your Unique Referral Invitation Link
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-[#0D3B43] border border-[#E1A238]/30 text-[#F2C868] font-mono text-xs p-3.5 rounded-xl focus:outline-none font-bold tracking-wider select-all"
            />
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto btn-infinity-cyan text-xs font-black px-7 py-3.5 rounded-xl shadow-lg transition-all shrink-0 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-[#081E26]" /> : <Copy className="w-4 h-4 text-[#081E26]" />}
              <span>{copied ? 'Copied Link!' : 'Copy Invitation Link'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Network Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Invites</p>
          <p className="text-2xl font-black text-white">4</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Deposits</p>
          <p className="text-2xl font-black text-[#00C2B8]">2 Active</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Pending Verification</p>
          <p className="text-2xl font-black text-[#F2C868]">1 Pending</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Unverified Leads</p>
          <p className="text-2xl font-black text-slate-400">1 User</p>
        </motion.div>
      </div>

      {/* Corporate Referral Members Directory Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-8 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#081E26]">
          <div>
            <h3 className="text-base font-black text-white tracking-tight">Referred Members Directory</h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Real-time deposit verification log and 5% bonus tracking.</p>
          </div>
          <span className="text-[10px] font-mono font-black text-[#00C2B8] bg-[#081E26] px-3 py-1 rounded-full border border-[#00C2B8]/40">
            Total Bonus Earned: ₹500
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081E26] border-b border-[#0D3B43] text-[#F2C868] uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Member Name</th>
                <th className="p-4">Member ID</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Deposit Status</th>
                <th className="p-4 rounded-r-xl">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#081E26] font-medium">
              {referrals.map(ref => (
                <tr key={ref.id} className="hover:bg-[#081E26]/50 transition-colors">
                  <td className="p-4 font-extrabold text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#081E26] text-[#F2C868] font-black text-xs flex items-center justify-center border border-[#E1A238]/30">
                        {ref.referredName.charAt(0)}
                      </div>
                      <span>{ref.referredName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#00C2B8] font-black">{ref.referredMemberId}</td>
                  <td className="p-4 text-slate-300 font-medium">{ref.joinedDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ref.depositStatus === 'Verified' 
                        ? 'bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40' 
                        : 'bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40'
                    }`}>
                      {ref.depositStatus}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-slate-300">{ref.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

