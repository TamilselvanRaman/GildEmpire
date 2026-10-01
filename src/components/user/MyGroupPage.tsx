'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Table, 
  LayoutGrid, 
  Eye, 
  Lock, 
  PlusCircle, 
  Wallet, 
  X, 
  AlertCircle,
  Check,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MyGroupPage = () => {
  const { 
    group, 
    allGroups, 
    user, 
    selectedBatchId, 
    setSelectedBatchId, 
    setCurrentView, 
    fetchDbUsers,
    withdrawableBonusBalance,
    buySlotWithWallet,
    submitDeposit
  } = useApp();

  const [activeBatchId, setActiveBatchId] = useState(group.groupId || 'GROUP-001');
  const [filter, setFilter] = useState<'All' | 'ActivePool' | 'WonGold' | 'MySlots'>('All');
  const [viewFormat, setViewFormat] = useState<'table' | 'grid'>('table');
  
  // Buy Slot Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedSlotForBuy, setSelectedSlotForBuy] = useState<number | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccessMessage, setBuySuccessMessage] = useState<string | null>(null);
  const [buyErrorMessage, setBuyErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof fetchDbUsers === 'function') {
      fetchDbUsers();
    }
  }, []);

  // Selected Group details
  const currentGroup = allGroups.find(g => g.groupId === activeBatchId) || group || allGroups[0];
  const groupSlots = currentGroup.slots || [];
  
  const occupiedCount = groupSlots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
  const availableCount = 50 - occupiedCount;

  // Resolve all slots owned by the current logged-in user across all batches
  const userSlotsByBatch = useMemo(() => {
    const map: Record<string, { batchId: string; batchName: string; slots: typeof currentGroup.slots; hasWon: boolean }> = {};

    allGroups.forEach(g => {
      const ownedSlotsInGroup = (g.slots || []).filter(s => {
        const isMemberIdMatch = Boolean(user.memberId && s.memberId && user.memberId.trim().toUpperCase() === s.memberId.trim().toUpperCase());
        const isNameMatch = Boolean(user.fullName && s.memberName && user.fullName.trim().toLowerCase() === s.memberName.trim().toLowerCase());
        const isAllocatedMatch = Boolean(Array.isArray(user.allocatedSlots) && user.allocatedSlots.some(as => (as.groupId === g.groupId || as.group === g.groupId) && as.slotNumber === s.slotNumber));
        const isPrimaryMatch = Boolean(user.groupId === g.groupId && user.slotNumber === s.slotNumber);
        return isMemberIdMatch || isNameMatch || isAllocatedMatch || isPrimaryMatch;
      });

      if (ownedSlotsInGroup.length > 0) {
        map[g.groupId] = {
          batchId: g.groupId,
          batchName: g.groupName,
          slots: ownedSlotsInGroup,
          hasWon: ownedSlotsInGroup.some(s => s.status === 'Won 1g Gold' || Boolean(s.wonDay)),
        };
      }
    });

    return map;
  }, [allGroups, user.memberId, user.fullName, user.allocatedSlots, user.groupId, user.slotNumber, currentGroup.slots]);

  const totalUserSlotsCount = Object.values(userSlotsByBatch).reduce((acc, b) => acc + b.slots.length, 0);
  const totalBatchesCount = Object.keys(userSlotsByBatch).length;

  // Check user owned slots specifically in the currently active batch
  const userOwnedSlotsInCurrentBatch = userSlotsByBatch[currentGroup.groupId]?.slots || [];
  const userOwnedSlotNumbers = new Set(userOwnedSlotsInCurrentBatch.map(s => s.slotNumber));

  // Filter slots
  const filteredSlots = groupSlots.filter(s => {
    const isOwned = userOwnedSlotNumbers.has(s.slotNumber);

    if (filter === 'MySlots') return isOwned;
    if (filter === 'WonGold') return s.status === 'Won 1g Gold';
    if (filter === 'ActivePool') return s.status !== 'Won 1g Gold';
    return true;
  });

  const isCurrentBatchLiveOrActive = currentGroup.status === 'active' || currentGroup.status === 'live' || ((currentGroup.currentCycleDay ?? 0) > 0);
  const isCurrentBatchFull = occupiedCount >= 50 || availableCount === 0;

  // Find the next recruiting batch that has available slots
  const nextOpenBatch = allGroups.find(g => {
    const occ = (g.slots || []).filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
    const live = g.status === 'active' || g.status === 'live' || ((g.currentCycleDay ?? 0) > 0);
    return !live && occ < 50;
  });

  const handleOpenBuySlot = (slotNo?: number) => {
    if ((isCurrentBatchFull || isCurrentBatchLiveOrActive) && nextOpenBatch && !slotNo) {
      setActiveBatchId(nextOpenBatch.groupId);
      setSelectedBatchId(nextOpenBatch.groupId);
      setSelectedSlotForBuy(null);
      setBuySuccessMessage(null);
      setBuyErrorMessage(null);
      setShowBuyModal(true);
      return;
    }

    if ((isCurrentBatchFull || isCurrentBatchLiveOrActive) && !nextOpenBatch && !slotNo) {
      alert('All batches are currently full or in active 50-day cycle. Next recruiting batch is being initialized.');
      return;
    }

    setSelectedSlotForBuy(slotNo || null);
    setBuySuccessMessage(null);
    setBuyErrorMessage(null);
    setShowBuyModal(true);
  };

  const handleBuyWithWallet = async () => {
    setIsBuying(true);
    setBuyErrorMessage(null);
    try {
      const res = await buySlotWithWallet(currentGroup.groupId, selectedSlotForBuy || undefined);
      if (res.success) {
        setBuySuccessMessage(`🎉 Success! Slot #${res.slotNumber} in ${currentGroup.groupName} was successfully purchased using ₹10,000 from your digital wallet.`);
        setTimeout(() => {
          setShowBuyModal(false);
          setBuySuccessMessage(null);
        }, 2500);
      } else {
        setBuyErrorMessage(res.error || 'Failed to complete wallet slot purchase.');
      }
    } catch (e: any) {
      setBuyErrorMessage(e.message || 'Error occurred while purchasing slot.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="space-y-6 text-white font-sans relative pb-16">
      
      {/* 📦 YOUR MULTI-BATCH SLOT HOLDINGS PORTFOLIO BREAKDOWN */}
      {totalUserSlotsCount > 0 ? (
        <div className="bg-[#0D3B43] border-2 border-[#E1A238]/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E1A238]/30 pb-3.5 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black shadow-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest block">
                  Your Verified Ownership Portfolio
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  You Hold {totalUserSlotsCount} Slot{totalUserSlotsCount === 1 ? '' : 's'} Across {totalBatchesCount} Batch{totalBatchesCount === 1 ? '' : 'es'}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-[#00C2B8] bg-[#081E26] px-3 py-1.5 rounded-full border border-[#00C2B8]/40">
              Member ID: {user.memberId || 'LOP-MEMBER'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 relative z-10">
            {allGroups.map((grp) => {
              const holding = userSlotsByBatch[grp.groupId];
              const isSelectedBatch = grp.groupId === currentGroup.groupId;
              const hasSlots = Boolean(holding && holding.slots.length > 0);

              return (
                <div
                  key={grp.groupId}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelectedBatch
                      ? 'bg-[#081E26] border-[#00C2B8] shadow-lg shadow-[#00C2B8]/15 ring-2 ring-[#00C2B8]/40'
                      : hasSlots
                      ? 'bg-[#081E26]/80 border-[#E1A238]/40 hover:border-[#E1A238]/80'
                      : 'bg-[#081E26]/40 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-[#0D3B43] text-[#F2C868] px-2 py-0.5 rounded border border-[#E1A238]/30">
                        {grp.groupId}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">
                        {grp.groupName ? grp.groupName.replace('InfinityGram 50 Gold Club - ', '') : grp.groupId}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      hasSlots
                        ? holding?.hasWon
                          ? 'bg-amber-400 text-amber-950 font-extrabold shadow-sm'
                          : 'bg-[#00C2B8] text-[#081E26]'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {hasSlots ? `${holding?.slots.length}/3 Slots Hold` : '0 Slots'}
                    </span>
                  </div>

                  {hasSlots ? (
                    <div className="space-y-2 mt-3 pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-1.5">
                        {holding?.slots.map(s => {
                          const isSlotWon = s.status === 'Won 1g Gold' || Boolean(s.wonDay);
                          return (
                            <div
                              key={s.slotNumber}
                              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 ${
                                isSlotWon
                                  ? 'bg-amber-400 text-amber-950 font-black border border-amber-300'
                                  : 'bg-[#0D3B43] text-[#00C2B8] border border-[#00C2B8]/40'
                              }`}
                            >
                              <span>Slot #{s.slotNumber}</span>
                              <span>{isSlotWon ? `🏆 Won (Day ${s.wonDay || 1})` : '🟢 Active Pool'}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setActiveBatchId(grp.groupId);
                          setSelectedBatchId(grp.groupId);
                        }}
                        className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-1 ${
                          isSelectedBatch
                            ? 'bg-[#00C2B8] text-[#081E26] font-black shadow-sm'
                            : 'bg-[#0D3B43] hover:bg-[#0D3B43]/80 text-white'
                        }`}
                      >
                        {isSelectedBatch ? '✓ Currently Viewing' : `Switch to ${grp.groupName.split(' - ')[1] || grp.groupId} →`}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <p className="text-[11px] text-slate-400">No slot purchased yet in this batch.</p>
                      {grp.status === 'active' || grp.status === 'live' || ((grp.slots?.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length ?? grp.filledMembers ?? 0) >= 50) ? (
                        <span className="block text-[11px] text-amber-400/80 font-mono mt-1 font-bold">
                          🔒 Batch Full / Live (Closed)
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBatchId(grp.groupId);
                            setSelectedBatchId(grp.groupId);
                            handleOpenBuySlot();
                          }}
                          className="w-full text-center py-1.5 rounded-xl text-[11px] font-bold text-[#F2C868] hover:underline cursor-pointer mt-1"
                        >
                          + Buy Slot in {grp.groupId} (₹10,000)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Deposit / Quota Callout Banner for Registered Users */
        <div className="bg-gradient-to-r from-amber-500/20 via-[#E1A238]/15 to-transparent border border-[#E1A238]/50 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-medium text-amber-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E1A238] text-[#081E26] flex items-center justify-center font-black shrink-0 text-base shadow-md">
              ⚡
            </div>
            <div>
              <h4 className="font-extrabold text-[#F2C868] text-sm">₹10,000 Scheme Deposit & Slot Purchase Required</h4>
              <p className="text-slate-200 text-xs mt-0.5">
                Your account is registered. Buy or deposit into an open slot to join the 50-member daily 1g gold draw cycle (Max 3 slots per batch).
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenBuySlot()}
            className="bg-[#00C2B8] hover:bg-[#00a8a0] text-[#081E26] font-black px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap cursor-pointer text-xs"
          >
            Buy Open Slot (₹10,000) →
          </button>
        </div>
      )}

      {/* DYNAMIC BATCH TABS BAR */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono font-bold text-[#F2C868] uppercase tracking-wider shrink-0 mr-1">Select Batch:</span>
        {allGroups.map((g) => {
          const isSelected = g.groupId === currentGroup.groupId;
          const filled = g.filledMembers || g.totalMembers || 0;
          const holdingInTab = userSlotsByBatch[g.groupId];
          const hasUserSlots = Boolean(holdingInTab && holdingInTab.slots.length > 0);

          return (
            <button
              key={g.groupId}
              onClick={() => {
                setActiveBatchId(g.groupId);
                setSelectedBatchId(g.groupId);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 border whitespace-nowrap ${
                isSelected
                  ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8] shadow-md shadow-[#00C2B8]/20 scale-105'
                  : 'bg-[#0D3B43] text-slate-300 border-[#E1A238]/20 hover:bg-[#0D3B43]/80'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{g.groupName ? g.groupName.replace('InfinityGram 50 Gold Club - ', '') : g.groupId}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold ${
                isSelected ? 'bg-[#081E26] text-[#00C2B8]' : 'bg-[#081E26] text-[#F2C868]'
              }`}>
                {filled}/50
              </span>
              {hasUserSlots && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-black ${
                  holdingInTab.hasWon
                    ? 'bg-amber-400 text-amber-950'
                    : isSelected ? 'bg-white text-[#081E26]' : 'bg-[#00C2B8] text-[#081E26]'
                }`}>
                  {holdingInTab.hasWon ? '🏆 Won' : `${holdingInTab.slots.length} Hold`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Group Header Card */}
      <div className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              currentGroup.status === 'active' || currentGroup.status === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-[#081E26] text-[#00C2B8] border-[#00C2B8]/40'
            }`}>
              {currentGroup.status === 'active' || currentGroup.status === 'live' ? `🟢 Live (Day ${currentGroup.currentCycleDay || 1}/50)` : currentGroup.status}
            </span>
            <span className="text-xs font-mono text-[#F2C868] font-bold">{currentGroup.groupId}</span>
            {userOwnedSlotsInCurrentBatch.length > 0 && (
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold">
                You own {userOwnedSlotsInCurrentBatch.length} slot ({userOwnedSlotsInCurrentBatch.map(s => `#${s.slotNumber}`).join(', ')}) in this batch
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white">{currentGroup.groupName || 'InfinityGram 50 Gold Club - Batch A'}</h1>
          <p className="text-xs text-slate-300">
            Strict 50-Member Group Structure. <span className="text-[#00C2B8] font-bold">{occupiedCount} Verified Members</span> allocated, <span className="text-[#F2C868] font-bold">{availableCount} Slots available</span>.
          </p>
          <div className="text-[11px] text-slate-300 font-medium pt-1 flex items-center space-x-4">
            <span>📅 Start Date: <strong className="text-white font-mono">{currentGroup.startDate || 'Pending Setup'}</strong></span>
            <span>⏰ Daily Draw: <strong className="text-white font-mono">{currentGroup.scheduledTime && !currentGroup.scheduledTime.includes('Pending') && !currentGroup.scheduledTime.includes('Awaiting') && currentGroup.scheduledTime.trim() !== '' ? currentGroup.scheduledTime : 'Pending Setup'}</strong></span>
          </div>
        </div>

        {/* Quick Pool Stats & Buy Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center space-x-3 bg-[#081E26] p-3.5 rounded-2xl border border-[#0D3B43] text-xs font-bold shadow-inner">
            <div className="text-center px-3 border-r border-[#0D3B43]">
              <p className="text-slate-400 font-medium">Total Slots</p>
              <p className="text-base font-bold text-white">50</p>
            </div>
            <div className="text-center px-3 border-r border-[#0D3B43]">
              <p className="text-slate-400 font-medium">Occupied</p>
              <p className="text-base font-bold text-[#00C2B8]">{occupiedCount} / 50</p>
            </div>
            <div className="text-center px-3">
              <p className="text-slate-400 font-medium">Available</p>
              <p className="text-base font-bold text-[#F2C868]">{availableCount}</p>
            </div>
          </div>

          {isCurrentBatchLiveOrActive || isCurrentBatchFull ? (
            nextOpenBatch ? (
              <button
                onClick={() => {
                  setActiveBatchId(nextOpenBatch.groupId);
                  setSelectedBatchId(nextOpenBatch.groupId);
                  handleOpenBuySlot();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-[#081E26] font-black px-5 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Join Open {nextOpenBatch.groupName.replace('InfinityGram 50 Gold Club - ', '')} →</span>
              </button>
            ) : (
              <div className="bg-[#081E26] border border-amber-500/40 text-amber-300 font-bold px-4 py-3 rounded-2xl text-xs flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Batch 100% Full (50/50)</span>
              </div>
            )
          ) : (
            <button
              onClick={() => handleOpenBuySlot()}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black px-5 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Buy Batch Slot (₹10,000) • {availableCount} Left</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0D3B43] rounded-2xl border border-[#E1A238]/30 shadow-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#E1A238]" />
          <span className="text-xs font-bold text-white">Filter Slots:</span>
          
          <button
            onClick={() => setFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'All' ? 'bg-[#00C2B8] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            All 50 Slots
          </button>
          <button
            onClick={() => setFilter('MySlots')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'MySlots' ? 'bg-[#F2C868] text-[#081E26] shadow-sm font-black' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            My Slots ({userOwnedSlotNumbers.size})
          </button>
          <button
            onClick={() => setFilter('ActivePool')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'ActivePool' ? 'bg-[#00C2B8] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            Active Pool
          </button>
          <button
            onClick={() => setFilter('WonGold')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'WonGold' ? 'bg-[#E1A238] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            Won 1g Gold
          </button>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center space-x-1 bg-[#081E26] p-1 rounded-xl border border-[#E1A238]/20 text-xs font-bold">
          <button
            onClick={() => setViewFormat('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewFormat === 'table' ? 'bg-[#00C2B8] text-[#081E26] font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewFormat('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewFormat === 'grid' ? 'bg-[#00C2B8] text-[#081E26] font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Privacy Audit Banner */}
      <div className="bg-[#081E26] border border-[#00C2B8]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#00C2B8]/20 border border-[#00C2B8]/50 text-[#00C2B8] flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-[#00C2B8]">🔒 Audited Privacy Mode Active:</span>
            <span className="text-slate-300 ml-1">
              Only your personal verified slot details are displayed. All other member slots are protected & encrypted for strict compliance.
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-[#00C2B8]/15 border border-[#00C2B8]/30 text-[#00C2B8] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shrink-0">
          256-Bit Encrypted Pool
        </span>
      </div>

      {/* Main 50-Member Display Container */}
      <div className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#00C2B8]" />
            <span>{currentGroup.groupName} — Progression Directory</span>
          </h3>
          <span className="text-xs text-slate-300 font-mono">Showing {filteredSlots.length} of 50 Slots</span>
        </div>

        {/* TABLE VIEW */}
        {viewFormat === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-[#081E26] w-full">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-[#081E26] text-slate-300 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">Slot #</th>
                  <th className="p-3.5 whitespace-nowrap">Member Name</th>
                  <th className="p-3.5 whitespace-nowrap">Member ID</th>
                  <th className="p-3.5 whitespace-nowrap">Cycle Status</th>
                  <th className="p-3.5 whitespace-nowrap">Action / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#081E26] font-medium">
                {filteredSlots.map(slot => {
                  const isWon = slot.status === 'Won 1g Gold';

                  const isCurrentUser = Boolean(
                    user && (
                      userOwnedSlotNumbers.has(slot.slotNumber) ||
                      (!!user.memberId && !!slot.memberId && user.memberId.trim().toUpperCase() === slot.memberId.trim().toUpperCase())
                    )
                  );

                  const displayMemberName = isCurrentUser
                    ? (user.fullName || slot.memberName || 'Your Account')
                    : '🔒 Protected Member Slot';

                  const displayMemberId = isCurrentUser
                    ? (user.memberId || slot.memberId || `LOP-${String(slot.slotNumber).padStart(6, '0')}`)
                    : '🔒 Protected ID';

                  return (
                    <tr
                      key={slot.slotNumber}
                      className={`transition-all ${
                        isCurrentUser
                          ? 'bg-[#00C2B8]/20 text-white font-bold border-l-4 border-l-[#00C2B8] shadow-md'
                          : isWon
                          ? 'bg-[#E1A238]/10 text-[#F2C868]'
                          : 'text-slate-200 hover:bg-[#081E26]/40'
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#00C2B8] whitespace-nowrap">
                        #{slot.slotNumber.toString().padStart(2, '0')}
                      </td>

                      {/* Member Name Field */}
                      <td className="p-3.5 font-bold whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={isCurrentUser ? 'text-white font-black' : 'text-slate-300'}>
                            {displayMemberName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-[#E1A238] text-[#081E26] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                              ★ YOUR OWNED SLOT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Member ID Field */}
                      <td className="p-3.5 font-mono whitespace-nowrap">
                        <span className={isCurrentUser ? 'text-[#00C2B8] font-bold' : 'text-slate-400'}>
                          {displayMemberId}
                        </span>
                      </td>

                      {/* Cycle Status Field */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isWon ? (
                          <span className="inline-flex items-center space-x-1 bg-[#E1A238]/20 text-[#E1A238] border border-[#E1A238]/40 px-2.5 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap">
                            <Award className="w-3 h-3" />
                            <span>Won 1g 916 Gold</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-[#00C2B8]/10 text-[#00C2B8] border border-[#00C2B8]/30 px-2.5 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Eligible Daily Draw</span>
                          </span>
                        )}
                      </td>

                      {/* Action / Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isCurrentUser ? (
                          <span className="text-emerald-400 font-bold font-mono text-[11px]">✓ Verified Active</span>
                        ) : isWon ? (
                          <span className="text-[#F2C868] font-bold font-mono text-[11px]">Won Gold</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Occupied</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {filteredSlots.map(slot => {
              const isWon = slot.status === 'Won 1g Gold';

              const isCurrentUser = Boolean(
                user && (
                  userOwnedSlotNumbers.has(slot.slotNumber) ||
                  (!!user.memberId && !!slot.memberId && user.memberId.trim().toUpperCase() === slot.memberId.trim().toUpperCase())
                )
              );

              return (
                <motion.div
                  key={slot.slotNumber}
                  whileHover={{ scale: 1.03 }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[105px] ${
                    isCurrentUser
                      ? 'bg-gradient-to-b from-[#00C2B8]/30 to-[#081E26] border-[#00C2B8] shadow-lg shadow-[#00C2B8]/20 ring-1 ring-[#00C2B8]'
                      : isWon
                      ? 'bg-[#E1A238]/15 border-[#E1A238]/50 text-[#F2C868]'
                      : 'bg-[#081E26]/60 border-[#0D3B43] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isCurrentUser ? 'bg-[#00C2B8] text-[#081E26] font-black' : isWon ? 'bg-[#E1A238] text-[#081E26] font-black' : 'bg-black/30 text-slate-300'
                    }`}>
                      #{slot.slotNumber}
                    </span>
                    {isCurrentUser ? <span>★</span> : isWon ? <span>👑</span> : <span>🔒</span>}
                  </div>

                  <div className="my-1">
                    {isCurrentUser ? (
                      <p className="text-[11px] font-black text-white truncate">{user.fullName || 'Your Slot'}</p>
                    ) : (
                      <p className="text-[10px] font-medium text-slate-400 truncate">Protected Slot</p>
                    )}
                  </div>

                  <div className="text-[9px] font-bold pt-1 border-t border-white/5">
                    {isCurrentUser ? (
                      isWon ? (
                        <span className="text-amber-300 font-black">🏆 Won 1g ({slot.wonDay ? `Day ${slot.wonDay}` : 'Won'})</span>
                      ) : (
                        <span className="text-emerald-400">✓ Your Active Slot</span>
                      )
                    ) : isWon ? (
                      <span className="text-amber-300">Won 1g</span>
                    ) : (
                      <span className="text-slate-400">In Pool</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🛍️ BUY GROUP SLOT MODAL */}
      <AnimatePresence>
        {showBuyModal && (
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
              className="bg-[#081E26] max-w-md w-full rounded-[2.5rem] p-5 sm:p-8 border border-[#E1A238]/60 shadow-2xl space-y-6 relative text-left text-white max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowBuyModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>50-Member Sovereign Gold Slot</span>
                </div>
                <h2 className="text-2xl font-black text-white">Buy Group Batch Slot</h2>
                <p className="text-xs text-slate-300 font-medium">
                  Enroll in <strong className="text-[#00C2B8] font-bold">{currentGroup.groupName}</strong>. Each slot guarantees 50 days of daily 1g 916 gold draw eligibility.
                </p>
              </div>

              {/* Status & Wallet Snapshot */}
              <div className="bg-[#0D3B43] p-4 rounded-2xl border border-[#E1A238]/30 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Selected Batch:</span>
                  <span className="font-mono text-white font-bold">{currentGroup.groupId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Slot Assignment:</span>
                  <span className="font-mono text-amber-300 font-black">
                    {selectedSlotForBuy ? `Slot #${selectedSlotForBuy}` : 'Next Available Open Slot'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Slot Price:</span>
                  <span className="font-mono text-emerald-400 font-black">₹10,000</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2 text-slate-200">
                  <span className="flex items-center space-x-1">
                    <Wallet className="w-3.5 h-3.5 text-[#00C2B8]" />
                    <span>Your Digital Wallet Balance:</span>
                  </span>
                  <span className="font-mono text-[#F2C868] font-black text-sm">
                    ₹{withdrawableBonusBalance.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Messages */}
              {buySuccessMessage && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-3.5 rounded-2xl text-xs text-emerald-200 flex items-center space-x-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{buySuccessMessage}</span>
                </div>
              )}

              {buyErrorMessage && (
                <div className="bg-rose-500/20 border border-rose-500/40 p-3.5 rounded-2xl text-xs text-rose-200 flex items-center space-x-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{buyErrorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Buy with Wallet Button */}
                <button
                  disabled={isBuying || withdrawableBonusBalance < 10000}
                  onClick={handleBuyWithWallet}
                  className={`w-full py-4 rounded-2xl text-xs font-black transition-all shadow-md flex items-center justify-center space-x-2 ${
                    withdrawableBonusBalance >= 10000
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white hover:brightness-110 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>
                    {isBuying 
                      ? 'Processing Purchase...' 
                      : withdrawableBonusBalance >= 10000 
                      ? 'Pay ₹10,000 from Digital Wallet' 
                      : 'Insufficient Wallet Balance (Requires ₹10,000)'}
                  </span>
                </button>

                {/* 2. Direct Deposit Alternative */}
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setCurrentView('user-deposit-overview');
                  }}
                  className="w-full bg-[#0D3B43] hover:bg-[#124e59] text-amber-300 font-extrabold py-3.5 rounded-2xl text-xs transition-all border border-[#E1A238]/40 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Pay via Direct Deposit (UPI / Bank Transfer) →</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
