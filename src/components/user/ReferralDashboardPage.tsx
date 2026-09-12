'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, Users, ArrowUpRight, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReferralDashboardPage = () => {
  const { user, referrals } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = user.referralId || `REF-${user.memberId?.slice(-6) || 'USER'}`;
  const referralLink = `https://infinitygram.net/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const verifiedCount = referrals.filter(r => r.depositStatus === 'Verified').length;
  const pendingCount = referrals.filter(r => r.depositStatus === 'Pending' || r.depositStatus === 'Not Started').length;
  const total5PercentEarnings = verifiedCount * 500; // 5% of ₹10,000 = ₹500 per verified member

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
              <span>InfinityGram 5% Referral Program</span>
            </span>
            <span className="text-[10px] font-black text-[#00C2B8] bg-[#00C2B8]/20 border border-[#00C2B8]/40 px-3 py-1 rounded-full uppercase tracking-wider">
              5% Instant Bonus (₹500 / Verified Deposit)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Invite Members & Earn 5% Instant Cash Rewards
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
            Share your unique referral code or link. For every member who joins and completes their ₹10,000 scheme deposit, you earn an instant 5% commission (₹500) credited to your wallet.
          </p>
        </div>

        {/* Link & Code Generator Box */}
        <div className="bg-[#081E26] p-5 rounded-2xl border border-[#0D3B43] space-y-4 relative z-10 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Referral Code Box */}
            <div className="md:col-span-4 space-y-1.5">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                Your Referral Code
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={referralCode}
                  className="w-full bg-[#0D3B43] border border-[#E1A238]/40 text-[#F2C868] font-mono text-sm p-3 rounded-xl focus:outline-none font-black tracking-widest text-center select-all"
                />
                <button
                  onClick={handleCopyCode}
                  className="bg-[#0D3B43] hover:bg-[#144f5a] text-[#F2C868] border border-[#E1A238]/40 p-3 rounded-xl transition-all cursor-pointer shrink-0"
                  title="Copy Referral Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-[#00C2B8]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="md:col-span-8 space-y-1.5">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                Your Direct Referral Link
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-[#0D3B43] border border-[#00C2B8]/40 text-[#00C2B8] font-mono text-xs p-3 rounded-xl focus:outline-none font-bold tracking-wider select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto btn-infinity-cyan text-xs font-black px-6 py-3 rounded-xl shadow-lg transition-all shrink-0 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#081E26]" /> : <Share2 className="w-4 h-4 text-[#081E26]" />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

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
          <p className="text-2xl font-black text-white">{referrals.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Deposits</p>
          <p className="text-2xl font-black text-[#00C2B8]">{verifiedCount} Active</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 text-center space-y-1 hover:border-[#E1A238]/60 transition-all"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Commission Rate</p>
          <p className="text-2xl font-black text-[#F2C868]">5% Instant</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#0D3B43] rounded-[2rem] border border-[#00C2B8]/40 shadow-2xl p-6 text-center space-y-1 hover:border-[#00C2B8] transition-all bg-gradient-to-br from-[#0D3B43] to-[#0A2E35]"
        >
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Bonus Earned</p>
          <p className="text-2xl font-black text-[#00C2B8]">₹{total5PercentEarnings}</p>
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
          <span className="text-[10px] font-mono font-black text-[#00C2B8] bg-[#081E26] px-3.5 py-1.5 rounded-full border border-[#00C2B8]/40">
            Total Commission: ₹{total5PercentEarnings} (5% on ₹10,000)
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
                <th className="p-4">5% Referral Bonus</th>
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
                  <td className="p-4 font-mono font-black text-[#00C2B8]">
                    {ref.depositStatus === 'Verified' ? '+₹500 (5%)' : '₹0 (Pending)'}
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

