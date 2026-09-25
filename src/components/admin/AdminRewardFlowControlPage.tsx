'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
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
  Tv
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
    selectedBatchId,
    setSelectedBatchId,
    pastWinners, 
    executeDailySpin, 
    setCurrentView,
    drawLockedUntil,
    resetDrawLock,
    programEvents,
    updateGroupSchedule,
  } = useApp();
  
  // Draw State
  const [drawState, setDrawState] = useState<'idle' | 'shaking' | 'drawing' | 'revealed'>('idle');
  const [selectedWinner, setSelectedWinner] = useState<DailyGoldWinner | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list'>('month');

  // Batch Draw Schedule Configurator State
  const [scheduledTime, setScheduledTime] = useState('07:00'); // 7:00 AM
  const [scheduledAmPm, setScheduledAmPm] = useState<'AM' | 'PM'>('AM');
  const [startDate, setStartDate] = useState('2026-08-14');
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Sync scheduledTime and startDate whenever target group switches or updates
  useEffect(() => {
    if (group) {
      if (group.startDate && !group.startDate.includes('Not Started')) {
        setStartDate(group.startDate);
      }
      const rawTime = group.scheduledTime || '07:00 AM IST';
      const match = rawTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        setScheduledTime(`${match[1].padStart(2, '0')}:${match[2]}`);
        setScheduledAmPm(match[3].toUpperCase() as 'AM' | 'PM');
      }
    }
  }, [group?.groupId, group?.scheduledTime, group?.startDate]);

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

  const activePoolMembers = group.slots.filter(s => s.status !== 'Won 1g Gold');
  const goldWinnerSlots = group.slots.filter(s => s.status === 'Won 1g Gold');

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

  // Handle Interactive Glass Bottle Draw Trigger
  const handleTriggerGlassBottleDraw = () => {
    if (isLocked24h || drawState !== 'idle' || activePoolMembers.length === 0) return;

    setDrawState('shaking');
    mysteryAudio.playSpin7Seconds();

    setTimeout(() => {
      setDrawState('drawing');
      
      setTimeout(() => {
        const winner = executeDailySpin();
        setSelectedWinner(winner);
        setDrawState('revealed');
        setShowWinnerModal(true);
      }, 1600);
    }, 5400);
  };

  const resetDrawState = () => {
    setDrawState('idle');
    setShowWinnerModal(false);
  };

  const handleSendEmailNotification = () => {
    setEmailSent(true);
    setShowEmailModal(true);
  };

  const handleSaveSchedule = () => {
    const formattedScheduledTime = `${scheduledTime} ${scheduledAmPm} IST`;
    updateGroupSchedule(group.groupId, startDate, formattedScheduledTime);
    setScheduleSaved(true);
    setTimeout(() => {
      setScheduleSaved(false);
      setShowScheduleModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#0D3B43] via-[#081E26] to-[#040D11] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#E1A238]/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00C2B8] via-[#F2C868] to-[#E1A238]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-[#00C2B8]" />
            <span>Admin Control Panel — InfinityGram Program Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
            50-Day Reward Program Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Target Batch: <strong className="text-white font-bold">{group.groupName}</strong> ({group.groupId}) | Schedule: <span className="text-[#F2C868] font-mono font-black">{scheduledTime} {scheduledAmPm} IST Daily</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          {/* Configure Schedule Button */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#081E26] hover:bg-[#0D3B43] text-white font-extrabold px-4 py-3 rounded-2xl text-xs border border-[#E1A238]/40 shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#F2C868]" />
            <span>Configure Schedule</span>
          </button>

          {/* Send 10-Min Pre-Draw Email Button */}
          <button
            onClick={handleSendEmailNotification}
            className={`px-4 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
              emailSent 
                ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                : 'bg-[#00C2B8] hover:bg-[#009890] text-[#081E26] font-black shadow-[#00C2B8]/20'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{emailSent ? '📧 10-Min Email Sent' : '📧 Send 10-Min Email Alert'}</span>
          </button>

          {/* Demo Reset Lock Button */}
          {isLocked24h && (
            <button
              onClick={resetDrawLock}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 px-3.5 py-3 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Reset 24h cooldown timer for testing"
            >
              <Unlock className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset 24h Lock (Test Mode)</span>
            </button>
          )}

          {/* Trigger Panai Glass Bottle Selection Button (Admin Only, 24h Cooldown) */}
          <button
            onClick={handleTriggerGlassBottleDraw}
            disabled={isLocked24h || drawState !== 'idle' || activePoolMembers.length === 0}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 cursor-pointer ${
              isLocked24h 
                ? 'bg-[#081E26] text-slate-500 border border-slate-700 cursor-not-allowed'
                : drawState !== 'idle' 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#F2C868] via-[#E1A238] to-[#B87C10] hover:brightness-110 text-[#081E26] font-serif shadow-[#E1A238]/30 hover:scale-[1.02]'
            }`}
          >
            {isLocked24h ? (
              <>
                <Lock className="w-4 h-4 text-[#E1A238]" />
                <span>
                  Draw Locked (Next in {String(lockCountdown?.hours).padStart(2, '0')}h {String(lockCountdown?.minutes).padStart(2, '0')}m {String(lockCountdown?.seconds).padStart(2, '0')}s)
                </span>
              </>
            ) : (
              <>
                <RotateCw className={`w-4 h-4 ${drawState !== 'idle' ? 'animate-spin' : ''}`} />
                <span>
                  {drawState === 'shaking' ? '🏺 Shaking Glass Bottle...' :
                   drawState === 'drawing' ? '📜 Drawing Folded Paper Chit...' :
                   drawState === 'revealed' ? '✨ Winner Picked!' :
                   `Click to Shake & Draw Lucky Chit (Day ${group.currentCycleDay})`}
                </span>
              </>
            )}
          </button>
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
                Day {group.currentCycleDay - 1} chit selection completed. The draw button automatically disables for 24 hours to prevent duplicate draws and re-opens on schedule.
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
                <span className="text-xs font-mono text-slate-500 font-extrabold">Batch A Schedule</span>
              </div>
              <h3 className="text-base font-black text-[#0B1E39] mt-1">
                Daily Selection Scheduled for {scheduledTime} {scheduledAmPm} IST
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                System automatically emails all 50 members at <strong className="text-amber-800 font-extrabold">{preEmailTime}</strong> (10 minutes prior to live draw event).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Edit Start Time & Auto-Emails</span>
          </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pt-2">
          
          {/* Left Text & Controls */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#00C2B8]/15 text-[#00C2B8] border border-[#00C2B8]/30 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider">
              <Dices className="w-4 h-4 text-[#00C2B8]" />
              <span>InfinityGram Glass Bottle Draw Pot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Traditional Glass Bottle Lucky Pot
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Inside this glass bottle are <strong className="text-[#F2C868] font-bold">{activePoolMembers.length} folded paper chits</strong> representing active members in sequence. Clicking the button below starts the bottle shake, draws one folded chit, and broadcasts live to all user dashboards.
            </p>

            {/* Quick Action Trigger Button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                onClick={handleTriggerGlassBottleDraw}
                disabled={isLocked24h || drawState !== 'idle' || activePoolMembers.length === 0}
                className={`py-4 px-8 rounded-2xl shadow-xl text-xs uppercase tracking-wider flex items-center space-x-3 transition-all ${
                  isLocked24h
                    ? 'bg-[#081E26] text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00C2B8] to-[#009890] hover:brightness-110 text-[#081E26] font-serif font-black shadow-[#00C2B8]/30 hover:scale-105 cursor-pointer'
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
                    <span>Click to Shake & Draw Lucky Chit</span>
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
          <p className="text-2xl font-black text-[#0B1E39]">Day {group.currentCycleDay} of 50</p>
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
              Scheduled daily events for Batch A (Day 1 to Day 50 at 07:00 AM IST)
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
                    <td className="p-3.5 font-bold text-[#0B1E39]">{evt.winnerName || 'Pending Execution'}</td>
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
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
                              {g.groupName.includes('Batch A') ? 'A' : 'B'}
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

                {/* Time Picker */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0B1E39] font-extrabold mb-1">Daily Selection Time</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                    >
                      <option value="06:00">06:00</option>
                      <option value="06:30">06:30 (Morning 6:30)</option>
                      <option value="07:00">07:00 (Morning 7:00)</option>
                      <option value="08:00">08:00 (Morning 8:00)</option>
                      <option value="18:00">18:00 (Evening 6:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#0B1E39] font-extrabold mb-1">AM / PM</label>
                    <select
                      value={scheduledAmPm}
                      onChange={(e) => setScheduledAmPm(e.target.value as 'AM' | 'PM')}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                    >
                      <option value="AM">AM (Morning)</option>
                      <option value="PM">PM (Evening)</option>
                    </select>
                  </div>
                </div>

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

      {/* WINNER ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {showWinnerModal && selectedWinner && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-8 border border-amber-300 shadow-2xl space-y-6 relative text-center overflow-hidden"
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
                  <p className="text-xs font-mono font-extrabold text-[#2F6FED] mt-0.5">
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
        )}
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
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
                    Broadcast Successfully Sent
                  </span>
                  <h3 className="text-lg font-black text-[#0B1E39] mt-1">10-Minute Pre-Selection Email Broadcast</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="border-b border-slate-200 pb-2 space-y-1 font-mono">
                  <p className="text-slate-500"><strong>From:</strong> notifications@infinitygram.in</p>
                  <p className="text-slate-500"><strong>Recipients:</strong> All 50 Enrolled Members in Batch A</p>
                  <p className="text-[#0B1E39] font-black font-sans text-sm pt-1">
                    Subject: ⏰ Live 1 Gram Gold Panai Selection Starts at {scheduledTime} {scheduledAmPm}!
                  </p>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium pt-1">
                  "Dear Member, your group's daily 1 Gram 916 Gold Panai lucky pot selection starts in 10 minutes ({scheduledTime} {scheduledAmPm} IST). Click the direct link below to open the portal and watch the live paper chit draw!"
                </p>

                <div className="pt-2">
                  <div className="bg-[#0B1E39] text-white text-center py-3.5 rounded-xl font-black text-xs flex items-center justify-center space-x-2">
                    <span>🏺 Open Live 1g Gold Rewards Selection Portal</span>
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setShowEmailModal(false); setCurrentView('user-reward-spin'); }}
                className="w-full bg-[#2F6FED] hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-xs transition-all shadow-lg cursor-pointer"
              >
                View User Side Live Stream Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
