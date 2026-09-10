'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, Users, ArrowUpRight, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReferralDashboardPage = () => {
  const { user, referrals } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://gildempire.in/register?ref=${user.referralId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Executive Dark Sovereign Referral Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GildEmpire Referral Wealth Network</span>
            </span>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
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
        <div className="bg-[#102747]/90 backdrop-blur-md p-5 rounded-2xl border border-[#1A3860] space-y-3 relative z-10 shadow-inner">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
            Your Unique Referral Invitation Link
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-[#0B1E39] border border-[#1A3860] text-amber-300 font-mono text-xs p-3.5 rounded-xl focus:outline-none font-bold tracking-wider select-all"
            />
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-black px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all shrink-0 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 text-center space-y-1 hover:shadow-xl transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Invites</p>
          <p className="text-2xl font-black text-[#0B1E39]">4</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 text-center space-y-1 hover:shadow-xl transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Deposits</p>
          <p className="text-2xl font-black text-[#1E9E64]">2 Active</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 text-center space-y-1 hover:shadow-xl transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Pending Verification</p>
          <p className="text-2xl font-black text-amber-600">1 Pending</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] p-6 text-center space-y-1 hover:shadow-xl transition-all"
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
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] p-8 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-[#0B1E39] tracking-tight">Referred Members Directory</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time deposit verification log and 5% bonus tracking.</p>
          </div>
          <span className="text-[10px] font-mono font-black text-[#2F6FED] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Total Bonus Earned: ₹500
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-400 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Member Name</th>
                <th className="p-4">Member ID</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Deposit Status</th>
                <th className="p-4 rounded-r-xl">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {referrals.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-[#0B1E39]">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1E39] font-black text-xs flex items-center justify-center border border-slate-200">
                        {ref.referredName.charAt(0)}
                      </div>
                      <span>{ref.referredName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#2F6FED] font-black">{ref.referredMemberId}</td>
                  <td className="p-4 text-slate-500 font-medium">{ref.joinedDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ref.depositStatus === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {ref.depositStatus}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-slate-700">{ref.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

