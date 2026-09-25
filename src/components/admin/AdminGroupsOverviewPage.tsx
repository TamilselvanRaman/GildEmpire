'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles,
  ShieldCheck,
  Grid,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  X,
  ChevronRight,
  UserCheck,
  Calendar,
  Lock,
  Eye,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminGroupsOverviewPage = () => {
  const { group, allGroups, selectedBatchId, setSelectedBatchId, setCurrentView, autoFillGroupWithSystemUsers, updateGroupSchedule, createNewBatchGroup } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [targetStartBatchId, setTargetStartBatchId] = useState<string>('GROUP-001');
  const [startDateInput, setStartDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledTimeInput, setScheduledTimeInput] = useState<string>('07:00 AM IST');
  const [isAutoFillingId, setIsAutoFillingId] = useState<string | null>(null);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatchName, setNewBatchName] = useState(`InfinityGram 50 Gold Club - Batch ${String.fromCharCode(65 + (allGroups.length % 26))}`);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'full' | 'recruiting' | 'empty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [viewFormat, setViewFormat] = useState<'cards' | 'table'>('cards');

  // 50-Slot Batch Roster Pipeline
  const groupsList = allGroups.map(g => {
    const isFull = g.totalMembers === 50;
    const isLive = isFull && (g.status === 'active' || g.status === 'live');
    
    let statusText = '4. Empty (Reserve Queue)';
    let statusType: 'live' | 'full' | 'recruiting' | 'empty' = 'empty';
    let statusColor = 'slate';

    if (isLive) {
      statusText = '1. Live 50-Day Cycle Active';
      statusType = 'live';
      statusColor = 'emerald';
    } else if (isFull) {
      statusText = '2. Full - Ready to Start/Schedule (50/50)';
      statusType = 'full';
      statusColor = 'amber';
    } else if (g.totalMembers > 0) {
      statusText = `3. Recruitment Active (${g.totalMembers}/50 Members)`;
      statusType = 'recruiting';
      statusColor = 'blue';
    } else {
      statusText = '4. Empty (Reserve Queue)';
      statusType = 'empty';
      statusColor = 'slate';
    }

    return {
      id: g.groupId,
      name: g.groupName,
      status: statusText,
      statusType,
      statusColor,
      membersCount: g.totalMembers,
      totalCapacity: 50,
      currentDay: isLive ? (g.currentCycleDay || 1) : 0,
      goldAwardedGrams: g.totalGoldDistributedGrams,
      startDate: isLive ? (g.startDate || '2026-08-14') : isFull ? 'Ready to Schedule & Start' : 'Awaiting 50 Members',
      leader: 'Operations Lead',
      poolAmount: `₹${(g.totalMembers * 10000).toLocaleString('en-IN')}`,
      nextPayout: isLive ? (g.scheduledTime || 'Daily 07:00 AM IST') : isFull ? 'Schedule Ready' : 'Event Not Started',
    };
  });

  const filteredGroups = groupsList.filter(grp => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === grp.statusType;
    
    const matchesSearch = 
      grp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grp.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleOpenRosterModal = (grp: any) => {
    setSelectedBatch(grp);
    setShowRosterModal(true);
  };

  const handleCreateNewGroupSubmit = () => {
    const nameToUse = newBatchName.trim() || `InfinityGram 50 Gold Club - Batch ${String.fromCharCode(65 + (allGroups.length % 26))}`;
    const res = createNewBatchGroup(nameToUse);
    if (res.success) {
      setShowCreateModal(false);
      setSelectedBatchId(res.newGroup.groupId);
      alert(`🎉 New 50-Member Batch Created! ${res.newGroup.groupId} (${res.newGroup.groupName}) is now open for registration & slot purchases.`);
    }
  };

  const handleAutoFillGroup = async (groupId: string) => {
    setIsAutoFillingId(groupId);
    try {
      const res = await autoFillGroupWithSystemUsers(groupId);
      if (res.success) {
        alert(`Success! Auto-filled group ${groupId} with system bot members. Group is now 50/50 Full & Ready to Start!`);
      } else {
        alert(res.error || 'Failed to auto-fill group.');
      }
    } catch (e: any) {
      alert(e.message || 'Error occurred during auto-fill.');
    } finally {
      setIsAutoFillingId(null);
    }
  };

  const handleOpenStartModal = (groupId: string) => {
    setTargetStartBatchId(groupId);
    setShowStartModal(true);
  };

  const handleConfirmStartEvent = () => {
    updateGroupSchedule(targetStartBatchId, startDateInput, scheduledTimeInput);
    setShowStartModal(false);
    alert(`🎉 50-Day Gold Event officially launched for ${targetStartBatchId}! Day 1 is now active.`);
  };

  const currentRosterSlots = group.slots.filter(s => {
    if (!rosterSearch.trim()) return true;
    return (
      (s.memberName && s.memberName.toLowerCase().includes(rosterSearch.toLowerCase())) ||
      (s.memberId && s.memberId.toLowerCase().includes(rosterSearch.toLowerCase())) ||
      s.slotNumber.toString().includes(rosterSearch)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Top Executive Header */}
      <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>50-Member Batch Roster & Lifecycle Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1E39] tracking-tight">Group Batches Overview</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Manage 50-member groups: Live active cycle (GROUP-001), Full schedule ready (GROUP-002), Active recruiting (GROUP-003), and Empty reserve queues.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-md text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Create New 50-Member Batch</span>
          </button>
        </div>
      </div>

      {/* Corporate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Total Active Batches</span>
          <p className="text-3xl font-black text-[#0B1E39] font-mono">{allGroups.length} Batches</p>
          <span className="text-slate-500 font-semibold">GROUP-001 to GROUP-00{allGroups.length}</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <span className="text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">1. Live 50-Slot Cycle</span>
          <p className="text-3xl font-black text-emerald-700 font-mono">
            {allGroups.find(g => g.status === 'active' || g.status === 'live')?.groupId || 'None'}
          </p>
          <span className="text-emerald-800 font-extrabold">
            {allGroups.find(g => g.status === 'active' || g.status === 'live') ? `Day ${allGroups.find(g => g.status === 'active' || g.status === 'live')?.currentCycleDay || 1} Active (50/50 Full)` : 'Awaiting Full Group'}
          </span>
        </div>

        <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/90 space-y-2">
          <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">2. Full (Schedule Ready)</span>
          <p className="text-3xl font-black text-amber-800 font-mono">
            {allGroups.find(g => g.totalMembers === 50 && g.status !== 'active')?.groupId || 'None'}
          </p>
          <span className="text-amber-900 font-bold">50/50 Filled • Ready to Schedule</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">3. Recruiting Batch</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">
            {allGroups.find(g => g.totalMembers < 50 && g.totalMembers > 0)?.groupId || 'GROUP-001'}
          </p>
          <span className="text-blue-900 font-bold">
            {allGroups.find(g => g.totalMembers < 50 && g.totalMembers > 0)?.totalMembers || 0} Members • {50 - (allGroups.find(g => g.totalMembers < 50 && g.totalMembers > 0)?.totalMembers || 0)} Open Slots
          </span>
        </div>

      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center space-x-1.5 bg-slate-100/90 p-1.5 rounded-2xl w-full md:w-auto text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-[#0B1E39] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All {allGroups.length} Batches
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'live' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Cycle
          </button>
          <button
            onClick={() => setActiveTab('full')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'full' ? 'bg-amber-500 text-amber-950 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full - Ready to Start (50/50)
          </button>
          <button
            onClick={() => setActiveTab('recruiting')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'recruiting' ? 'bg-[#2F6FED] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recruiting (&lt;50 Members)
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2F6FED]"
          />
        </div>
      </div>

      {/* Batches Cards List */}
      <div className="space-y-6">
        {filteredGroups.map(grp => {
          return (
            <div 
              key={grp.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 hover:border-slate-300 transition-all relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      grp.statusType === 'live'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : grp.statusType === 'full'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-black'
                          : grp.statusType === 'recruiting'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {grp.status}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/80">
                      {grp.id}
                    </span>
                  </div>
                  <h3 
                    onClick={() => {
                      setSelectedBatchId(grp.id);
                      setCurrentView('admin-group-detail');
                    }}
                    className="text-xl sm:text-2xl font-black text-[#0B1E39] hover:text-[#2F6FED] cursor-pointer tracking-tight transition-colors"
                  >
                    {grp.name}
                  </h3>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* CLICK TO NAVIGATE DIRECTLY TO FULL GROUP DETAIL PAGE */}
                  {grp.membersCount > 0 ? (
                    <button
                      onClick={() => {
                        setSelectedBatchId(grp.id);
                        setCurrentView('admin-group-detail');
                      }}
                      className="bg-[#2F6FED] hover:bg-blue-700 text-white font-black px-4 py-2.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Users className="w-4 h-4" />
                      <span>View {grp.membersCount} Member Details</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-slate-100 text-slate-400 border border-slate-200/80 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-2 cursor-not-allowed opacity-80"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>No Members (0/50 Slots)</span>
                    </button>
                  )}

                  {/* AUTO-FILL BUTTON FOR INCOMPLETE GROUPS (< 50 MEMBERS) */}
                  {grp.membersCount < 50 && (
                    <button
                      onClick={() => handleAutoFillGroup(grp.id)}
                      disabled={isAutoFillingId === grp.id}
                      className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      {isAutoFillingId === grp.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></div>
                          <span>Auto-Filling...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>🤖 Auto-Fill 50 Members</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* SCHEDULE & START EVENT BUTTON FOR FULL GROUPS (50/50) */}
                  {grp.membersCount === 50 && grp.statusType === 'full' && (
                    <button
                      onClick={() => handleOpenStartModal(grp.id)}
                      className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:to-teal-800 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>🚀 Schedule & Start 50-Day Event</span>
                    </button>
                  )}

                  {/* DAILY GOLD ENGINE BUTTON IF EVENT IS LIVE ACTIVE */}
                  {grp.statusType === 'live' && (
                    <button
                      onClick={() => {
                        setSelectedBatchId(grp.id);
                        setCurrentView('admin-reward-flow-control');
                      }}
                      className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Daily Gold Engine</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Metric Columns */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Occupancy & Slots</span>
                  <p className="text-xl font-black text-[#0B1E39] font-mono">{grp.membersCount} / {grp.totalCapacity} Slots</p>
                  <span className="text-slate-500 font-bold text-[11px]">{grp.totalCapacity - grp.membersCount} Open Slots Remaining</span>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Cycle Status</span>
                  <p className="text-xl font-black text-[#2F6FED] font-mono">
                    {grp.currentDay > 0 ? `Day ${grp.currentDay} / 50` : grp.membersCount === 50 ? 'Day 0 / 50 (Full)' : 'Day 0 / 50'}
                  </p>
                  <span className="text-slate-500 font-bold text-[11px]">
                    {grp.currentDay > 0 ? grp.nextPayout : grp.membersCount === 50 ? 'Ready to Schedule & Start' : 'Event Not Started (Needs 50 Members)'}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Total Pool Capital</span>
                  <p className="text-xl font-black text-amber-700 font-mono">{grp.poolAmount}</p>
                  <span className="text-slate-500 font-bold text-[11px]">₹10,000 Deposit / Member</span>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block mb-1">Batch Manager</span>
                  <p className="text-sm font-extrabold text-[#0B1E39] truncate">{grp.leader}</p>
                  <span className="text-slate-500 font-bold text-[11px]">Start: {grp.startDate}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 📜 SEATED MEMBERS ROSTER LIST MODAL */}
      <AnimatePresence>
        {showRosterModal && selectedBatch && (
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
              className="bg-white max-w-4xl w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowRosterModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Seated Roster List ({selectedBatch.id})
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      {selectedBatch.membersCount} / {selectedBatch.totalCapacity} Occupied Slots
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0B1E39] mt-1">{selectedBatch.name}</h2>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Member ID, name, or slot..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              {/* Member Roster Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="p-3.5">Slot #</th>
                      <th className="p-3.5">Member ID</th>
                      <th className="p-3.5">Member Name</th>
                      <th className="p-3.5">Deposit Amount</th>
                      <th className="p-3.5">Slot Status</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5">Prize Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {currentRosterSlots.map(slot => (
                      <tr key={slot.slotNumber} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#0B1E39]">
                          Slot #{slot.slotNumber.toString().padStart(2, '0')}
                        </td>
                        <td className="p-3.5 font-mono font-black text-[#2F6FED]">
                          {slot.memberId || '—'}
                        </td>
                        <td className="p-3.5 font-bold text-[#0B1E39]">
                          {slot.memberName || <span className="text-slate-400 font-normal">Available Open Slot</span>}
                        </td>
                        <td className="p-3.5 font-mono text-emerald-700 font-extrabold">
                          {slot.memberName ? '₹10,000 (Verified)' : '—'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            slot.status === 'Won 1g Gold'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : slot.status === 'Current Member'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : slot.memberName
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                          }`}>
                            {slot.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{slot.joinedDate || '—'}</td>
                        <td className="p-3.5">
                          {slot.wonDay ? (
                            <span className="text-amber-800 font-black text-[11px] flex items-center space-x-1">
                              <span>🏆 Day {slot.wonDay} Gold Winner</span>
                            </span>
                          ) : slot.memberName ? (
                            <span className="text-slate-600 font-semibold text-[11px]">In Selection Pool</span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Open for Registration</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-500 font-medium">
                  Displaying {currentRosterSlots.length} seated slots in {selectedBatch.id}
                </span>

                <button
                  onClick={() => {
                    setShowRosterModal(false);
                    setCurrentView('admin-group-detail');
                  }}
                  className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold px-6 py-3 rounded-2xl transition-all shadow-md cursor-pointer flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Open Detailed Roster Page</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 SCHEDULE & START 50-DAY EVENT MODAL */}
      <AnimatePresence>
        {showStartModal && (
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
                onClick={() => setShowStartModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Full Batch Ready (50/50 Members)</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Launch 50-Day Gold Event</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Configure start date and daily draw schedule for <span className="font-mono text-amber-700 font-bold">{targetStartBatchId}</span>. Launching activates Day 1 of the 50-day cycle.
                </p>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>Capacity Status:</span>
                  <span className="font-mono text-emerald-700 font-black">50 / 50 Slots Filled (Verified)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>Total Capital Pool:</span>
                  <span className="font-mono text-amber-700 font-black">₹500,000</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>Gold Distribution:</span>
                  <span className="font-mono text-[#0B1E39] font-black">50 Grams 916 Gold (1g Daily)</span>
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
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Daily Draw Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={scheduledTimeInput}
                    onChange={(e) => setScheduledTimeInput(e.target.value)}
                    placeholder="e.g. 07:00 AM IST"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStartEvent}
                  className="w-1/2 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:to-teal-800 text-white font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 Confirm & Launch Live</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ➕ CREATE NEW 50-MEMBER BATCH GROUP MODAL */}
      <AnimatePresence>
        {showCreateModal && (
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
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  <span>New Group Expansion</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Create New 50-Member Batch</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Initialize a brand new 50-slot group batch. Once created, users can register and purchase slots in this batch.
                </p>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Assigned Batch ID:</span>
                  <span className="font-mono text-amber-800 font-black">GROUP-{String(allGroups.length + 1).padStart(3, '0')}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Slot Capacity:</span>
                  <span className="font-mono text-[#0B1E39] font-black">50 Open Slots (₹10,000 / Slot)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Initial Status:</span>
                  <span className="font-mono text-blue-700 font-black">Recruiting Active (0/50 Members)</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Group Batch Title
                  </label>
                  <input
                    type="text"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    placeholder="e.g. InfinityGram 50 Gold Club - Batch F"
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewGroupSubmit}
                  className="w-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Create & Open Batch</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
