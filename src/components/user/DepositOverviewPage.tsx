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
  Check,
  Mail,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DepositOverviewPage = () => {
  const { user, deposits, submitDeposit, setCurrentView, settings, isAuthenticated } = useApp();
  const [amount, setAmount] = useState(settings.depositAmountINR || 10000);
  const [refId, setRefId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'Razorpay' | 'UPI' | 'Bank Transfer'>('Razorpay');
  const [submitted, setSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [emailResentToast, setEmailResentToast] = useState(false);

  const slotsOwnedCount = user.slotsOwned || (user.slotNumber ? 1 : 0);
  const maxSlotsAllowed = 3;
  const remainingSlotsToBuy = Math.max(0, maxSlotsAllowed - slotsOwnedCount);

  // Razorpay Checkout Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [rzpSubMethod, setRzpSubMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const handleResendEmail = () => {
    setEmailResentToast(true);
    setTimeout(() => setEmailResentToast(false), 3500);
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setCurrentView('auth-login');
      return;
    }
    if (!refId) return;
    submitDeposit(amount, refId, selectedMethod === 'UPI' ? 'UPI (Manual UTR)' : 'Bank Transfer (NEFT/IMPS)');
    setSubmitted(true);
  };

  const handleRazorpayPay = () => {
    if (!isAuthenticated) {
      setCurrentView('auth-login');
      return;
    }
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
    navigator.clipboard.writeText('infinitygram@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const userVerifiedDeposits = deposits.filter(d => d.status === 'Verified' && d.memberId === user.memberId);
  const userBalance = userVerifiedDeposits.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative z-10 text-white">
      
      {/* Toast Notification for Resend Email */}
      {emailResentToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-500 text-slate-950 font-extrabold p-4 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 text-xs border border-emerald-300"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>Deposit verification email re-sent to <strong className="underline">{user.email}</strong>! Please check your inbox.</span>
          </div>
          <button onClick={() => setEmailResentToast(false)} className="text-slate-950 font-bold px-2 py-0.5 rounded hover:bg-emerald-600/30 cursor-pointer">✕</button>
        </motion.div>
      )}

      {/* EMAIL VERIFICATION & PAYMENT DISPATCH BANNER FOR UNDEPOSITED USERS */}
      {user.depositStatus !== 'Verified' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 p-5 sm:p-7 rounded-[2.2rem] shadow-2xl space-y-4 relative overflow-hidden transition-all duration-500 bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0A192F] border-amber-400/90"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start space-x-3.5 min-w-0 w-full">
              <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner bg-amber-500/20 border-amber-400/50 text-amber-300">
                <Mail className="w-6 h-6 animate-pulse text-amber-300" />
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider bg-amber-400 text-amber-950">
                    EMAIL DISPATCHED & VERIFIED
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold break-all">Recipient: {user.email}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-black text-white leading-tight break-words">
                  Payment Verification Email Dispatched to <span className="text-amber-300 break-all">{user.email}</span>
                </h3>
                
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  An official email containing payment instructions and bank verification link has been dispatched to your verified email (<strong className="text-amber-300 break-all">{user.email}</strong>). Check your inbox to proceed with deposit.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={handleResendEmail}
                className="w-full sm:w-auto bg-[#081E26] hover:bg-[#081E26]/80 text-amber-300 border border-amber-400/40 text-xs font-black px-4 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Resend Email</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3-SLOT MAXIMUM MEMBER POLICY BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#081E26] border border-[#00C2B8]/40 p-5 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00C2B8]/20 text-[#00C2B8] flex items-center justify-center border border-[#00C2B8]/40 font-black shrink-0">
            <Sparkles className="w-5 h-5 text-[#00C2B8]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white flex items-center space-x-2">
              <span>Rule Update: Maximum 3 Slots Per Member in 1 Group</span>
              <span className="text-[10px] bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-2 py-0.5 rounded-full font-mono">ENFORCED</span>
            </h4>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Each member is allowed to purchase up to <strong className="text-[#F2C868]">3 slots max</strong> per 50-member group. You currently own <strong className="text-[#00C2B8]">{slotsOwnedCount} of 3 slots</strong> ({remainingSlotsToBuy > 0 ? `Can purchase ${remainingSlotsToBuy} more slot${remainingSlotsToBuy > 1 ? 's' : ''}` : 'Maximum slot limit reached'}).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 bg-[#0D3B43] px-4 py-2 rounded-xl border border-[#E1A238]/30 font-mono text-xs font-bold text-[#F2C868]">
          <span>Slots Owned:</span>
          <span className="text-[#00C2B8] font-black">{slotsOwnedCount} / 3 Max</span>
        </div>
      </motion.div>

      {/* Executive Dark Sovereign Deposit Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/40 space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E1A238]/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Member Profile & Wallet Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#0D3B43] relative z-10 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-extrabold">
            <span className="text-[#00C2B8] font-black uppercase text-[11px] tracking-wider">Audited Member Portal</span>
            <span>/</span>
            <span className="text-[#F2C868] font-black uppercase text-[11px] tracking-wider">Deposit Module</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Wallet pill */}
            <div 
              onClick={() => setCurrentView('user-wallet')}
              className="bg-[#081E26] hover:bg-[#081E26]/80 border border-[#00C2B8]/40 px-3.5 py-1.5 rounded-full flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-[#00C2B8]" />
              <span className="text-[11px] font-mono font-black text-[#F2C868]">₹{userBalance.toLocaleString('en-IN')}.00</span>
            </div>

            {/* Profile badge */}
            <div 
              onClick={() => setCurrentView('user-settings')}
              className="bg-[#081E26] hover:bg-[#081E26]/80 border border-[#E1A238]/40 px-3 py-1 rounded-full flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <img src={user.avatar} alt={user.fullName} className="w-5 h-5 rounded-full object-cover border border-[#00C2B8]" />
              <span className="text-[11px] font-black text-white">{user.fullName.split(' ')[0]}</span>
              <span className="text-[9px] font-mono text-[#F2C868] font-bold">{user.memberId}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-[#00C2B8]" />
              <span>Verified 50-Member Gold Scheme Deposit Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Membership Deposit & Auto-Reconciliation
            </h1>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Complete your ₹10,000 group deposit to secure your active slot in the 50-member cycle (Up to 3 slots max per member). Instant auto-verification available via Razorpay.
            </p>
          </div>

          {/* Active Slot Status Pill */}
          <div className="bg-[#081E26]/90 backdrop-blur-md border border-[#E1A238]/40 p-5 rounded-2xl shrink-0 space-y-2 w-full sm:w-auto shadow-inner">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-[10px] font-black uppercase text-[#F2C868] tracking-wider">
                {user.slotNumber ? `Assigned Slot #${user.slotNumber}` : 'Unassigned Slot'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                user.depositStatus === 'Verified' 
                  ? 'text-[#00C2B8] bg-[#00C2B8]/20 border-[#00C2B8]/40' 
                  : 'text-[#F2C868] bg-[#E1A238]/20 border-[#E1A238]/40'
              }`}>
                {user.depositStatus === 'Verified' ? 'ACTIVE' : 'PENDING'}
              </span>
            </div>
            <p className="text-xl font-black text-white font-mono">
              {user.depositStatus === 'Verified' ? `₹${(slotsOwnedCount * 10000).toLocaleString('en-IN')} Confirmed` : '₹10,000 Deposit Required'}
            </p>
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
          className={`p-6 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between space-y-5 cursor-pointer ${
            selectedMethod === 'Razorpay'
              ? 'bg-[#0D3B43] text-white border-[#00C2B8] shadow-2xl ring-2 ring-[#00C2B8]/40'
              : 'bg-[#0D3B43]/80 text-slate-200 border-[#E1A238]/30 shadow-md'
          }`}
          onClick={() => setSelectedMethod('Razorpay')}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#00C2B8] text-[#081E26] inline-flex items-center space-x-1 shadow-xs">
                <Zap className="w-3 h-3 fill-current text-[#081E26]" />
                <span>RECOMMENDED (INSTANT)</span>
              </span>
              <h3 className="text-lg font-black text-white mt-2">Razorpay Gateway</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 flex items-center justify-center font-black shadow-md shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-300 leading-relaxed">
            Pay securely via Razorpay using UPI, Credit/Debit Cards, or NetBanking. Instant auto-verification within 5 seconds.
          </p>

          <button
            type="button"
            onClick={handleRazorpayPay}
            className="w-full bg-gradient-to-r from-[#00C2B8] to-[#00A8A0] hover:from-[#00A8A0] hover:to-[#00C2B8] text-[#081E26] text-xs font-black py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-[#081E26] fill-current" />
            <span>Pay ₹10,000 via Razorpay (Instant Slot)</span>
          </button>
        </motion.div>

        {/* Method 2: Direct UPI QR Code / Apps */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={`p-6 rounded-[2.5rem] border transition-all flex flex-col justify-between space-y-5 cursor-pointer ${
            selectedMethod === 'UPI'
              ? 'bg-[#0D3B43] text-white border-[#00C2B8] shadow-2xl ring-2 ring-[#00C2B8]/40'
              : 'bg-[#0D3B43]/80 text-slate-200 border-[#E1A238]/30 shadow-md'
          }`}
          onClick={() => setSelectedMethod('UPI')}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 inline-flex items-center">
                DIRECT UPI UTR
              </span>
              <h3 className="text-lg font-black text-white mt-2">GPay / PhonePe / Paytm</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 flex items-center justify-center font-black shadow-md shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-300 leading-relaxed">
            Transfer ₹10,000 to official VPA <strong className="text-[#00C2B8] font-bold">infinitygram@icici</strong> and enter 12-digit UTR reference.
          </p>

          <div className="flex items-center justify-between text-xs font-mono font-bold pt-2 border-t border-[#081E26] text-slate-300">
            <span className="truncate">VPA: infinitygram@icici</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="text-[#00C2B8] hover:text-white flex items-center space-x-1 shrink-0 font-sans cursor-pointer font-extrabold"
            >
              <Copy className="w-3.5 h-3.5 text-[#00C2B8]" />
              <span>{copiedUpi ? 'Copied!' : 'Copy UPI VPA'}</span>
            </button>
          </div>
        </motion.div>

        {/* Method 3: Bank Transfer (NEFT/IMPS) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`p-6 rounded-[2.5rem] border transition-all flex flex-col justify-between space-y-5 cursor-pointer ${
            selectedMethod === 'Bank Transfer'
              ? 'bg-[#0D3B43] text-white border-[#E1A238] shadow-2xl ring-2 ring-[#E1A238]/40'
              : 'bg-[#0D3B43]/80 text-slate-200 border-[#E1A238]/30 shadow-md'
          }`}
          onClick={() => setSelectedMethod('Bank Transfer')}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40 inline-flex items-center">
                CORPORATE BANKING
              </span>
              <h3 className="text-lg font-black text-white mt-2">Bank NEFT / IMPS</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#081E26] text-[#E1A238] border border-[#E1A238]/40 flex items-center justify-center font-black shadow-md shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs font-medium text-slate-300 leading-relaxed">
            Deposit via HDFC Sovereign Escrow Account. Verification completed by financial audit desk within 2 hours.
          </p>

          <div className="text-[11px] font-mono text-[#F2C868] pt-2 border-t border-[#081E26] flex justify-between font-bold">
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
        className="bg-[#0D3B43] p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#081E26]">
          <div>
            <h2 className="text-lg font-black text-white">Submit Payment Reference for Audit Verification</h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Enter your 12-digit transaction UTR code after transferring ₹10,000 via UPI or Bank IMPS.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-[#081E26] text-[#00C2B8] px-3.5 py-1.5 rounded-full text-xs font-black border border-[#00C2B8]/40 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>Audit Ledger SSL Encrypted</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-[#081E26] border border-[#00C2B8]/40 p-8 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#00C2B8] mx-auto" />
            <h3 className="text-base font-black text-white">Deposit Reference Logged & Submitted</h3>
            <p className="text-xs font-bold text-[#00C2B8] max-w-md mx-auto">
              Your deposit reference <span className="font-mono underline">#{refId}</span> has been dispatched to admin reconciliation desk and assigned to your active slot.
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
                    className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-black text-base pl-9 pr-4 py-4 rounded-2xl focus:outline-none"
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
                    className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-extrabold text-xs px-4 py-4 rounded-2xl focus:outline-none appearance-none shadow-xs cursor-pointer"
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
                  className="w-full bg-[#081E26] border border-[#0D3B43] text-white font-mono font-bold text-xs p-4 rounded-2xl focus:outline-none shadow-xs"
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-slate-400 font-medium">
                * Note: Instant slot auto-allocation active on Razorpay & verified UTR submissions.
              </p>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {selectedMethod === 'Razorpay' && (
                  <button
                    type="button"
                    onClick={handleRazorpayPay}
                    className="flex-1 sm:flex-initial bg-gradient-to-r from-[#00C2B8] to-[#00A8A0] hover:from-[#00A8A0] hover:to-[#00C2B8] text-[#081E26] text-xs font-black px-8 py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <Zap className="w-4 h-4 text-[#081E26] fill-current" />
                    <span>Launch Razorpay Gateway</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial bg-[#00C2B8] hover:bg-[#00a8a0] text-[#081E26] text-xs font-black px-8 py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#081E26]" />
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
        className="bg-[#0D3B43] p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/30 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#081E26]">
          <div>
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#00C2B8]" />
              <span>Deposit Reconciliation Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Historical ledger of your membership deposits and verification timestamps.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081E26] border-b border-[#0D3B43] text-[#F2C868] uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Reference ID / UTR</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4 rounded-r-xl">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#081E26] font-medium">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-[#081E26]/50 transition-colors">
                  <td className="p-4 font-mono font-black text-[#00C2B8]">{dep.referenceId}</td>
                  <td className="p-4 font-mono font-black text-white">₹{dep.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-300 font-semibold">{dep.paymentMethod}</td>
                  <td className="p-4 text-slate-400 font-mono">{dep.transactionDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      dep.status === 'Verified' 
                        ? 'bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40' 
                        : dep.status === 'Pending' 
                          ? 'bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40' 
                          : 'bg-rose-900/30 text-rose-400 border border-rose-700/50'
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
            className="fixed inset-0 bg-[#081E26]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0D3B43] max-w-md w-full rounded-[2.5rem] border border-[#E1A238]/40 shadow-2xl overflow-hidden relative text-white"
            >
              {/* Razorpay Official Top Header Strip */}
              <div className="bg-[#081E26] p-5 border-b border-[#0D3B43] flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00C2B8] text-[#081E26] flex items-center justify-center font-black shadow-lg">
                    <Zap className="w-5 h-5 fill-current text-[#081E26]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
                      <span>Razorpay Secure</span>
                      <span className="text-[8px] bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-2 py-0.5 rounded-full uppercase font-mono font-bold">
                        256-Bit SSL
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">InfinityGram Sovereign Deposit Gateway</p>
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
                    <div className="bg-[#081E26] p-5 rounded-2xl border border-[#00C2B8]/40 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Amount Payable</p>
                        <p className="text-2xl font-black text-white font-mono mt-0.5">₹10,000.00</p>
                      </div>
                      <div className="text-right text-xs font-bold text-slate-300">
                        <p className="text-[#F2C868] font-black">Group Slot #14</p>
                        <p className="text-[10px] text-[#00C2B8] font-extrabold flex items-center justify-end space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8]"></span>
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
                              ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8] shadow-md'
                              : 'bg-[#081E26] text-slate-300 border-[#0D3B43] hover:bg-[#081E26]/80'
                          }`}
                        >
                          UPI App
                        </button>
                        <button
                          type="button"
                          onClick={() => setRzpSubMethod('card')}
                          className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                            rzpSubMethod === 'card'
                              ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8] shadow-md'
                              : 'bg-[#081E26] text-slate-300 border-[#0D3B43] hover:bg-[#081E26]/80'
                          }`}
                        >
                          Credit/Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setRzpSubMethod('netbanking')}
                          className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                            rzpSubMethod === 'netbanking'
                              ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8] shadow-md'
                              : 'bg-[#081E26] text-slate-300 border-[#0D3B43] hover:bg-[#081E26]/80'
                          }`}
                        >
                          NetBanking
                        </button>
                      </div>
                    </div>

                    {/* Method Option Details Panel */}
                    <div className="bg-[#081E26] p-4 rounded-2xl border border-[#0D3B43] text-xs text-slate-300 space-y-3">
                      {rzpSubMethod === 'upi' && (
                        <div className="space-y-2">
                          <p className="font-extrabold text-white">Instant UPI Apps Supported:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-300">
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-[#00C2B8]"></span>
                              <span>Google Pay</span>
                            </div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-[#E1A238]"></span>
                              <span>PhonePe</span>
                            </div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-[#00C2B8]"></span>
                              <span>Paytm UPI</span>
                            </div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-[#F2C868]"></span>
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
                            className="w-full bg-[#0D3B43] border border-[#0D3B43] p-3 rounded-xl text-xs font-mono font-bold text-white"
                            defaultValue="4532 •••• •••• 8901"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="bg-[#0D3B43] border border-[#0D3B43] p-3 rounded-xl text-xs font-mono font-bold text-white"
                              defaultValue="12/28"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              className="bg-[#0D3B43] border border-[#0D3B43] p-3 rounded-xl text-xs font-mono font-bold text-white"
                              defaultValue="892"
                            />
                          </div>
                        </div>
                      )}

                      {rzpSubMethod === 'netbanking' && (
                        <div className="space-y-2">
                          <p className="font-extrabold text-white">Select Popular Bank:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-300">
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#00C2B8] text-[#00C2B8] flex items-center justify-between">
                              <span>HDFC Bank</span>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43]">State Bank of India</div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43]">ICICI Bank</div>
                            <div className="bg-[#0D3B43] p-2.5 rounded-xl border border-[#0D3B43]">Axis Bank</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={executeRazorpaySuccess}
                      className="w-full btn-infinity-cyan font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Proceed to Pay ₹10,000 via Razorpay</span>
                    </button>
                  </div>
                )}

                {razorpayStep === 'processing' && (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 border-4 border-[#00C2B8] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h4 className="text-base font-black text-white">Communicating with Razorpay Gateway...</h4>
                    <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
                      Authorizing 256-bit encrypted banking transaction. Please do not close or refresh this window.
                    </p>
                  </div>
                )}

                {razorpayStep === 'success' && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-black text-white">Payment Successful & Auto-Verified!</h4>
                    <p className="text-xs text-[#00C2B8] font-mono font-black">
                      Razorpay Txn Reference ID: RZP-DEPOSIT-892401
                    </p>
                    <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
                      Your ₹10,000 group deposit has been confirmed and assigned to Royal 50 Gold Club Batch A (Slot #14).
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
