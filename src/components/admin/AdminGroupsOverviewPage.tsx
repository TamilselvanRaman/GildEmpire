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
  const { group, allGroups, selectedBatchId, setSelectedBatchId, setCurrentView } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatchName, setNewBatchName] = useState('InfinityGram 50 Gold Club - Batch F');
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'full' | 'recruiting' | 'empty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [viewFormat, setViewFormat] = useState<'cards' | 'table'>('cards');

  // 50-Slot Batch Roster Pipeline
  const groupsList = allGroups.map(g => ({
    id: g.groupId,
    name: g.groupName,
    status: g.status === 'active' || g.status === 'live' ? '1. Live 50-Day Cycle Active' :
            g.status === 'full' ? '2. Full - Schedule Ready (50/50)' :
            g.status === 'recruiting' ? `3. Recruitment Active (${g.totalMembers} Members)` : '4. Empty (Reserve Queue)',
    statusType: g.status === 'active' ? 'live' : g.status,
    statusColor: g.status === 'active' || g.status === 'live' ? 'emerald' : g.status === 'full' ? 'amber' : g.status === 'recruiting' ? 'blue' : 'slate',
    membersCount: g.totalMembers,
    totalCapacity: 50,
    currentDay: g.currentCycleDay,
    goldAwardedGrams: g.totalGoldDistributedGrams,
    startDate: g.startDate || (g.status === 'full' ? 'Full - Set Date/Time' : 'Recruiting Active'),
    leader: 'Operations Lead',
    poolAmount: `₹${(g.totalMembers * 10000).toLocaleString('en-IN')}`,
    nextPayout: g.scheduledTime || 'Daily 07:00 AM IST',
  }));

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
          <p className="text-3xl font-black text-[#0B1E39] font-mono">5 Batches</p>
          <span className="text-slate-500 font-semibold">GROUP-001 to GROUP-005</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <span className="text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">1. Live 50-Slot Cycle</span>
          <p className="text-3xl font-black text-emerald-700 font-mono">GROUP-001</p>
          <span className="text-emerald-800 font-extrabold">Day 2 Active (50/50 Full)</span>
        </div>

        <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/90 space-y-2">
          <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">2. Full (Schedule Ready)</span>
          <p className="text-3xl font-black text-amber-800 font-mono">GROUP-002</p>
          <span className="text-amber-900 font-bold">50/50 Filled • Ready to Schedule</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">3. Recruiting Batch</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">GROUP-003</p>
          <span className="text-blue-900 font-bold">40 Members • 10 Open Slots</span>
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
            All 5 Batches
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'live' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Cycle (GROUP-001)
          </button>
          <button
            onClick={() => setActiveTab('full')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'full' ? 'bg-amber-500 text-amber-950 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full - Schedule Ready (GROUP-002)
          </button>
          <button
            onClick={() => setActiveTab('recruiting')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'recruiting' ? 'bg-[#2F6FED] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recruiting (GROUP-003)
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
                  {/* CLICK TO NAVIGATE DIRECTLY TO FULL GROUP DETAIL PAGE (ONLY IF MEMBERS ARE AVAILABLE) */}
                  {grp.membersCount > 0 ? (
                    <button
                      onClick={() => {
                        setSelectedBatchId(grp.id);
                        setCurrentView('admin-group-detail');
                      }}
                      className="bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Users className="w-4 h-4" />
                      <span>View {grp.membersCount} Member Details</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-slate-100 text-slate-400 border border-slate-200/80 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 cursor-not-allowed opacity-80"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>No Members Available (0/50 Slots)</span>
                    </button>
                  )}

                  {grp.statusType === 'full' && (
                    <button
                      onClick={() => {
                        setSelectedBatchId(grp.id);
                        setCurrentView('admin-reward-flow-control');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-5 py-3 rounded-2xl text-xs shadow-md shadow-amber-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Set Date & Time</span>
                    </button>
                  )}

                  {grp.statusType === 'live' && (
                    <button
                      onClick={() => {
                        setSelectedBatchId(grp.id);
                        setCurrentView('admin-reward-flow-control');
                      }}
                      className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-black px-5 py-3 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
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
                    {grp.currentDay > 0 ? `Day ${grp.currentDay} / 50` : grp.statusType === 'full' ? 'Full Ready' : 'Recruiting'}
                  </p>
                  <span className="text-slate-500 font-bold text-[11px]">{grp.nextPayout}</span>
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

    </div>
  );
};
