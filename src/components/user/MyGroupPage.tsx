'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Award, ShieldCheck, Sparkles, Filter, CheckCircle2, Clock, Table, LayoutGrid, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyGroupPage = () => {
  const { group, user, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'All' | 'ActivePool' | 'WonGold'>('All');
  const [viewFormat, setViewFormat] = useState<'table' | 'grid'>('table');
  const [selectedSlotModal, setSelectedSlotModal] = useState<typeof group.slots[0] | null>(null);

  const filteredSlots = group.slots.filter(s => {
    if (filter === 'WonGold') return s.status === 'Won 1g Gold';
    if (filter === 'ActivePool') return s.status !== 'Won 1g Gold';
    return true;
  });

  return (
    <div className="space-y-6 text-white font-sans relative">
      
      {/* Group Header Card */}
      <div className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-extrabold bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {group.status}
            </span>
            <span className="text-xs font-mono text-[#F2C868] font-bold">{group.groupId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">InfinityGram 50 Gold Club - Batch A</h1>
          <p className="text-xs text-slate-300 mt-1">
            Strict 50-Member Group Structure. Day {group.currentCycleDay - 1} completed <span className="text-[#00C2B8] font-bold">→</span> 14 Members awarded 1 Gram Gold. {group.activePoolCount} Members remain in active pool.
          </p>
        </div>

        {/* Quick Pool Stats */}
        <div className="flex items-center space-x-3 bg-[#081E26] p-3.5 rounded-2xl border border-[#0D3B43] shrink-0 text-xs font-bold shadow-inner">
          <div className="text-center px-3 border-r border-[#0D3B43]">
            <p className="text-slate-400 font-medium">Total Slots</p>
            <p className="text-base font-bold text-white">50</p>
          </div>
          <div className="text-center px-3 border-r border-[#0D3B43]">
            <p className="text-slate-400 font-medium">Gold Awarded</p>
            <p className="text-base font-bold text-[#F2C868]">14 Grams</p>
          </div>
          <div className="text-center px-3">
            <p className="text-slate-400 font-medium">Active Pool</p>
            <p className="text-base font-bold text-[#00C2B8]">36 Pool</p>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0D3B43] rounded-2xl border border-[#E1A238]/30 shadow-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#E1A238]" />
          <span className="text-xs font-bold text-white">Filter 50-Slots:</span>
          
          <button
            onClick={() => setFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'All' ? 'bg-[#00C2B8] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            All 50 Slots
          </button>
          <button
            onClick={() => setFilter('ActivePool')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'ActivePool' ? 'bg-[#00C2B8] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            Active Pool ({group.activePoolCount})
          </button>
          <button
            onClick={() => setFilter('WonGold')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'WonGold' ? 'bg-[#E1A238] text-[#081E26] shadow-sm' : 'bg-[#081E26] text-slate-300 hover:text-white border border-[#0D3B43]'
            }`}
          >
            Won 1g Gold (14)
          </button>
        </div>

        {/* View Switcher Toggle & Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-[#081E26] p-1 rounded-xl border border-[#E1A238]/20 text-xs font-bold">
            <button
              onClick={() => setViewFormat('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewFormat === 'table' ? 'bg-[#00C2B8] text-[#081E26] font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewFormat('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewFormat === 'grid' ? 'bg-[#00C2B8] text-[#081E26] font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 50-Member Display Container */}
      <div className="bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#00C2B8]" />
            <span>Audited 50-Member Progression Directory</span>
          </h3>
          <span className="text-xs text-slate-300 font-mono">Showing {filteredSlots.length} of 50 Members</span>
        </div>

        {/* TABLE VIEW */}
        {viewFormat === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-[#081E26]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081E26] text-slate-300 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="p-3.5">Slot #</th>
                  <th className="p-3.5">Member Name</th>
                  <th className="p-3.5">Member ID</th>
                  <th className="p-3.5">Cycle Status</th>
                  <th className="p-3.5">Award / Pool Info</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#081E26] font-medium">
                {filteredSlots.map(slot => {
                  const isWon = slot.status === 'Won 1g Gold';
                  const isCurrentUser = slot.slotNumber === user.slotNumber;

                  return (
                    <tr
                      key={slot.slotNumber}
                      onClick={() => setSelectedSlotModal(slot)}
                      className={`transition-colors cursor-pointer ${
                        isCurrentUser
                          ? 'bg-[#00C2B8]/20 hover:bg-[#00C2B8]/30 text-white font-bold'
                          : isWon
                            ? 'bg-[#E1A238]/10 hover:bg-[#E1A238]/20 text-[#F2C868]'
                            : 'hover:bg-[#081E26]/50 text-slate-200'
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#00C2B8]">
                        #{slot.slotNumber.toString().padStart(2, '0')}
                      </td>
                      <td className="p-3.5 font-bold">
                        <div className="flex items-center space-x-2">
                          <span>{slot.memberName}</span>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-[#E1A238] text-[#081E26] font-black px-1.5 py-0.5 rounded uppercase">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{slot.memberId}</td>
                      <td className="p-3.5">
                        {isWon ? (
                          <span className="inline-flex items-center space-x-1 bg-[#E1A238]/20 text-[#E1A238] border border-[#E1A238]/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <Award className="w-3 h-3" />
                            <span>Won 1g 24K Gold</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-[#00C2B8]/10 text-[#00C2B8] border border-[#00C2B8]/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8]"></span>
                            <span>Active Pool</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        {isWon ? (
                          <span className="text-[#F2C868]">Awarded Day {slot.wonDay}</span>
                        ) : (
                          <span className="text-slate-400">Eligible Daily Draw</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedSlotModal(slot); }}
                          className="px-3 py-1 bg-[#081E26] hover:bg-[#00C2B8] hover:text-[#081E26] border border-[#0D3B43] rounded-lg text-[11px] font-bold transition-all inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Seat</span>
                        </button>
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
              const isCurrentUser = slot.slotNumber === user.slotNumber;

              return (
                <motion.div
                  key={slot.slotNumber}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedSlotModal(slot)}
                  className={`p-3 rounded-2xl border flex flex-col justify-between h-24 transition-all relative overflow-hidden cursor-pointer ${
                    isWon
                      ? 'bg-[#081E26] border-[#E1A238] text-[#F2C868] shadow-xs'
                      : isCurrentUser
                        ? 'bg-gradient-to-br from-[#00C2B8] to-[#0D3B43] text-white border-[#00C2B8] shadow-md ring-2 ring-[#00C2B8]/40'
                        : 'bg-[#081E26] border-[#0D3B43] text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isCurrentUser ? 'text-white' : 'text-slate-400'}`}>
                      #{slot.slotNumber.toString().padStart(2, '0')}
                    </span>
                    {isWon && <Award className="w-4 h-4 text-[#E1A238]" />}
                    {isCurrentUser && !isWon && (
                      <span className="text-[9px] font-bold uppercase bg-[#E1A238] text-[#081E26] px-1.5 rounded">YOU</span>
                    )}
                  </div>

                  <div>
                    <p className={`text-xs font-bold truncate ${isCurrentUser ? 'text-white' : isWon ? 'text-[#F2C868]' : 'text-white'}`}>
                      {slot.memberName}
                    </p>
                    <p className={`text-[10px] font-mono ${isCurrentUser ? 'text-slate-200' : 'text-slate-400'}`}>
                      {slot.memberId}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-[#0D3B43]">
                    {isWon ? (
                      <span className="text-[9px] font-extrabold text-[#E1A238] uppercase">
                        Won Day {slot.wonDay}
                      </span>
                    ) : (
                      <span className={`text-[9px] font-bold flex items-center space-x-1 ${isCurrentUser ? 'text-white' : 'text-[#00C2B8]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrentUser ? 'bg-white' : 'bg-[#00C2B8]'}`}></span>
                        <span>In Active Pool</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Member Slot Detail Modal */}
      {selectedSlotModal && (
        <div className="fixed inset-0 bg-[#081E26]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D3B43] border border-[#E1A238]/40 p-6 rounded-3xl max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#081E26] pb-3">
              <h4 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#00C2B8]" />
                <span>Slot #{selectedSlotModal.slotNumber.toString().padStart(2, '0')} Seat Verification</span>
              </h4>
              <button 
                onClick={() => setSelectedSlotModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-[#081E26] rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#081E26] p-4 rounded-2xl border border-[#0D3B43] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Member Name:</span>
                  <span className="font-bold text-white">{selectedSlotModal.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Member ID:</span>
                  <span className="font-mono text-[#00C2B8] font-bold">{selectedSlotModal.memberId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Group Name:</span>
                  <span className="font-bold text-white">InfinityGram 50 Gold Club - Batch A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-[#F2C868]">{selectedSlotModal.status}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSlotModal(null)}
              className="w-full py-3 bg-[#00C2B8] text-[#081E26] font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              Close Seat Overview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
