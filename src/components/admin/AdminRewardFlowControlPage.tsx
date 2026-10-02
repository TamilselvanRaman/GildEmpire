'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ClockTimePicker } from '../common/ClockTimePicker';
import { DailyGoldWinner } from '../../types';
import { mysteryAudio } from '../../utils/mysteryAudio';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  RotateCw, 
  Mail, 
  Clock, 
  X, 
  ExternalLink,
  Users,
  Dices,
  Play,
  Volume2,
  Calendar,
  BellRing,
  Sliders,
  Check,
  Lock,
  Unlock,
  Grid,
  List,
  CalendarDays,
  Tv,
  UserCheck,
  Search,
  Crown,
  AlertCircle,
  Fingerprint,
  ChevronRight,
  ChevronDown,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Interactive3DBottleCard = dynamic(
  () => import('../mystery-letter/Interactive3DBottleCard').then((mod) => mod.Interactive3DBottleCard),
  { ssr: false }
);

export const AdminRewardFlowControlPage = () => {
  const { 
    group, 
    allGroups,
    fetchDbGroups,
    dbUsers,
    selectedBatchId,
    setSelectedBatchId,
    pastWinners, 
    executeDailySpin, 
    setCurrentView,
    drawLockedUntil,
    resetDrawLock,
    programEvents,
    updateGroupSchedule,
    triggerLiveDraw,
    completeLiveDraw,
    resetLiveDraw,
  } = useApp();
  
  // Draw State
  const [drawState, setDrawState] = useState<'idle' | 'shaking' | 'drawing' | 'revealed'>('idle');
  const [selectedWinner, setSelectedWinner] = useState<DailyGoldWinner | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStartEventModal, setShowStartEventModal] = useState(false);
  const [isStartingEvent, setIsStartingEvent] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list'>('month');

  // Manual Winner of the Day Selection State
  const [manualTargetSlot, setManualTargetSlot] = useState<number | null>(null);
  const [inputTargetMemberId, setInputTargetMemberId] = useState('');
  const [selectionMode, setSelectionMode] = useState<'select' | 'input'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState<'all' | 'real' | 'bots'>('all');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Batch Draw Schedule Configurator State
  const [startDate, setStartDate] = useState(group?.startDate || '');
  const [scheduledTime, setScheduledTime] = useState('07:00');
  const [scheduledAmPm, setScheduledAmPm] = useState<'AM' | 'PM'>('AM');
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const handleConfirmStartEvent = async () => {
    if (!startDate) {
      alert('Please choose an official start date for the 50-day event.');
      return;
    }
    setIsStartingEvent(true);
    try {
      const formattedScheduledTime = `${scheduledTime} ${scheduledAmPm} IST`;
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_event',
          groupId: group.groupId,
          startDate: startDate,
          scheduledTime: formattedScheduledTime,
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowStartEventModal(false);
        alert(`🎉 ${data.message || `Event unlocked and started for ${group.groupId}!`}`);
        if (typeof fetchDbGroups === 'function') await fetchDbGroups();
      } else {
        alert(`Error starting event: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Network error starting event: ${e.message}`);
    } finally {
      setIsStartingEvent(false);
    }
  };

  const hasAdminConfiguredSchedule = Boolean(
    group?.startDate &&
    !group.startDate.includes('Not Started') &&
    !group.startDate.includes('Pending') &&
    !group.startDate.includes('2026-08-14') &&
    group?.scheduledTime &&
    !group.scheduledTime.includes('Awaiting') &&
    !group.scheduledTime.includes('Pending') &&
    group.scheduledTime.trim() !== ''
  );

  // Sync scheduledTime and startDate whenever target group switches or updates
  useEffect(() => {
    if (group) {
      if (group.startDate && !group.startDate.includes('Not Started') && !group.startDate.includes('Pending')) {
        setStartDate(group.startDate);
      } else {
        setStartDate(new Date().toISOString().split('T')[0]);
      }
      const rawTime = group.scheduledTime || '';
      const match = rawTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        setScheduledTime(`${match[1].padStart(2, '0')}:${match[2]}`);
        setScheduledAmPm(match[3].toUpperCase() as 'AM' | 'PM');
      } else {
        setScheduledTime('07:00');
        setScheduledAmPm('AM');
      }
    }
  }, [group?.groupId, group?.scheduledTime, group?.startDate]);

  const activePoolMembers = group.slots.filter(s => s.status !== 'Won 1g Gold');
  const goldWinnerSlots = group.slots.filter(s => s.status === 'Won 1g Gold');
  const wonCount = goldWinnerSlots.length;
  const currentActiveDay = (group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : Math.min(50, Math.max(1, wonCount + 1));
  const batchShortName = group.groupName.split(' - ')[1] || group.groupName;

  // Auto-initialize target slot to first eligible member if none selected
  useEffect(() => {
    if (activePoolMembers.length > 0) {
      if (manualTargetSlot === null || !activePoolMembers.some(s => s.slotNumber === manualTargetSlot)) {
        setManualTargetSlot(activePoolMembers[0].slotNumber);
      }
    } else {
      setManualTargetSlot(null);
    }
  }, [group?.groupId, group?.slots, activePoolMembers.length]);

  const targetWinnerSlotObj = activePoolMembers.find(s => s.slotNumber === manualTargetSlot) || null;

  // Identify bot vs real member from active group slots and dbUsers
  const isBotMember = (m: any) => {
    if (!m) return false;
    const matchedUser = dbUsers?.find((u: any) => 
      (m.memberId && m.memberId !== '—' && u.memberId === m.memberId) ||
      (m.memberName && m.memberName !== '—' && (u.name === m.memberName || u.fullName === m.memberName)) ||
      (u.slotNumber && Number(u.slotNumber) === Number(m.slotNumber) && (u.group || u.groupId || '').toUpperCase() === (group.groupId || '').toUpperCase())
    );
    return (
      matchedUser?.isSimulated === true ||
      matchedUser?.userType === 'simulated' ||
      (matchedUser?.email && (matchedUser.email.endsWith('@infinitygram.net') || matchedUser.email.includes('bot'))) ||
      (m.memberName && (m.memberName.toLowerCase().includes('bot') || m.memberName.includes('(BOT)')))
    );
  };

  const realMembersCount = activePoolMembers.filter(m => !isBotMember(m)).length;
  const botMembersCount = activePoolMembers.filter(m => isBotMember(m)).length;

  // Filtered members for dropdown search and bot/real toggle
  const filteredActiveMembers = activePoolMembers.filter(s => {
    const isBot = isBotMember(s);
    if (memberTypeFilter === 'bots' && !isBot) return false;
    if (memberTypeFilter === 'real' && isBot) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.memberName?.toLowerCase().includes(q) ||
      s.memberId?.toLowerCase().includes(q) ||
      String(s.slotNumber).includes(q)
    );
  });

  const handleManualMemberIdInput = (val: string) => {
    setInputTargetMemberId(val);
    setValidationError(null);
    const clean = val.trim().toLowerCase();
    if (!clean) return;

    const matched = activePoolMembers.find(s => 
      (s.memberId && s.memberId.toLowerCase() === clean) ||
      String(s.slotNumber) === clean ||
      (s.memberName && s.memberName.toLowerCase().includes(clean))
    );

    if (matched) {
      setManualTargetSlot(matched.slotNumber);
      setValidationError(null);
    } else {
      setValidationError(`No active eligible pool member matches "${val}".`);
    }
  };

  // 24-Hour Lock Countdown Calculation
  const [lockCountdown, setLockCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const updateLockTimer = () => {
      if (!drawLockedUntil) {
        setLockCountdown(null);
        return;
      }
      const now = Date.now();
      const diff = drawLockedUntil - now;
      if (diff <= 0) {
        setLockCountdown(null);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setLockCountdown({ hours, minutes, seconds });
      }
    };

    updateLockTimer();
    const timer = setInterval(updateLockTimer, 1000);
    return () => clearInterval(timer);
  }, [drawLockedUntil]);

  const isLocked24h = lockCountdown !== null;

  // Calculate 10-Minute Pre-Event Email Time
  const calculatePreEmailTime = (timeStr: string, ampm: string) => {
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);

    m -= 10;
    if (m < 0) {
      m += 60;
      h -= 1;
      if (h < 1) h = 12;
    }

    const hFormatted = String(h).padStart(2, '0');
    const mFormatted = String(m).padStart(2, '0');
    return `${hFormatted}:${mFormatted} ${ampm}`;
  };

  const preEmailTime = calculatePreEmailTime(scheduledTime, scheduledAmPm);

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailBroadcastResult, setEmailBroadcastResult] = useState<any>(null);

  // Handle Interactive Glass Bottle Draw Trigger
  const handleTriggerGlassBottleDraw = async () => {
    if (isLocked24h || drawState !== 'idle' || activePoolMembers.length === 0) return;

    if (!targetWinnerSlotObj) {
      setValidationError('Please select or enter an active eligible member as the winner before initiating the draw.');
      return;
    }

    setValidationError(null);
    setDrawState('shaking');
    mysteryAudio.playSpin7Seconds();

    const wonCount = goldWinnerSlots.length;
    const currentDay = Math.min(50, Math.max(1, (group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : (wonCount + 1)));

    const winnerDraft = {
      slotNumber: targetWinnerSlotObj.slotNumber,
      memberId: targetWinnerSlotObj.memberId,
      memberName: targetWinnerSlotObj.memberName,
      group: group.groupId,
      batchName: group.groupName,
      cycleDay: currentDay,
      dayNumber: currentDay,
      rewardGrams: 1,
      purity: '24K / 916 BIS Hallmark Gold Chit',
      certificateId: `CERT-IG-2026-${String(targetWinnerSlotObj.slotNumber).padStart(4, '0')}`,
      timestamp: Date.now(),
    };

    // Broadcast live shake signal to database
    await triggerLiveDraw(group.groupId, targetWinnerSlotObj.slotNumber, winnerDraft);

    setTimeout(() => {
      setDrawState('drawing');
      
      setTimeout(async () => {
        const winner = executeDailySpin(targetWinnerSlotObj.slotNumber);
        const finalWinner = {
          ...(winner || winnerDraft),
          cycleDay: currentDay,
          dayNumber: currentDay,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
        setSelectedWinner(finalWinner as any);
        setDrawState('revealed');
        setShowWinnerModal(true);

        // Record completed winner in Firestore database
        await completeLiveDraw(group.groupId, targetWinnerSlotObj.slotNumber, finalWinner);
      }, 1600);
    }, 4500);
  };

  const isEventLiveOrActive = group.status === 'active' || group.status === 'live' || (group.currentCycleDay && group.currentCycleDay > 0);

  const resetDrawState = async () => {
    setDrawState('idle');
    setShowWinnerModal(false);
    await resetLiveDraw(group.groupId);
  };

  const handleSendEmailNotification = async () => {
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/admin/send-pre-draw-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: group.groupId,
          batchName: group.groupName,
          scheduledTime: `${scheduledTime} ${scheduledAmPm} IST`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setEmailBroadcastResult(data);
      setEmailSent(true);
      setShowEmailModal(true);
    } catch (e: any) {
      alert(`Error sending pre-draw emails: ${e.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveSchedule = async () => {
    const formattedScheduledTime = `${scheduledTime} ${scheduledAmPm} IST`;
    await updateGroupSchedule(group.groupId, startDate, formattedScheduledTime);
    setScheduleSaved(true);
    setTimeout(() => {
      setScheduleSaved(false);
      setShowScheduleModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#040D11] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#E1A238]/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00C2B8] via-[#F2C868] to-[#E1A238]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-[#00C2B8]" />
            <span>Admin Control Panel — InfinityGram Program Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
            50-Day Reward Program Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Target Batch: <strong className="text-white font-bold">{group.groupName}</strong> ({group.groupId}) | Schedule:{' '}
            {hasAdminConfiguredSchedule ? (
              <span className="text-[#F2C868] font-mono font-black">{group.scheduledTime} Daily (Starts: {group.startDate})</span>
            ) : (
              <span className="text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs">
                ⚠️ Schedule Not Set — Admin Setup Required
              </span>
            )}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full xl:w-auto justify-start xl:justify-end">
          {/* Unlock & Start Event Button (High Priority when Pre-Event) */}
          {!isEventLiveOrActive && (
            <button
              onClick={() => setShowStartEventModal(true)}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer flex items-center space-x-2 border border-amber-200 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
              <span>🚀 UNLOCK & START 50-DAY EVENT</span>
            </button>
          )}

          {/* Configure Schedule Button */}
          {isEventLiveOrActive ? (
            <div className="bg-[#081E26] text-slate-400 font-bold px-3.5 py-2.5 rounded-xl text-xs border border-slate-700 shadow-sm flex items-center space-x-1.5 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5 text-[#F2C868]" />
              <span>🔒 Schedule Locked</span>
            </div>
          ) : (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-[#081E26] hover:bg-[#0D3B43] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs border border-[#E1A238]/40 shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#F2C868]" />
              <span>Configure Schedule</span>
            </button>
          )}

          {/* Send 10-Min Pre-Draw Email Button */}
          <button
            disabled={isSendingEmail}
            onClick={handleSendEmailNotification}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60 ${
              emailSent 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#00C2B8] hover:bg-[#009890] text-[#081E26] font-black'
            }`}
          >
            <Mail className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-bounce' : ''}`} />
            <span>
              {isSendingEmail ? 'Sending...' : (emailSent ? '📧 Email Sent' : '📧 10-Min Alert')}
            </span>
          </button>

          {/* Reset Lock Button (Test Mode) */}
          {isLocked24h && (
            <button
              onClick={resetDrawLock}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Reset 24h cooldown timer for testing"
            >
              <Unlock className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset 24h Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE EVENT BATCH SELECTOR BAR */}
      <div className="bg-[#081E26] p-4 rounded-2xl border border-[#E1A238]/40 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-mono font-black text-[#F2C868] uppercase tracking-wider shrink-0 mr-2">Target Event Batch:</span>
        {(allGroups.filter(g => g.totalMembers > 0).length > 0 ? allGroups.filter(g => g.totalMembers > 0) : allGroups).map((g) => {
          const isSelected = group.groupId === g.groupId;
          return (
            <button
              key={g.groupId}
              onClick={() => setSelectedBatchId(g.groupId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#00C2B8] text-[#081E26] shadow-md font-mono'
                  : 'bg-[#0D3B43] text-slate-300 hover:bg-[#0D3B43]/80 border border-[#E1A238]/20'
              }`}
            >
              <span>{g.groupName.split(' - ')[1] || g.groupName}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                isSelected ? 'bg-[#081E26] text-[#00C2B8]' : 'bg-[#081E26] text-[#F2C868]'
              }`}>
                {g.groupId} ({g.scheduledTime || '07:00 AM IST'})
              </span>
            </button>
          );
        })}
      </div>

      {/* 24-HOUR COOLDOWN & LIVE BROADCAST ALERT CARD */}
      {isLocked24h ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 p-6 rounded-3xl border border-amber-500/40 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  🔒 24-Hour Cooldown Active
                </span>
                <span className="text-xs font-mono text-emerald-400 font-extrabold">🔴 Live Stream Broadcasting to User Dashboards</span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                Draw Button Locked for Next 24 Hours
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Day {Math.max(1, currentActiveDay - 1)} chit selection completed for {batchShortName}. The draw button automatically disables for 24 hours to prevent duplicate draws and re-opens on schedule.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/80 px-5 py-3 rounded-2xl border border-amber-400/30 font-mono shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Time to Next Draw</span>
              <span className="text-xl font-black text-amber-400">
                {String(lockCountdown?.hours).padStart(2, '0')}:{String(lockCountdown?.minutes).padStart(2, '0')}:{String(lockCountdown?.seconds).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={resetDrawLock}
              className="text-xs font-sans font-bold bg-amber-400 text-amber-950 px-3 py-1.5 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Unlock Now
            </button>
          </div>
        </div>
      ) : !hasAdminConfiguredSchedule ? (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/40 to-orange-50 p-6 rounded-3xl border-2 border-dashed border-amber-300 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-amber-700 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  ⚠️ Draw Schedule Not Set
                </span>
                <span className="text-xs font-mono text-slate-600 font-extrabold">
                  {batchShortName}
                </span>
              </div>
              <h3 className="text-base font-black text-[#0B1E39] mt-1">
                Event Start Date & Daily Draw Time Pending Configuration
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Admin must set the start date and daily selection time to start the 50-day consecutive draw cycle.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>Set Start Date & Time Now</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ⚡ Auto 10-Min Pre-Draw Email Schedule Active
                </span>
                <span className="text-xs font-mono text-slate-500 font-extrabold">
                  {group.groupName.replace('InfinityGram 50 Gold Club - ', '') || group.groupId} Schedule
                </span>
              </div>
              <h3 className="text-base font-black text-[#0B1E39] mt-1">
                Daily Selection Scheduled for {scheduledTime} {scheduledAmPm} IST (Starts: {group.startDate})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                System automatically emails all real verified members at <strong className="text-amber-800 font-extrabold">{preEmailTime}</strong> (10 minutes prior to live draw event).
              </p>
            </div>
          </div>

          {isEventLiveOrActive ? (
            <div className="bg-slate-100 text-slate-500 font-bold px-4 py-3 rounded-2xl text-xs border border-slate-200 shrink-0 cursor-not-allowed flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>🔒 Schedule Locked (Event Live)</span>
            </div>
          ) : (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Edit Start Time & Auto-Emails</span>
            </button>
          )}
        </div>
      )}

      {/* 🔮 INTERACTIVE GLASS BOTTLE PANAI DRAW VISUALIZER WIDGET */}
      <div className="bg-gradient-to-br from-[#0D3B43] via-[#081E26] to-[#040D11] p-6 sm:p-10 rounded-3xl border-2 border-[#E1A238]/60 shadow-2xl text-white relative overflow-hidden space-y-6">
        
        {/* Top Status Bar */}
        <div className="bg-[#081E26]/80 backdrop-blur-md p-4 rounded-2xl border border-[#E1A238]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C2B8] text-[#081E26] flex items-center justify-center font-black shadow-md">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-[#F2C868] uppercase tracking-widest block">Admin Command Console</span>
              <p className="text-sm font-serif font-black text-white">Live Stream & Bottle Shake Trigger Panel</p>
            </div>
          </div>

          {/* 24-Hour Cooldown Timer Indicator */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-medium">Draw Control Status:</span>
            {isLocked24h ? (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked 24h ({String(lockCountdown?.hours).padStart(2, '0')}h {String(lockCountdown?.minutes).padStart(2, '0')}m {String(lockCountdown?.seconds).padStart(2, '0')}s)</span>
              </span>
            ) : (
              <span className="bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5">
                <Unlock className="w-3.5 h-3.5 text-[#00C2B8]" />
                <span>Ready for Draw</span>
              </span>
            )}
          </div>
        </div>

        {/* Glass Bottle Visualizer Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 pt-2">
          
          {/* Left Text & Controls */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center space-x-2 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/30 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider">
                <Dices className="w-4 h-4 text-[#00C2B8]" />
                <span>InfinityGram Glass Bottle Draw Pot</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 bg-[#E1A238]/15 text-[#F2C868] border border-[#E1A238]/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
                <Crown className="w-3.5 h-3.5 text-[#F2C868]" />
                <span>Admin Manual Override Active</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                Traditional Glass Bottle Lucky Pot
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
                Inside this glass bottle are <strong className="text-[#F2C868] font-bold">{activePoolMembers.length} folded paper chits</strong> representing active members. Choose the target winner below, then trigger the 3D bottle shake to broadcast live to all dashboards.
              </p>
            </div>

            {/* 👑 ADMIN MANUAL WINNER SELECTION CONSOLE */}
            <div className="bg-[#05171E]/90 backdrop-blur-md rounded-2xl border-2 border-[#E1A238]/40 p-4 sm:p-5 text-left space-y-4 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1A238]/20 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E1A238]/20 border border-[#E1A238]/50 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-[#F2C868]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider">
                        Target Winner Selection (Day {currentActiveDay} of 50)
                      </h4>
                      <span className="bg-[#00C2B8]/20 border border-[#00C2B8]/40 text-[#00C2B8] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full">
                        {batchShortName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pre-select which member chit is drawn from the bottle for <strong className="text-[#F2C868]">{group.groupName}</strong>
                    </p>
                  </div>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center bg-[#081E26] p-0.5 rounded-xl border border-slate-700/60 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => { setSelectionMode('select'); setValidationError(null); }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      selectionMode === 'select'
                        ? 'bg-[#00C2B8] text-[#081E26] shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Active Pool ({activePoolMembers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectionMode('input'); setValidationError(null); }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      selectionMode === 'input'
                        ? 'bg-[#00C2B8] text-[#081E26] shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enter ID / Slot
                  </button>
                </div>
              </div>

              {/* Mode 1: Dropdown & Search Filter with Real vs Bot Tabs */}
              {selectionMode === 'select' && (
                <div className="space-y-2.5">
                  {/* REAL VS BOT FILTER TABS */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMemberTypeFilter('all');
                          const match = activePoolMembers.find(m => m.slotNumber === manualTargetSlot);
                          if (!match && activePoolMembers.length > 0) {
                            setManualTargetSlot(activePoolMembers[0].slotNumber);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border flex items-center space-x-1 ${
                          memberTypeFilter === 'all'
                            ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8] font-black shadow-xs'
                            : 'bg-[#081E26] text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        <span>All Pool</span>
                        <span className="bg-black/20 px-1 py-0.2 rounded text-[9px]">{activePoolMembers.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMemberTypeFilter('real');
                          const realOnes = activePoolMembers.filter(m => !isBotMember(m));
                          if (!realOnes.some(m => m.slotNumber === manualTargetSlot) && realOnes.length > 0) {
                            setManualTargetSlot(realOnes[0].slotNumber);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border flex items-center space-x-1 ${
                          memberTypeFilter === 'real'
                            ? 'bg-emerald-500 text-[#081E26] border-emerald-400 font-black shadow-xs'
                            : 'bg-[#081E26] text-emerald-300 border-emerald-500/30 hover:border-emerald-400'
                        }`}
                      >
                        <span>👤 Real Members</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] ${memberTypeFilter === 'real' ? 'bg-[#081E26]/20 text-[#081E26]' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {realMembersCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMemberTypeFilter('bots');
                          const botOnes = activePoolMembers.filter(m => isBotMember(m));
                          if (!botOnes.some(m => m.slotNumber === manualTargetSlot) && botOnes.length > 0) {
                            setManualTargetSlot(botOnes[0].slotNumber);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border flex items-center space-x-1 ${
                          memberTypeFilter === 'bots'
                            ? 'bg-purple-500 text-white border-purple-400 font-black shadow-xs'
                            : 'bg-[#081E26] text-purple-300 border-purple-500/30 hover:border-purple-400'
                        }`}
                      >
                        <span>🤖 Bot Users</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] ${memberTypeFilter === 'bots' ? 'bg-black/20 text-white' : 'bg-purple-500/20 text-purple-300'}`}>
                          {botMembersCount}
                        </span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {filteredActiveMembers.length} candidate{filteredActiveMembers.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* CUSTOM LUXURY SEARCHABLE DROPDOWN */}
                  <div className="relative" ref={dropdownRef}>
                    {/* Trigger button showing current selection with Real/Bot badge */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[#081E26] hover:bg-[#0c2b36] border-2 border-[#E1A238]/60 hover:border-[#E1A238] rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition-all cursor-pointer shadow-md focus:outline-none focus:border-[#00C2B8]"
                    >
                      {targetWinnerSlotObj ? (
                        <div className="flex items-center space-x-2.5 overflow-hidden text-left">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F2C868] to-[#B3781A] text-[#081E26] flex flex-col items-center justify-center font-serif font-black shadow-xs shrink-0">
                            <span className="text-[7px] uppercase font-bold leading-none">Chit</span>
                            <span className="text-xs font-black leading-none">#{String(targetWinnerSlotObj.slotNumber).padStart(2, '0')}</span>
                          </div>
                          <div className="truncate">
                            <div className="flex items-center space-x-2 truncate">
                              <span className="font-bold text-white text-xs truncate">
                                {targetWinnerSlotObj.memberName || `Member #${targetWinnerSlotObj.slotNumber}`}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#00C2B8] block truncate">
                              {targetWinnerSlotObj.memberId || `LOP-${String(targetWinnerSlotObj.slotNumber).padStart(6, '0')}`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Select a member from pool...</span>
                      )}

                      <div className="flex items-center space-x-1.5 text-slate-400 pl-2 shrink-0">
                        <span className="text-[10px] font-mono font-bold text-[#E1A238] hidden sm:inline">Change Winner</span>
                        <ChevronDown className={`w-4 h-4 text-[#E1A238] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Dropdown Popup Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#081E26] border-2 border-[#00C2B8]/60 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Internal Quick Search Bar */}
                        <div className="p-2 border-b border-slate-700/80 bg-[#06181f]">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-[#00C2B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Search by name, member ID, or chit number..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full bg-[#081E26] border border-slate-600 focus:border-[#00C2B8] rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                            />
                            {searchTerm && (
                              <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Members Scrollable List */}
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 p-1 custom-scrollbar">
                          {filteredActiveMembers.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-xs">
                              <p className="font-medium">No matching pool members found.</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Try clearing the search or switching the Real/Bot filter tab.</p>
                            </div>
                          ) : (
                            filteredActiveMembers.map((m) => {
                              const isBot = isBotMember(m);
                              const isSelected = manualTargetSlot === m.slotNumber;
                              return (
                                <button
                                  key={m.slotNumber}
                                  type="button"
                                  onClick={() => {
                                    setManualTargetSlot(m.slotNumber);
                                    setValidationError(null);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left rounded-lg transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#00C2B8]/20 border border-[#00C2B8]/60 text-white'
                                      : 'hover:bg-white/5 text-slate-200 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <div className={`w-7 h-7 rounded-md flex flex-col items-center justify-center font-serif font-black text-[10px] shrink-0 ${
                                      isSelected 
                                        ? 'bg-[#F2C868] text-[#081E26]' 
                                        : 'bg-slate-800 text-[#F2C868] border border-[#E1A238]/30'
                                    }`}>
                                      <span className="leading-none font-black">#{String(m.slotNumber).padStart(2, '0')}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center space-x-1.5">
                                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#F2C868]' : 'text-white'}`}>
                                          {m.memberName || `Member #${m.slotNumber}`}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {m.memberId || `LOP-${String(m.slotNumber).padStart(6, '0')}`}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 shrink-0">
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-[#00C2B8] shrink-0" />
                                    )}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Quick Footer */}
                        <div className="px-3 py-1.5 bg-[#06181f] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Filter: {memberTypeFilter === 'all' ? 'All Members' : memberTypeFilter === 'real' ? '👤 Real Only' : '🤖 Bots Only'}</span>
                          <span className="text-[#00C2B8] font-bold">Total: {filteredActiveMembers.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Input ID Box */}
              {selectionMode === 'input' && (
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-300 font-bold flex items-center space-x-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#00C2B8]" />
                    <span>Enter Member ID, Slot Number, or Name:</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. LOP-000007 or 7 or Rajesh"
                      value={inputTargetMemberId}
                      onChange={(e) => handleManualMemberIdInput(e.target.value)}
                      className="flex-1 bg-[#081E26] border-2 border-[#00C2B8]/50 focus:border-[#00C2B8] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {validationError && (
                <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-xl p-2.5 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Verified Winner Target Preview Card */}
              {targetWinnerSlotObj && (
                <div className="bg-gradient-to-r from-[#0D3B43]/80 via-[#081E26] to-[#0D3B43]/80 border border-[#00C2B8]/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2C868] to-[#B3781A] text-[#081E26] flex flex-col items-center justify-center font-serif font-black shadow-md shrink-0">
                      <span className="text-[9px] uppercase leading-none font-bold">Chit</span>
                      <span className="text-sm font-black leading-none">#{targetWinnerSlotObj.slotNumber}</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-serif font-black text-white">
                          {targetWinnerSlotObj.memberName || `Member #${targetWinnerSlotObj.slotNumber}`}
                        </span>
                        {isBotMember(targetWinnerSlotObj) ? (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                            BOT
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                            REAL MEMBER
                          </span>
                        )}
                        <span className="bg-[#00C2B8]/20 text-[#00C2B8] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                          {targetWinnerSlotObj.memberId || `LOP-${String(targetWinnerSlotObj.slotNumber).padStart(6, '0')}`}
                        </span>
                        <span className="bg-[#E1A238]/20 text-[#F2C868] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                          {batchShortName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#F2C868] font-medium flex items-center space-x-1 mt-0.5">
                        <Award className="w-3 h-3 text-[#F2C868]" />
                        <span>Pre-set to win 1g Gold Coin on Day {currentActiveDay} ({batchShortName})</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold self-start sm:self-center">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Eligible & Verified</span>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Action Trigger Button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                onClick={handleTriggerGlassBottleDraw}
                disabled={isLocked24h || drawState !== 'idle' || activePoolMembers.length === 0 || !targetWinnerSlotObj}
                className={`py-4 px-8 rounded-2xl shadow-xl text-xs uppercase tracking-wider flex items-center space-x-3 transition-all ${
                  isLocked24h || !targetWinnerSlotObj
                    ? 'bg-[#081E26] text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00C2B8] via-[#00DFD3] to-[#009890] hover:brightness-110 text-[#081E26] font-serif font-black shadow-[#00C2B8]/40 hover:scale-105 cursor-pointer'
                }`}
              >
                {isLocked24h ? (
                  <>
                    <Lock className="w-5 h-5 text-[#E1A238]" />
                    <span>24H Lock Active ({String(lockCountdown?.hours).padStart(2, '0')}h {String(lockCountdown?.minutes).padStart(2, '0')}m remaining)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#081E26] stroke-[2.5]" />
                    <span>
                      {targetWinnerSlotObj 
                        ? `Shake Bottle & Draw Chit #${targetWinnerSlotObj.slotNumber} (${targetWinnerSlotObj.memberName?.split(' ')[0] || 'Winner'})` 
                        : 'Click to Shake & Draw Lucky Chit'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Interactive 3D Glass Bottle Container */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
            <Interactive3DBottleCard
              drawState={drawState}
              winner={selectedWinner}
              activeChitCount={activePoolMembers.length}
              onTriggerDraw={handleTriggerGlassBottleDraw}
              isLocked24h={isLocked24h}
              lockCountdown={lockCountdown}
              isAdminView={true}
            />
          </div>

        </div>

      </div>

      {/* 3 Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <p className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Current Cycle Day</p>
          <p className="text-2xl font-black text-[#0B1E39]">Day {(group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : Math.min(50, Math.max(1, goldWinnerSlots.length + 1))} of 50</p>
          <p className="text-amber-800 font-extrabold mt-0.5">{goldWinnerSlots.length} Grams Gold Awarded</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <p className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Active Panai Draw Pool</p>
          <p className="text-2xl font-black text-[#2F6FED]">{activePoolMembers.length} Members</p>
          <p className="text-slate-500 font-medium mt-0.5">{activePoolMembers.length} folded paper chits inside pot</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <p className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">Daily Execution Schedule</p>
          <p className="text-2xl font-black text-[#0B1E39] font-mono">{scheduledTime} {scheduledAmPm} IST</p>
          <p className="text-emerald-600 font-bold mt-0.5 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>10-Min Auto Email Alert ({preEmailTime})</span>
          </p>
        </div>
      </div>

      {/* 📅 50-DAY PROGRAM EVENT CALENDAR & HISTORICAL LOG */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        {/* Calendar Header with View Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-[#0B1E39]">50-Day Daily Program Event Calendar</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Scheduled daily events for {group.groupName.replace('InfinityGram 50 Gold Club - ', '') || group.groupId} (Day 1 to Day 50 at {scheduledTime} {scheduledAmPm} IST)
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                calendarView === 'month' 
                  ? 'bg-white text-[#0B1E39] shadow-sm font-black' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month View</span>
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                calendarView === 'week' 
                  ? 'bg-white text-[#0B1E39] shadow-sm font-black' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Week View</span>
            </button>
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                calendarView === 'list' 
                  ? 'bg-white text-[#0B1E39] shadow-sm font-black' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Month Grid View */}
        {calendarView === 'month' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
            {programEvents.map(evt => (
              <div 
                key={evt.dayNumber}
                className={`p-3 rounded-2xl border text-center transition-all relative ${
                  evt.status === 'Completed' 
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950' 
                    : evt.status === 'Today'
                      ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-md ring-2 ring-blue-400/50'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span>Day {evt.dayNumber}</span>
                  {evt.status === 'Completed' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : evt.status === 'Today' ? (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  ) : null}
                </div>
                <p className="text-[11px] font-black truncate">{evt.date}</p>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5">{evt.time}</p>
                {evt.winnerName && (
                  <p className="text-[9px] font-extrabold text-amber-800 truncate mt-1 bg-amber-200/60 px-1 py-0.5 rounded">
                    🏆 {evt.winnerName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Week View */}
        {calendarView === 'week' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Next 7 Days Scheduled Events</h4>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {programEvents.slice(0, 7).map(evt => (
                <div key={evt.dayNumber} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-[#2F6FED]">Day {evt.dayNumber}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{evt.status}</span>
                  </div>
                  <p className="text-xs font-black text-[#0B1E39]">{evt.date}</p>
                  <p className="text-[10px] font-mono text-slate-500">{evt.time}</p>
                  {evt.winnerName ? (
                    <div className="bg-amber-100 text-amber-900 text-[10px] font-bold p-1.5 rounded-xl truncate">
                      🏆 {evt.winnerName}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium">Pending Draw</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View Table */}
        {calendarView === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-3.5">Day #</th>
                  <th className="p-3.5">Scheduled Date</th>
                  <th className="p-3.5">Execution Time</th>
                  <th className="p-3.5">Event Status</th>
                  <th className="p-3.5">Winner Member ID</th>
                  <th className="p-3.5">Winner Name</th>
                  <th className="p-3.5">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {programEvents.map(evt => (
                  <tr key={evt.dayNumber} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-[#0B1E39]">Day {evt.dayNumber.toString().padStart(2, '0')}</td>
                    <td className="p-3.5 text-slate-600 font-semibold">{evt.date}</td>
                    <td className="p-3.5 font-mono text-slate-500">{evt.time}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        evt.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        evt.status === 'Today' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-black text-[#2F6FED]">{evt.winnerMemberId || '—'}</td>
                    <td className="p-3.5 font-bold text-[#0B1E39]">
                      {evt.winnerName ? (
                        <span>{evt.winnerName}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Pending Execution</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">{evt.auditHash || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ⚙️ CONFIGURE SCHEDULE & AUTO-EMAIL MODAL */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Batch Schedule Configurator
                  </span>
                  <h3 className="text-xl font-black text-[#0B1E39] mt-1">Set Daily Draw Time & Auto-Emails</h3>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                {/* Target Batch Selection Cards */}
                <div>
                  <label className="block text-[#0B1E39] font-extrabold mb-2 uppercase text-[10px] tracking-wider">
                    Select Filled 50-Member Batch to Schedule
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {allGroups.filter(g => g.totalMembers === 50).map((g) => {
                      const isSelected = selectedBatchId === g.groupId;
                      return (
                        <div
                          key={g.groupId}
                          onClick={() => setSelectedBatchId(g.groupId)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#0B1E39] text-white border-[#2F6FED] shadow-lg shadow-blue-900/20 ring-2 ring-[#2F6FED]/40'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                              isSelected ? 'bg-amber-400 text-amber-950 shadow-sm' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {g.groupName.split(' - ')[1]?.replace('Batch ', '') || g.groupId.replace('GROUP-', '')}
                            </div>
                            <div>
                              <p className={`font-black text-xs ${isSelected ? 'text-white' : 'text-[#0B1E39]'}`}>
                                {g.groupName}
                              </p>
                              <p className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                Code: {g.groupId} • {g.status === 'active' || g.status === 'live' ? 'Active Cycle Running' : 'Full 50/50 Ready'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black font-mono ${
                              isSelected ? 'bg-amber-400 text-amber-950' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              50/50 Full
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-[#0B1E39] font-extrabold mb-1">Cycle Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-semibold focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                <ClockTimePicker
                  label="Daily Selection Scheduled Time"
                  value={`${scheduledTime} ${scheduledAmPm} IST`}
                  onChange={(formatted, timeOnly, ap) => {
                    setScheduledTime(timeOnly);
                    setScheduledAmPm(ap);
                  }}
                />

                {/* Automated Email Toggle Switch */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 text-xs flex items-center space-x-1.5">
                      <Mail className="w-4 h-4 text-amber-700" />
                      <span>Auto-Send Email 10 Mins Before Event</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={autoEmailEnabled}
                      onChange={(e) => setAutoEmailEnabled(e.target.checked)}
                      className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-amber-900 font-medium">
                    When enabled, the system will automatically send pre-draw notification emails to all 50 members at <strong className="font-mono font-bold text-amber-950">{preEmailTime}</strong> (exactly 10 minutes before scheduled draw).
                  </p>
                </div>

                {/* Locking Rule Policy Notice */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700 text-[11px] space-y-1">
                  <p className="font-bold text-[#0B1E39] flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Database Schedule Sync & Locking Rule:</span>
                  </p>
                  <p>
                    You can set/edit this date and time from here or the <strong>Slot Control Grid</strong>. Once saved, it stores in Firestore database. Once the 50-day draw cycle starts (Day 1), schedule editing will be permanently <strong>locked</strong> in both places.
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSaveSchedule}
                  className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40 flex items-center justify-center space-x-2"
                >
                  {scheduleSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Schedule & Auto-Emails Saved!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Save Schedule & Activate 10-Min Auto-Emails</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 START / UNLOCK 50-DAY EVENT MODAL */}
      <AnimatePresence>
        {showStartEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-5 sm:p-8 border-2 border-amber-300 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowStartEventModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-900 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Admin Event Unlock & Launchpad</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">
                  Unlock & Launch 50-Day Event
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Set the official launch date and daily draw time for <span className="font-mono text-amber-700 font-black">{group.groupName} ({group.groupId})</span>.
                </p>
              </div>

              {/* READINESS CARD */}
              <div className="bg-gradient-to-br from-[#0B1E39] to-[#0F294D] text-white p-4.5 rounded-2xl border border-white/10 space-y-2.5 text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Target Batch:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">{group.groupId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Members:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    {group.totalMembers || 50} / 50 Verified Members
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Prize Pool:</span>
                  <span className="font-mono font-black text-amber-300">50 x 1 Gram 916 BIS Hallmark Gold Coins</span>
                </div>
              </div>

              {/* INPUTS FOR START DATE AND DRAW TIME */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Official Event Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-3.5 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>

                <ClockTimePicker
                  label="Daily Draw Scheduled Time"
                  value={`${scheduledTime} ${scheduledAmPm} IST`}
                  onChange={(formatted, timeOnly, ap) => {
                    setScheduledTime(timeOnly);
                    setScheduledAmPm(ap);
                  }}
                />

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black">Unlock Action:</span> This will transition <span className="font-mono font-bold">{group.groupId}</span> status to <span className="font-mono font-bold text-emerald-700">Active (Day 1/50)</span> and immediately unlock the 3D Lucky Bowl live stream for all members on their user dashboard!
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowStartEventModal(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isStartingEvent || !startDate}
                  onClick={handleConfirmStartEvent}
                  className="w-2/3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-amber-500/30 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950" />
                  <span>{isStartingEvent ? 'Unlocking Event...' : '🚀 Confirm & Unlock 50-Day Event'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WINNER ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {showWinnerModal && selectedWinner && (() => {
          const isWinnerBot = isBotMember({
            memberId: selectedWinner.winnerMemberId,
            memberName: selectedWinner.winnerName,
            slotNumber: selectedWinner.slotNumber,
          });

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                className="bg-white max-w-md w-full rounded-[2.5rem] p-5 sm:p-8 border border-amber-300 shadow-2xl space-y-6 relative text-center max-h-[90vh] overflow-y-auto"
              >
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

                <button
                  onClick={resetDrawState}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-3">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-3xl font-black"
                  >
                    🏆
                  </motion.div>

                  <div>
                    <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider">
                      Day {selectedWinner.dayNumber} Panai Winner Drawn
                    </span>
                    <h3 className="text-2xl font-black text-[#0B1E39] mt-2 tracking-tight">
                      {selectedWinner.winnerName}
                    </h3>
                    


                    <p className="text-xs font-mono font-extrabold text-[#2F6FED] mt-1">
                      Member ID: {selectedWinner.winnerMemberId}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-left space-y-2 text-xs font-medium">

                  <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
                    <span className="text-slate-600 font-bold">Awarded Prize:</span>
                    <span className="text-amber-900 font-black">1 Gram 916 Gold Coin</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
                    <span className="text-slate-600 font-bold">Group Batch:</span>
                    <span className="text-[#0B1E39] font-extrabold">{group.groupName}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-bold">24H Cooldown Status:</span>
                    <span className="font-mono text-xs font-black text-rose-600">Button Locked for 24 Hours</span>
                  </div>
                </div>

                <button
                  onClick={resetDrawState}
                  className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40"
                >
                  Confirm Winner & Lock Draw for 24 Hours
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0 border border-blue-100">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full uppercase">
                    {emailBroadcastResult?.success ? `✅ Broadcast Delivered (${emailBroadcastResult.dispatchedCount || 0} Real Members)` : 'Broadcast Successfully Sent'}
                  </span>
                  <h3 className="text-lg font-black text-[#0B1E39] mt-1">10-Minute Pre-Selection Email Broadcast</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="border-b border-slate-200 pb-2 space-y-1 font-mono">
                  <p className="text-slate-500"><strong>From:</strong> InfinityGram Live &lt;onboarding@resend.dev&gt;</p>
                  <p className="text-slate-500">
                    <strong>Recipients:</strong> {emailBroadcastResult?.totalRealMembers || 'All'} Verified Real Members in {group.groupName} (Bot Users Excluded)
                  </p>
                  <p className="text-[#0B1E39] font-black font-sans text-sm pt-1">
                    Subject: ⏰ Live 1 Gram Gold Panai Selection Starts at {scheduledTime} {scheduledAmPm}! [{group.groupName}]
                  </p>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium pt-1">
                  "Dear Member, your group's daily 1 Gram 916 Gold Panai lucky pot selection starts in 10 minutes ({scheduledTime} {scheduledAmPm} IST). Click the direct link below to open the portal and watch the live paper chit draw!"
                </p>

                {emailBroadcastResult?.directRewardUrl && (
                  <div className="pt-2">
                    <a
                      href={emailBroadcastResult.directRewardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0B1E39] hover:bg-[#152D50] text-white text-center py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md block"
                    >
                      <span>🏺 Open Live 1g Gold Rewards Selection Portal ({group.groupId})</span>
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={() => { 
                  setSelectedBatchId(group.groupId);
                  setShowEmailModal(false); 
                  setCurrentView('user-reward-spin'); 
                }}
                className="w-full bg-[#2F6FED] hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Open User Rewards Stream for {group.groupId}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
