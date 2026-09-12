'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  CreditCard,
  Building2,
  Sparkles,
  QrCode,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export type PaymentStatus = 
  | 'processing' 
  | 'success' 
  | 'failed' 
  | 'cancelled' 
  | 'invoice' 
  | 'transaction-details';

interface Props {
  status?: PaymentStatus;
}

export const PaymentStatesPage: React.FC<Props> = ({ status = 'success' }) => {
  const { setCurrentView, user } = useApp();
  const [activeStatus, setActiveStatus] = useState<PaymentStatus>(status);

  const mockTransaction = {
    txnId: 'TXN-9948201',
    utr: 'UTR-2026-8840192',
    amount: 10000,
    memberId: user?.memberId || 'MB-1002',
    memberName: user?.fullName || 'Rajesh Kumar',
    date: '11 Sep 2026, 10:18 AM IST',
    paymentMethod: 'UPI (Manual UTR Verification)',
    groupAllocated: 'GROUP-003 (Batch A)',
    slotSeated: 'Slot #42',
    status: 'Verified & Bank Locked',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Status Switcher Tabs for Verification */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold font-mono">
          {(['processing', 'success', 'failed', 'cancelled', 'invoice', 'transaction-details'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeStatus === s ? 'bg-[#0B1E39] text-amber-300 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CARD 1: PAYMENT PROCESSING GATEWAY */}
        {activeStatus === 'processing' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400"></div>

            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-widest">
                VERIFYING BANK TRANSACTION
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E39]">Processing ₹10,000 Scheme Deposit</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                Communicating with UPI banking gateway. Please do not close or refresh this browser window while we seat your slot.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="text-blue-600">TXN-9948201</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit Amount:</span>
                <span className="text-emerald-700 font-black">₹10,000.00</span>
              </div>
            </div>

            <button
              onClick={() => setActiveStatus('success')}
              className="bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3 px-6 rounded-xl shadow-lg cursor-pointer"
            >
              Simulate Gateway Confirmation
            </button>
          </div>
        )}

        {/* CARD 2: PAYMENT SUCCESS RECEIPT */}
        {activeStatus === 'success' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600"></div>

            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DEPOSIT VERIFIED & BANK LOCKED</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E39]">Deposit Payment Successful!</h1>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                Your ₹10,000 deposit has been confirmed. You are now seated in <span className="font-bold text-slate-900">Slot #42 of GROUP-003</span> for the 50-day daily 1g gold draw cycle.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-medium">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{mockTransaction.txnId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-medium">
                <span className="text-slate-500">Bank UTR Reference:</span>
                <span className="font-mono font-bold text-blue-600">{mockTransaction.utr}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-medium">
                <span className="text-slate-500">Seated Group & Slot:</span>
                <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {mockTransaction.groupAllocated} &bull; {mockTransaction.slotSeated}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-700">Total Amount Paid:</span>
                <span className="text-base font-black text-emerald-700">₹10,000.00</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('user-my-group')}
                className="w-full sm:flex-1 bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-6 rounded-xl shadow-lg cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>View My 50-Member Group Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveStatus('invoice')}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3.5 px-5 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>
        )}

        {/* CARD 3: PAYMENT FAILED */}
        {activeStatus === 'failed' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 to-red-600"></div>

            <div className="w-20 h-20 rounded-full bg-rose-50 border-4 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="w-10 h-10 text-rose-600" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black bg-rose-50 text-rose-800 border border-rose-200 px-3.5 py-1 rounded-full uppercase tracking-widest">
                TRANSACTION FAILED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E39]">Deposit Payment Unsuccessful</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                Your bank or UPI gateway declined the transaction. If funds were debited, they will be automatically refunded by your issuing bank within 2–3 business days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('user-deposit-overview')}
                className="w-full sm:w-auto bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-7 rounded-xl shadow-lg cursor-pointer flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Payment Again</span>
              </button>
              <button
                onClick={() => setCurrentView('support-home')}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3.5 px-5 rounded-xl border border-slate-200 cursor-pointer"
              >
                Contact Support Desk
              </button>
            </div>
          </div>
        )}

        {/* CARD 4: TAX INVOICE RECEIPT */}
        {(activeStatus === 'invoice' || activeStatus === 'transaction-details') && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-xl font-black text-[#0B1E39] font-mono">GILDEMPIRE TAX INVOICE</h2>
                <p className="text-xs text-slate-500 font-medium">Invoice #{mockTransaction.txnId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.print()} 
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs font-medium">
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Billed To Member:</p>
                <p className="font-bold text-slate-900 mt-1">{mockTransaction.memberName}</p>
                <p className="text-slate-500 font-mono">{mockTransaction.memberId}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Issued By:</p>
                <p className="font-bold text-slate-900 mt-1">InfinityGram Sovereign Platform</p>
                <p className="text-slate-500">GSTIN: 33AAAAA0000A1Z5</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-y border-slate-200">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                <tr>
                  <td className="py-4 px-4">50-Member Group Gold Scheme Deposit (100% Refundable)</td>
                  <td className="py-4 px-4 text-right">1</td>
                  <td className="py-4 px-4 text-right font-black">₹10,000.00</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2 text-sm font-black text-[#0B1E39]">
              <span>Total Payment Confirmed:</span>
              <span className="text-emerald-600 text-lg">₹10,000.00</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
