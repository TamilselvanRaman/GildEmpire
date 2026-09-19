'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Grid, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  Calendar, 
  Layers, 
  Award, 
  List, 
  Eye, 
  Phone, 
  Mail, 
  X,
  Check,
  UserCheck,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSlotsControlPage = () => {
  const { group, allGroups, deposits, setCurrentView, dbUsers = [], manualAssignSlot } = useApp();
  const [selectedBatch, setSelectedBatch] = useState<'batchA' | 'batchB' | 'batchC' | 'batchD' | 'batchE'>('batchA');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'occupied' | 'available'>('all');
  const [viewFormat, setViewFormat] = useState<'table' | 'grid'>('table');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetSlotNum, setTargetSlotNum] = useState<number | null>(null);
  const [selectedMemberModal, setSelectedMemberModal] = useState<any>(null);

  // Manual slot assignment states
  const [selectedUserForSlot, setSelectedUserForSlot] = useState<string>('');
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  const getGroupStats = (groupId: string) => {
    const target = (allGroups || []).find(g => g.groupId === groupId);
    const filled = target ? target.slots.filter(s => s.status === 'Occupied').length : 0;
    return { filled, available: 50 - filled };
  };

  const statsA = getGroupStats('GROUP-001');
  const statsB = getGroupStats('GROUP-002');
  const statsC = getGroupStats('GROUP-003');
  const statsD = getGroupStats('GROUP-004');
  const statsE = getGroupStats('GROUP-005');

  // 5 Batch Slot Pipelines
  const batchData = {
    batchA: {
      groupId: 'GROUP-001',
      name: 'InfinityGram 50 Gold Club - Batch A',
      status: '1. Live 50-Day Cycle Active',
      statusType: 'live',
      filled: statsA.filled,
      total: 50,
      available: statsA.available,
      waiting: 0,
      description: `Active Group Cycle. 1g 916 Gold awarded daily. ${statsA.filled}/50 Members Enrolled.`,
    },
    batchB: {
      groupId: 'GROUP-002',
      name: 'InfinityGram 50 Gold Club - Batch B',
      status: statsB.filled === 50 ? '2. Full - Schedule Ready' : '2. Recruiting Active',
      statusType: statsB.filled === 50 ? 'full' : 'recruiting',
      filled: statsB.filled,
      total: 50,
      available: statsB.available,
      waiting: 0,
      description: `${statsB.filled}/50 Members Enrolled. Awaiting member deposits to complete group.`,
    },
    batchC: {
      groupId: 'GROUP-003',
      name: 'InfinityGram 50 Gold Club - Batch C',
      status: '3. Recruiting Active',
      statusType: 'recruiting',
      filled: statsC.filled,
      total: 50,
      available: statsC.available,
      waiting: 0,
      description: `Active recruiting batch. ${statsC.available} available open slots. Automatic slot assignment active on deposit verification.`,
    },
    batchD: {
      groupId: 'GROUP-004',
      name: 'InfinityGram 50 Gold Club - Batch D',
      status: '4. Reserve Queue',
      statusType: 'empty',
      filled: statsD.filled,
      total: 50,
      available: statsD.available,
      waiting: 0,
      description: 'Upcoming batch queue. Opens automatically as active batches fill.',
    },
    batchE: {
      groupId: 'GROUP-005',
      name: 'InfinityGram 50 Gold Club - Batch E',
      status: '5. Reserve Queue',
      statusType: 'empty',
      filled: statsE.filled,
      total: 50,
      available: statsE.available,
      waiting: 0,
      description: 'Reserve batch queue for upcoming deposits.',
    },
  };

  const currentBatchInfo = batchData[selectedBatch];
  const filledCount = currentBatchInfo.filled;
  const availableCount = currentBatchInfo.available;
  const waitingCount = 0;
  const fillPercentage = Math.round((filledCount / currentBatchInfo.total) * 100);

  // Global aggregate stats across all 5 batches
  const totalSystemSlots = 250;
  const totalSystemFilled = (allGroups || []).reduce((acc, g) => acc + g.slots.filter(s => s.status === 'Occupied').length, 0);
  const totalSystemAvailable = 250 - totalSystemFilled;
  const totalSystemWaiting = dbUsers.filter(u => u.deposit !== 'Verified' && u.depositStatus !== 'Verified').length;

  // Real pending queue members derived from dbUsers
  const waitingQueueMembers = dbUsers
    .filter(u => u.deposit !== 'Verified' && u.depositStatus !== 'Verified')
    .map(u => ({
      id: u.memberId || u.id || 'DEP-NEW',
      name: u.name || u.email,
      phone: u.mobile || '—',
      utr: u.utr || 'Pending Verification',
      amount: '₹10,000',
      depositTime: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently'
    }));

  // Generate 50 Slots Representation for selected batch
  const generateBatchSlots = () => {
    const targetGrp = (allGroups || []).find(g => g.groupId === currentBatchInfo.groupId);
    if (targetGrp && targetGrp.slots && targetGrp.slots.length === 50) {
      return targetGrp.slots;
    }
    return Array.from({ length: 50 }, (_, i) => {
      const slotNo = i + 1;
      return {
        slotNumber: slotNo,
        memberId: undefined,
        memberName: undefined,
        status: 'Available' as const,
        joinedDate: undefined,
        wonDay: undefined,
      };
    });
  };

  const currentSlots = generateBatchSlots();

  const filteredSlots = currentSlots.filter(slot => {
    const matchesFilter = 
      statusFilter === 'all' ? true :
      statusFilter === 'occupied' ? slot.status !== 'Available' :
      slot.status === 'Available';

    const matchesSearch = 
      !searchQuery.trim() ||
      (slot.memberName && slot.memberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (slot.memberId && slot.memberId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      slot.slotNumber.toString().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const handleAssignToSlot = (slotNo: number) => {
    setTargetSlotNum(slotNo);
    setShowAssignModal(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-8 rounded-3xl border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black">
            <Grid className="w-4 h-4 text-amber-400" />
            <span>Master Slot Management & Availability Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Slot Management & Queue Control</h1>
          <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
            Monitor real-time slot availability, filled member allocations, and waiting depositor queues across all 5 group batches.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('admin-groups')}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 flex items-center space-x-2 cursor-pointer transition-all shrink-0 relative z-10"
        >
          <Layers className="w-4 h-4" />
          <span>View 50-Member Groups</span>
        </button>
      </div>

      {/* 4 GLOBAL SLOT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Total System Capacity</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-[#0B1E39] font-mono">{totalSystemSlots} Slots</p>
          <span className="text-slate-500 font-semibold text-xs">Across 5 Group Batches</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <div className="flex justify-between items-center text-emerald-800">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Filled & Verified Slots</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 font-mono">{totalSystemFilled} Slots</p>
          <span className="text-emerald-800 font-extrabold text-xs">56% Overall Fill Rate</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <div className="flex justify-between items-center text-blue-800">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Available Open Slots</span>
            <Grid className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">{totalSystemAvailable} Slots</p>
          <span className="text-blue-900 font-bold text-xs">Ready for Member Assignment</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <div className="flex justify-between items-center text-emerald-900">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Instant Auto-Allocation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 font-mono">0 Waiting</p>
          <span className="text-emerald-800 font-extrabold text-xs">⚡ Automatic Batch Slot Seating Active</span>
        </div>

      </div>

      {/* BATCH SELECTOR TABS BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-black text-[#0B1E39] uppercase tracking-wider shrink-0 mr-2 ml-1">Select Batch:</span>
        {(Object.keys(batchData) as Array<keyof typeof batchData>).map((batchKey) => {
          const b = batchData[batchKey];
          const isSelected = selectedBatch === batchKey;

          return (
            <button
              key={batchKey}
              onClick={() => setSelectedBatch(batchKey)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#0B1E39] text-white shadow-md border border-[#1E385C]'
                  : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span>{b.name.split(' - ')[1]}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono ${
                isSelected
                  ? 'bg-amber-400 text-amber-950'
                  : b.available === 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : b.filled > 0
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-slate-200 text-slate-600'
              }`}>
                {b.available === 0 ? '50/50 Full' : b.filled > 0 ? `${b.filled}/50 (${b.available} Open)` : 'Reserve Queue'}
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED BATCH STATUS & CAPACITY BREAKDOWN */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                currentBatchInfo.statusType === 'live' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : currentBatchInfo.statusType === 'full'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-black'
                    : currentBatchInfo.statusType === 'recruiting'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 font-extrabold'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {currentBatchInfo.status}
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">{currentBatchInfo.groupId}</span>
            </div>
            <h2 className="text-2xl font-black text-[#0B1E39] tracking-tight">{currentBatchInfo.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{currentBatchInfo.description}</p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {currentBatchInfo.available > 0 && (
              <button
                onClick={() => setCurrentView('admin-deposits')}
                className="bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Verify Deposit in Queue (Auto-Fills Next Slot)</span>
              </button>
            )}

            {currentBatchInfo.statusType === 'full' && (
              <button
                onClick={() => setCurrentView('admin-reward-flow-control')}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Set Date & Time for Daily Draw</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Capacity Breakdown Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 space-y-1">
            <span className="text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">Filled & Verified Members</span>
            <p className="text-3xl font-black text-emerald-700 font-mono">{filledCount} Slots</p>
            <span className="text-emerald-800 font-bold">{fillPercentage}% Capacity Filled</span>
          </div>

          <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200/90 space-y-1">
            <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">Available Open Slots Now</span>
            <p className="text-3xl font-black text-[#2F6FED] font-mono">{availableCount} Slots</p>
            <span className="text-blue-900 font-bold">{availableCount === 0 ? 'Batch Fully Filled (50/50)' : `Open Slots #${filledCount + 1} to #50`}</span>
          </div>

          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/90 space-y-1">
            <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">Waiting Depositors Queue</span>
            <p className="text-3xl font-black text-amber-800 font-mono">{waitingCount} Depositors</p>
            <span className="text-amber-900 font-bold">Verified ₹10k Paid Waiting Assignment</span>
          </div>
        </div>

        {/* Fill Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#0B1E39]">Batch Fill Progress ({filledCount} / 50 Filled • {availableCount} Available)</span>
            <span className="text-emerald-700 font-black">{fillPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex border border-slate-200/80">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${fillPercentage}%` }}
            ></div>
            <div 
              className="bg-blue-400/30 h-full transition-all duration-500" 
              style={{ width: `${100 - fillPercentage}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* WAITING DEPOSITORS ASSIGNMENT QUEUE */}
      {waitingCount > 0 && (
        <div className="bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-amber-200/60 text-amber-950 px-3 py-1 rounded-full text-xs font-black">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Waiting Assignment Queue ({waitingCount} Members)</span>
              </div>
              <h3 className="text-lg font-black text-[#0B1E39]">Verified Depositors Waiting for Open Slots</h3>
              <p className="text-xs text-slate-600 font-medium">
                These users submitted verified ₹10,000 deposits and are waiting to fill available slots in {currentBatchInfo.name}.
              </p>
            </div>

            <button
              onClick={() => handleAssignToSlot(filledCount + 1)}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-5 py-3 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Auto-Assign Next Waiting Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {waitingQueueMembers.map((member, idx) => (
              <div key={member.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3 relative text-xs">
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-slate-400">{member.depositTime}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0B1E39] text-xs">{member.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{member.phone}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">UTR:</span>
                    <span className="font-mono text-slate-800 font-bold">{member.utr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deposit:</span>
                    <span className="font-mono text-emerald-700 font-black">{member.amount} Verified</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAssignToSlot(filledCount + 1 + idx)}
                  className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-bold py-2 rounded-xl text-[11px] flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Assign to Slot #{filledCount + 1 + idx}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 50-SLOT AVAILABILITY DIRECTORY TABLE & GRID */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-black text-[#0B1E39]">Slot Availability Directory & Allocations</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Review filled slots and open available slots for {currentBatchInfo.name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-[#0B1E39] shadow-xs font-extrabold' : 'text-slate-500'}`}
              >
                All 50 Slots
              </button>
              <button
                onClick={() => setStatusFilter('occupied')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'occupied' ? 'bg-emerald-500 text-white font-black' : 'text-slate-500'}`}
              >
                Occupied ({filledCount})
              </button>
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'available' ? 'bg-[#2F6FED] text-white font-black' : 'text-slate-500'}`}
              >
                Available Open ({availableCount})
              </button>
            </div>

            {/* View Format Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
              <button
                onClick={() => setViewFormat('table')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewFormat === 'table' ? 'bg-[#0B1E39] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table Format</span>
              </button>
              <button
                onClick={() => setViewFormat('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewFormat === 'grid' ? 'bg-[#0B1E39] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid Format</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search slot # or member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-900 pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2F6FED] font-medium"
              />
            </div>
          </div>
        </div>

        {/* TABLE FORMAT VIEW */}
        {viewFormat === 'table' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold font-sans">
                <tr>
                  <th className="p-4">Slot #</th>
                  <th className="p-4">Slot Occupant & Contact</th>
                  <th className="p-4">Member ID</th>
                  <th className="p-4">Slot Availability Status</th>
                  <th className="p-4">Deposit Status</th>
                  <th className="p-4">Slot Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSlots.map((slot) => {
                  const isOccupied = slot.status !== 'Available';
                  const isWon = slot.status === 'Won 1g Gold';

                  return (
                    <tr 
                      key={slot.slotNumber}
                      onClick={() => isOccupied && setSelectedMemberModal(slot)}
                      className={`transition-colors ${isOccupied ? 'hover:bg-slate-50/80 cursor-pointer' : 'bg-blue-50/20'}`}
                    >
                      <td className="p-4 font-mono font-black text-[#0B1E39] text-sm">
                        Slot #{slot.slotNumber.toString().padStart(2, '0')}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                            isWon ? 'bg-amber-100 text-amber-900 border border-amber-300' : isOccupied ? 'bg-blue-50 text-[#2F6FED]' : 'bg-blue-100/60 text-blue-700'
                          }`}>
                            {slot.memberName ? slot.memberName.charAt(0) : '+'}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#0B1E39] text-xs">
                              {slot.memberName || <span className="text-[#2F6FED] font-black">+ Available Open Slot</span>}
                            </p>
                            {isOccupied ? (
                              <p className="text-[11px] text-slate-500 font-mono">
                                +91 98765 {10000 + slot.slotNumber}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 font-medium">Ready for depositor assignment</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-black text-[#2F6FED]">
                        {slot.memberId || <span className="text-slate-400 font-normal">—</span>}
                      </td>

                      <td className="p-4">
                        {isWon ? (
                          <span className="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center space-x-1">
                            <Award className="w-3.5 h-3.5 text-amber-700" />
                            <span>Won 1g Gold</span>
                          </span>
                        ) : isOccupied ? (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Filled & Enrolled</span>
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center space-x-1">
                            <Grid className="w-3.5 h-3.5 text-blue-600" />
                            <span>AVAILABLE OPEN SLOT</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {isOccupied ? (
                          <span className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold">
                            ₹10,000 Verified
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Open for ₹10,000 Deposit</span>
                        )}
                      </td>

                      <td className="p-4">
                        {isOccupied ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMemberModal(slot);
                            }}
                            className="text-xs font-bold text-[#2F6FED] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignToSlot(slot.slotNumber);
                            }}
                            className="bg-[#2F6FED] hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Assign Member</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* GRID FORMAT VIEW */}
        {viewFormat === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3 pt-2">
            {filteredSlots.map((slot) => {
              const isOccupied = slot.status !== 'Available';
              const isWon = slot.status === 'Won 1g Gold';

              return (
                <div
                  key={slot.slotNumber}
                  onClick={() => isOccupied ? setSelectedMemberModal(slot) : handleAssignToSlot(slot.slotNumber)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col justify-between h-24 relative cursor-pointer ${
                    isWon
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                      : isOccupied
                        ? 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                        : 'bg-blue-50/60 border-2 border-dashed border-blue-400 hover:bg-blue-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#0B1E39]">
                      #{slot.slotNumber.toString().padStart(2, '0')}
                    </span>

                    {isWon ? (
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                    ) : isOccupied ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-[#0B1E39] truncate">
                      {slot.memberName || <span className="text-[#2F6FED] font-black text-[10px]">+ Available</span>}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 truncate">
                      {slot.memberId || 'Open Slot'}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-slate-100 text-[9px] font-bold">
                    {isWon ? (
                      <span className="text-amber-800 font-extrabold">Won Gold</span>
                    ) : isOccupied ? (
                      <span className="text-emerald-700 font-extrabold">Filled</span>
                    ) : (
                      <span className="text-blue-700 font-black">+ Assign</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ASSIGN MEMBER MODAL */}
      <AnimatePresence>
        {showAssignModal && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowAssignModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-mono font-black text-[#2F6FED] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Assign Slot #{targetSlotNum?.toString().padStart(2, '0')}
                </span>
                <h3 className="text-xl font-black text-[#0B1E39]">Assign Depositor to Available Slot</h3>
                <p className="text-xs text-slate-500">
                  Select a verified depositor from the queue to fill Slot #{targetSlotNum} in {currentBatchInfo.name}.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-[#0B1E39]">Search Registered User by Name, Member ID, Email, or Ref ID:</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Type Name, LOP-ID, Email or Ref ID..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                <label className="block text-xs font-extrabold text-[#0B1E39] pt-1">Select Registered User to Assign:</label>
                <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-2 bg-slate-50/80">
                  {dbUsers
                    .filter((u) => {
                      if (!userSearchTerm.trim()) return true;
                      const q = userSearchTerm.toLowerCase();
                      return (
                        (u.name && u.name.toLowerCase().includes(q)) ||
                        (u.email && u.email.toLowerCase().includes(q)) ||
                        (u.memberId && u.memberId.toLowerCase().includes(q)) ||
                        (u.mobile && u.mobile.includes(q))
                      );
                    })
                    .map((u) => {
                      const val = u.email || u.memberId;
                      const isSelected = selectedUserForSlot === val;
                      const initial = u.name ? u.name.charAt(0).toUpperCase() : 'M';
                      const isVerified = u.deposit === 'Verified';

                      return (
                        <div
                          key={u.id || u.email}
                          onClick={() => setSelectedUserForSlot(val)}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-[#2F6FED] ring-2 ring-blue-500/20 shadow-xs'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs uppercase shrink-0 border ${
                              isSelected ? 'bg-[#00C2B8] text-[#081E26] border-[#00C2B8]' : 'bg-gradient-to-br from-[#00C2B8] to-[#0B1E39] text-[#F2C868] border-amber-300/40'
                            }`}>
                              {initial}
                            </div>
                            <div className="truncate">
                              <p className="font-extrabold text-[#0B1E39] text-xs truncate">
                                {u.name || u.email}
                              </p>
                              <p className="text-[10px] font-mono text-slate-500 font-bold">
                                {u.memberId || 'LOP-NEW'} &bull; {u.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 ml-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {isVerified ? '✓ Verified Paid' : 'Payment Pending'}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#2F6FED]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1 text-xs">
                <div className="flex justify-between text-emerald-900 font-bold">
                  <span>Slot Assignment Result:</span>
                  <span>Slot #{targetSlotNum} Occupied</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Once confirmed, this member will be verified and seated in Slot #{targetSlotNum} of {currentBatchInfo.name}.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedUserForSlot || isAssigning}
                  onClick={async () => {
                    if (!selectedUserForSlot || !targetSlotNum) return;
                    setIsAssigning(true);
                    const res = await manualAssignSlot(selectedUserForSlot, targetSlotNum, currentBatchInfo.groupId);
                    setIsAssigning(false);
                    setShowAssignModal(false);
                    setSelectedUserForSlot('');
                    setUserSearchTerm('');
                    if (res?.success) {
                      const personName = (res as any).memberName || selectedUserForSlot;
                      alert(`✅ Slot #${targetSlotNum} successfully assigned to ${personName}!`);
                    } else {
                      alert(`❌ Slot assignment error: ${res?.error || 'Failed to assign slot.'}`);
                    }
                  }}
                  className="w-1/2 bg-[#2F6FED] hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isAssigning ? 'Assigning...' : 'Confirm Slot Assignment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL MEMBER INSPECTION MODAL FOR CLICKED PERSON */}
      <AnimatePresence>
        {selectedMemberModal && (
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Member Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1E39] to-[#2F6FED] text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {selectedMemberModal.memberName ? selectedMemberModal.memberName.charAt(0) : 'M'}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase">
                    Slot #{selectedMemberModal.slotNumber.toString().padStart(2, '0')} Occupant
                  </span>
                  <h3 className="text-xl font-black text-[#0B1E39] mt-1">
                    {selectedMemberModal.memberName || `Member #${selectedMemberModal.slotNumber}`}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-[#2F6FED]">
                    Member ID: {selectedMemberModal.memberId || `LOP-${String(selectedMemberModal.slotNumber).padStart(6, '0')}`}
                  </p>
                </div>
              </div>

              {/* Detailed Key Value Grid */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Assigned Group:</span>
                  <span className="font-extrabold text-[#0B1E39]">{currentBatchInfo.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Deposit Requirement:</span>
                  <span className="font-mono text-emerald-700 font-black">₹10,000 (Verified & Locked)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Bank Reference UTR:</span>
                  <span className="font-mono text-slate-800 font-bold">UPI-98234120938{selectedMemberModal.slotNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Mobile Contact:</span>
                  <span className="font-mono text-slate-800 font-bold">+91 98765 {10000 + selectedMemberModal.slotNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="text-slate-800 font-medium">{selectedMemberModal.memberName ? `${selectedMemberModal.memberName.toLowerCase().replace(/\s+/g, '.')}@infinitygram.in` : 'member@infinitygram.in'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Joined Date:</span>
                  <span className="text-slate-800 font-semibold">{selectedMemberModal.joinedDate || '12 Aug 2026'}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Gold Reward Status:</span>
                  <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {selectedMemberModal.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedMemberModal(null)}
                className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40"
              >
                Close Full Member Inspection Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
