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
  CalendarDays
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
    pastWinners, 
    drawLockedUntil, 
    isLiveDrawActive, 
    currentLiveWinner,
    programEvents
  } = useApp();
  
  const [vesselType, setVesselType] = useState<'glass' | 'panai'>('glass');
  const [selectedWinner, setSelectedWinner] = useState<DailyGoldWinner | null>(currentLiveWinner);

  // 24-Hour Cooldown Timer Calculation
  const [lockCountdown, setLockCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

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

  const isLocked24h = lockCountdown !== null;
  const activePoolMembers = group.slots.filter(s => s.status !== 'Won 1g Gold');

  useEffect(() => {
    if (currentLiveWinner) {
      setSelectedWinner(currentLiveWinner);
    }
  }, [currentLiveWinner]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-16 select-none">
      
      {/* 🏛️ EXECUTIVE CORPORATE METRICS TICKER BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Selection Day */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1A238]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">Current Cycle</p>
          <p className="text-xl sm:text-2xl font-black text-white font-serif mt-1">Day {group.currentCycleDay.toString().padStart(2, '0')} <span className="text-xs text-[#00C2B8] font-sans font-semibold">/ 50</span></p>
          <p className="text-[11px] text-slate-300 mt-1 font-medium">1 Gram 916 Gold Draw</p>
        </div>

        {/* Metric 2: Active Chits Pool */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C2B8]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">Active Pool Chits</p>
          <p className="text-xl sm:text-2xl font-black text-[#00C2B8] font-mono mt-1">{activePoolMembers.length} <span className="text-xs text-slate-300 font-sans font-normal">Members</span></p>
          <p className="text-[11px] text-[#F2C868] mt-1 font-medium">Inside 3D Crystal Bowl</p>
        </div>

        {/* Metric 3: Live Broadcast Schedule */}
        <div className="bg-gradient-to-br from-[#0D3B43] to-[#081E26] p-4 sm:p-5 rounded-2xl border border-[#E1A238]/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C2B8]/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest">Daily Schedule</p>
          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1">07:00 <span className="text-xs text-[#00C2B8] font-sans">AM IST</span></p>
          <p className="text-[11px] text-[#00C2B8] mt-1 font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#00C2B8] animate-pulse" />
            <span>Admin Live Broadcast</span>
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
          <p className="text-[11px] text-slate-300 mt-1 font-mono text-ellipsis overflow-hidden whitespace-nowrap">0x7F9B...88A2</p>
        </div>
      </div>

      {/* 📺 CORPORATE SOVEREIGN BROADCAST ARENA */}
      <div className="bg-gradient-to-b from-[#0D3B43] via-[#081E26] to-[#040D11] rounded-[2.5rem] border-2 border-[#E1A238]/60 shadow-[0_30px_70px_rgba(8,30,38,0.9),0_0_50px_rgba(0,194,184,0.2)] overflow-hidden relative">
        
        {/* Top Header Banner */}
        <div className="px-6 sm:px-10 py-6 border-b border-[#E1A238]/30 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 bg-[#081E26]/80 backdrop-blur-md">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-mono font-bold bg-[#0D3B43] text-[#00C2B8] border border-[#00C2B8]/40 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00C2B8]" />
                <span>InfinityGram Live Broadcast</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#081E26] bg-[#E1A238] px-3 py-1 rounded-full font-black">
                {activePoolMembers.length} Folded Chits Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-white tracking-wide pt-1">
              Day {group.currentCycleDay} Traditional 1 Gram Gold Selection
            </h1>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center space-x-3 shrink-0 bg-[#0D3B43] border border-[#00C2B8]/50 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2B8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C2B8]"></span>
            </span>
            <div className="text-left">
              <span className="text-[9px] font-mono text-slate-300 block uppercase tracking-wider">Stream Status</span>
              <span className="text-xs font-serif font-bold text-[#F2C868] uppercase tracking-widest">3D Lucky Bowl Active</span>
            </div>
          </div>
        </div>

        {/* Live Broadcast Studio Stage */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center space-y-6 relative z-10">
          
          {/* Centered 3D Glass Bottle Stage */}
          <div className="w-full flex items-center justify-center py-2">
            <Interactive3DBottleCard
              drawState={isLiveDrawActive ? (currentLiveWinner ? 'revealed' : 'shaking') : 'idle'}
              winner={currentLiveWinner}
              activeChitCount={activePoolMembers.length}
              isAdminView={false}
            />
          </div>

          {/* Live Stream Monitor Button Bar */}
          <div className="space-y-3 w-full max-w-md">
            <button
              disabled
              className={`w-full py-4 rounded-full text-xs font-serif font-bold tracking-widest uppercase flex items-center justify-center space-x-2.5 transition-all shadow-xl border ${
                isLocked24h
                  ? 'bg-[#081E26] text-[#F2C868] border-[#E1A238]/50'
                  : 'bg-[#0D3B43] text-white border-[#00C2B8]/40'
              }`}
            >
              {isLocked24h ? (
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
              Cryptographically verified 1 Gram 916 Gold Coin winner dispatch registry
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#081E26] bg-[#00C2B8] border border-[#00C2B8] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm font-extrabold">
            <ShieldCheck className="w-4 h-4 text-[#081E26]" />
            <span>Verified SOC-2 Audit</span>
          </span>
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
              {pastWinners.map(w => (
                <tr key={w.dayNumber} className="hover:bg-[#0D3B43]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#F2C868]">Day {w.dayNumber.toString().padStart(2, '0')}</td>
                  <td className="p-4 text-slate-300">{w.date}</td>
                  <td className="p-4 font-mono font-bold text-[#00C2B8]">{w.winnerMemberId}</td>
                  <td className="p-4 font-bold text-white">{w.winnerName}</td>
                  <td className="p-4 text-[#E1A238] font-bold">1 Gram 916 Gold Coin</td>
                  <td className="p-4">
                    <span className="bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                      {w.dispatchStatus}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-slate-400 truncate max-w-[130px]">{w.auditHash}</td>
                </tr>
              ))}
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
