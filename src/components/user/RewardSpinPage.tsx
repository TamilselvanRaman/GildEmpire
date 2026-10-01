'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyGoldWinner } from '../../types';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Lock, 
  Clock, 
  Dices, 
  Eye, 
  Trophy, 
  Gift, 
  Tv, 
  Radio, 
  CalendarDays,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Interactive3DBottleCard = dynamic(
  () => import('../mystery-letter/Interactive3DBottleCard').then((mod) => mod.Interactive3DBottleCard),
  { ssr: false }
);

export const RewardSpinPage = () => {
  const { 
    group, 
    allGroups,
    user,
    selectedBatchId,
    setSelectedBatchId,
    setCurrentView,
    pastWinners, 
    drawLockedUntil, 
    isLiveDrawActive, 
    currentLiveWinner,
    programEvents,
    liveDrawState,
  } = useApp();
  
  const [vesselType, setVesselType] = useState<'glass' | 'panai'>('glass');
  const [selectedWinner, setSelectedWinner] = useState<DailyGoldWinner | null>(liveDrawState?.winner || currentLiveWinner);

  // 24-Hour Cooldown Timer Calculation
  const [lockCountdown, setLockCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Pre-Event Target Launch Countdown Timer Calculation
  const [eventCountdown, setEventCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; isReady: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: false
  });

  const isEventLiveOrActive = group.status === 'active' || group.status === 'live' || ((group.currentCycleDay ?? 0) > 0);

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

  // Live Pre-Event Launch Countdown Ticker
  useEffect(() => {
    const updateEventCountdown = () => {
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

      // If no target time or past date, compute next daily 07:00 AM IST
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

    updateEventCountdown();
    const interval = setInterval(updateEventCountdown, 1000);
    return () => clearInterval(interval);
  }, [group.startDate, group.scheduledTime]);

  const isLocked24h = lockCountdown !== null;
  const activePoolMembers = (group.slots || []).filter(s => s.status !== 'Won 1g Gold');
  const occupiedSlotsCount = (group.slots || []).filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold' || (s.memberName && s.memberName !== '—' && !s.memberName.startsWith('Available Slot'))).length;
  const availableSlotsCount = Math.max(0, 50 - occupiedSlotsCount);
  const isBatch50Full = occupiedSlotsCount >= 50 || availableSlotsCount === 0;

  // Multi-batch slot ownership for current user
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

  const userSelectedBatchSlots = rawAllocatedSlots.filter(
    s => (s.groupId || s.group || 'GROUP-001') === (group.groupId || selectedBatchId)
  );

  const currentBatchId = group.groupId || selectedBatchId || 'GROUP-001';

  // Dynamically resolve past winners from this group's slots
  const slotWinners: DailyGoldWinner[] = (group.slots || [])
    .filter(s => s.status === 'Won 1g Gold' && s.wonDay)
    .map(s => ({
      dayNumber: s.wonDay!,
      date: s.wonDate || 'Draw Recorded',
      winnerMemberId: s.memberId || `LOP-${String(s.slotNumber).padStart(6, '0')}`,
      winnerName: s.memberName || `Member #${s.slotNumber}`,
      prizeDescription: '1 Gram 916 Gold Coin',
      dispatchStatus: 'Verified & Shipped',
      auditHash: `0x${s.slotNumber}a9b8c7d6e5`,
      batchId: currentBatchId,
      batchName: group.groupName,
      slotNumber: s.slotNumber,
      certificateId: `CERT-IG-2026-${String(s.slotNumber).padStart(4, '0')}`,
    }));

  // Filter Firestore winners to ONLY those belonging to this selected batch
  const filteredPastWinners = (pastWinners || []).filter((w: any) => {
    const wBatch = w.batchId || w.group || w.groupId || 'GROUP-001';
    return wBatch === currentBatchId;
  });

  const uniqueWinnersMap = new Map<number, DailyGoldWinner>();
  [...slotWinners, ...filteredPastWinners].forEach((w: any) => {
    if (w && w.dayNumber && !uniqueWinnersMap.has(w.dayNumber)) {
      uniqueWinnersMap.set(w.dayNumber, {
        ...w,
        batchId: currentBatchId,
        batchName: group.groupName,
      });
    }
  });
  const displayedWinners: DailyGoldWinner[] = Array.from(uniqueWinnersMap.values()).sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));

  const latestBatchWinner = displayedWinners.length > 0 ? displayedWinners[0] : (
    (currentLiveWinner && (currentLiveWinner.batchId === currentBatchId || !currentLiveWinner.batchId))
      ? currentLiveWinner 
      : (liveDrawState?.batchId === currentBatchId ? liveDrawState?.winner : null)
  );

  // Check if current user is a winner in this batch
  const userWinningSlot = userSelectedBatchSlots.find(s => {
    const slotObj = (group.slots || []).find(gs => gs.slotNumber === s.slotNumber);
    const isSlotWon = slotObj?.status === 'Won 1g Gold' || Boolean(slotObj?.wonDay);
    const isUserWon = filteredPastWinners.some((w: any) => w.winnerMemberId === user.memberId || Number(w.slotNumber) === s.slotNumber);
    return isSlotWon || isUserWon;
  });

  const isUserWinner = Boolean(userWinningSlot) || 
    (user.rewardStatus === 'Won 1g Gold' && (user.wonBatch === currentBatchId || user.groupId === currentBatchId));
  const userWonDay = (userWinningSlot ? group.slots?.find(gs => gs.slotNumber === userWinningSlot.slotNumber)?.wonDay : undefined) || user.wonDay || 1;

  useEffect(() => {
    if (currentLiveWinner) {
      setSelectedWinner(currentLiveWinner);
    }
  }, [currentLiveWinner]);

  const handleSelectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    if (typeof window !== 'undefined') {
      const newUrl = `/rewards/${batchId.toLowerCase()}`;
      window.history.pushState({ batch: batchId }, '', newUrl);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-16 select-none">
      
      {/* 🏷️ EXECUTIVE BATCH SELECTOR TABS & USER OWNERSHIP BANNER */}
      <div className="bg-[#0D3B43] border border-[#E1A238]/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#00C2B8]" />
            <span className="text-xs font-black text-white uppercase tracking-wider">Select Selection Batch:</span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            Active Batch: <strong className="text-[#F2C868]">{group.groupName}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {allGroups.map((grp) => {
            const isSelected = grp.groupId === (group.groupId || selectedBatchId);
            const userSlotsInThisBatch = rawAllocatedSlots.filter(
              s => (s.groupId || s.group || 'GROUP-001') === grp.groupId
            );
            const batchNameShort = grp.groupName.replace('InfinityGram 50 Gold Club - ', '');
            const isGrpLive = grp.status === 'active' || grp.status === 'live' || (grp.currentCycleDay && grp.currentCycleDay > 0);

            return (
              <button
                key={grp.groupId}
                onClick={() => handleSelectBatch(grp.groupId)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border-amber-300 shadow-lg scale-[1.02]'
                    : 'bg-[#081E26] text-slate-200 border-white/10 hover:border-[#00C2B8]/50 hover:bg-[#081E26]/80'
                }`}
              >
                <span className="font-black">{batchNameShort}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-amber-950/20 text-amber-950 font-black' : 'bg-black/40 text-amber-300'
                }`}>
                  {grp.groupId}
                </span>

                {/* Live / Locked Pill */}
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  isGrpLive 
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isGrpLive ? `🟢 Day ${grp.currentCycleDay || 1}/50` : '🔒 Pre-Event'}
                </span>

                {userSlotsInThisBatch.length > 0 && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-950 text-amber-300' : 'bg-[#00C2B8] text-[#081E26]'
                  }`}>
                    {userSlotsInThisBatch.length} Slot{userSlotsInThisBatch.length > 1 ? 's' : ''} Hold
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Personalized Member Status for Selected Batch */}
        {userSelectedBatchSlots.length > 0 ? (
          <div className={`rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs border ${
            isUserWinner 
              ? 'bg-gradient-to-r from-amber-950/80 via-[#0D3B43] to-amber-950/80 border-[#F2C868] shadow-lg shadow-amber-500/10'
              : 'bg-[#081E26] border border-[#00C2B8]/40'
          }`}>
            <div className="flex items-center space-x-2.5">
              {isUserWinner ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                  🏆
                </div>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold">
                    {isUserWinner ? `🎉 Congratulations, ${user.fullName || 'Member'}!` : `You hold ${userSelectedBatchSlots.length} slot${userSelectedBatchSlots.length > 1 ? 's' : ''} in ${group.groupName}:`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {userSelectedBatchSlots.map(s => (
                      <span key={s.slotNumber} className={`px-2.5 py-0.5 rounded-lg font-mono font-black text-[11px] shadow-sm ${
                        isUserWinner && userWinningSlot?.slotNumber === s.slotNumber
                          ? 'bg-[#F2C868] text-[#081E26] ring-2 ring-amber-300'
                          : 'bg-[#00C2B8] text-[#081E26]'
                      }`}>
                        #{s.slotNumber}
                      </span>
                    ))}
                  </div>
                </div>
                {isUserWinner ? (
                  <p className="text-[11px] text-[#F2C868] font-semibold mt-0.5">
                    Your chit was drawn on Day {userWonDay}! Prize: 1 Gram 916 BIS Hallmark Gold Coin (Verified & Shipped)
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    {isEventLiveOrActive 
                      ? '🟢 Your chits are active in the live 3D Lucky Bowl and eligible for daily draws.' 
                      : '🔒 Your chits are safely deposited in the Lucky Bowl and will be activated once Admin unlocks the event.'}
                  </p>
                )}
              </div>
            </div>

            <span className={`text-[10px] font-mono font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
              isUserWinner 
                ? 'text-amber-950 bg-gradient-to-r from-amber-300 to-amber-500 border border-amber-200 shadow-md font-extrabold'
                : 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
            }`}>
              {isUserWinner ? `🏆 Day ${userWonDay} Winner` : (isEventLiveOrActive ? '🟢 In 1g Gold Selection Pool' : '🔒 Chit Deposited')}
            </span>
          </div>
        ) : isEventLiveOrActive ? (
          /* Case 1: 50-Day Event Active - Registrations Closed */
          <div className="bg-[#081E26] border border-cyan-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <Lock className="w-4 h-4 text-[#00C2B8] shrink-0" />
              <span className="text-slate-300">
                The 50-day daily gold draw event is actively running for <strong className="text-white">{group.groupName}</strong>. New slot registrations are closed.
              </span>
            </div>
            <button
              onClick={() => setCurrentView('user-my-group')}
              className="bg-[#0D3B43] hover:bg-[#124d57] text-[#00C2B8] border border-[#00C2B8]/40 font-bold px-3.5 py-1.5 rounded-xl text-[11px] uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center space-x-1"
            >
              <span>Explore Other Batches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isBatch50Full ? (
          /* Case 2: 50/50 Full - Registration Closed, Awaiting Event Launch */
          <div className="bg-[#081E26] border border-amber-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <Lock className="w-4 h-4 text-[#F2C868] shrink-0" />
              <span className="text-slate-300">
                <strong className="text-white">{group.groupName}</strong> is 100% full (<span className="text-[#F2C868] font-bold">50/50 Slots Filled</span>). Registration closed for this batch.
              </span>
            </div>
            <button
              onClick={() => setCurrentView('user-my-group')}
              className="bg-[#0D3B43] hover:bg-[#124d57] text-[#F2C868] border border-[#E1A238]/40 font-bold px-3.5 py-1.5 rounded-xl text-[11px] uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center space-x-1"
            >
              <span>View Open Batches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Case 3: Open Slots Available (Recruiting phase) */
          <div className="bg-[#081E26] border border-emerald-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                You have not purchased slots in <strong className="text-white">{group.groupName}</strong> yet. (<span className="text-emerald-400 font-bold">{availableSlotsCount} of 50 slots available</span>)
              </span>
            </div>
            <button
              onClick={() => setCurrentView('user-my-group')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-[#081E26] font-black px-4 py-1.5 rounded-xl text-[11px] uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center space-x-1"
            >
              <span>Buy Slot in {group.groupId} ({availableSlotsCount} Left)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 🏛️ EXECUTIVE CORPORATE METRICS TICKER BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Selection Day or Locked Status */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1A238]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">
            {isEventLiveOrActive ? 'Current Cycle' : 'Event Status'}
          </p>
          <p className="text-xl sm:text-2xl font-black text-white font-serif mt-1">
            {isEventLiveOrActive ? (
              <>
                Day {((group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : Math.min(50, Math.max(1, (group.slots || []).filter(s => s.status === 'Won 1g Gold').length + 1))).toString().padStart(2, '0')} <span className="text-xs text-[#00C2B8] font-sans font-semibold">/ 50</span>
              </>
            ) : (
              <span className="text-amber-300 font-sans text-lg flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Locked (Pre-Event)</span>
              </span>
            )}
          </p>
          <p className="text-[11px] text-slate-300 mt-1 font-medium">
            {isEventLiveOrActive ? '1 Gram 916 Gold Draw' : `${occupiedSlotsCount}/50 Verified Members`}
          </p>
        </div>

        {/* Metric 2: Launch Countdown / Active Chits Pool */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C2B8]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">
            {isEventLiveOrActive ? 'Active Pool Chits' : 'Launch Countdown'}
          </p>
          {isEventLiveOrActive ? (
            <p className="text-xl sm:text-2xl font-black text-[#00C2B8] font-mono mt-1">
              {activePoolMembers.length} <span className="text-xs text-slate-300 font-sans font-normal">Members</span>
            </p>
          ) : (
            <p className="text-base sm:text-lg font-black text-amber-300 font-mono mt-1">
              {String(eventCountdown.days).padStart(2, '0')}d : {String(eventCountdown.hours).padStart(2, '0')}h : {String(eventCountdown.minutes).padStart(2, '0')}m : {String(eventCountdown.seconds).padStart(2, '0')}s
            </p>
          )}
          <p className="text-[11px] text-[#F2C868] mt-1 font-medium">
            {isEventLiveOrActive ? 'Inside 3D Crystal Bowl' : 'Awaiting Admin Unlock'}
          </p>
        </div>

        {/* Metric 3: Live Broadcast Schedule */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C2B8]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">Daily Schedule</p>
          <p className="text-lg sm:text-xl font-black text-white font-mono mt-1 truncate">
            {group.scheduledTime && !group.scheduledTime.includes('Pending') && !group.scheduledTime.includes('Awaiting') && group.scheduledTime.trim() !== '' ? group.scheduledTime : '07:00 AM IST'}
          </p>
          <p className="text-[11px] text-[#00C2B8] mt-1 font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#00C2B8] animate-pulse" />
            <span>{group.startDate && !group.startDate.includes('Not Started') && !group.startDate.includes('Pending') ? `Starts: ${group.startDate}` : 'Admin Live Broadcast'}</span>
          </p>
        </div>

        {/* Metric 4: Blockchain Audit */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1A238]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">Audit Standard</p>
          <p className="text-base sm:text-lg font-black text-[#00C2B8] mt-1 flex items-center gap-1.5 font-serif">
            <ShieldCheck className="w-4 h-4 text-[#00C2B8] shrink-0" />
            <span>SOC-2 Verified</span>
          </p>
          <p className="text-[11px] text-slate-300 mt-1 font-mono text-ellipsis overflow-hidden whitespace-nowrap">
            0x{group.groupId.replace(/[^0-9]/g, '') || '1'}F9B...88A2
          </p>
        </div>
      </div>

      {/* 📺 CORPORATE SOVEREIGN BROADCAST ARENA */}
      <div className="bg-gradient-to-b from-[#0D3B43] via-[#081E26] to-[#040D11] rounded-[2.5rem] border-2 border-[#E1A238]/60 shadow-[0_30px_70px_rgba(8,30,38,0.9),0_0_50px_rgba(0,194,184,0.2)] overflow-hidden relative">
        
        {/* Top Header Banner */}
        <div className="px-6 sm:px-10 py-6 border-b border-[#E1A238]/30 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 bg-[#081E26]/80 backdrop-blur-md">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-xs border ${
                isEventLiveOrActive
                  ? 'bg-[#0D3B43] text-[#00C2B8] border-[#00C2B8]/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-400/40'
              }`}>
                {isEventLiveOrActive ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#00C2B8]" />
                    <span>InfinityGram Live Broadcast</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pre-Event Recruiting • Event Locked</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#081E26] bg-[#E1A238] px-3 py-1 rounded-full font-black">
                {occupiedSlotsCount}/50 Verified Chits Deposited
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-white tracking-wide pt-1">
              {isEventLiveOrActive ? (
                `Day ${((group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : Math.min(50, Math.max(1, (group.slots || []).filter(s => s.status === 'Won 1g Gold').length + 1)))} Traditional 1 Gram Gold Selection`
              ) : (
                `Pre-Event Phase — 50-Day 1 Gram Gold Selection Engine`
              )}
            </h1>
          </div>

          {/* Live / Locked Status Badge */}
          <div className={`flex items-center space-x-3 shrink-0 border px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md ${
            isEventLiveOrActive 
              ? 'bg-[#0D3B43] border-[#00C2B8]/50' 
              : 'bg-amber-950/70 border-amber-400/50'
          }`}>
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEventLiveOrActive ? 'bg-[#00C2B8]' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isEventLiveOrActive ? 'bg-[#00C2B8]' : 'bg-amber-400'}`}></span>
            </span>
            <div className="text-left">
              <span className="text-[9px] font-mono text-slate-300 block uppercase tracking-wider">Stream Status</span>
              <span className="text-xs font-serif font-bold text-[#F2C868] uppercase tracking-widest">
                {isEventLiveOrActive ? '3D Lucky Bowl Active' : 'Locked — Waiting for Launch'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Broadcast Studio Stage */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center space-y-6 relative z-10">
          
          {/* If Event is Live: Centered 3D Glass Bottle Stage */}
          {isEventLiveOrActive ? (
            <div className="w-full flex items-center justify-center py-2">
              <Interactive3DBottleCard
                drawState={
                  liveDrawState?.status && liveDrawState.status !== 'idle'
                    ? liveDrawState.status
                    : isLiveDrawActive
                      ? (currentLiveWinner ? 'revealed' : 'shaking')
                      : (latestBatchWinner ? 'revealed' : 'idle')
                }
                winner={liveDrawState?.winner || currentLiveWinner || latestBatchWinner}
                activeChitCount={activePoolMembers.length}
                isAdminView={false}
              />
            </div>
          ) : (
            /* If Event is Locked: Ultra-Crisp Countdown & Locked Bowl Presentation */
            <div className="w-full max-w-2xl py-6 px-4 space-y-6 text-center">
              
              {/* Shimmering Golden Lock Padlock Card */}
              <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-amber-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 border-2 border-amber-200 animate-pulse">
                <Lock className="w-12 h-12 text-amber-950 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>COUNTDOWN TO OFFICIAL EVENT LAUNCH</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Event Unlocks on Launch Date
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
                  {group.groupName} is currently in pre-event preparation mode. The interactive 3D Lucky Bowl and live daily draws will unlock automatically once Admin initiates the event.
                </p>
              </div>

              {/* LIVE DIGITAL COUNTDOWN TICKER BOXES */}
              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
                {[
                  { label: 'DAYS', val: String(eventCountdown.days).padStart(2, '0') },
                  { label: 'HOURS', val: String(eventCountdown.hours).padStart(2, '0') },
                  { label: 'MINUTES', val: String(eventCountdown.minutes).padStart(2, '0') },
                  { label: 'SECONDS', val: String(eventCountdown.seconds).padStart(2, '0') },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-b from-[#0D3B43] to-[#081E26] border-2 border-[#E1A238]/60 p-3 sm:p-4 rounded-2xl shadow-xl shadow-black/40">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-white block tracking-wider drop-shadow-md">
                      {item.val}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* BATCH CAPACITY & READINESS BAR */}
              <div className="bg-[#081E26]/90 border border-[#E1A238]/40 rounded-2xl p-4.5 max-w-lg mx-auto space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-300">Group Capacity Readiness:</span>
                  <span className={`font-mono font-black ${isBatch50Full ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {occupiedSlotsCount} / 50 Verified Slots ({Math.round((occupiedSlotsCount / 50) * 100)}%)
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-[#00C2B8] to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, Math.round((occupiedSlotsCount / 50) * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                  <span>Start Date: <strong className="text-white">{group.startDate || 'Pending Setup'}</strong></span>
                  <span>Daily Draw: <strong className="text-[#F2C868]">{group.scheduledTime || '07:00 AM IST'}</strong></span>
                </div>
              </div>

            </div>
          )}

          {/* Live Stream Monitor Button Bar */}
          <div className="space-y-3 w-full max-w-md">
            <button
              disabled
              className={`w-full py-4 rounded-full text-xs font-serif font-bold tracking-widest uppercase flex items-center justify-center space-x-2.5 transition-all shadow-xl border ${
                !isEventLiveOrActive
                  ? 'bg-[#081E26] text-[#F2C868] border-[#E1A238]/60 shadow-inner'
                  : liveDrawState?.status === 'shaking'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 animate-bounce'
                  : liveDrawState?.status === 'revealed' || latestBatchWinner
                    ? 'bg-emerald-600 text-white border-emerald-300'
                    : isLocked24h
                      ? 'bg-[#081E26] text-[#F2C868] border-[#E1A238]/50'
                      : 'bg-[#0D3B43] text-white border-[#00C2B8]/40'
              }`}
            >
              {!isEventLiveOrActive ? (
                <>
                  <Lock className="w-4 h-4 text-[#E1A238]" />
                  <span className="font-mono font-black">
                    🔒 EVENT LOCKED — WAITING FOR ADMIN LAUNCH
                  </span>
                </>
              ) : liveDrawState?.status === 'shaking' ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span className="font-black">🏺 LIVE DRAW ACTIVE: SHAKING 3D GLASS BOTTLE...</span>
                </>
              ) : (liveDrawState?.status === 'revealed' || latestBatchWinner) ? (
                <>
                  <Award className="w-4 h-4 text-emerald-200" />
                  <span className="font-black">🏆 DAY {latestBatchWinner?.dayNumber || 1} WINNER: {latestBatchWinner?.winnerName?.toUpperCase()} ({latestBatchWinner?.winnerMemberId})</span>
                </>
              ) : isLocked24h ? (
                <>
                  <Lock className="w-4 h-4 text-[#E1A238]" />
                  <span>
                    Draw Completed — Locked for 24h ({String(lockCountdown?.hours).padStart(2, '0')}:
                    {String(lockCountdown?.minutes).padStart(2, '0')}:
                    {String(lockCountdown?.seconds).padStart(2, '0')} Left)
                  </span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-[#00C2B8] animate-pulse" />
                  <span>LIVE STREAM MODE — WAITING FOR ADMIN DRAW</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-300 font-medium text-center">
              * Member accounts view draw results live. Draws are executed exclusively by Admin at 07:00 AM IST daily.
            </p>
          </div>

        </div>

      </div>

      {/* 📜 OFFICIAL 50-DAY WINNER DISPATCH LOG */}
      <div className="bg-[#081E26] p-6 sm:p-8 rounded-[2.5rem] border border-[#E1A238]/50 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E1A238]/30 pb-4">
          <div>
            <h3 className="text-lg font-serif font-black text-white tracking-wide">
              Official 50-Day Winner Dispatch Log
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Cryptographically verified 1 Gram 916 Gold Coin registry for <strong className="text-[#F2C868]">{group.groupName}</strong> ({group.scheduledTime && !group.scheduledTime.includes('Pending') ? group.scheduledTime : 'Schedule TBD'})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#081E26] bg-[#00C2B8] border border-[#00C2B8] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm font-extrabold">
              <ShieldCheck className="w-4 h-4 text-[#081E26]" />
              <span>Verified SOC-2 Audit</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#0D3B43] border-b border-[#E1A238]/40 text-[#F2C868] uppercase text-[10px] font-mono font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Day #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Winner Member ID</th>
                <th className="p-4">Winner Name</th>
                <th className="p-4">Prize</th>
                <th className="p-4">Courier Status</th>
                <th className="p-4">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D3B43] font-medium text-slate-200">
              {(programEvents && programEvents.length > 0 ? programEvents : Array.from({ length: 50 }, (_, i) => ({
                dayNumber: i + 1,
                date: 'Date TBD',
                time: group.scheduledTime || 'Time TBD',
                status: i === 0 ? 'Today' as const : 'Scheduled' as const,
                winnerMemberId: undefined,
                winnerName: undefined,
                auditHash: undefined,
              }))).map(evt => {
                const matchedWinner = displayedWinners.find(w => w.dayNumber === evt.dayNumber);
                const isCompleted = evt.status === 'Completed' || Boolean(matchedWinner);
                const winnerId = matchedWinner?.winnerMemberId || evt.winnerMemberId;
                const winnerName = matchedWinner?.winnerName || evt.winnerName;
                const auditHash = matchedWinner?.auditHash || evt.auditHash;

                return (
                  <tr key={evt.dayNumber} className="hover:bg-[#0D3B43]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#F2C868]">
                      Day {evt.dayNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{matchedWinner?.date || evt.date}</td>
                    <td className="p-4 font-mono font-bold text-[#00C2B8]">
                      {winnerId || '—'}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {winnerName || (evt.status === 'Today' ? `Live Selection Scheduled (${evt.time})` : 'Pending Scheduled Draw')}
                    </td>
                    <td className="p-4 text-[#E1A238] font-bold">1 Gram 916 Gold Coin</td>
                    <td className="p-4">
                      {isCompleted ? (
                        <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                          ✓ Verified & Shipped
                        </span>
                      ) : evt.status === 'Today' ? (
                        <span className="bg-blue-950/80 text-blue-300 border border-blue-400/50 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider flex items-center space-x-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping mr-1"></span>
                          <span>Live Draw Today</span>
                        </span>
                      ) : (
                        <span className="bg-slate-900/80 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                          ⏳ Scheduled
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                      {auditHash || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WINNER ANNOUNCEMENT MODAL FOR USER LIVE STREAM */}
      <AnimatePresence>
        {selectedWinner && (
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
              className="bg-[#050B14] max-w-md w-full rounded-[2.5rem] p-8 border-2 border-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.35)] space-y-6 relative text-center overflow-hidden font-serif"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

              <button
                onClick={() => setSelectedWinner(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-3xl font-black"
                >
                  🏆
                </motion.div>

                <div>
                  <span className="text-[10px] font-sans font-black text-amber-950 bg-[#F7DF94] border border-amber-400 px-3.5 py-1 rounded-full uppercase tracking-wider">
                    Day {selectedWinner.dayNumber} Gold Winner Announced
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3 tracking-tight">
                    {selectedWinner.winnerName}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-amber-400 mt-1">
                    Member ID: {selectedWinner.winnerMemberId}
                  </p>
                </div>
              </div>

              <div className="bg-[#0B1524] p-5 rounded-2xl border border-[#D4AF37]/30 text-left space-y-2.5 text-xs font-sans">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold">Awarded Prize:</span>
                  <span className="text-[#F7DF94] font-black">1 Gram 916 Gold Coin</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold">Group Batch:</span>
                  <span className="text-white font-extrabold">{group.groupName}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500 font-bold">Audit Hash:</span>
                  <span className="font-mono text-[10px] text-amber-300 truncate max-w-[160px]">{selectedWinner.auditHash}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWinner(null)}
                className="w-full bg-gradient-to-b from-[#FDE68A] via-[#F5D76E] to-[#C98808] text-slate-950 font-serif font-black py-4 rounded-full shadow-xl text-xs uppercase tracking-widest cursor-pointer transition-all hover:brightness-110 active:scale-95"
              >
                Close & View Dispatch Log
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
