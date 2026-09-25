'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Check, 
  X, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminWithdrawalsPage: React.FC = () => {
  const { withdrawals, reviewWithdrawal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid bank details or suspicious activity.');

  const filteredWithdrawals = (withdrawals || []).filter(item => {
    const matchesSearch = 
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.upiId && item.upiId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.bankAccount && item.bankAccount.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const pendingRequests = (withdrawals || []).filter(w => w.status === 'Pending');
  const totalApprovedAmount = (withdrawals || [])
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const handleApprove = async (id: string, name: string, amount: number) => {
    const res = await reviewWithdrawal(id, 'Approved', `IMPS Payout of ₹${amount.toLocaleString('en-IN')} approved and dispatched by admin.`);
    if (res.success) {
      setToastMessage(`Withdrawal of ₹${amount.toLocaleString('en-IN')} approved for ${name} (${id})`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalId) return;
    const target = withdrawals.find(w => w.id === rejectModalId);
    const res = await reviewWithdrawal(rejectModalId, 'Rejected', rejectReason);
    setRejectModalId(null);

    if (res.success) {
      setToastMessage(`Withdrawal request ${rejectModalId} rejected. Funds returned to ${target?.memberName || 'user'}'s wallet balance.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
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
              <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest">Withdrawal Action Completed</p>
              <p className="text-white text-xs font-bold mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Withdrawal Header */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00C2B8] via-emerald-400 to-[#00C2B8]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00C2B8]/10 border border-[#00C2B8]/30 text-[#00C2B8] text-xs font-mono font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00C2B8]" />
            <span>WITHDRAWAL APPROVAL QUEUE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Member Withdrawal Management & IMPS Disbursal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Review user withdrawal requests generated from referral earnings. Approve to dispatch instant IMPS bank payouts or decline to refund balance to user wallet. Minimum withdrawal limit is ₹500.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <div className="bg-slate-900/90 backdrop-blur-md border border-[#00C2B8]/30 px-5 py-4 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#00C2B8]/20 text-[#00C2B8] flex items-center justify-center font-black text-xl border border-[#00C2B8]/40">
              ₹500
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Minimum Limit</p>
              <p className="text-sm font-black text-white">Enforced Per Request</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pendingRequests.length} Requests</p>
          <p className="text-[11px] font-semibold text-amber-600 mt-2">Requires Admin Verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Approved & Paid</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalApprovedAmount.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-2">Disbursed via Bank IMPS</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Requests Tracked</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{(withdrawals || []).length} Records</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-2">Complete Audit Stream</p>
        </div>
      </div>

      {/* Main Table & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
              <span>Withdrawal Requests Queue</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verify member banking information and approve IMPS payout processing.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search member, ID, or bank..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'Pending', 'Approved', 'Rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st 
                      ? 'bg-white text-slate-900 shadow-xs font-extrabold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
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
                <th className="px-6 py-4 whitespace-nowrap">Request ID & Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Member Details</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount (INR)</th>
                <th className="px-6 py-4 whitespace-nowrap">Payout Method & Account Details</th>
                <th className="px-6 py-4 whitespace-nowrap">Audit Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No withdrawal requests matched your filter. Submitted user withdrawal requests will appear here.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{w.id}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{w.requestDate}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{w.memberName}</div>
                      <div className="text-[11px] font-mono text-blue-600 font-bold">{w.memberId}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-black text-emerald-600 text-sm">
                        ₹{w.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Min Limit Verified</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{w.payoutMethod}</div>
                      {w.upiId ? (
                        <div className="text-[11px] font-mono text-purple-600 font-bold">UPI: {w.upiId}</div>
                      ) : (
                        <div className="text-[11px] font-mono text-slate-600 font-semibold">
                          A/C: {w.bankAccount} {w.ifscCode ? `| IFSC: ${w.ifscCode}` : ''}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {w.status === 'Approved' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Paid</span>
                        </span>
                      )}
                      {w.status === 'Pending' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {w.status === 'Rejected' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected & Refunded</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {w.status === 'Pending' ? (
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(w.id, w.memberName, w.amount)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve IMPS</span>
                          </button>
                          <button
                            onClick={() => setRejectModalId(w.id)}
                            className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer active:scale-95 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Reviewed ({w.processedDate || 'Done'})</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal Confirmation */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Decline Withdrawal Request</span>
              </h3>
              <button onClick={() => setRejectModalId(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Rejecting this request will immediately refund the withdrawal amount back to the user&apos;s withdrawable wallet balance.
            </p>

            <div>
              <label className="block text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
                Rejection Reason (Provided to User)
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
              >
                Confirm Rejection & Refund Wallet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
