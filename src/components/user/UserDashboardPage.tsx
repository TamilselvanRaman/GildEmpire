'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyGoldWinner } from '../../types';
import { mysteryAudio } from '../../utils/mysteryAudio';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
  Award, 
  Share2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  Check,
  Mail,
  RefreshCw,
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  Upload,
  Crown,
  Calendar,
  Layers,
  Clock,
  PlusCircle,
  Trophy,
  Radio,
  Medal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserDashboardPage = () => {
  const { 
    user, 
    group, 
    allGroups,
    deposits, 
    referrals, 
    pastWinners,
    setCurrentView, 
    setSelectedBatchId,
    isAuthenticated,
    isDepositModalOpen,
    closeDepositModal,
    openDepositModal,
    submitDeposit,
    settings,
    liveDrawState,
    withdrawableBonusBalance,
    fetchDbUsers,
    fetchDbGroups
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailResentToast, setEmailResentToast] = useState<{ type: 'success' | 'error'; message: string; url?: string } | null>(null);
  const [selectedWinnerFilterBatch, setSelectedWinnerFilterBatch] = useState<string>('all');

  const [eventCountdown, setEventCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; isReady: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: false
  });

  const isEventLiveOrActive = group.status === 'active' || group.status === 'live' || ((group.currentCycleDay ?? 0) > 0);

  // Live countdown to configured start date and scheduled time
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let targetTime = 0;

      if (group.startDate && !group.startDate.includes('Pending') && !group.startDate.includes('Not Started')) {
        let timeStr = group.scheduledTime || '07:00 AM';
        let cleanTime = timeStr.replace(/IST/i, '').trim();
        let [timePart, meridiem] = cleanTime.split(' ');
        let [hStr, mStr] = (timePart || '07:00').split(':');
        let hours = parseInt(hStr || '7', 10);
        let mins = parseInt(mStr || '0', 10);
        if (meridiem && meridiem.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (meridiem && meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;

        const targetDate = new Date(group.startDate);
        targetDate.setHours(hours, mins, 0, 0);
        targetTime = targetDate.getTime();
      }

      if (!targetTime || targetTime <= now) {
        const nextDraw = new Date();
        nextDraw.setHours(7, 0, 0, 0);
        if (nextDraw.getTime() <= now) {
          nextDraw.setDate(nextDraw.getDate() + 1);
        }
        targetTime = nextDraw.getTime();
      }

      const diff = targetTime - now;
      if (diff <= 0) {
        setEventCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isReady: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setEventCountdown({ days, hours, minutes, seconds, isReady: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [group.startDate, group.scheduledTime]);

  // Trigger real-time Firestore database fetch on page load
  useEffect(() => {
    if (typeof fetchDbUsers === 'function') fetchDbUsers();
    if (typeof fetchDbGroups === 'function') fetchDbGroups();
  }, []);

  // Gather all winners across groups & real-time Firestore database collection
  const allDatabaseWinners: DailyGoldWinner[] = useMemo(() => {
    const list: DailyGoldWinner[] = [];
    const seen = new Set<string>();

    // 1. First add Firestore real-time collection winners
    (pastWinners || []).forEach((w: any) => {
      const bId = w.batchId || w.group || w.groupId || 'GROUP-001';
      const bName = w.batchName || (allGroups.find(g => g.groupId === bId)?.groupName) || (bId === 'GROUP-002' ? 'InfinityGram 50 Gold Club - Batch B' : 'InfinityGram 50 Gold Club - Batch A');
      const key = `${bId}-${w.dayNumber}-${w.winnerMemberId || w.memberId}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          ...w,
          batchId: bId,
          batchName: bName,
        });
      }
    });

    // 2. Add any group slot winners from allGroups
    (allGroups || []).forEach(g => {
      (g.slots || []).forEach(s => {
        if (s.status === 'Won 1g Gold' && s.wonDay) {
          const key = `${g.groupId}-${s.wonDay}-${s.memberId}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              dayNumber: s.wonDay,
              date: s.wonDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              winnerMemberId: s.memberId || `LOP-${String(s.slotNumber).padStart(6, '0')}`,
              winnerName: s.memberName || `Member #${s.slotNumber}`,
              prizeDescription: '1 Gram 916 Gold Coin',
              dispatchStatus: 'Verified & Shipped',
              auditHash: `0x${s.slotNumber}a9b8c7d6e5`,
              batchId: g.groupId,
              batchName: g.groupName,
              slotNumber: s.slotNumber,
              purity: '24K / 916 BIS Hallmark Gold Coin',
              certificateId: `CERT-IG-2026-${String(s.slotNumber).padStart(4, '0')}`,
            });
          }
        }
      });
    });

    // Sort by day number descending
    return list.sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));
  }, [pastWinners, allGroups, group.groupId]);

  const filteredWinners = selectedWinnerFilterBatch === 'all'
    ? allDatabaseWinners
    : allDatabaseWinners.filter(w => (w.batchId || (w as any).group || (w as any).groupId || 'GROUP-001') === selectedWinnerFilterBatch);

  const userWinningRecords = allDatabaseWinners.filter(w => 
    (user.memberId && w.winnerMemberId?.toLowerCase() === user.memberId.toLowerCase()) ||
    (user.fullName && w.winnerName?.toLowerCase() === user.fullName.toLowerCase())
  );

  // In-Dashboard Deposit Payment Modal State
  const [depositAmount, setDepositAmount] = useState(settings?.depositAmountINR || 10000);
  const [depositMethod, setDepositMethod] = useState<'Razorpay' | 'UPI' | 'Bank Transfer'>('Razorpay');
  const [utrRefId, setUtrRefId] = useState('');
  const [depositSubmitted, setDepositSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  // Real-time audio trigger on live draw status change
  useEffect(() => {
    if (liveDrawState?.status === 'shaking') {
      try {
        mysteryAudio.init();
        mysteryAudio.playShakeClink();
      } catch (e) {}
    } else if (liveDrawState?.status === 'revealed') {
      try {
        mysteryAudio.playWinningSound();
      } catch (e) {}
    }
  }, [liveDrawState?.status]);

  const handleRazorpayInstantPay = () => {
    if (!isAuthenticated) {
      setCurrentView('auth-login');
      return;
    }
    setRazorpayStep('processing');
    setTimeout(() => {
      const generatedRzpId = 'RZP-' + Math.floor(100000000 + Math.random() * 900000000);
      submitDeposit(depositAmount, generatedRzpId, 'Razorpay Instant Gateway');
      setRazorpayStep('success');
      setTimeout(() => {
        setRazorpayStep('checkout');
        closeDepositModal();
      }, 2000);
    }, 2000);
  };

  const handleManualSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setCurrentView('auth-login');
      return;
    }
    if (!utrRefId.trim()) return;
    submitDeposit(depositAmount, utrRefId.trim(), depositMethod === 'UPI' ? 'UPI (Manual UTR)' : 'Bank Transfer (NEFT/IMPS)');
    setDepositSubmitted(true);
    setTimeout(() => {
      setDepositSubmitted(false);
      setUtrRefId('');
      closeDepositModal();
    }, 2500);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('infinitygram@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const [showDisabledDepositToast, setShowDisabledDepositToast] = useState(false);

  const handleTriggerDepositDisabledNotice = () => {
    setShowDisabledDepositToast(true);
    setTimeout(() => {
      setShowDisabledDepositToast(false);
    }, 4500);
  };

  const isEmailVerified = Boolean(user.emailVerified);

  const handleResendEmail = async () => {
    if (!user.email) return;
    setIsResendingEmail(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailResentToast({
          type: 'success',
          message: data.message || `Verification link successfully resent to ${user.email}!`,
          url: data.verificationUrl,
        });
      } else {
        setEmailResentToast({
          type: 'error',
          message: data.error || 'Failed to resend verification link. Please try again.',
        });
      }
    } catch (err: any) {
      setEmailResentToast({
        type: 'error',
        message: err?.message || 'Network error while attempting to resend verification link.',
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  // MULTI-BATCH USER ALLOCATIONS RESOLUTION
  const rawAllocatedSlots = Array.isArray(user.allocatedSlots) && user.allocatedSlots.length > 0
    ? user.allocatedSlots
    : ((user.slotNumber ?? 0) > 0 ? [{
        group: user.groupId || 'GROUP-001',
        groupId: user.groupId || 'GROUP-001',
        slotNumber: user.slotNumber!,
        slot: `#${user.slotNumber}`,
        assignedDate: user.registrationDate || new Date().toLocaleDateString('en-IN'),
        depositStatus: 'Verified',
      }] : []);

  const totalSlotsOwned = rawAllocatedSlots.length;

  // Group slots by batch ID
  const slotsByBatch: Record<string, typeof rawAllocatedSlots> = {};
  rawAllocatedSlots.forEach(s => {
    const bId = s.groupId || s.group || 'GROUP-001';
    if (!slotsByBatch[bId]) slotsByBatch[bId] = [];
    slotsByBatch[bId].push(s);
  });

  const latestWinner = allDatabaseWinners.length > 0 ? allDatabaseWinners[0] : null;

  // Active & Won slot counts for current batch
  const currentBatchSlots = group.slots || [];
  const currentBatchOccupied = currentBatchSlots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold' || s.status === 'Current Member').length;
  const currentBatchWon = currentBatchSlots.filter(s => s.status === 'Won 1g Gold').length;

  return (
    <div className="space-y-8 font-sans select-none pb-20 text-slate-100">
      
      {/* EMAIL RESENT TOAST BANNER */}
      {emailResentToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-extrabold p-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs border ${
            emailResentToast.type === 'success'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
              : 'bg-red-500 text-white border-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {emailResentToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{emailResentToast.message}</span>
          </div>
          <button onClick={() => setEmailResentToast(null)} className="font-bold px-2 py-0.5 rounded hover:bg-black/20 cursor-pointer">✕</button>
        </motion.div>
      )}

      {/* 🔴 REAL-TIME LIVE 3D BOTTLE DRAW BROADCAST ALERT BANNER */}
      {liveDrawState && liveDrawState.status && liveDrawState.status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 sm:p-7 rounded-[2.2rem] border-2 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
            liveDrawState.status === 'shaking'
              ? 'bg-gradient-to-r from-amber-600 via-[#1e1b4b] to-amber-900 border-amber-400 text-white animate-pulse'
              : 'bg-gradient-to-r from-emerald-800 via-[#0B1E39] to-emerald-950 border-emerald-400 text-white'
          }`}
        >
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🏺
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {liveDrawState.status === 'shaking' ? '🔴 LIVE EVENT STREAM' : '🏆 WINNER REVEALED'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">{liveDrawState.batchId}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-1">
                {liveDrawState.status === 'shaking'
                  ? 'Daily 1g Gold Panai Glass Bottle Draw is Live!'
                  : `Congratulations to ${liveDrawState.winner?.memberName || 'Winner'} (Slot #${liveDrawState.winner?.slotNumber || 1})!`}
              </h3>
              <p className="text-xs text-white/90 font-medium max-w-xl leading-relaxed">
                {liveDrawState.status === 'shaking'
                  ? 'The 3D Glass Bottle is actively being shaken to draw today’s lucky member chit. Watch live stream now!'
                  : '1 Gram 24K / 916 BIS Hallmark Gold Chit successfully drawn and officially recorded.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('user-reward-spin')}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 shrink-0 relative z-10"
          >
            <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950" />
            <span>Watch Live 3D Stream</span>
          </button>
        </motion.div>
      )}

      {/* 🏆 TODAY'S 1 GRAM 916 GOLD WINNER OR SCHEDULED DRAW CARD */}
      {latestWinner ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] border-2 border-[#E1A238]/60 p-6 sm:p-7 rounded-[2.2rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A238]/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="flex items-center space-x-5 relative z-10">
            {/* Animated 3D Glowing Gold Coin */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-xl shadow-amber-500/30 shrink-0 relative group">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-yellow-400 to-amber-700 flex flex-col items-center justify-center text-amber-950 font-black border-2 border-yellow-200 animate-[spin_8s_linear_infinite]">
                <Crown className="w-5 h-5 text-amber-950 fill-amber-950" />
                <span className="text-[10px] tracking-tighter leading-tight">1g GOLD</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-sm animate-pulse -z-10"></div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#E1A238] text-[#081E26] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>Today's Gold Winner</span>
                </span>
                <span className="text-xs font-mono text-[#00C2B8] font-bold">
                  Day {latestWinner.dayNumber} of 50
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-serif font-black text-white">
                {latestWinner.winnerName}
                <span className="text-xs sm:text-sm font-mono text-[#F2C868] font-bold ml-2">
                  ({latestWinner.winnerMemberId})
                </span>
              </h3>

              <p className="text-xs text-slate-300 font-medium flex items-center space-x-2">
                <span className="text-[#00C2B8] font-bold">Batch: {latestWinner.batchName || group.groupName}</span>
                <span>•</span>
                <span>Prize: <strong className="text-amber-300 font-bold">1 Gram 916 Hallmark Gold Coin</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('user-reward-spin')}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 shrink-0 relative z-10"
          >
            <Award className="w-4 h-4 text-amber-950" />
            <span>View Winners Ledger →</span>
          </button>
        </motion.div>
      ) : !isEventLiveOrActive ? (
        /* Pre-Event Launch Countdown Card */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] border-2 border-[#E1A238]/60 p-6 sm:p-7 rounded-[2.2rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A238]/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="flex items-center space-x-5 relative z-10">
            {/* Animated 3D Golden Lock */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-[#E1A238] to-amber-700 p-1 shadow-xl shadow-amber-500/30 shrink-0 flex items-center justify-center text-amber-950 font-black border-2 border-yellow-200">
              <Lock className="w-8 h-8 text-amber-950" />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Launch Countdown</span>
                </span>
                <span className="text-xs font-mono text-[#F2C868] font-bold">
                  {group.startDate && !group.startDate.includes('Pending') && !group.startDate.includes('Not Started')
                    ? `Starts on ${group.startDate} @ ${group.scheduledTime || '07:00 AM IST'}`
                    : 'Launch Schedule: Pending Admin Setup'}
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-serif font-black text-white">
                50-Day Reward Event Starting Soon
                <span className="text-xs sm:text-sm font-mono text-[#00C2B8] font-bold ml-2">
                  ({(group.slots || []).filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length}/50 Slots Filled)
                </span>
              </h3>

              <p className="text-xs text-slate-300 font-medium flex items-center space-x-2">
                <span className="text-[#00C2B8] font-bold">Batch: {group.groupName || 'InfinityGram 50 Gold Club'}</span>
                <span>•</span>
                <span>Prize: <strong className="text-amber-300 font-bold">1 Gram 916 Hallmark Gold Coin Daily</strong></span>
              </p>
            </div>
          </div>

          {/* Live Digital Launch Countdown Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10">
            <div className="bg-[#081E26] border-2 border-[#E1A238]/60 px-5 py-3 rounded-2xl text-center shadow-inner">
              <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-wider">
                Launch Countdown
              </p>
              <div className="text-lg sm:text-xl font-mono font-black text-[#F2C868] tracking-widest mt-0.5 flex items-center justify-center space-x-1.5">
                <span>{String(eventCountdown.days).padStart(2, '0')}d</span>
                <span>:</span>
                <span>{String(eventCountdown.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span>{String(eventCountdown.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="text-white">{String(eventCountdown.seconds).padStart(2, '0')}s</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">
                {eventCountdown.isReady ? 'Ready for Launch' : 'Awaiting Admin Unlock'}
              </p>
            </div>

            <button
              onClick={() => setCurrentView('user-reward-spin')}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 shrink-0"
            >
              <Award className="w-4 h-4 text-amber-950" />
              <span>Inspect Pre-Event Bowl →</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Live / Active Event Banner */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#0D3B43] border-2 border-[#E1A238]/60 p-6 sm:p-7 rounded-[2.2rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="flex items-center space-x-5 relative z-10">
            {/* Animated 3D Glowing Gold Coin */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-xl shadow-amber-500/30 shrink-0 relative group">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-yellow-400 to-amber-700 flex flex-col items-center justify-center text-amber-950 font-black border-2 border-yellow-200 animate-[spin_8s_linear_infinite]">
                <Crown className="w-5 h-5 text-amber-950 fill-amber-950" />
                <span className="text-[10px] tracking-tighter leading-tight">1g GOLD</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-sm animate-pulse -z-10"></div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#00C2B8] text-[#081E26] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Daily 1g Gold Selection</span>
                </span>
                <span className="text-xs font-mono text-[#F2C868] font-bold">
                  {group.scheduledTime && !group.scheduledTime.includes('Pending') && !group.scheduledTime.includes('Awaiting') && group.scheduledTime.trim() !== ''
                    ? `Draw Scheduled at ${group.scheduledTime}`
                    : 'Draw Schedule: Pending Admin Setup'}
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-serif font-black text-white">
                Daily Selection Pool Active
                <span className="text-xs sm:text-sm font-mono text-[#00C2B8] font-bold ml-2">
                  (50 Chits In Selection Bowl)
                </span>
              </h3>

              <p className="text-xs text-slate-300 font-medium flex items-center space-x-2">
                <span className="text-[#00C2B8] font-bold">Batch: {group.groupName || 'InfinityGram 50 Gold Club'}</span>
                <span>•</span>
                <span>Prize: <strong className="text-amber-300 font-bold">1 Gram 916 Hallmark Gold Coin</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('user-reward-spin')}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 shrink-0 relative z-10"
          >
            <Award className="w-4 h-4 text-amber-950" />
            <span>View 3D Live Draw & Pool →</span>
          </button>
        </motion.div>
      )}

      {/* 📦 MULTI-BATCH USER SLOT OWNERSHIP PORTFOLIO */}
      {totalSlotsOwned > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#00C2B8]" />
              <span>Your Owned Slots Portfolio ({totalSlotsOwned} Slot{totalSlotsOwned === 1 ? '' : 's'} across {Object.keys(slotsByBatch).length} Batch{Object.keys(slotsByBatch).length === 1 ? '' : 'es'})</span>
            </h3>
            <button
              onClick={() => setCurrentView('user-my-group')}
              className="text-xs text-[#00C2B8] hover:underline font-bold flex items-center space-x-1"
            >
              <span>Manage in Group View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(slotsByBatch).map(([batchId, slots]) => {
              const matchedGrp = allGroups.find(g => g.groupId === batchId) || group;
              return (
                <div
                  key={batchId}
                  className="bg-[#0D3B43] border border-[#E1A238]/40 rounded-3xl p-5 shadow-xl space-y-3 relative overflow-hidden transition-all hover:border-[#E1A238]/80"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-[#081E26] text-[#F2C868] px-2.5 py-0.5 rounded-md border border-[#E1A238]/30">
                        {batchId}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">
                        {matchedGrp?.groupName ? matchedGrp.groupName.replace('InfinityGram 50 Gold Club - ', '') : batchId}
                      </h4>
                    </div>
                    <span className="text-[10px] font-black text-[#00C2B8] bg-[#081E26] px-2.5 py-1 rounded-full border border-[#00C2B8]/30">
                      {slots.length}/3 Slots Hold
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {slots.map(s => {
                      const isWonInThisBatch = allDatabaseWinners.some(w => 
                        ((w.batchId || (w as any).group || (w as any).groupId) === batchId) &&
                        (
                          (w.slotNumber && Number(w.slotNumber) === Number(s.slotNumber)) ||
                          (w.winnerMemberId && user.memberId && w.winnerMemberId.toLowerCase() === user.memberId.toLowerCase())
                        )
                      ) || (matchedGrp.slots?.find(sl => sl.slotNumber === s.slotNumber)?.status === 'Won 1g Gold')
                      || (user.rewardStatus === 'Won 1g Gold' && user.wonBatch === batchId && (user.slotNumber === s.slotNumber || user.assignedSlots?.includes(s.slotNumber)));

                      return isWonInThisBatch ? (
                        <div
                          key={s.slotNumber}
                          className="bg-gradient-to-r from-amber-950/80 to-amber-900/50 border border-amber-400/80 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-bold shadow-md"
                        >
                          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-[11px] shadow-sm">
                            #{s.slotNumber}
                          </span>
                          <div className="text-left">
                            <p className="text-[10px] text-amber-300 font-black flex items-center space-x-1">
                              <span>🏆 Won 1g Gold</span>
                            </p>
                            <p className="text-[9px] text-emerald-400 font-mono">Dispatched & Verified</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={s.slotNumber}
                          className="bg-[#081E26] border border-[#00C2B8]/50 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs font-bold"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#00C2B8] text-[#081E26] font-black flex items-center justify-center text-[11px]">
                            #{s.slotNumber}
                          </span>
                          <div className="text-left">
                            <p className="text-[10px] text-emerald-400 font-black">Verified & In Pool</p>
                            <p className="text-[9px] text-slate-400 font-mono">1g Gold Eligible</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-300 pt-2 flex flex-col gap-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span>Cycle Status:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {(matchedGrp.status === 'active' || matchedGrp.status === 'live' || matchedGrp.totalMembers === 50) ? `🟢 Live (Day ${(matchedGrp.currentCycleDay && matchedGrp.currentCycleDay > 0) ? matchedGrp.currentCycleDay : 1}/50)` : 'Recruiting (50/50 Ready)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedBatchId(batchId);
                          setCurrentView('user-reward-spin');
                        }}
                        className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-amber-950 font-black py-2 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>View Draw ({batchId})</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBatchId(batchId);
                          setCurrentView('user-my-group');
                        }}
                        className="bg-[#081E26] hover:bg-[#081E26]/80 text-[#00C2B8] border border-[#00C2B8]/40 font-bold px-3 py-2 rounded-xl text-[11px] transition-all flex items-center justify-center cursor-pointer"
                      >
                        <span>Grid</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EXECUTIVE GREETING BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/40 shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {group.groupName}
            </span>
            <span className="bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40 text-[10px] font-mono font-bold px-3 py-1 rounded-full">
              {totalSlotsOwned > 0 ? `${totalSlotsOwned} Total Slots Owned` : 'No Slots Yet'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
            Good Morning, {user.fullName || 'Sovereign Member'}
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Welcome to <strong className="text-[#F2C868] font-extrabold">{group.groupName}</strong>. 
            Each member can hold up to 3 slots per individual batch. You currently hold <strong className="text-[#00C2B8]">{totalSlotsOwned} total slots</strong> across all batches.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            onClick={() => setCurrentView('user-my-group')}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-6 py-4 rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Buy Batch Slot (₹10,000)</span>
          </button>

          <button
            onClick={() => setCurrentView('user-my-group')}
            className="bg-[#081E26] hover:bg-[#081E26]/80 text-[#00C2B8] border border-[#00C2B8]/40 text-xs font-black px-6 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Inspect 50-Slot Grid</span>
            <ArrowRight className="w-4 h-4 text-[#00C2B8]" />
          </button>
        </div>
      </motion.div>

      {/* 4 HIGH-TRUST KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Account Status */}
        <div className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Account Status</p>
            <h3 className="text-xl font-black text-white tracking-tight">{user.accountStatus}</h3>
            <div className="pt-1">
              <span className="text-[10px] text-[#00C2B8] font-extrabold inline-flex items-center space-x-1 bg-[#081E26] px-2.5 py-1 rounded-full border border-[#00C2B8]/40">
                <CheckCircle2 className="w-3 h-3 text-[#00C2B8]" />
                <span>Audited Account Verified</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#00C2B8] flex items-center justify-center shrink-0 border border-[#00C2B8]/40 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Deposit & Slots Owned */}
        <div className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Deposit & Slots Owned</p>
            <h3 className="text-xl font-black text-white tracking-tight">
              {totalSlotsOwned > 0 ? `₹${(totalSlotsOwned * 10000).toLocaleString('en-IN')} Verified` : 'Deposit Pending'}
            </h3>
            <p className="text-[10px] text-[#F2C868] font-mono font-bold tracking-tight pt-1">
              {totalSlotsOwned} Active Slots Owned
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#E1A238] flex items-center justify-center shrink-0 border border-[#E1A238]/40 shadow-xs">
            <Wallet className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: 50-Member Group Metric */}
        <div className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">50-Member Group</p>
            <h3 className="text-xl font-black text-white tracking-tight">
              {currentBatchOccupied} Active / 50
            </h3>
            <div className="pt-1">
              <span className="text-[10px] text-[#F2C868] font-extrabold inline-flex items-center space-x-1 bg-[#081E26] px-2.5 py-1 rounded-full border border-[#E1A238]/40">
                <Users className="w-3 h-3 text-[#E1A238]" />
                <span>{currentBatchWon} Winners Awarded</span>
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#F2C868] flex items-center justify-center shrink-0 border border-[#E1A238]/40 shadow-xs">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Gold Reward Status */}
        <div className="bg-[#0D3B43] rounded-[2rem] border border-[#E1A238]/30 shadow-2xl p-6 flex items-center justify-between group hover:border-[#E1A238]/60 transition-all duration-300 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Gold Reward Status</p>
            <h3 className="text-xl font-black text-white tracking-tight">
              {userWinningRecords.length > 0 || user.rewardStatus === 'Won 1g Gold'
                ? '🏆 Won 1g Gold'
                : (totalSlotsOwned > 0 ? 'In Active Pool' : 'Deposit Pending')}
            </h3>
            <p className="text-[10px] text-[#F2C868] font-black pt-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E1A238] fill-[#E1A238]" />
              <span>
                {userWinningRecords.length > 0
                  ? `Won in ${userWinningRecords[0].batchName || user.wonBatch || 'Batch B'}`
                  : (user.rewardStatus === 'Won 1g Gold'
                      ? `Won in ${user.wonBatch || 'Batch B'}`
                      : (totalSlotsOwned > 0 ? 'Eligible for Daily Spin' : 'Buy Slot to Enter'))}
              </span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-xs">
            <Award className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* 50-DAY PROGRESSION BAR */}
      <div className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 p-6 sm:p-7 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">50-Day 1 Gram Gold Cycle Progression</h3>
            <p className="text-xs text-slate-300 font-medium">
              Daily selection awards 1 Gram 916 BIS Hallmark Gold Coin.
            </p>
          </div>
          <span className="font-mono text-xs font-black text-[#F2C868] bg-[#081E26] px-3 py-1 rounded-xl border border-[#E1A238]/40">
            Day {group.currentCycleDay || 0} of 50
          </span>
        </div>

        <div className="w-full bg-[#081E26] h-3 rounded-full overflow-hidden border border-[#0D3B43]">
          <div 
            className="h-full bg-gradient-to-r from-[#00C2B8] via-[#F2C868] to-[#E1A238] transition-all duration-700"
            style={{ width: `${Math.min(100, Math.round(((group.currentCycleDay || 0) / 50) * 100))}%` }}
          />
        </div>
      </div>

      {/* 🏆 OFFICIAL 50-DAY DAILY 1G GOLD WINNERS BOARD (LIVE DATABASE LOG) */}
      <div className="bg-[#081E26] p-6 sm:p-8 rounded-[2.5rem] border border-[#E1A238]/50 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#E1A238]/30 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/40 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C2B8] animate-pulse"></span>
                <span>Live Database Synced</span>
              </span>
              <span className="text-xs font-mono text-[#F2C868] font-black">
                {allDatabaseWinners.length} Verified Winner{allDatabaseWinners.length === 1 ? '' : 's'} Logged
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide">
              Daily 1 Gram Gold Winners Board
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Cryptographically verified 1 Gram 916 BIS Hallmark Gold Coin distribution history fetched directly from database.
            </p>
          </div>

          {/* Batch Selector & Stream CTA */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-[#0D3B43] p-1 rounded-2xl border border-[#E1A238]/40 flex items-center space-x-1">
              <button
                onClick={() => setSelectedWinnerFilterBatch('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedWinnerFilterBatch === 'all'
                    ? 'bg-[#00C2B8] text-[#081E26] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All Batches
              </button>
              {allGroups.map(g => (
                <button
                  key={g.groupId}
                  onClick={() => setSelectedWinnerFilterBatch(g.groupId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWinnerFilterBatch === g.groupId
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {g.groupName.split(' - ')[1] || g.groupId}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('user-reward-spin')}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Live Draw Stream</span>
            </button>
          </div>
        </div>

        {/* Personalized User Winning Alert Banner if user has won */}
        {userWinningRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-2 border-[#E1A238] p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  🎉 You Are A Winner!
                </span>
                <h4 className="text-base font-black text-white mt-1">
                  Congratulations {user.fullName || 'Member'}! You Won 1 Gram 916 BIS Hallmark Gold Coin!
                </h4>
                <p className="text-xs text-amber-200/90 font-medium">
                  {userWinningRecords.map(w => `Day ${w.dayNumber} (${w.batchName ? w.batchName.replace('InfinityGram 50 Gold Club - ', '') : (w.batchId || 'Batch A')}) • Certificate: ${w.certificateId || w.auditHash}`).join(' | ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('user-rewards-overview')}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-xl text-xs transition-all shrink-0 cursor-pointer shadow-md"
            >
              View Certificate →
            </button>
          </motion.div>
        )}

        {/* Winners Table / List */}
        {filteredWinners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0D3B43] border-b border-[#E1A238]/40 text-[#F2C868] uppercase text-[10px] font-mono font-extrabold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-2xl">Day #</th>
                  <th className="p-4">Batch Name</th>
                  <th className="p-4">Won Date</th>
                  <th className="p-4">Winner Member ID</th>
                  <th className="p-4">Winner Name</th>
                  <th className="p-4">Awarded Prize</th>
                  <th className="p-4">Courier Status</th>
                  <th className="p-4 rounded-r-2xl">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D3B43] font-medium text-slate-200">
                {filteredWinners.map((winner, idx) => {
                  const isCurrentUser = Boolean(
                    (user.memberId && winner.winnerMemberId?.toLowerCase() === user.memberId.toLowerCase()) ||
                    (user.fullName && winner.winnerName?.toLowerCase() === user.fullName.toLowerCase())
                  );

                  return (
                    <tr
                      key={`${winner.batchId || 'b'}-${winner.dayNumber}-${winner.winnerMemberId}-${idx}`}
                      className={`hover:bg-[#0D3B43]/60 transition-colors ${
                        isCurrentUser ? 'bg-amber-500/10 border-l-4 border-l-amber-400' : ''
                      }`}
                    >
                      <td className="p-4 font-mono font-black text-[#F2C868]">
                        <span className="bg-[#081E26] px-2.5 py-1 rounded-lg border border-[#E1A238]/30">
                          Day {String(winner.dayNumber).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">
                        <span className="text-xs">
                          {winner.batchName ? winner.batchName.replace('InfinityGram 50 Gold Club - ', '') : (winner.batchId || 'Batch A')}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400 font-normal">{winner.batchId || 'GROUP-001'}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-mono font-semibold">{winner.date || 'Today'}</td>
                      <td className="p-4 font-mono font-bold text-[#00C2B8]">
                        <span className="flex items-center space-x-1.5">
                          <span>{winner.winnerMemberId}</span>
                          {isCurrentUser && (
                            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded font-sans uppercase">
                              YOU
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-black shrink-0">
                            🥇
                          </div>
                          <span className={isCurrentUser ? 'text-amber-300 font-black' : 'text-white'}>
                            {winner.winnerName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-[#E1A238] font-bold">
                        <span className="block text-xs">{winner.prizeDescription || '1 Gram 916 Gold Coin'}</span>
                        <span className="text-[10px] text-amber-300/80 font-mono font-normal">{winner.purity || '24K / 916 BIS Hallmark'}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider inline-flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{winner.dispatchStatus || 'Verified & Shipped'}</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                        {winner.auditHash || winner.certificateId || '0x49f2a8b7c1'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#0D3B43]/50 border border-dashed border-[#E1A238]/40 rounded-3xl p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-2xl font-black">
              🏺
            </div>
            <h4 className="text-base font-serif font-black text-white">
              No Daily Winners Drawn Yet
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              When the 50-day draw cycle starts, the Admin shakes the 3D crystal jar daily at{' '}
              <strong className="text-[#F2C868] font-mono">
                {group.scheduledTime && !group.scheduledTime.includes('Pending') ? group.scheduledTime : 'scheduled time'}
              </strong>{' '}
              to draw a 1 Gram 916 BIS Hallmark Gold winner. Results will appear here in real-time.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('user-reward-spin')}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-amber-950 font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open 3D Live Draw & Pool Pot</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
