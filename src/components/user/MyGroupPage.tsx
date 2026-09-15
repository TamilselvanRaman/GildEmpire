'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Award, ShieldCheck, Sparkles, Filter, CheckCircle2, Clock, Table, LayoutGrid, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyGroupPage = () => {
  const { group, user, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'All' | 'ActivePool' | 'WonGold'>('All');
  const [viewFormat, setViewFormat] = useState<'table' | 'grid'>('table');

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
            Strict 50-Member Group Structure. Member allocation in progress <span className="text-[#00C2B8] font-bold">→</span> 1 Active Member registered, 49 Slots available.
          </p>
        </div>

        {/* Quick Pool Stats */}
        <div className="flex items-center space-x-3 bg-[#081E26] p-3.5 rounded-2xl border border-[#0D3B43] shrink-0 text-xs font-bold shadow-inner">
          <div className="text-center px-3 border-r border-[#0D3B43]">
            <p className="text-slate-400 font-medium">Total Slots</p>
            <p className="text-base font-bold text-white">50</p>
          </div>
          <div className="text-center px-3 border-r border-[#0D3B43]">
            <p className="text-slate-400 font-medium">Occupied</p>
            <p className="text-base font-bold text-[#00C2B8]">1 Slot</p>
          </div>
          <div className="text-center px-3">
            <p className="text-slate-400 font-medium">Available</p>
            <p className="text-base font-bold text-[#F2C868]">49 Slots</p>
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
            Active Pool
          </button>
          <button
            onClick={() => setFilter('WonGold')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
                </tr>
              </thead>
              <tbody className="divide-y divide-[#081E26] font-medium">
                {filteredSlots.map(slot => {
                  const isWon = slot.status === 'Won 1g Gold';
                  const isCurrentUser = 
                    slot.slotNumber === user.slotNumber || 
                    (user.memberId && slot.memberId === user.memberId) ||
                    (user.fullName && slot.memberName && slot.memberName.toLowerCase() === user.fullName.toLowerCase()) ||
                    slot.slotNumber === 1;

                  return (
                    <tr
                      key={slot.slotNumber}
                      className={`transition-all ${
                        isCurrentUser
                          ? 'bg-[#00C2B8]/20 text-white font-bold border-l-4 border-l-[#00C2B8]'
                          : isWon
                            ? 'bg-[#E1A238]/10 text-[#F2C868]'
                            : 'text-slate-200'
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#00C2B8]">
                        #{slot.slotNumber.toString().padStart(2, '0')}
                      </td>

                      {/* Member Name Field */}
                      <td className="p-3.5 font-bold">
                        <div className="flex items-center space-x-2">
                          <span>{slot.memberName}</span>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-[#E1A238] text-[#081E26] font-black px-1.5 py-0.5 rounded uppercase shrink-0">YOU</span>
                          )}
                        </div>
                      </td>

                      {/* Member ID Field */}
                      <td className="p-3.5 font-mono text-slate-300">
                        <span>{slot.memberId}</span>
                      </td>

                      <td className="p-3.5">
                        {isWon ? (
                          <span className="inline-flex items-center space-x-1 bg-[#E1A238]/20 text-[#E1A238] border border-[#E1A238]/40 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <Award className="w-3 h-3" />
                            <span>Won 1g 24K Gold</span>
                          </span>
                        ) : isCurrentUser ? (
                          <span className="inline-flex items-center space-x-1 bg-[#00C2B8]/10 text-[#00C2B8] border border-[#00C2B8]/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2B8]"></span>
                            <span>Active Pool</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-slate-800/60 text-slate-400 border border-slate-700/60 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <span>Available Slot</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        {isWon ? (
                          <span className="text-[#F2C868]">Awarded Day {slot.wonDay}</span>
                        ) : isCurrentUser ? (
                          <span className="text-slate-400">Eligible Daily Draw</span>
                        ) : (
                          <span className="text-slate-500">Open for Allocation</span>
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
              const isCurrentUser = 
                slot.slotNumber === user.slotNumber || 
                (user.memberId && slot.memberId === user.memberId) ||
                (user.fullName && slot.memberName && slot.memberName.toLowerCase() === user.fullName.toLowerCase()) ||
                slot.slotNumber === 1;

              return (
                <motion.div
                  key={slot.slotNumber}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-2xl border flex flex-col justify-between h-24 transition-all relative overflow-hidden ${
                    isWon
                      ? 'bg-[#081E26] border-[#E1A238] text-[#F2C868] shadow-xs'
                      : isCurrentUser
                        ? 'bg-gradient-to-br from-[#00C2B8] to-[#0D3B43] text-white border-[#00C2B8] shadow-md ring-2 ring-[#00C2B8]/40'
                        : 'bg-[#081E26] border-[#0D3B43] text-slate-300'
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
                    <p className={`text-xs font-bold truncate ${isCurrentUser ? 'text-white' : isWon ? 'text-[#F2C868]' : 'text-slate-300'}`}>
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
                    ) : isCurrentUser ? (
                      <span className="text-[9px] font-bold flex items-center space-x-1 text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        <span>In Active Pool</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-500">
                        Available
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
