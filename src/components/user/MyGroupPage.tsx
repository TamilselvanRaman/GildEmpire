'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Award, ShieldCheck, Sparkles, Filter, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyGroupPage = () => {
  const { group, user, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'All' | 'ActivePool' | 'WonGold'>('All');

  const filteredSlots = group.slots.filter(s => {
    if (filter === 'WonGold') return s.status === 'Won 1g Gold';
    if (filter === 'ActivePool') return s.status !== 'Won 1g Gold';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Group Header Card */}
      <div className="sovereign-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="badge-green text-[10px] px-2.5 py-0.5">
              {group.status}
            </span>
            <span className="text-xs font-mono text-slate-500 font-bold">{group.groupId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B1E39]">{group.groupName}</h1>
          <p className="text-xs text-slate-600 mt-1">
            Strict 50-Member Group Structure. Day {group.currentCycleDay - 1} completed $\rightarrow$ 14 Members awarded 1 Gram Gold. {group.activePoolCount} Members remain in active pool.
          </p>
        </div>

        {/* Quick Pool Stats */}
        <div className="flex items-center space-x-3 bg-[#F0F4FA] p-3.5 rounded-2xl border border-[#DCE4F0] shrink-0 text-xs font-bold">
          <div className="text-center px-3 border-r border-[#DCE4F0]">
            <p className="text-slate-500 font-medium">Total Slots</p>
            <p className="text-base font-bold text-[#0B1E39]">50</p>
          </div>
          <div className="text-center px-3 border-r border-[#DCE4F0]">
            <p className="text-slate-500 font-medium">Gold Awarded</p>
            <p className="text-base font-bold text-amber-700">14 Grams</p>
          </div>
          <div className="text-center px-3">
            <p className="text-slate-500 font-medium">Active Pool</p>
            <p className="text-base font-bold text-[#2F6FED]">36 Pool</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sovereign-card p-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-[#0B1E39]">Filter 50-Slots:</span>
          
          <button
            onClick={() => setFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'All' ? 'bg-[#0B1E39] text-white shadow-sm' : 'bg-[#F0F4FA] text-slate-600 hover:bg-[#E6EEFB]'
            }`}
          >
            All 50 Slots
          </button>
          <button
            onClick={() => setFilter('ActivePool')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'ActivePool' ? 'bg-[#2F6FED] text-white shadow-sm' : 'bg-[#F0F4FA] text-slate-600 hover:bg-[#E6EEFB]'
            }`}
          >
            Active Pool ({group.activePoolCount})
          </button>
          <button
            onClick={() => setFilter('WonGold')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'WonGold' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-[#F0F4FA] text-slate-600 hover:bg-[#E6EEFB]'
            }`}
          >
            Won 1g Gold (14)
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-[11px] font-bold">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500 inline-block"></span>
            <span className="text-slate-700">Won 1g Gold</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-[#2F6FED] inline-block"></span>
            <span className="text-slate-700">Your Position (#14)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-white border border-[#DCE4F0] inline-block"></span>
            <span className="text-slate-700">Active Pool</span>
          </span>
        </div>
      </div>

      {/* Interactive 50-Slot Grid (#1 to #50) */}
      <div className="sovereign-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0B1E39]">Audited 50-Member Progression Grid</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {filteredSlots.map(slot => {
            const isWon = slot.status === 'Won 1g Gold';
            const isCurrentUser = slot.slotNumber === user.slotNumber;

            return (
              <motion.div
                key={slot.slotNumber}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-2xl border flex flex-col justify-between h-24 transition-all relative overflow-hidden ${
                  isWon
                    ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                    : isCurrentUser
                      ? 'bg-[#2F6FED] text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                      : 'bg-white border-[#DCE4F0] text-[#0B1E39]'
                }`}
              >
                {/* Slot Number Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isCurrentUser ? 'text-amber-300' : 'text-slate-400'}`}>
                    #{slot.slotNumber.toString().padStart(2, '0')}
                  </span>
                  {isWon && (
                    <Award className="w-4 h-4 text-amber-600" />
                  )}
                  {isCurrentUser && !isWon && (
                    <span className="text-[9px] font-bold uppercase bg-amber-400 text-slate-950 px-1.5 rounded">YOU</span>
                  )}
                </div>

                {/* Member Name */}
                <div>
                  <p className={`text-xs font-bold truncate ${isCurrentUser ? 'text-white' : 'text-[#0B1E39]'}`}>
                    {slot.memberName}
                  </p>
                  <p className={`text-[10px] font-mono ${isCurrentUser ? 'text-slate-200' : 'text-slate-400'}`}>
                    {slot.memberId}
                  </p>
                </div>

                {/* Bottom Status Tag */}
                <div className="pt-1 border-t border-[#DCE4F0]">
                  {isWon ? (
                    <span className="text-[9px] font-extrabold text-amber-800 uppercase">
                      Won Day {slot.wonDay}
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold flex items-center space-x-1 ${isCurrentUser ? 'text-white' : 'text-[#1E9E64]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrentUser ? 'bg-amber-300' : 'bg-[#1E9E64]'}`}></span>
                      <span>In Active Pool</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
