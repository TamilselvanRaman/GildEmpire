'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Send, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  X, 
  Filter, 
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletPage = () => {
  const { user, deposits, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'referral' | 'withdrawal'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '2500',
    upiId: 'rajesh.sharma@upi',
    bankAccount: '918234120938',
    ifscCode: 'HDFC0001234',
    payoutMethod: 'upi',
  });

  // Mock Ledger Data
  const walletTransactions = [
    {
      id: 'tx-101',
      date: '14 Aug 2026, 02:15 PM',
      type: 'Membership Deposit',
      category: 'deposit',
      refId: deposits[0]?.referenceId || 'UPI-982341209384',
      method: 'UPI AutoPay (PhonePe)',
      amount: 5000,
      direction: 'in',
      status: 'Verified',
      balanceAfter: 5000,
    },
    {
      id: 'tx-102',
      date: '18 Aug 2026, 05:40 PM',
      type: 'Referral Bonus (Suresh Raina)',
      category: 'referral',
      refId: 'REF-9901-BONUS',
      method: 'Instant Referral Wallet Credit',
      amount: 250,
      direction: 'in',
      status: 'Completed',
      balanceAfter: 5250,
    },
    {
      id: 'tx-103',
      date: '22 Aug 2026, 06:10 PM',
      type: 'Referral Bonus (Meera Nambiar)',
      category: 'referral',
      refId: 'REF-9902-BONUS',
      method: 'Instant Referral Wallet Credit',
      amount: 250,
      direction: 'in',
      status: 'Completed',
      balanceAfter: 5500,
    },
    {
      id: 'tx-104',
      date: '25 Aug 2026, 11:30 AM',
      type: 'Bank Withdrawal Payout',
      category: 'withdrawal',
      refId: 'WTH-89240192',
      method: 'HDFC Bank IMPS Transfer',
      amount: 2000,
      direction: 'out',
      status: 'Completed',
      balanceAfter: 3500,
    },
    {
      id: 'tx-105',
      date: '10 Sep 2026, 06:05 PM',
      type: '1g 24K Gold Coin Dispatch Token',
      category: 'gold',
      refId: 'GLD-TOKEN-DAY14',
      method: 'Sovereign Vault Ledger',
      amount: 0,
      direction: 'in',
      status: 'Verified & Shipped',
      balanceAfter: 3500,
    }
  ];

  const filteredTransactions = walletTransactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.category === activeTab;
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative z-10">
      
      {/* Executive Dark Sovereign Wallet Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Encrypted Sovereign Digital Wallet</span>
              </span>
              <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full uppercase">
                {user.memberId}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Wallet Statement & Financial Report
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
              Complete audit ledger tracking your ₹5,000 group deposit, 5% referral bonuses, instant withdrawals, and 1g Gold coin allocations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
            <button
              onClick={() => setCurrentView('user-deposit-overview')}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs font-black px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <Wallet className="w-4 h-4 text-blue-300" />
              <span>Deposit Ledger</span>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-emerald-950 text-xs font-black px-7 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
            >
              <ArrowUpRight className="w-4.5 h-4.5 stroke-[3]" />
              <span>Instant Withdrawal</span>
            </button>
          </div>
        </div>

        {/* Balance Breakdown Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 relative z-10 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Available Wallet Balance</p>
            <p className="text-2xl font-black text-amber-300 font-mono tracking-tight mt-0.5">₹3,500.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Group Deposit</p>
            <p className="text-2xl font-black text-white font-mono tracking-tight mt-0.5">₹5,000.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">5% Referral Bonus Earned</p>
            <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">₹500.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Payouts Processed</p>
            <p className="text-2xl font-black text-blue-300 font-mono tracking-tight mt-0.5">₹2,000.00</p>
          </div>
        </div>

      </motion.div>

      {/* Main Statement Ledger Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] p-8 sm:p-10 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-[#0B1E39] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#2F6FED]" />
              <span>Full Audit Transaction Statement</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live cryptographically recorded deposits, referral bonuses, and bank withdrawals.
            </p>
          </div>

          {/* Statement Filters & Export */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
              {[
                { id: 'all', label: 'All Logs' },
                { id: 'deposit', label: 'Deposits' },
                { id: 'referral', label: 'Referrals' },
                { id: 'withdrawal', label: 'Withdrawals' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === t.id 
                      ? 'bg-[#0B1E39] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => alert('Downloading official PDF statement...')}
              className="bg-blue-50 hover:bg-blue-100 text-[#2F6FED] text-xs font-black px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Statement</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-400 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Transaction Date</th>
                <th className="p-4">Type & Description</th>
                <th className="p-4">Reference / UTR Code</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount (INR)</th>
                <th className="p-4 rounded-r-xl">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{tx.date}</td>
                  <td className="p-4 font-extrabold text-[#0B1E39]">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        tx.direction === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {tx.direction === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <span>{tx.type}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#2F6FED]">{tx.refId}</td>
                  <td className="p-4 text-slate-600 font-medium">{tx.method}</td>
                  <td className="p-4 font-mono font-black text-sm">
                    {tx.amount === 0 ? (
                      <span className="text-amber-600">1 Gram 24K Gold</span>
                    ) : tx.direction === 'in' ? (
                      <span className="text-emerald-600">+₹{tx.amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-blue-600">-₹{tx.amount.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0B1E39]">Instant Wallet Withdrawal</h3>
                  <p className="text-xs text-slate-500 font-medium">Available to withdraw: ₹3,500.00</p>
                </div>
              </div>

              {withdrawSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Withdrawal request of ₹{withdrawForm.amount} initiated. Reference #WTH-8924012. IMPS payout dispatched to bank.</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    max={3500}
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-black text-lg p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                    Receiving Bank UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawForm.upiId}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, upiId: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                    HDFC Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawForm.bankAccount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bankAccount: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B1E39] hover:bg-[#142d52] text-white font-black py-4 rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  Submit Instant IMPS Withdrawal Request
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
