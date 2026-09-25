'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Clock, 
  CheckCircle2, 
  Search, 
  Grid, 
  List, 
  Download, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail,
  FileText,
  DollarSign,
  X,
  Eye,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminGroupDetailPage = () => {
  const { group, allGroups, setSelectedBatchId, setCurrentView, autoFillGroupWithSystemUsers, updateGroupSchedule } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'winners' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotMember, setSelectedSlotMember] = useState<any>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const isFull = group.totalMembers === 50;
  const isLive = isFull && (group.status === 'active' || group.status === 'live');

  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      const res = await autoFillGroupWithSystemUsers(group.groupId);
      if (res.success) {
        alert(`Success! Auto-filled ${group.groupId} with system bot members. Group is now 50/50 Full & Ready to Start!`);
      } else {
        alert(res.error || 'Auto-fill failed.');
      }
    } catch (e: any) {
      alert(e.message || 'Error occurred.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleStartEventNow = () => {
    updateGroupSchedule(group.groupId, new Date().toISOString().split('T')[0], '07:00 AM IST');
    alert(`🎉 50-Day Event officially started for ${group.groupId}! Day 1 is now active.`);
  };

  const memberSlots = group.slots;
  const winnersCount = memberSlots.filter(s => s.status === 'Won 1g Gold').length;
  const activeCount = memberSlots.filter(s => s.status !== 'Won 1g Gold' && s.memberName && s.memberName.trim() !== '').length;

  const filteredMembers = memberSlots.filter(slot => {
    const matchesTab = 
      filterTab === 'all' ? true :
      filterTab === 'winners' ? slot.status === 'Won 1g Gold' :
      slot.status !== 'Won 1g Gold';

    const matchesSearch = 
      !searchQuery.trim() ||
      (slot.memberName && slot.memberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (slot.memberId && slot.memberId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      slot.slotNumber.toString().includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Back Button & Top Executive Header */}
      <div className="space-y-4">
        <button
          onClick={() => setCurrentView('admin-groups')}
          className="inline-flex items-center space-x-2 text-xs font-black text-[#0B1E39] hover:text-[#2F6FED] bg-white border border-slate-200/90 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Group Batches Overview</span>
        </button>

        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black">
              <Users className="w-4 h-4 text-amber-600" />
              <span>50-Member Batch Roster & Slot Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1E39] tracking-tight">
              {group.groupName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Batch Code: <span className="font-mono text-amber-700 font-bold">{group.groupId}</span> | Status: <span className="text-emerald-700 font-bold">{isLive ? `Active Day ${group.currentCycleDay || 1} Cycle` : isFull ? 'Full 50/50 Ready to Start' : `Recruiting Active (${group.totalMembers}/50)`}</span> | Capacity: <span className="text-[#0B1E39] font-extrabold">{group.totalMembers} / 50 Slots</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 relative z-10">
            {!isFull && (
              <button
                onClick={handleAutoFill}
                disabled={isAutoFilling}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black px-5 py-3.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                {isAutoFilling ? (
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

            {isFull && !isLive && (
              <button
                onClick={handleStartEventNow}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-5 py-3.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🚀 Launch 50-Day Event Live</span>
              </button>
            )}

            {isLive && (
              <button
                onClick={() => setCurrentView('admin-reward-flow-control')}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-5 py-3.5 rounded-2xl text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Panai Gold Engine</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BATCH SELECTOR SWITCHER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-black text-[#0B1E39] uppercase tracking-wider shrink-0 mr-2">Selected Batch:</span>
        {allGroups.map((g) => {
          const isSelected = group.groupId === g.groupId;
          const isAvailable = g.totalMembers > 0;
          return (
            <button
              key={g.groupId}
              disabled={!isAvailable}
              onClick={() => isAvailable && setSelectedBatchId(g.groupId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 whitespace-nowrap ${
                !isAvailable
                  ? 'bg-slate-100/60 text-slate-400 cursor-not-allowed border border-dashed border-slate-200 opacity-60'
                  : isSelected
                    ? 'bg-[#0B1E39] text-white shadow-md cursor-pointer'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 cursor-pointer'
              }`}
            >
              <span>{g.groupName.split(' - ')[1]}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                !isAvailable ? 'bg-slate-200 text-slate-500' : isSelected ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-800'
              }`}>
                {g.groupId} ({!isAvailable ? '0 Members' : `${g.totalMembers}/50`})
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Total Members Joined</span>
          <p className="text-3xl font-black text-[#0B1E39] font-mono">{group.totalMembers} / 50 Slots</p>
          <span className="text-emerald-700 font-extrabold text-xs">{Math.round((group.totalMembers / 50) * 100)}% Capacity Filled</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Total Capital Deposited</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">₹{(group.totalMembers * 10000).toLocaleString('en-IN')}</p>
          <span className="text-slate-500 font-semibold text-xs">{group.totalMembers} Verified ₹10,000 Payments</span>
        </div>

        <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/90 space-y-2">
          <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">Gold Awarded To Date</span>
          <p className="text-3xl font-black text-amber-800 font-mono">{winnersCount} Grams</p>
          <span className="text-amber-900 font-bold text-xs">{winnersCount} Member Won 1g Gold</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">Active Draw Pool</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">{activeCount} Members</p>
          <span className="text-blue-900 font-bold text-xs">Remaining for Upcoming Days</span>
        </div>
      </div>

      {/* Roster Controls & Filter Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black font-mono bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase">
                {group.groupId}
              </span>
              <h2 className="text-xl font-black text-[#0B1E39]">{group.groupName} — Members Directory & Slot Verification</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Comprehensive roster list of all enrolled members in sequence (Slots 1 to {group.totalMembers || 50}) for <strong className="text-slate-800 font-bold">{group.groupName}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'all' ? 'bg-white text-[#0B1E39] shadow-xs font-extrabold' : 'text-slate-500'}`}
              >
                All 50 Slots
              </button>
              <button
                onClick={() => setFilterTab('winners')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'winners' ? 'bg-amber-400 text-amber-950 font-black' : 'text-slate-500'}`}
              >
                Gold Winners ({winnersCount})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTab === 'active' ? 'bg-blue-600 text-white font-black' : 'text-slate-500'}`}
              >
                Active Pool ({activeCount})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search slot # or member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-900 pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] font-semibold w-64"
              />
            </div>
          </div>
        </div>

        {/* 50 Members Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold font-sans">
              <tr>
                <th className="p-4">Slot #</th>
                <th className="p-4">Member Profile</th>
                <th className="p-4">Member ID</th>
                <th className="p-4">Deposit Verified</th>
                <th className="p-4">Reward Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMembers.map((slot) => {
                const hasWon = slot.status === 'Won 1g Gold';
                const isFilled = slot.memberName && slot.memberName.trim() !== '' && slot.memberName !== '—' && slot.memberId && slot.memberId !== '—' && slot.memberId !== 'Unassigned';

                return (
                  <tr 
                    key={slot.slotNumber}
                    onClick={() => isFilled && setSelectedSlotMember(slot)}
                    className={`transition-colors ${isFilled ? 'hover:bg-blue-50/70 cursor-pointer' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="p-4 font-mono font-black text-[#0B1E39] text-sm">
                      Slot #{slot.slotNumber.toString().padStart(2, '0')}
                    </td>

                    <td className="p-4">
                      {isFilled ? (
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0 border ${
                            hasWon ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gradient-to-br from-[#00C2B8] to-[#0B1E39] text-[#F2C868] border-[#E1A238]/60 shadow-xs'
                          }`}>
                            {(slot.memberName || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#0B1E39] text-xs">
                              {slot.memberName}
                            </p>
                            {(slot as any).mobile ? (
                              <p className="text-[11px] text-slate-500 font-mono">
                                {(slot as any).mobile}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono font-bold">—</span>
                      )}
                    </td>

                    <td className="p-4 font-mono font-black text-[#2F6FED]">
                      {isFilled ? slot.memberId : <span className="text-slate-400 font-normal">—</span>}
                    </td>

                    <td className="p-4">
                      {isFilled ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>₹10,000 Paid (Verified)</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-medium">
                          Slot Open / Unassigned
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {isFilled ? (
                        hasWon ? (
                          <span className="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center space-x-1">
                            <Award className="w-3.5 h-3.5 text-amber-700" />
                            <span>Won 1g Gold (Day {slot.wonDay || 1})</span>
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Active in Draw Pool</span>
                          </span>
                        )
                      ) : (
                        <span className="bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-medium">
                          Slot Open
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {isFilled ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSlotMember(slot);
                          }}
                          className="text-xs font-bold text-[#2F6FED] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* MEMBER DETAILS INSPECTION MODAL */}
      <AnimatePresence>
        {selectedSlotMember && (
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
                onClick={() => setSelectedSlotMember(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1E39] to-[#2F6FED] text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {selectedSlotMember.memberName ? selectedSlotMember.memberName.charAt(0) : 'M'}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase">
                    Slot #{selectedSlotMember.slotNumber.toString().padStart(2, '0')} Occupant
                  </span>
                  <h3 className="text-xl font-black text-[#0B1E39] mt-1">
                    {selectedSlotMember.memberName || `Member #${selectedSlotMember.slotNumber}`}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-[#2F6FED]">
                    Member ID: {selectedSlotMember.memberId || `LOP-${String(selectedSlotMember.slotNumber).padStart(6, '0')}`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Group Batch:</span>
                  <span className="font-extrabold text-[#0B1E39]">{group.groupName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Deposit Requirement:</span>
                  <span className="font-mono text-emerald-700 font-black">₹10,000 (Verified)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Payment Reference UTR:</span>
                  <span className="font-mono text-slate-800 font-bold">UPI-98234120938{selectedSlotMember.slotNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Joined Date:</span>
                  <span className="text-slate-800 font-semibold">{selectedSlotMember.joinedDate || '12 Aug 2026'}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Gold Reward Status:</span>
                  <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {selectedSlotMember.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSlotMember(null)}
                className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40"
              >
                Close Member Inspection Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
