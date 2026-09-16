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
  const { user, group, deposits, referrals, submitDeposit, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'referral' | 'withdrawal'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [buySlotSuccess, setBuySlotSuccess] = useState<string | null>(null);
  const [addFundsAmount, setAddFundsAmount] = useState(10000);

  const slotsOwnedCount = user.slotsOwned || (user.slotNumber ? 1 : 0);
  const maxSlots = 3;

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '2500',
    upiId: 'rajesh.sharma@upi',
    bankAccount: '918234120938',
    ifscCode: 'HDFC0001234',
    payoutMethod: 'upi',
  });

  const userVerifiedDeposits = deposits.filter(d => d.memberId === user.memberId);
  const depositTotal = userVerifiedDeposits.filter(d => d.status === 'Verified').reduce((acc, curr) => acc + curr.amount, 0);
  const referralBonus = (referrals || []).filter(r => r.depositStatus === 'Verified').length * 500;
  const userBalance = depositTotal + referralBonus;

  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRzpId = 'RZP-WLT-' + Math.floor(10000000 + Math.random() * 90000000);
    submitDeposit(addFundsAmount, generatedRzpId, 'Razorpay Instant Gateway');
    setShowAddFundsModal(false);
    setBuySlotSuccess(`₹${addFundsAmount.toLocaleString('en-IN')} successfully added to digital wallet balance!`);
    setTimeout(() => setBuySlotSuccess(null), 4000);
  };

  const handleBuySlotWithWallet = () => {
    if (slotsOwnedCount >= maxSlots) {
      alert('Maximum 3 slots per member limit reached for this group!');
      return;
    }

    if (userBalance < 10000) {
      setShowAddFundsModal(true);
      return;
    }

    const generatedTxId = 'WLT-SLOT-' + Math.floor(100000 + Math.random() * 900000);
    submitDeposit(10000, generatedTxId, 'UPI (Manual UTR)');
    setBuySlotSuccess(`🎉 Group Slot Successfully Purchased using Wallet Balance! Assigned to Slot #${user.slotNumber || 1}.`);
    setTimeout(() => setBuySlotSuccess(null), 5000);
  };

  // Dynamic Ledger Data from actual user state
  const walletTransactions = userVerifiedDeposits.map((d, index) => ({
    id: d.id || `tx-${index}`,
    date: d.transactionDate,
    type: 'Membership Deposit',
    category: 'deposit' as const,
    refId: d.referenceId,
    method: d.paymentMethod,
    amount: d.amount,
    direction: 'in' as const,
    status: d.status,
    balanceAfter: d.status === 'Verified' ? d.amount : 0,
  }));

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative z-10 text-white">
      
      {/* Toast Banner for Wallet & Slot Purchase Success */}
      {buySlotSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-500 text-slate-950 font-black p-4 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 text-xs border border-emerald-300"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{buySlotSuccess}</span>
          </div>
          <button onClick={() => setBuySlotSuccess(null)} className="text-slate-950 font-bold px-2 py-0.5 rounded hover:bg-emerald-600/30 cursor-pointer">✕</button>
        </motion.div>
      )}

      {/* Executive Dark Sovereign Wallet Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/40 space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A238]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#00C2B8] animate-ping"></span>
                <span>Encrypted Sovereign Digital Wallet</span>
              </span>
              <span className="text-[10px] font-mono font-black text-[#F2C868] bg-[#081E26] border border-[#E1A238]/40 px-3 py-1 rounded-full uppercase">
                {user.memberId}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Wallet Statement & Financial Report
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
              Complete audit ledger tracking your ₹10,000 group deposit, 5% referral bonuses, instant withdrawals, and 1g Gold coin allocations.
            </p>
          </div>

          {/* Action Buttons: Add Funds, Buy Slot, Withdraw */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
            <button
              onClick={() => setShowAddFundsModal(true)}
              className="bg-[#00C2B8] hover:bg-[#00C2B8]/80 text-[#081E26] text-xs font-black px-5 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg cursor-pointer hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 fill-current text-[#081E26]" />
              <span>+ Add Wallet Funds</span>
            </button>

            {slotsOwnedCount < maxSlots && (
              <button
                onClick={handleBuySlotWithWallet}
                className="bg-gradient-to-r from-[#E1A238] to-[#F2C868] hover:from-[#F2C868] hover:to-[#E1A238] text-[#081E26] text-xs font-black px-6 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(225,162,56,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
              >
                <Award className="w-4.5 h-4.5 text-[#081E26] fill-[#081E26]" />
                <span>Buy Group Slot (₹10,000)</span>
              </button>
            )}

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-[#081E26] hover:bg-[#081E26]/80 text-white border border-[#E1A238]/40 text-xs font-black px-5 py-4 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
            >
              <ArrowUpRight className="w-4 h-4 text-[#F2C868]" />
              <span>Withdrawal</span>
            </button>
          </div>
        </div>

        {/* Balance Breakdown Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#0D3B43] relative z-10 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Available Wallet Balance</p>
            <p className="text-2xl font-black text-[#F2C868] font-mono tracking-tight mt-0.5">₹{userBalance.toLocaleString('en-IN')}.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Group Deposit</p>
            <p className="text-2xl font-black text-white font-mono tracking-tight mt-0.5">₹{depositTotal.toLocaleString('en-IN')}.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">5% Referral Bonus Earned</p>
            <p className="text-2xl font-black text-[#00C2B8] font-mono tracking-tight mt-0.5">₹{referralBonus.toLocaleString('en-IN')}.00</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Group Slots Owned</p>
            <p className="text-2xl font-black text-[#00C2B8] font-mono tracking-tight mt-0.5">{slotsOwnedCount} / 3 Max</p>
          </div>
        </div>

      </motion.div>

      {/* Main Statement Ledger Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#0D3B43] rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl p-4 sm:p-8 space-y-6 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#081E26]">
          <div>
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#00C2B8]" />
              <span>Full Audit Transaction Statement</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Live cryptographically recorded deposits, referral bonuses, and bank withdrawals.
            </p>
          </div>

          {/* Statement Filters & Export */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-1 bg-[#081E26] p-1.5 rounded-2xl border border-[#0D3B43] text-xs font-black w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Logs' },
                { id: 'deposit', label: 'Deposits' },
                { id: 'referral', label: 'Referrals' },
                { id: 'withdrawal', label: 'Withdrawals' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] ${
                    activeTab === t.id 
                      ? 'bg-[#00C2B8] text-[#081E26] shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => alert('Downloading official PDF statement...')}
              className="bg-[#081E26] hover:bg-[#081E26]/80 text-[#00C2B8] text-xs font-black px-4 py-2.5 rounded-xl border border-[#00C2B8]/30 transition-colors flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Statement</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-[#081E26] border-b border-[#0D3B43] text-[#F2C868] uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl whitespace-nowrap">Transaction Date</th>
                <th className="p-3.5 whitespace-nowrap">Type & Description</th>
                <th className="p-3.5 whitespace-nowrap">Reference / UTR Code</th>
                <th className="p-3.5 whitespace-nowrap">Payment Method</th>
                <th className="p-3.5 whitespace-nowrap">Amount (INR)</th>
                <th className="p-3.5 rounded-r-xl whitespace-nowrap">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#081E26] font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No transactions recorded. Verified membership deposits will appear here.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#081E26]/50 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="p-3.5 font-extrabold text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          tx.direction === 'in' ? 'bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/30' : 'bg-[#081E26] text-[#E1A238] border border-[#E1A238]/30'
                        }`}>
                          {tx.direction === 'in' ? <ArrowDownLeft className="w-4 h-4 text-[#00C2B8]" /> : <ArrowUpRight className="w-4 h-4 text-[#E1A238]" />}
                        </div>
                        <span>{tx.type}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-black text-[#00C2B8] whitespace-nowrap">{tx.refId}</td>
                    <td className="p-3.5 text-slate-300 font-semibold whitespace-nowrap">{tx.method}</td>
                    <td className="p-3.5 font-mono font-black text-white whitespace-nowrap">
                      {tx.direction === 'in' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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
            className="fixed inset-0 bg-[#081E26]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0D3B43] max-w-md w-full rounded-[2.5rem] p-8 border border-[#E1A238]/40 shadow-2xl space-y-6 relative text-left text-white"
            >
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Instant Wallet Withdrawal</h3>
                  <p className="text-xs text-slate-300 font-medium">Available to withdraw: ₹3,500.00</p>
                </div>
              </div>

              {withdrawSuccess && (
                <div className="bg-[#081E26] border border-[#00C2B8]/40 text-[#00C2B8] p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00C2B8] shrink-0" />
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
                    className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-black text-lg p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8]"
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
                    className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8]"
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
                    className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-mono font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-infinity-cyan font-black py-4 rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
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
