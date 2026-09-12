'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  Users, 
  Award, 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Gift, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Sliders,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  UserPlus,
  Wallet,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  refereeId: string;
  refereeName: string;
  refereeEmail: string;
  joinedDate: string;
  depositAmount: number;
  depositStatus: 'Verified' | 'Pending Review' | 'Not Deposited';
  commissionRate: string; // '5%'
  bonusAmount: number; // depositAmount * 0.05
  payoutStatus: 'Instant Wallet Credit' | 'Pending Verification' | 'Ineligible';
}

export const AdminReferralsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Verified' | 'Pending Review' | 'Not Deposited'>('all');
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic admin referral database (starts clean)
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  const filteredReferrals = referrals.filter(item => {
    const matchesSearch = 
      item.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referrerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refereeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refereeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || item.depositStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalInvites = referrals.length;
  const verifiedCount = referrals.filter(r => r.depositStatus === 'Verified').length;
  const totalCommissionINR = referrals.filter(r => r.depositStatus === 'Verified').reduce((acc, r) => acc + (r.bonusAmount || 500), 0);
  const pendingCount = referrals.filter(r => r.depositStatus === 'Pending Review').length;

  const handleApprovePayout = (id: string) => {
    const target = referrals.find(r => r.id === id);
    if (!target) return;

    const calculatedBonus = target.bonusAmount || (target.depositAmount ? target.depositAmount * 0.05 : 500);

    setReferrals(prev => prev.map(ref => 
      ref.id === id ? { 
        ...ref, 
        depositStatus: 'Verified' as const, 
        payoutStatus: 'Instant Wallet Credit' as const,
        bonusAmount: calculatedBonus,
      } : ref
    ));

    setToastMessage(`₹${calculatedBonus.toLocaleString('en-IN')} cash bonus verified for sponsor ${target.referrerName} (${target.referrerId})`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none relative">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#0B1E39] text-white px-5 py-3.5 rounded-2xl border border-emerald-400/40 shadow-2xl flex items-center space-x-3 text-xs font-black max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest">Sponsor Wallet Credited</p>
              <p className="text-white text-xs font-bold mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Executive Dark Sovereign Referral Hero */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>REFERRAL CASH BONUS ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Invite Friends. Earn 5% Deposit Bonus.
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            When your referred contacts join the platform and complete their membership deposit, you instantly receive 5% credited directly to your secure digital wallet. Withdraw your earnings at any time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-extrabold text-amber-400">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>AUTOMATED Instant Wallet Credit</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-extrabold text-emerald-400">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>FLEXIBLE Unlimited Withdrawals</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <div className="bg-slate-900/90 backdrop-blur-md border border-amber-400/30 px-5 py-4 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xl border border-amber-400/40">
              5%
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Default Commission</p>
              <p className="text-sm font-black text-white">₹500 / ₹10,000 Deposit</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Referral Invites</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalInvites} Invites</p>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Referral Network</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Member Deposits</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{verifiedCount} Active</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-2">Deposits verified by desk</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">5% Wallet Commissions</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalCommissionINR.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-2">Instant Wallet Disbursed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Audit Claims</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pendingCount} Pending</p>
          <p className="text-[11px] font-semibold text-purple-700 mt-2">Requires Deposit Review</p>
        </div>
      </div>

      {/* Main Referral Management Table & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Referral Network & 5% Bonus Database</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Real-time log of referrer sponsors, referee member deposits, and instant 5% wallet bonuses.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search referrer, referee or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'Verified', 'Pending Review', 'Not Deposited'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-slate-900 shadow-xs font-extrabold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All Records' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Referral ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Referrer (Sponsor)</th>
                <th className="px-6 py-4 whitespace-nowrap">Referred Member (Referee)</th>
                <th className="px-6 py-4 whitespace-nowrap">Deposit Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Deposit Status</th>
                <th className="px-6 py-4 whitespace-nowrap">5% Cash Incentive</th>
                <th className="px-6 py-4 whitespace-nowrap">Sponsor Wallet Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No referral records matched your search filter.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">{ref.id}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{ref.referrerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{ref.referrerId}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{ref.refereeName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{ref.refereeId}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-black text-slate-900">
                        {ref.depositAmount > 0 ? `₹${ref.depositAmount.toLocaleString('en-IN')}` : '₹0'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">{ref.joinedDate}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {ref.depositStatus === 'Verified' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified Deposit</span>
                        </span>
                      )}
                      {ref.depositStatus === 'Pending Review' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {ref.depositStatus === 'Not Deposited' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>No Deposit Yet</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 border border-amber-300 text-amber-800 shadow-2xs">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>5% Cash Bonus ({ref.bonusAmount > 0 ? `₹${ref.bonusAmount}` : '₹500'})</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {ref.payoutStatus === 'Instant Wallet Credit' ? (
                        <span className="text-emerald-700 font-extrabold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Instant Wallet Credit</span>
                        </span>
                      ) : ref.payoutStatus === 'Pending Verification' ? (
                        <span className="text-amber-700 font-extrabold flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Approval</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Ineligible</span>
                      )}
                    </td>

                    {/* ACTIONS WITH DIRECT 5% CASH APPROVAL AND INSPECT BUTTONS */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-2">
                        {ref.payoutStatus !== 'Instant Wallet Credit' && ref.depositStatus !== 'Not Deposited' && (
                          <button
                            onClick={() => handleApprovePayout(ref.id)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve 5% Cash</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedReferral(ref)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer active:scale-95"
                        >
                          Inspect Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Inspect Tree & Override Payout */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">5% Sponsor Wallet Bonus Inspector</h3>
                  <p className="text-xs font-mono text-slate-400">{selectedReferral.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReferral(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Sponsor (Referrer):</span>
                  <span className="font-black text-slate-900">{selectedReferral.referrerName} ({selectedReferral.referrerId})</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">New Member (Referee):</span>
                  <span className="font-black text-slate-900">{selectedReferral.refereeName} ({selectedReferral.refereeId})</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Member Deposit Amount:</span>
                  <span className="font-black text-emerald-700 text-sm">₹{(selectedReferral.depositAmount || 10000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">Commission Rate:</span>
                  <span className="font-bold text-amber-600">5% Instant Cash Bonus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500">Sponsor Wallet Bonus:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ₹{selectedReferral.depositAmount || 10000} × 5% = <span className="text-amber-600 font-black">₹{selectedReferral.bonusAmount || 500}</span>
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold text-xs flex items-center space-x-1.5">
                  <Wallet className="w-4 h-4 text-amber-600" />
                  <span>Wallet Payout: {selectedReferral.payoutStatus}</span>
                </p>
                <p className="text-[11px] text-amber-800">
                  Clicking approve will immediately credit ₹{selectedReferral.bonusAmount || 500} to {selectedReferral.referrerName}&apos;s digital wallet for instant withdrawal.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedReferral(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {selectedReferral.payoutStatus !== 'Instant Wallet Credit' && (
                <button
                  onClick={() => handleApprovePayout(selectedReferral.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Credit 5% Cash (₹{selectedReferral.bonusAmount || 500}) to Sponsor Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
