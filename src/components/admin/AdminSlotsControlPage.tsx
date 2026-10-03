'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { ClockTimePicker } from '../common/ClockTimePicker';
import { 
  Users, 
  Search, 
  Grid, 
  List, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  Calendar, 
  Clock, 
  Hourglass,
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  ChevronRight, 
  X,
  ExternalLink,
  PlusCircle,
  Eye,
  Trash2,
  Lock,
  Edit3,
  RotateCcw,
  Save,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSlotsControlPage = () => {
  const { 
    group, 
    allGroups, 
    selectedBatchId,
    pastWinners,
    setSelectedBatchId, 
    setCurrentView, 
    dbUsers, 
    unassignSlot,
    resetSlotWinnerStatus,
    updateGroupSchedule,
    autoFillGroupWithSystemUsers,
    manualAssignSlot,
    fetchDbGroups
  } = useApp();

  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'occupied' | 'won' | 'available'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberModal, setSelectedMemberModal] = useState<any>(null);
  const [slotToDelete, setSlotToDelete] = useState<{ slotNumber: number; memberName?: string; memberId?: string } | null>(null);
  const [isDeletingSlot, setIsDeletingSlot] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Assign Slot Modal State
  const [slotToAssign, setSlotToAssign] = useState<number | null>(null);
  const [assignTab, setAssignTab] = useState<'existing' | 'bots' | 'custom'>('existing');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'bots' | 'real' | 'eligible'>('all');
  const [selectedUserIdToAssign, setSelectedUserIdToAssign] = useState<string>('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customMobile, setCustomMobile] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Schedule & Start Event Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [startDateInput, setStartDateInput] = useState(group.startDate || '');
  const [scheduledTimeInput, setScheduledTimeInput] = useState(group.scheduledTime || '');
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const [showStartEventModal, setShowStartEventModal] = useState(false);
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventDrawTime, setEventDrawTime] = useState('07:00 AM IST');
  const [isStartingEvent, setIsStartingEvent] = useState(false);

  // Active resolved group object from allGroups
  const currentBatchId = group?.groupId || selectedBatchId || 'GROUP-001';
  const activeGroup = (allGroups || []).find(g => (g.groupId || '').toUpperCase() === currentBatchId.toUpperCase()) || group || allGroups[0];

  // Dynamic Batch Selection info
  const currentBatchInfo = {
    groupId: activeGroup.groupId || currentBatchId,
    name: activeGroup.groupName || `InfinityGram 50 Gold Club - ${currentBatchId}`,
    status: activeGroup.status || 'recruiting',
    startDate: activeGroup.startDate || 'Pending Schedule',
    scheduledTime: activeGroup.scheduledTime || 'Pending Setup',
    currentCycleDay: activeGroup.currentCycleDay || 0,
  };

  const isEventLiveOrActive = currentBatchInfo.status === 'active' || currentBatchInfo.status === 'live' || currentBatchInfo.currentCycleDay > 0;

  // Live countdown to configured start date and scheduled time
  const [eventCountdown, setEventCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; isReady: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let targetTime = 0;

      if (currentBatchInfo.startDate && !currentBatchInfo.startDate.includes('Pending') && !currentBatchInfo.startDate.includes('Not Started')) {
        let timeStr = currentBatchInfo.scheduledTime || '07:00 AM';
        let cleanTime = timeStr.replace(/IST/i, '').trim();
        let [timePart, meridiem] = cleanTime.split(' ');
        let [hStr, mStr] = (timePart || '07:00').split(':');
        let hours = parseInt(hStr || '7', 10);
        let mins = parseInt(mStr || '0', 10);
        if (meridiem && meridiem.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (meridiem && meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;

        const targetDate = new Date(currentBatchInfo.startDate);
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
  }, [currentBatchInfo.startDate, currentBatchInfo.scheduledTime]);

  // 🌐 BATCH URL ROUTE & QUERY SYNCHRONIZATION
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const queryBatch = searchParams.get('batch');
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);
      const batchSegment = segments[2] || queryBatch;

      if (batchSegment) {
        const clean = batchSegment.toLowerCase();
        let targetBatchId = '';
        if (clean === 'batch-a' || clean === 'a' || clean === 'group-001') {
          targetBatchId = 'GROUP-001';
        } else if (clean === 'batch-b' || clean === 'b' || clean === 'group-002') {
          targetBatchId = 'GROUP-002';
        } else if (clean === 'batch-c' || clean === 'c' || clean === 'group-003') {
          targetBatchId = 'GROUP-003';
        } else if (clean === 'batch-d' || clean === 'd' || clean === 'group-004') {
          targetBatchId = 'GROUP-004';
        } else {
          const found = (allGroups || []).find(g => 
            g.groupId.toLowerCase() === clean || 
            g.groupName.toLowerCase().includes(clean)
          );
          if (found) targetBatchId = found.groupId;
        }

        if (targetBatchId && targetBatchId.toUpperCase() !== (group.groupId || '').toUpperCase()) {
          setSelectedBatchId(targetBatchId.toUpperCase());
        }
      }
    }
  }, [allGroups, setSelectedBatchId, group.groupId]);

  const handleSelectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    if (typeof window !== 'undefined') {
      const newUrl = `/admin/slots/${batchId.toLowerCase()}`;
      window.history.pushState({ batch: batchId }, '', newUrl);
    }
  };

  const handleOpenScheduleModal = () => {
    if (isEventLiveOrActive) {
      alert('🔒 Schedule is Locked: The 50-day draw event has already started. Event date and daily draw time cannot be edited once active.');
      return;
    }
    setStartDateInput(activeGroup.startDate || new Date().toISOString().split('T')[0]);
    setScheduledTimeInput(activeGroup.scheduledTime || '');
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async () => {
    if (!startDateInput) {
      alert('Please select a valid event start date.');
      return;
    }
    setIsSavingSchedule(true);
    try {
      await updateGroupSchedule(currentBatchInfo.groupId, startDateInput, scheduledTimeInput);
      setShowScheduleModal(false);
      alert(`✅ Success: Schedule updated for ${currentBatchInfo.groupId} and stored in database!`);
      if (typeof fetchDbGroups === 'function') await fetchDbGroups();
    } catch (e: any) {
      alert(`Error updating schedule: ${e.message}`);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleOpenStartEventModal = () => {
    setEventStartDate(activeGroup.startDate || new Date().toISOString().split('T')[0]);
    setEventDrawTime(activeGroup.scheduledTime && !activeGroup.scheduledTime.includes('Pending') ? activeGroup.scheduledTime : '07:00 AM IST');
    setShowStartEventModal(true);
  };

  const handleConfirmStartEvent = async () => {
    if (!eventStartDate) {
      alert('Please choose an official start date for the 50-day event.');
      return;
    }
    setIsStartingEvent(true);
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_event',
          groupId: currentBatchInfo.groupId,
          startDate: eventStartDate,
          scheduledTime: eventDrawTime,
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowStartEventModal(false);
        alert(`🎉 ${data.message}`);
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

  const handleAutoFillBots = async () => {
    if (availableCount === 0) {
      alert(`Batch ${currentBatchInfo.groupId} is already 100% full (50/50 members)!`);
      return;
    }
    const confirmFill = window.confirm(
      `⚡ Auto-Fill ${availableCount} Open Slots?\n\nThis will assign verified system bot users from the database into all remaining empty slots to make ${currentBatchInfo.groupId} 50/50 Full & Ready.\n\nAlready created bot users will be reused directly without creating unnecessary duplicate accounts.`
    );
    if (!confirmFill) return;

    setIsAutoFilling(true);
    try {
      const res = await autoFillGroupWithSystemUsers(currentBatchInfo.groupId);
      if (res.success) {
        alert(`✅ ${res.message || `Successfully auto-filled ${currentBatchInfo.groupId} to 50/50 Full!`}`);
      } else {
        alert(`❌ Auto-fill error: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || 'Auto-fill failed'}`);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleDownloadUserRoster = () => {
    // Collect occupied slots from active group
    const occupiedSlotsList = (memberSlots || []).filter(s => isSlotOccupied(s));

    if (occupiedSlotsList.length === 0) {
      alert('No occupied members found in this group to download.');
      return;
    }

    const rows = occupiedSlotsList.map((slot) => {
      const matchedUser = (dbUsers || []).find((u: any) => 
        (slot.memberId && slot.memberId !== '—' && u.memberId === slot.memberId) ||
        (slot.memberName && slot.memberName !== '—' && (u.name === slot.memberName || u.fullName === slot.memberName))
      );

      const rawName = slot.memberName || matchedUser?.name || matchedUser?.fullName || 'Member';
      const cleanName = rawName.replace(/\s*\(BOT\)/gi, '');
      const memberId = (slot.memberId && slot.memberId !== '—')
        ? slot.memberId 
        : (matchedUser?.memberId || `LOP-${String(slot.slotNumber).padStart(6, '0')}`);
      
      const rawMobile = String(matchedUser?.mobile || (slot as any).mobile || '').trim();
      const maskedContact = rawMobile ? (rawMobile.length > 3 ? rawMobile.slice(0, -3) + '***' : rawMobile) : '—';
      const email = matchedUser?.email || '—';

      return {
        'Slot Number': `#${slot.slotNumber}`,
        'Member Name': cleanName,
        'Member ID': memberId,
        'Contact Info': maskedContact,
        'Email Address': email,
        'Deposit Status': '₹10,000 Verified'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${currentBatchInfo.groupId} Roster`);
    XLSX.writeFile(workbook, `${currentBatchInfo.groupId}_Users_Roster.xlsx`);
  };

  const handleDirectAssignUser = async (targetUser: any) => {
    if (!slotToAssign) return;
    const targetIdentifier = targetUser.memberId || targetUser.email || targetUser.id;
    setIsAssigning(true);
    try {
      const res = await manualAssignSlot(targetIdentifier, slotToAssign, currentBatchInfo.groupId);
      if (res.success) {
        setSlotToAssign(null);
        setSelectedUserIdToAssign('');
        setUserSearchQuery('');
      } else {
        alert(`❌ Assignment failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error assigning slot: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleConfirmAssignSlot = async () => {
    if (!slotToAssign) return;

    let targetIdentifier = '';
    if (assignTab === 'existing' || assignTab === 'bots') {
      if (!selectedUserIdToAssign) {
        alert('Please select a registered member or bot from the list.');
        return;
      }
      targetIdentifier = selectedUserIdToAssign;
    } else {
      if (!customName.trim() || !customEmail.trim()) {
        alert('Please enter member full name and email address.');
        return;
      }
      targetIdentifier = customEmail.trim();
    }

    setIsAssigning(true);
    try {
      const res = await manualAssignSlot(targetIdentifier, slotToAssign, currentBatchInfo.groupId);
      if (res.success) {
        setSlotToAssign(null);
        setSelectedUserIdToAssign('');
        setCustomName('');
        setCustomEmail('');
        setCustomMobile('');
      } else {
        alert(`❌ Assignment failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error assigning slot: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleResetWinnerStatus = async (slotNo: number, memberId?: string, memberName?: string) => {
    const confirmReset = window.confirm(
      `🔄 Reset Winner Status for Slot #${slotNo}?\n\nMember: ${memberName || memberId || 'Slot #' + slotNo}\n\nThis will reset this member's reward status from "Won 1g Gold" back to "In Selection Pool", clear the winner lock in Firestore, and make this member eligible for future daily draws.`
    );
    if (!confirmReset) return;

    try {
      const res = await resetSlotWinnerStatus(slotNo, currentBatchInfo.groupId, memberId);
      if (res?.success) {
        alert(`✅ ${res.message || `Slot #${slotNo} restored to "In Selection Pool" successfully!`}`);
        if (typeof fetchDbGroups === 'function') await fetchDbGroups();
      } else {
        alert(`❌ Error resetting winner status: ${res?.error || 'Failed to reset status'}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // Helper to accurately identify if a slot member won gold in THIS batch
  const isSlotWon = (slot: any) => {
    if (!slot || slot.memberId === '—' || !slot.memberId || slot.status === 'Available') return false;
    if (slot.status === 'Won 1g Gold' || Boolean(slot.wonDay)) return true;
    
    // Check in pastWinners list from Firestore strictly for this batch
    if (pastWinners && pastWinners.length > 0) {
      const matchInWinners = pastWinners.some((w: any) => 
        ((w.batchId || w.group || w.groupId || 'GROUP-001').toUpperCase() === currentBatchInfo.groupId.toUpperCase()) &&
        (
          (w.winnerMemberId && slot.memberId && slot.memberId !== '—' && w.winnerMemberId === slot.memberId) ||
          (w.winnerName && slot.memberName && slot.memberName !== '—' && w.winnerName.toLowerCase() === slot.memberName.toLowerCase()) ||
          (w.slotNumber && Number(w.slotNumber) === Number(slot.slotNumber))
        )
      );
      if (matchInWinners) return true;
    }

    // Check in dbUsers list strictly for this batch
    if (dbUsers && dbUsers.length > 0) {
      const matchInUsers = dbUsers.some((u: any) => 
        ((u.group || u.groupId || 'GROUP-001').toUpperCase() === currentBatchInfo.groupId.toUpperCase()) &&
        (
          (u.memberId && slot.memberId && slot.memberId !== '—' && u.memberId === slot.memberId) ||
          (u.name && slot.memberName && slot.memberName !== '—' && u.name.toLowerCase() === slot.memberName.toLowerCase())
        ) && (u.rewardStatus === 'Won 1g Gold' || Boolean(u.wonDay) || u.status === 'Won 1g Gold')
      );
      if (matchInUsers) return true;
    }

    return false;
  };

  // Helper to determine if a slot is occupied by a valid member
  const isSlotOccupied = (slot: any) => {
    if (!slot) return false;
    if (slot.memberId === '—' || !slot.memberId || slot.status === 'Available' || (slot.memberName && slot.memberName.startsWith('Available Slot'))) return false;
    return slot.status === 'Occupied' || slot.status === 'Won 1g Gold' || isSlotWon(slot) || (Boolean(slot.memberName) && slot.memberName !== '—');
  };

  const getSlotWonDay = (slot: any) => {
    if (slot.wonDay) return slot.wonDay;
    const matchInWinners: any = pastWinners?.find((w: any) => 
      ((w.batchId || w.group || w.groupId || 'GROUP-001').toUpperCase() === currentBatchInfo.groupId.toUpperCase()) &&
      (
        (w.winnerMemberId && slot.memberId && slot.memberId !== '—' && w.winnerMemberId === slot.memberId) ||
        (w.winnerName && slot.memberName && slot.memberName !== '—' && w.winnerName.toLowerCase() === slot.memberName.toLowerCase()) ||
        (w.slotNumber && Number(w.slotNumber) === Number(slot.slotNumber))
      )
    );
    if (matchInWinners) return matchInWinners.dayNumber || matchInWinners.cycleDay || 1;
    const matchInUsers = dbUsers?.find((u: any) => 
      ((u.group || u.groupId || 'GROUP-001').toUpperCase() === currentBatchInfo.groupId.toUpperCase()) &&
      (
        (u.memberId && slot.memberId && slot.memberId !== '—' && u.memberId === slot.memberId) ||
        (u.name && slot.memberName && slot.memberName !== '—' && u.name.toLowerCase() === slot.memberName.toLowerCase())
      )
    );
    if (matchInUsers?.wonDay) return matchInUsers.wonDay;
    return null;
  };

  // 50 slots mapping from activeGroup
  const memberSlots = activeGroup.slots || [];
  const wonCount = memberSlots.filter(s => isSlotWon(s)).length;
  const occupiedCount = memberSlots.filter(s => isSlotOccupied(s)).length;
  const availableCount = Math.max(0, 50 - occupiedCount);

  // Filter slots
  const filteredSlots = memberSlots.filter(slot => {
    const isWon = isSlotWon(slot);
    const isOccupied = isSlotOccupied(slot);
    const isAvailable = !isOccupied;

    if (filterState === 'occupied' && (!isOccupied || isWon)) return false;
    if (filterState === 'won' && !isWon) return false;
    if (filterState === 'available' && !isAvailable) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = String(slot.slotNumber).includes(q);
      const matchName = slot.memberName?.toLowerCase().includes(q);
      const matchId = slot.memberId?.toLowerCase().includes(q);
      return matchNum || matchName || matchId;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 text-slate-900">
      
      {/* 🌟 ULTRA-PREMIUM HEADER & COMMAND CENTER */}
      <div className="bg-gradient-to-br from-[#0B1E39] via-[#0F294D] to-[#071529] p-6 sm:p-8 rounded-[2.2rem] text-white shadow-2xl border border-white/10 space-y-6 relative overflow-hidden">
        
        {/* Subtle Background Glow Effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP SECTION: TITLE & BATCH SELECTOR TABS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>50-Member Gold Club Engine</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Slot Control Grid
              </h1>
              <span className="text-xs font-mono font-extrabold bg-amber-400/15 text-amber-300 px-3 py-1 rounded-xl border border-amber-400/30 shadow-xs">
                {currentBatchInfo.groupId}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Real-time matrix of all 50 slots for <strong className="text-white font-semibold">{currentBatchInfo.name}</strong>. Monitor member allocations, deposits, and daily gold winners.
            </p>
          </div>

          {/* BATCH SELECTOR PILLS */}
          <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex flex-wrap items-center gap-1.5 self-start lg:self-auto">
            {allGroups.map((g) => {
              const isSelected = g.groupId === currentBatchInfo.groupId;
              return (
                <button
                  key={g.groupId}
                  onClick={() => handleSelectBatch(g.groupId)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-[#0B1E39] border-amber-300 shadow-md shadow-amber-400/25 scale-[1.02]'
                      : 'bg-transparent text-slate-300 border-transparent hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{g.groupName ? g.groupName.replace('InfinityGram 50 Gold Club - ', '') : g.groupId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${isSelected ? 'bg-[#0B1E39]/20 text-[#0B1E39]' : 'bg-white/10 text-amber-300'}`}>
                    {g.totalMembers || 0}/50
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE SECTION: SCHEDULE STATUS BAR & ACTION BUTTONS */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4 relative z-10 w-full overflow-hidden">
          {/* Status info pills - Responsive 4 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs w-full">
            {/* 1. START DATE PILL / BUTTON */}
            <button
              onClick={() => {
                if (!isEventLiveOrActive) handleOpenScheduleModal();
              }}
              title={isEventLiveOrActive ? 'Schedule is locked (event active)' : 'Click to Set or Edit Start Date'}
              className={`rounded-xl px-3.5 py-2.5 border flex items-center space-x-3 text-left transition-all min-w-0 w-full ${
                isEventLiveOrActive
                  ? 'bg-white/5 border-white/10 cursor-default'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-400/50 cursor-pointer shadow-xs active:scale-[0.98]'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-semibold truncate">Start Date</span>
                <span className="font-bold text-white font-mono text-xs truncate block">{currentBatchInfo.startDate || 'Pending Schedule'}</span>
              </div>
            </button>

            {/* 2. DAILY DRAW TIME PILL / BUTTON */}
            <button
              onClick={() => {
                if (!isEventLiveOrActive) handleOpenScheduleModal();
              }}
              title={isEventLiveOrActive ? 'Schedule is locked (event active)' : 'Click to Set or Edit Draw Time'}
              className={`rounded-xl px-3.5 py-2.5 border flex items-center space-x-3 text-left transition-all min-w-0 w-full ${
                isEventLiveOrActive
                  ? 'bg-white/5 border-white/10 cursor-default'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-400/50 cursor-pointer shadow-xs active:scale-[0.98]'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-semibold truncate">Daily Draw</span>
                <span className="font-bold text-white font-mono text-xs truncate block">{currentBatchInfo.scheduledTime}</span>
              </div>
            </button>

            {/* 3. EVENT CYCLE PILL */}
            <div className="bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10 flex items-center space-x-3 min-w-0 w-full">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isEventLiveOrActive ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-semibold truncate">Event Cycle</span>
                <span className={`font-black text-xs truncate block ${isEventLiveOrActive ? 'text-emerald-300' : 'text-blue-300'}`}>
                  {isEventLiveOrActive ? `Live (Day ${currentBatchInfo.currentCycleDay || 1}/50)` : 'Pre-Event (Recruiting)'}
                </span>
              </div>
            </div>

            {/* 4. LAUNCH COUNTDOWN CLICKABLE ACTION BUTTON */}
            <button
              onClick={() => {
                if (!isEventLiveOrActive) {
                  handleOpenScheduleModal();
                }
              }}
              title={isEventLiveOrActive ? 'Event is actively live' : 'Click to Set or Edit Launch Date & Draw Time'}
              className={`rounded-xl px-3.5 py-2.5 border flex items-center space-x-3 text-left transition-all min-w-0 w-full ${
                isEventLiveOrActive
                  ? 'bg-amber-500/10 border-amber-400/30 cursor-default'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/50 hover:border-amber-400 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              <Hourglass className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-amber-300/90 uppercase font-mono tracking-wider font-semibold truncate">
                    {isEventLiveOrActive ? 'Daily Draw Timer' : 'Launch Countdown'}
                  </span>
                  {!isEventLiveOrActive && (
                    <span className="text-[9px] bg-amber-400/25 text-amber-300 border border-amber-400/50 px-1.5 py-0.5 rounded font-sans font-bold whitespace-nowrap shrink-0">
                      Click to Set ✏️
                    </span>
                  )}
                </div>
                <span className="font-mono font-black text-amber-300 text-xs tracking-wider block truncate mt-0.5">
                  {String(eventCountdown.days).padStart(2, '0')}d : {String(eventCountdown.hours).padStart(2, '0')}h : {String(eventCountdown.minutes).padStart(2, '0')}m : {String(eventCountdown.seconds).padStart(2, '0')}s
                </span>
              </div>
            </button>
          </div>

          {/* Dedicated Action Buttons Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10 w-full">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Real-time Slot Control Hub</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
              {/* If not 50/50, show Auto-Fill Button */}
              {availableCount > 0 && !isEventLiveOrActive && (
                <button
                  onClick={handleAutoFillBots}
                  disabled={isAutoFilling}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2 border border-blue-400/30"
                >
                  {isAutoFilling ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Auto-Filling {availableCount} Slots...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ Auto-Fill Bot Users</span>
                      <span className="bg-white/20 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                        {availableCount} Open
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* If 50/50 Full and not yet live, show ONLY "🚀 SET DATE & TIME TO START EVENT (50/50 FULL)" button */}
              {availableCount === 0 && !isEventLiveOrActive && (
                <button
                  onClick={handleOpenStartEventModal}
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-xl shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer flex items-center space-x-2 border border-amber-200 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950" />
                  <span>🚀 SET DATE & TIME TO START EVENT (50/50 FULL)</span>
                </button>
              )}

              {/* If event is already live, show locked schedule status and shortcut to live draw */}
              {isEventLiveOrActive ? (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center space-x-2 bg-slate-800/90 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-inner cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>🔒 Schedule Locked (Live)</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBatchId(currentBatchInfo.groupId);
                      setCurrentView('admin-reward-flow-control');
                    }}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Draw Stream</span>
                  </button>
                </div>
              ) : (
                availableCount > 0 && (
                  <button
                    onClick={handleOpenScheduleModal}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center space-x-2 border border-amber-300/40"
                  >
                    <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Edit Date & Time</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: 4 HIGH-VISIBILITY METRIC TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider font-mono">Total Slots</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white font-mono">50</span>
              <span className="text-[10px] text-slate-400 font-mono">Max Capacity</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider font-mono">Occupied & Verified</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">{occupiedCount}</span>
              <span className="text-xs text-slate-400 font-mono">/ 50 ({Math.round((occupiedCount / 50) * 100)}%)</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider font-mono">Gold Winners</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-300 font-mono">{wonCount}</span>
              <span className="text-[10px] text-amber-400 font-mono">1g Coins Won</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider font-mono">Available Slots</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-blue-300 font-mono">{availableCount}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${availableCount === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {availableCount === 0 ? 'Full' : 'Open'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH TOOLBAR WITH VIEW TOGGLE */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* TAB BUTTONS */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterState === 'all'
                ? 'bg-[#0B1E39] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 50 Slots ({memberSlots.length})
          </button>
          <button
            onClick={() => setFilterState('occupied')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterState === 'occupied'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Occupied ({occupiedCount})
          </button>
          <button
            onClick={() => setFilterState('won')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterState === 'won'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Won Gold ({wonCount})
          </button>
          <button
            onClick={() => setFilterState('available')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterState === 'available'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Available ({availableCount})
          </button>
        </div>

        {/* SEARCH, DOWNLOAD & VIEW SWITCHER */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search slot # or name..."
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2F6FED] transition-all"
            />
          </div>

          {/* DOWNLOAD ALL USERS EXCEL BUTTON */}
          <button
            onClick={handleDownloadUserRoster}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer shrink-0 border border-emerald-500/30 active:scale-95"
            title="Download User Roster as Excel (.xlsx) Spreadsheet"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Roster (Excel)</span>
          </button>

          {/* VIEW TOGGLE PILLS */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0B1E39] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0B1E39] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 50-SLOT TABLE VIEW OR GRID VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-black">Slot #</th>
                  <th className="py-3.5 px-4 font-black">Member Profile</th>
                  <th className="py-3.5 px-4 font-black">Member ID</th>
                  <th className="py-3.5 px-4 font-black">Contact Info</th>
                  <th className="py-3.5 px-4 font-black">Deposit Status</th>
                  <th className="py-3.5 px-4 font-black">Reward Status</th>
                  <th className="py-3.5 px-4 font-black text-right">Actions / Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSlots.map((slot) => {
                  const isWon = isSlotWon(slot);
                  const isOccupied = slot.status === 'Occupied' || isWon || (slot.memberName && slot.memberName !== '—' && !slot.memberName.startsWith('Available Slot'));
                  const isAvailable = !isOccupied;
                  const wonDay = getSlotWonDay(slot);

                  const matchedUser = dbUsers.find(u => 
                    (slot.memberId && slot.memberId !== '—' && u.memberId === slot.memberId) ||
                    (slot.memberName && slot.memberName !== '—' && (u.name === slot.memberName || u.fullName === slot.memberName))
                  );

                  const isBot = matchedUser?.isSimulated || matchedUser?.userType === 'simulated' || slot.memberName?.toLowerCase().includes('bot');

                  return (
                    <tr 
                      key={slot.slotNumber} 
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isWon ? 'bg-amber-50/30' : isOccupied ? 'bg-white' : 'bg-slate-50/40 text-slate-400'
                      }`}
                    >
                      {/* 1. SLOT # */}
                      <td className="py-3.5 px-4 font-mono font-black text-[#0B1E39]">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                          isWon
                            ? 'bg-amber-400 text-amber-950 shadow-xs'
                            : isOccupied
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          #{String(slot.slotNumber).padStart(2, '0')}
                        </span>
                      </td>

                      {/* 2. FULL NAME PROFILE */}
                      <td className="py-3.5 px-4">
                        {isOccupied ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0B1E39] to-[#2F6FED] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              {slot.memberName ? slot.memberName.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div className="min-w-0">
                              <span className="font-extrabold text-slate-900 truncate">
                                {slot.memberName}
                              </span>
                              <span className="text-[10px] text-slate-500 block font-mono font-medium">
                                Occupied: {slot.occupiedDate || slot.joinedDate || slot.assignedDate || '01 Oct 2026'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-slate-400">
                            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-xs">
                              +
                            </div>
                            <span className="font-semibold italic">Open Slot (Available)</span>
                          </div>
                        )}
                      </td>

                      {/* 3. MEMBER ID */}
                      <td className="py-3.5 px-4 font-mono">
                        {isOccupied ? (
                          <span className="text-xs font-bold text-slate-700">
                            {slot.memberId || `LOP-${String(slot.slotNumber).padStart(6, '0')}`}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* 4. CONTACT DETAILS */}
                      <td className="py-3.5 px-4 text-[11px]">
                        {isOccupied ? (
                          <div className="space-y-0.5">
                            <p className="font-medium text-slate-700">{matchedUser?.mobile || '+91 98765 43210'}</p>
                            <p className="text-slate-400 text-[10px] truncate max-w-[180px]">{matchedUser?.email || `${slot.memberName?.toLowerCase().replace(/[^a-z]/g, '')}@infinitygram.net`}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Ready for allocation</span>
                        )}
                      </td>

                      {/* 5. DEPOSIT STATUS */}
                      <td className="py-3.5 px-4">
                        {isOccupied ? (
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>₹10,000 Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-xl text-[11px] font-medium">
                            <span>Not Started</span>
                          </span>
                        )}
                      </td>

                      {/* 6. REWARD STATUS */}
                      <td className="py-3.5 px-4">
                        {isWon ? (
                          <span className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xs">
                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                            <span>Won 1g Gold {wonDay ? `(Day ${wonDay})` : ''}</span>
                          </span>
                        ) : isOccupied ? (
                          <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold">
                            <span>In Selection Pool</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* 7. ACTIONS / CONTROLS */}
                      <td className="py-3.5 px-4 text-right">
                        {isOccupied ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* View / Audit Profile */}
                            <button
                              onClick={() => setSelectedMemberModal(slot)}
                              title="View Member Profile Audit"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Winner Actions: Option to Reset to Selection Pool, Edit, or Delete */}
                            {isWon ? (
                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleResetWinnerStatus(slot.slotNumber, slot.memberId, slot.memberName)}
                                  title="Reset Winner status back into Selection Pool (Eligible for future draws)"
                                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold transition-all cursor-pointer flex items-center space-x-1 shadow-xs hover:scale-105"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
                                  <span className="text-[10px] font-black">Reset to Pool</span>
                                </button>

                                <button
                                  onClick={() => setSlotToAssign(slot.slotNumber)}
                                  title="Reassign / Edit Member on Slot"
                                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSlotToDelete({
                                      slotNumber: slot.slotNumber,
                                      memberName: slot.memberName,
                                      memberId: slot.memberId,
                                    });
                                  }}
                                  title="Delete / Release Slot"
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : isEventLiveOrActive ? (
                              <div className="flex items-center space-x-1.5">
                                <span 
                                  title="Slot edit/delete locked during active 50-day draw cycle"
                                  className="inline-flex items-center space-x-1 bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-xl text-[10px] font-bold"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Locked</span>
                                </span>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => setSlotToAssign(slot.slotNumber)}
                                  title="Reassign / Edit Member on Slot"
                                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSlotToDelete({
                                      slotNumber: slot.slotNumber,
                                      memberName: slot.memberName,
                                      memberId: slot.memberId,
                                    });
                                  }}
                                  title="Delete / Release Slot"
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setSlotToAssign(slot.slotNumber)}
                            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Assign Slot</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {filteredSlots.map((slot) => {
            const isWon = isSlotWon(slot);
            const isOccupied = slot.status === 'Occupied' || isWon || (slot.memberName && slot.memberName !== '—' && !slot.memberName.startsWith('Available Slot'));
            const isAvailable = !isOccupied;
            const wonDay = getSlotWonDay(slot);

            return (
              <motion.div
                key={slot.slotNumber}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  if (isOccupied) {
                    setSelectedMemberModal(slot);
                  } else {
                    setSlotToAssign(slot.slotNumber);
                  }
                }}
                className={`relative rounded-2xl p-3 border text-center transition-all flex flex-col justify-between min-h-[115px] cursor-pointer ${
                  isWon
                    ? 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300 shadow-sm'
                    : isOccupied
                    ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500 shadow-sm'
                    : 'bg-slate-50/80 border-dashed border-slate-300 hover:border-blue-400 text-slate-400 hover:bg-blue-50/40'
                }`}
              >
                {/* SLOT BADGE */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded-md ${
                    isWon
                      ? 'bg-amber-400 text-amber-950 font-black'
                      : isOccupied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    #{slot.slotNumber}
                  </span>

                  {isWon && <Crown className="w-3.5 h-3.5 text-amber-600" />}
                  {isOccupied && !isWon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isAvailable && <span className="text-blue-500 text-xs font-bold">+</span>}
                </div>

                {/* MEMBER NAME / ID */}
                <div className="my-1.5 text-left">
                  {isOccupied ? (
                    <>
                      <p className="text-[11px] font-extrabold text-[#0B1E39] truncate" title={slot.memberName}>
                        {slot.memberName}
                      </p>
                      <p className="text-[9px] font-mono text-slate-500 truncate">
                        {slot.memberId}
                      </p>
                    </>
                  ) : (
                    <p className="text-[11px] font-bold text-blue-600 text-center">
                      + Assign Slot
                    </p>
                  )}
                </div>

                {/* STATUS FOOTER */}
                <div className="pt-1 border-t border-black/5 text-[9px] font-extrabold">
                  {isWon ? (
                    <span className="text-amber-800 font-black">Won 1g Gold</span>
                  ) : isOccupied ? (
                    <span className="text-emerald-700">Verified Member</span>
                  ) : (
                    <span className="text-slate-400">Available</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 📅 SET / EDIT SCHEDULE MODAL (SYNCHRONIZED WITH DATABASE) */}
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Configure Batch Event Schedule</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Set Date & Draw Time</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Set the start date and daily draw time for <span className="font-mono text-amber-700 font-bold">{currentBatchInfo.groupId}</span>. This schedule syncs instantly to both the Grid View and Reward Program pages in the database.
                </p>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Target Batch:</span>
                  <span className="font-mono text-[#0B1E39] font-black">{currentBatchInfo.name}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Current Status:</span>
                  <span className="font-mono text-blue-700 font-black">{currentBatchInfo.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Event Official Start Date
                  </label>
                  <input
                    type="date"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <ClockTimePicker
                  label="Daily Selection Scheduled Time"
                  value={scheduledTimeInput || '07:00 AM IST'}
                  onChange={(formatted) => setScheduledTimeInput(formatted)}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSavingSchedule}
                  onClick={handleSaveSchedule}
                  className="w-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSchedule ? 'Saving...' : 'Save Schedule to DB'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 START 50-DAY EVENT MODAL (50/50 FULL LAUNCHPAD) */}
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-5 sm:p-8 border border-amber-300 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
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
                  <span>50/50 Capacity Reached • Ready for Launch</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">
                  Launch 50-Day Event Cycle
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Set the official launch date and daily draw time for <span className="font-mono text-amber-700 font-black">{currentBatchInfo.name} ({currentBatchInfo.groupId})</span>.
                </p>
              </div>

              {/* BATCH READINESS CARD */}
              <div className="bg-gradient-to-br from-[#0B1E39] to-[#0F294D] text-white p-4.5 rounded-2xl border border-white/10 space-y-2.5 text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Target Group:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">{currentBatchInfo.groupId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Member Slots:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    50 / 50 Verified (100% Full)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Total Deposit Escrow:</span>
                  <span className="font-mono font-black text-white">₹5,00,000 Verified</span>
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
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-3.5 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>

                <ClockTimePicker
                  label="Daily Gold Winner Draw Time"
                  value={eventDrawTime || '07:00 AM IST'}
                  onChange={(formatted) => setEventDrawTime(formatted)}
                />

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black">What happens next:</span> Batch status will transition from <span className="font-mono font-bold">Recruiting</span> to <span className="font-mono font-bold text-emerald-700">Active (Day 1/50)</span>, the schedule will lock, and members can view the live daily gold countdown on their dashboards.
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
                  disabled={isStartingEvent || !eventStartDate}
                  onClick={handleConfirmStartEvent}
                  className="w-2/3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-amber-500/30 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950" />
                  <span>{isStartingEvent ? 'Starting Event...' : '🚀 Confirm & Start 50-Day Event'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEMBER SLOT DETAILS MODAL */}
      <AnimatePresence>
        {selectedMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0B1E39] to-[#2F6FED] text-white flex items-center justify-center text-xl font-black shadow-lg">
                  #{selectedMemberModal.slotNumber}
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Slot Verified & Active</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0B1E39]">{selectedMemberModal.memberName}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedMemberModal.memberId}</p>
                </div>
              </div>

              {/* Slot Details */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Assigned Group:</span>
                  <span className="font-extrabold text-[#0B1E39]">{currentBatchInfo.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Slot Number:</span>
                  <span className="font-mono text-[#0B1E39] font-black">Slot #{selectedMemberModal.slotNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Deposit Requirement:</span>
                  <span className="font-mono text-emerald-700 font-black">₹10,000 (Verified & Locked)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Occupied Date:</span>
                  <span className="font-mono text-slate-900 font-bold bg-slate-200/60 px-2.5 py-0.5 rounded-lg">
                    {selectedMemberModal.occupiedDate || selectedMemberModal.joinedDate || selectedMemberModal.assignedDate || '01 Oct 2026'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-medium">Gold Reward Status:</span>
                  {isSlotWon(selectedMemberModal) || selectedMemberModal.status === 'Won 1g Gold' ? (
                    <span className="font-black text-amber-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1 shadow-xs">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>Won 1g Gold {getSlotWonDay(selectedMemberModal) ? `(Day ${getSlotWonDay(selectedMemberModal)})` : ''}</span>
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In Selection Pool</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="space-y-2 pt-2">
                {(isSlotWon(selectedMemberModal) || selectedMemberModal.status === 'Won 1g Gold') && (
                  <button
                    onClick={async () => {
                      const slotNo = selectedMemberModal.slotNumber;
                      const mId = selectedMemberModal.memberId;
                      const mName = selectedMemberModal.memberName;
                      setSelectedMemberModal(null);
                      await handleResetWinnerStatus(slotNo, mId, mName);
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black py-3.5 rounded-2xl text-xs cursor-pointer shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-950 stroke-[2.5]" />
                    <span>Reset Status to "In Selection Pool"</span>
                  </button>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const slotNum = selectedMemberModal.slotNumber;
                      setSelectedMemberModal(null);
                      setSlotToAssign(slotNum);
                    }}
                    className="w-1/3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3.5 rounded-2xl text-xs cursor-pointer flex items-center justify-center space-x-1.5 transition-all border border-blue-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Reassign</span>
                  </button>

                  <button
                    onClick={() => {
                      const slotToDel = {
                        slotNumber: selectedMemberModal.slotNumber,
                        memberName: selectedMemberModal.memberName,
                        memberId: selectedMemberModal.memberId,
                      };
                      setSelectedMemberModal(null);
                      setSlotToDelete(slotToDel);
                    }}
                    className="w-1/3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Release</span>
                  </button>

                  <button
                    onClick={() => setSelectedMemberModal(null)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs cursor-pointer transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE / UNASSIGN SLOT CONFIRMATION MODAL */}
      <AnimatePresence>
        {slotToDelete && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 sm:p-8 border border-rose-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSlotToDelete(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#0B1E39]">Confirm Slot Deletion / Unassign</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Are you sure you want to remove <strong className="text-slate-900 font-bold">{slotToDelete.memberName || `Member #${slotToDelete.slotNumber}`}</strong> from <strong className="text-[#2F6FED]">Slot #{slotToDelete.slotNumber}</strong> in {currentBatchInfo.name}?
                </p>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-[11px] text-rose-800 space-y-1">
                  <p className="font-bold">⚠️ Warning:</p>
                  <p>This action will unassign the user from this slot, update the database in real time, and mark Slot #{slotToDelete.slotNumber} as an Available Open Slot.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setSlotToDelete(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeletingSlot}
                  onClick={async () => {
                    setIsDeletingSlot(true);
                    const res = await unassignSlot(slotToDelete.slotNumber, currentBatchInfo.groupId, slotToDelete.memberId || slotToDelete.memberName);
                    setIsDeletingSlot(false);
                    setSlotToDelete(null);
                    if (res?.success) {
                      alert(`✅ Slot #${slotToDelete.slotNumber} was successfully deleted/released and is now available!`);
                    } else {
                      alert(`❌ Error releasing slot: ${res?.error || 'Failed to unassign slot.'}`);
                    }
                  }}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-2xl text-xs cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeletingSlot ? 'Deleting...' : 'Confirm Delete Slot'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👤 ASSIGN / EDIT MEMBER SLOT MODAL */}
      <AnimatePresence>
        {slotToAssign !== null && (
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
                onClick={() => {
                  setSlotToAssign(null);
                  setSelectedUserIdToAssign('');
                }}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-black">
                  <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Manual Member Assignment</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">
                  Assign Slot #{slotToAssign}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Assign a registered or verified member to <strong className="text-[#0B1E39]">{currentBatchInfo.name} ({currentBatchInfo.groupId})</strong>. Deposit will be automatically verified for this slot.
                </p>
              </div>

              {/* TABS: SELECT EXISTING DB USER VS QUICK BOT VS CUSTOM MEMBER */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setAssignTab('existing')}
                  className={`w-1/3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    assignTab === 'existing'
                      ? 'bg-white text-[#0B1E39] shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Users ({dbUsers.length})</span>
                </button>
                <button
                  onClick={() => setAssignTab('bots')}
                  className={`w-1/3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    assignTab === 'bots'
                      ? 'bg-white text-[#0B1E39] shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>1-Click Bot User</span>
                </button>
                <button
                  onClick={() => setAssignTab('custom')}
                  className={`w-1/3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    assignTab === 'custom'
                      ? 'bg-white text-[#0B1E39] shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Member</span>
                </button>
              </div>

              {/* TAB 1: SEARCH REGISTERED USERS */}
              {assignTab === 'existing' && (
                <div className="space-y-3 text-xs">
                  {/* SEARCH BAR & FILTER PILLS */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search member by Name, LOP ID (e.g. LOP-128476), Email, or Mobile..."
                        className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        { id: 'all', label: `All (${dbUsers.length})` },
                        { id: 'eligible', label: '🟢 Eligible (<3 Slots)' },
                        { id: 'real', label: '👤 Real Members' },
                        { id: 'bots', label: '🤖 Bots' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setUserTypeFilter(tab.id as any)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer border ${
                            userTypeFilter === tab.id
                              ? 'bg-[#0B1E39] text-white border-[#0B1E39]'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* USER LIST WITH REAL-TIME QUOTA & 1-CLICK ASSIGN BUTTON */}
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {dbUsers
                      .filter(u => {
                        const isBot = u.isSimulated === true || u.userType === 'simulated' || (u.email && u.email.endsWith('@infinitygram.net'));
                        if (userTypeFilter === 'bots' && !isBot) return false;
                        if (userTypeFilter === 'real' && isBot) return false;

                        // Check quota in this batch
                        const heldInBatch = memberSlots.filter(s => 
                          s.status !== 'Available' && (
                            (u.memberId && s.memberId === u.memberId) ||
                            (u.name && s.memberName?.toLowerCase() === u.name?.toLowerCase()) ||
                            (u.fullName && s.memberName?.toLowerCase() === u.fullName?.toLowerCase())
                          )
                        ).length;

                        if (userTypeFilter === 'eligible' && heldInBatch >= 3) return false;

                        if (!userSearchQuery.trim()) return true;
                        const q = userSearchQuery.toLowerCase();
                        return (
                          u.name?.toLowerCase().includes(q) ||
                          u.fullName?.toLowerCase().includes(q) ||
                          u.email?.toLowerCase().includes(q) ||
                          u.memberId?.toLowerCase().includes(q) ||
                          u.mobile?.toLowerCase().includes(q)
                        );
                      })
                      .map(u => {
                        const isSelected = selectedUserIdToAssign === u.memberId || selectedUserIdToAssign === u.email || selectedUserIdToAssign === u.id;
                        const isBot = u.isSimulated === true || u.userType === 'simulated' || (u.email && u.email.endsWith('@infinitygram.net'));

                        const heldInBatch = memberSlots.filter(s => 
                          s.status !== 'Available' && (
                            (u.memberId && s.memberId === u.memberId) ||
                            (u.name && s.memberName?.toLowerCase() === u.name?.toLowerCase()) ||
                            (u.fullName && s.memberName?.toLowerCase() === u.fullName?.toLowerCase())
                          )
                        ).length;

                        const isMaxLimitReached = heldInBatch >= 3;

                        return (
                          <div
                            key={u.id || u.memberId}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                                : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                                isBot ? 'bg-purple-600 text-white' : 'bg-[#0B1E39] text-white'
                              }`}>
                                {u.name ? u.name.charAt(0).toUpperCase() : 'M'}
                              </div>
                              <div className="min-w-0">
                                  <p className="font-black text-slate-900 truncate text-xs">{u.name || u.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono truncate">
                                  {u.memberId || 'LOP-ID'} • {u.email || u.mobile || 'No email'}
                                </p>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                    isMaxLimitReached 
                                      ? 'bg-rose-100 text-rose-700' 
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {heldInBatch}/3 Slots Hold in {currentBatchInfo.groupId}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 1-CLICK ASSIGN BUTTON */}
                            <div className="shrink-0">
                              {isMaxLimitReached ? (
                                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl block text-center">
                                  Limit (3/3)
                                </span>
                              ) : (
                                <button
                                  disabled={isAssigning}
                                  onClick={() => handleDirectAssignUser(u)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-2 rounded-xl text-[11px] shadow-sm hover:scale-105 cursor-pointer transition-all flex items-center space-x-1 disabled:opacity-50"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>Assign Slot #{slotToAssign}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 2: 1-CLICK BOT USER ALLOCATION */}
              {assignTab === 'bots' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-purple-950 text-xs">⚡ Instant Bot User Allocation</p>
                      <p className="text-[11px] text-purple-800 font-medium">
                        Assign an active simulated bot member to Slot #{slotToAssign} in {currentBatchInfo.groupId}.
                      </p>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {dbUsers
                      .filter(u => u.isSimulated === true || u.userType === 'simulated' || (u.email && u.email.endsWith('@infinitygram.net')))
                      .map(b => {
                        const heldInBatch = memberSlots.filter(s => 
                          s.status !== 'Available' && (
                            (b.memberId && s.memberId === b.memberId) ||
                            (b.name && s.memberName?.toLowerCase() === b.name?.toLowerCase()) ||
                            (b.fullName && s.memberName?.toLowerCase() === b.fullName?.toLowerCase())
                          )
                        ).length;

                        return (
                          <div
                            key={b.id || b.memberId}
                            className="p-3 bg-purple-50/50 hover:bg-purple-100/70 border border-purple-200 rounded-2xl flex items-center justify-between gap-3 transition-all"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                                🤖
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900">{b.name || b.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{b.memberId} • {heldInBatch}/3 in {currentBatchInfo.groupId}</p>
                              </div>
                            </div>

                            <button
                              disabled={isAssigning || heldInBatch >= 3}
                              onClick={() => handleDirectAssignUser(b)}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-3.5 py-2 rounded-xl text-[11px] shadow-sm hover:scale-105 cursor-pointer transition-all flex items-center space-x-1 disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Assign Bot</span>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 3: ENTER NEW CUSTOM MEMBER */}
              {assignTab === 'custom' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Ramesh Babu"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. rameshbabu@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number (Optional)</label>
                    <input
                      type="text"
                      value={customMobile}
                      onChange={(e) => setCustomMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    disabled={isAssigning || !customName.trim() || !customEmail.trim()}
                    onClick={handleConfirmAssignSlot}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-2xl text-xs cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isAssigning ? 'Creating & Assigning...' : `Create & Assign to Slot #${slotToAssign}`}</span>
                  </button>
                </div>
              )}

              {/* FOOTER CLOSE BUTTON */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setSlotToAssign(null);
                    setSelectedUserIdToAssign('');
                    setUserSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
