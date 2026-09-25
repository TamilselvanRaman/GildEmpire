'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, Users, ArrowUpRight, ShieldCheck, Sparkles, Wallet, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReferralDashboardPage = () => {
  const { user, referrals, fetchReferrals, claimReferralBonus, openDepositModal } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [claimToast, setClaimToast] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (fetchReferrals && user) {
      fetchReferrals(user);
    }
  }, [user]);

  const isUserDepositVerified = user?.depositStatus === 'Verified';
  const memberId = user?.memberId || 'LOP-485339';
  const referralCode = `REF-${memberId.replace(/^LOP-/i, '')}`;
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

  const handleClaim = async (refId: string) => {
    setClaimingId(refId);
    const res = await claimReferralBonus(refId);
    setClaimingId(null);

    if (res.success) {
      setClaimToast(res.message || '₹500 Referral Bonus credited to your wallet balance!');
      setTimeout(() => setClaimToast(null), 4000);
    } else {
      alert(res.error || 'Failed to claim bonus');
    }
  };

  const verifiedCount = referrals.filter(r => r.depositStatus === 'Verified').length;
  const claimedCount = referrals.filter(r => r.claimed).length;
  const total5PercentEarnings = referrals
    .filter(r => r.claimed || (r.depositStatus === 'Verified' && isUserDepositVerified))
    .reduce((sum, r) => sum + (r.bonusEarnedAmount || 500), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans text-white">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {claimToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500 text-slate-950 font-black p-4 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 text-xs border border-emerald-300 relative z-50"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
              <span>{claimToast}</span>
            </div>
            <button onClick={() => setClaimToast(null)} className="text-slate-950 font-bold px-2 py-0.5 rounded hover:bg-emerald-600/30 cursor-pointer">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Referrer Deposit Requirement Banner */}
      {!isUserDepositVerified ? (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0 border border-amber-500/40">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-300 text-sm">Deposit Required to Unlock Referral Cash Bonuses</h4>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5 max-w-2xl">
                Your referred members have signed up! Complete your ₹10,000 scheme deposit to unlock and claim 5% cash bonus (₹500 per member) directly to your withdrawable wallet balance.
              </p>
            </div>
          </div>
          <button
            onClick={openDepositModal}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
          >
            Deposit ₹10,000 Now
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 p-4 rounded-3xl flex items-center space-x-3.5 shadow-xl backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 border border-emerald-500/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-emerald-300 text-xs">Deposit Verified & Referral Bonuses Active</h4>
            <p className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
              Your ₹10,000 deposit is verified. You can claim 5% cash rewards instantly as soon as your referred members complete their deposit.
            </p>
          </div>
        </motion.div>
      )}

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
            Share your unique referral code or link. For every member who joins using your link or code and completes their ₹10,000 scheme deposit, you earn an instant 5% commission (₹500) credited to your wallet.
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
        className="bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-5 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#081E26]">
          <div>
            <h3 className="text-base font-black text-white tracking-tight">Referred Members Directory</h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Real-time registered users list who signed up with your reference ID/link.</p>
          </div>
          <span className="text-[10px] font-mono font-black text-[#00C2B8] bg-[#081E26] px-3.5 py-1.5 rounded-full border border-[#00C2B8]/40 self-start sm:self-auto">
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
                <th className="p-4 rounded-r-xl text-right">Claim Bonus Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#081E26] font-medium">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm text-slate-300">No Members Referred Yet</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Share your unique referral link <span className="text-[#00C2B8] font-mono">{referralLink}</span> or Referral Code <span className="text-[#F2C868] font-mono">{referralCode}</span> with friends to earn 5% instant bonus on every verified deposit.
                    </p>
                  </td>
                </tr>
              ) : (
                referrals.map(ref => {
                  const isMemberVerified = ref.depositStatus === 'Verified';
                  const isClaimed = ref.claimed;

                  return (
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
                          isMemberVerified 
                            ? 'bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40' 
                            : 'bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40'
                        }`}>
                          {ref.depositStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-black text-[#00C2B8]">
                        {isMemberVerified ? '+₹500 (5%)' : '₹0 (Pending)'}
                      </td>
                      
                      {/* CLAIM ACTION BUTTON & STATUS */}
                      <td className="p-4 text-right">
                        {isClaimed ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Claimed (+₹500)</span>
                          </span>
                        ) : isMemberVerified ? (
                          isUserDepositVerified ? (
                            <button
                              onClick={() => handleClaim(ref.id)}
                              disabled={claimingId === ref.id}
                              className="bg-gradient-to-r from-[#00C2B8] to-[#009E96] hover:from-[#009E96] hover:to-[#00C2B8] text-[#081E26] text-xs font-black px-4 py-2 rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 ml-auto active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5 fill-current" />
                              <span>{claimingId === ref.id ? 'Claiming...' : 'Claim 5% Bonus (₹500)'}</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Locked (Your Deposit Required)</span>
                            </div>
                          )
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Pending Member Deposit</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};
