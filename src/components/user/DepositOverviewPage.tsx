'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  CreditCard,
  QrCode,
  Building2,
  Sparkles,
  Zap,
  Lock,
  X,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DepositOverviewPage = () => {
  const { user, deposits, submitDeposit, setCurrentView } = useApp();
  const [amount, setAmount] = useState(5000);
  const [refId, setRefId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'Razorpay' | 'UPI' | 'Bank Transfer'>('Razorpay');
  const [submitted, setSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // Razorpay Checkout Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [rzpSubMethod, setRzpSubMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId) return;
    submitDeposit(amount, refId, selectedMethod === 'UPI' ? 'UPI (Manual UTR)' : 'Bank Transfer (NEFT/IMPS)');
    setSubmitted(true);
  };

  const handleRazorpayPay = () => {
    setShowRazorpayModal(true);
    setRazorpayStep('checkout');
  };

  const executeRazorpaySuccess = () => {
    setRazorpayStep('processing');
    setTimeout(() => {
      const generatedRzpId = 'RZP-' + Math.floor(100000000 + Math.random() * 900000000);
      submitDeposit(amount, generatedRzpId, 'Razorpay Instant Gateway');
      setRazorpayStep('success');
      setTimeout(() => {
        setShowRazorpayModal(false);
        setRazorpayStep('checkout');
      }, 2500);
    }, 2000);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('gildempire@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative z-10">
      
      {/* Executive Dark Sovereign Deposit Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Member Profile & Wallet Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-extrabold">
            <span className="text-blue-400 font-black uppercase text-[11px] tracking-wider">Audited Member Portal</span>
            <span>/</span>
            <span className="text-amber-400 font-black uppercase text-[11px] tracking-wider">Deposit Module</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Wallet pill */}
            <div 
              onClick={() => setCurrentView('user-wallet')}
              className="bg-[#102747] hover:bg-[#15325b] border border-[#1A3860] px-3.5 py-1.5 rounded-full flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-mono font-black text-amber-300">₹3,500.00</span>
            </div>

            {/* Profile badge */}
            <div 
              onClick={() => setCurrentView('user-settings')}
              className="bg-[#102747] hover:bg-[#15325b] border border-[#1A3860] px-3 py-1 rounded-full flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <img src={user.avatar} alt={user.fullName} className="w-5 h-5 rounded-full object-cover border border-blue-400" />
              <span className="text-[11px] font-black text-white">{user.fullName.split(' ')[0]}</span>
              <span className="text-[9px] font-mono text-amber-400 font-bold">{user.memberId}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified 50-Member Gold Scheme Deposit Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Membership Deposit & Auto-Reconciliation
            </h1>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Complete your single ₹5,000 group deposit to secure your active slot in the 50-member cycle. Instant auto-verification available via Razorpay.
            </p>
          </div>

          {/* Active Slot Status Pill */}
          <div className="bg-[#102747]/90 backdrop-blur-md border border-[#1A3860] p-5 rounded-2xl shrink-0 space-y-2 w-full sm:w-auto">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Assigned Slot #14</span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xl font-black text-white font-mono">₹5,000 Deposit Confirmed</p>
            <p className="text-[11px] text-slate-300 font-bold">Royal 50 Gold Club Batch A</p>
          </div>
        </div>
      </motion.div>

      {/* Featured Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Method 1: Razorpay Instant (Featured Corporate Option) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => setSelectedMethod('Razorpay')}
          className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-5 ${
            selectedMethod === 'Razorpay'
              ? 'bg-blue-50/70 text-[#0B1E39] border-[#0066FF] shadow-xl ring-2 ring-[#0066FF]/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#0066FF] text-white inline-flex items-center space-x-1 shadow-xs">
                <Zap className="w-3 h-3 fill-current" />
                <span>RECOMMENDED (INSTANT)</span>
              </span>
              <h3 className="text-lg font-black text-[#0B1E39] mt-2">Razorpay Gateway</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center font-black shadow-md shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Pay securely via Razorpay using UPI, Credit/Debit Cards, or NetBanking. Instant auto-verification within 5 seconds.
          </p>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedMethod('Razorpay'); handleRazorpayPay(); }}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-black py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Pay ₹5,000 via Razorpay</span>
          </button>
        </motion.div>

        {/* Method 2: Direct UPI QR Code / Apps */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onClick={() => setSelectedMethod('UPI')}
          className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
            selectedMethod === 'UPI'
              ? 'bg-emerald-50/70 text-[#0B1E39] border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                DIRECT UPI UTR
              </span>
              <h3 className="text-lg font-black text-[#0B1E39] mt-2">GPay / PhonePe / Paytm</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Transfer ₹5,000 to official VPA <strong className="text-emerald-700 font-bold">gildempire@icici</strong> and enter 12-digit UTR reference.
          </p>

          <div className="flex items-center justify-between text-xs font-mono font-bold pt-2 border-t border-slate-200/60 text-slate-700">
            <span className="truncate">VPA: gildempire@icici</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="text-[#2F6FED] hover:text-blue-800 flex items-center space-x-1 shrink-0 cursor-pointer font-sans"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </motion.div>

        {/* Method 3: Bank Transfer (NEFT/IMPS) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => setSelectedMethod('Bank Transfer')}
          className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
            selectedMethod === 'Bank Transfer'
              ? 'bg-amber-50/70 text-[#0B1E39] border-amber-500 shadow-xl ring-2 ring-amber-500/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center">
                CORPORATE BANKING
              </span>
              <h3 className="text-lg font-black text-[#0B1E39] mt-2">Bank NEFT / IMPS</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Deposit via HDFC Sovereign Escrow Account. Verification completed by financial audit desk within 2 hours.
          </p>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60 flex justify-between font-bold">
            <span>A/C: 918234120938</span>
            <span>IFSC: HDFC0001234</span>
          </div>
        </motion.div>

      </div>

      {/* Manual Deposit Reference Submission Form */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-[#0B1E39]">Submit Payment Reference for Audit Verification</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enter your 12-digit transaction UTR code after transferring ₹5,000 via UPI or Bank IMPS.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 text-[#2F6FED] px-3.5 py-1.5 rounded-full text-xs font-black border border-blue-100 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>Audit Ledger SSL Encrypted</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-black text-emerald-950">Deposit Reference Logged & Submitted</h3>
            <p className="text-xs font-bold text-emerald-800 max-w-md mx-auto">
              Your deposit reference <span className="font-mono underline">#{refId}</span> has been dispatched to admin reconciliation desk. Status updates to Verified within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitManual} className="space-y-6 text-xs font-medium">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-slate-400 font-extrabold mb-2 uppercase tracking-widest text-[10px]">
                  Deposit Amount (Fixed Cycle Slot)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₹</span>
                  <input
                    type="number"
                    readOnly
                    value={amount}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-black text-base pl-9 pr-4 py-4 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-extrabold mb-2 uppercase tracking-widest text-[10px]">
                  Selected Payment Channel
                </label>
                <div className="relative">
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-[#0B1E39] font-extrabold text-xs px-4 py-4 rounded-2xl focus:outline-none focus:border-[#2F6FED] appearance-none cursor-pointer shadow-xs"
                  >
                    <option value="Razorpay">Razorpay Auto Gateway (Instant Verified)</option>
                    <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-extrabold mb-2 uppercase tracking-widest text-[10px]">
                  Transaction UTR / Reference ID
                </label>
                <input
                  type="text"
                  required
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="e.g. UPI-982341209384 or RZP-901824"
                  className="w-full bg-white border border-slate-200 text-[#0B1E39] font-mono font-bold text-xs p-4 rounded-2xl focus:outline-none focus:border-[#2F6FED] shadow-xs"
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-slate-400 font-medium">
                * Note: If paying via Razorpay, your deposit is auto-verified instantly without waiting.
              </p>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {selectedMethod === 'Razorpay' && (
                  <button
                    type="button"
                    onClick={handleRazorpayPay}
                    className="flex-1 sm:flex-initial bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Launch Razorpay Gateway</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial bg-[#0B1E39] hover:bg-[#142d52] text-white text-xs font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Submit UTR for Reconciliation</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>

      {/* Deposit Audit Logs Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-[#0B1E39] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#2F6FED]" />
              <span>Deposit Reconciliation Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Historical ledger of your membership deposits and verification timestamps.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-400 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Reference ID / UTR</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4 rounded-r-xl">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-black text-[#2F6FED]">{dep.referenceId}</td>
                  <td className="p-4 font-mono font-black text-[#0B1E39]">₹{dep.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-600 font-semibold">{dep.paymentMethod}</td>
                  <td className="p-4 text-slate-500 font-mono">{dep.transactionDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      dep.status === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : dep.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {dep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Razorpay Interactive Payment Gateway Modal */}
      <AnimatePresence>
        {showRazorpayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] border border-slate-200 shadow-[0_25px_60px_-15px_rgba(11,30,57,0.35)] overflow-hidden relative text-[#0B1E39]"
            >
              {/* Razorpay Official Top Header Strip */}
              <div className="bg-[#02042B] p-5 border-b border-[#0C2340] flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-black shadow-lg">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
                      <span>Razorpay Secure</span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase font-mono font-bold">
                        256-Bit SSL
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">GildEmpire Sovereign Deposit Gateway</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                
                {razorpayStep === 'checkout' && (
                  <div className="space-y-5">
                    
                    {/* Amount Payable Box */}
                    <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Amount Payable</p>
                        <p className="text-2xl font-black text-[#0B1E39] font-mono mt-0.5">₹5,000.00</p>
                      </div>
                      <div className="text-right text-xs font-bold text-slate-700">
                        <p className="text-[#0B1E39] font-black">Group Slot #14</p>
                        <p className="text-[10px] text-emerald-600 font-extrabold flex items-center justify-end space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Auto-Verified</span>
                        </p>
                      </div>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="space-y-2.5">
                      <label className="block text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                        Select Payment Method
                      </label>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs font-black">
                        <button
                          type="button"
                          onClick={() => setRzpSubMethod('upi')}
                          className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                            rzpSubMethod === 'upi'
                              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          UPI App
                        </button>
                        <button
                          type="button"
                          onClick={() => setRzpSubMethod('card')}
                          className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                            rzpSubMethod === 'card'
                              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Credit/Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setRzpSubMethod('netbanking')}
                          className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                            rzpSubMethod === 'netbanking'
                              ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          NetBanking
                        </button>
                      </div>
                    </div>

                    {/* Method Option Details Panel */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
                      {rzpSubMethod === 'upi' && (
                        <div className="space-y-2">
                          <p className="font-extrabold text-[#0B1E39]">Instant UPI Apps Supported:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span>Google Pay</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              <span>PhonePe</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                              <span>Paytm UPI</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span>BHIM / Other UPI</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {rzpSubMethod === 'card' && (
                        <div className="space-y-2 font-medium">
                          <input
                            type="text"
                            placeholder="Card Number (4532 •••• •••• 8901)"
                            className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-[#0B1E39]"
                            defaultValue="4532 •••• •••• 8901"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-[#0B1E39]"
                              defaultValue="12/28"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-[#0B1E39]"
                              defaultValue="892"
                            />
                          </div>
                        </div>
                      )}

                      {rzpSubMethod === 'netbanking' && (
                        <div className="space-y-2">
                          <p className="font-extrabold text-[#0B1E39]">Select Popular Bank:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                            <div className="bg-white p-2.5 rounded-xl border border-blue-500 text-[#0066FF] flex items-center justify-between">
                              <span>HDFC Bank</span>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200">State Bank of India</div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200">ICICI Bank</div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200">Axis Bank</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={executeRazorpaySuccess}
                      className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Proceed to Pay ₹5,000 via Razorpay</span>
                    </button>
                  </div>
                )}

                {razorpayStep === 'processing' && (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h4 className="text-base font-black text-[#0B1E39]">Communicating with Razorpay Gateway...</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                      Authorizing 256-bit encrypted banking transaction. Please do not close or refresh this window.
                    </p>
                  </div>
                )}

                {razorpayStep === 'success' && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-black text-[#0B1E39]">Payment Successful & Auto-Verified!</h4>
                    <p className="text-xs text-emerald-700 font-mono font-black">
                      Razorpay Txn Reference ID: RZP-DEPOSIT-892401
                    </p>
                    <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
                      Your ₹5,000 group deposit has been confirmed and assigned to Royal 50 Gold Club Batch A (Slot #14).
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
