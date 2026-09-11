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
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12 select-none">
      
      {/* Executive Card Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
        
        {/* Sleek Top Header */}
        <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] px-6 sm:px-8 py-5 text-white flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Panai Gold Live Stream</span>
              </span>
              <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-700/60">
                {activePoolMembers.length} Active Paper Chits
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Day {group.currentCycleDay} Traditional 1 Gram Gold Selection
            </h1>
          </div>

          {/* Container Vessel Selector */}
          <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 text-xs font-black relative z-10 backdrop-blur-md">
            <button
              onClick={() => setVesselType('glass')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                vesselType === 'glass' 
                  ? 'bg-amber-400 text-amber-950 shadow-md font-black' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🫙</span>
              <span>Glass Lucky Jar</span>
            </button>
            <button
              onClick={() => setVesselType('panai')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                vesselType === 'panai' 
                  ? 'bg-amber-400 text-amber-950 shadow-md font-black' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🏺</span>
              <span>Clay Panai Pot</span>
            </button>
          </div>
        </div>

        {/* Live Broadcast Header Banner */}
        <div className="bg-slate-900 px-6 py-3.5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-extrabold text-rose-400 tracking-wide flex items-center space-x-1">
              <Radio className="w-4 h-4 text-rose-500" />
              <span>LIVE ADMIN STREAM BROADCAST</span>
            </span>
            <span className="text-slate-400">| Daily Schedule: 07:00 AM IST</span>
          </div>

          {/* Countdown timer to next draw or lock timer */}
          <div className="flex items-center space-x-2 font-mono font-bold text-amber-300 text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            {isLocked24h ? (
              <span>Next Draw in: {String(lockCountdown?.hours).padStart(2, '0')}:{String(lockCountdown?.minutes).padStart(2, '0')}:{String(lockCountdown?.seconds).padStart(2, '0')}</span>
            ) : (
              <span>Today's Selection Ready</span>
            )}
          </div>
        </div>

        {/* Main Glass Bottle Graphic & Live Stream Container */}
        <div className="p-8 flex flex-col items-center space-y-6 text-center bg-gradient-to-b from-slate-50 to-white">
          
          {/* User Notice Pill: Admin-Only Draw Control */}
          <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-2xl text-xs text-amber-950 max-w-lg flex items-center justify-center space-x-2 shadow-xs font-semibold">
            <Lock className="w-4.5 h-4.5 text-amber-700 shrink-0" />
            <span>Admin triggers bottle shake process. Members view live stream real-time.</span>
          </div>

          {/* Interactive Vessel Display */}
          <div className="relative w-full max-w-sm h-72 flex flex-col items-center justify-center py-2">
            
            {/* Floating Winner Chit Animation when Live Draw happens */}
            <AnimatePresence>
              {isLiveDrawActive && (
                <motion.div
                  initial={{ y: 80, scale: 0.3, opacity: 0 }}
                  animate={{ y: -60, scale: 1.2, opacity: 1, rotate: [0, 15, -15, 0] }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-0 z-30 flex flex-col items-center"
                >
                  <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 text-amber-950 px-5 py-3 rounded-2xl border-2 border-amber-400 shadow-2xl flex items-center space-x-2 font-black text-xs">
                    <span className="text-xl">📜</span>
                    <span>Admin Drawn Chit</span>
                  </div>
                  <div className="text-amber-500 text-xl font-bold mt-1 animate-pulse">
                    ✨ ✨ ✨
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glass Bottle Graphic */}
            <motion.div
              animate={
                isLiveDrawActive ? {
                  x: [-12, 12, -10, 10, -6, 6, -3, 3, 0],
                  y: [-4, 4, -3, 3, -1, 1, 0],
                  rotate: [-6, 6, -4, 4, -2, 2, 0]
                } : { y: 0, x: 0, rotate: 0 }
              }
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="relative w-48 h-64 flex flex-col items-center justify-end group select-none"
            >
              {vesselType === 'glass' ? (
                <>
                  {/* Bottle Stopper */}
                  <div className="w-16 h-8 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-t-lg border-2 border-amber-600 shadow-md relative z-20 flex items-center justify-center">
                    <span className="text-[10px] text-amber-200 font-extrabold uppercase">GILD 24K</span>
                  </div>

                  {/* Bottle Neck */}
                  <div className="w-20 h-10 bg-white/20 backdrop-blur-md border-x-2 border-slate-300 shadow-inner relative z-10"></div>

                  {/* Glass Body */}
                  <div className="w-48 h-48 bg-gradient-to-b from-blue-50/40 via-white/30 to-blue-100/40 backdrop-blur-md rounded-b-[3.5rem] rounded-t-3xl border-2 border-blue-300/80 shadow-2xl relative overflow-hidden flex items-end justify-center p-4">
                    
                    {/* Glass Light Reflection */}
                    <div className="absolute top-2 left-3 w-6 h-36 bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-full transform -rotate-12 pointer-events-none"></div>

                    {/* Folded Paper Chits inside Bottle */}
                    <div className="grid grid-cols-5 gap-1.5 w-full relative z-10 pb-2">
                      {Array.from({ length: Math.min(35, activePoolMembers.length) }).map((_, idx) => (
                        <motion.div
                          key={idx}
                          animate={
                            isLiveDrawActive ? {
                              y: [0, -18, 5, -12, 0],
                              x: [0, (idx % 2 === 0 ? 8 : -8), 0],
                              rotate: [0, (idx % 3 === 0 ? 45 : -45), 0]
                            } : { y: 0, x: 0, rotate: idx * 12 }
                          }
                          transition={{ duration: 1.8, delay: idx * 0.02 }}
                          className="w-6 h-6 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-md border border-amber-500 shadow-sm flex items-center justify-center text-[9px] font-black text-amber-950 font-mono"
                        >
                          📜
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Panai Clay Pot Graphic */
                <div className="w-48 h-48 rounded-full bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 border-4 border-amber-700 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="w-36 h-28 mt-4 relative overflow-hidden flex flex-wrap items-center justify-center gap-1.5 p-1">
                    {Array.from({ length: Math.min(35, activePoolMembers.length) }).map((_, idx) => (
                      <div key={idx} className="px-1.5 py-0.5 bg-amber-300 text-amber-950 rounded text-[9px] font-mono font-black border border-amber-400">
                        📄
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Status Pill */}
            <div className="mt-3 bg-white px-4 py-1.5 rounded-full border border-slate-200 text-xs font-extrabold text-[#0B1E39] flex items-center space-x-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{activePoolMembers.length} Folded Paper Chits Inside Pot</span>
            </div>

          </div>

          {/* User Button View: Strictly Disabled for User Action */}
          <div className="space-y-3 w-full max-w-sm">
            <button
              disabled
              className={`w-full py-4 rounded-2xl shadow-lg text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-not-allowed transition-all ${
                isLocked24h
                  ? 'bg-slate-800 text-amber-400 border border-slate-700 font-bold'
                  : 'bg-slate-100 text-slate-500 border border-slate-300 font-bold'
              }`}
            >
              {isLocked24h ? (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>
                    Draw Completed — Locked for 24h ({String(lockCountdown?.hours).padStart(2, '0')}h {String(lockCountdown?.minutes).padStart(2, '0')}m left)
                  </span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Live Stream Mode — Waiting for Admin Draw</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 font-medium">
              * Member accounts cannot trigger draws directly. Draws are executed exclusively by Admin at 07:00 AM IST daily.
            </p>
          </div>

        </div>

      </div>

      {/* Historical 50-Day Winner Dispatch Log */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0B1E39]">Official 50-Day Winner Dispatch Log</h3>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            Verified SOC-2 Blockchain Audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="p-3.5">Day #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Winner Member ID</th>
                <th className="p-3.5">Winner Name</th>
                <th className="p-3.5">Prize</th>
                <th className="p-3.5">Courier Status</th>
                <th className="p-3.5">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pastWinners.map(w => (
                <tr key={w.dayNumber} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-[#0B1E39]">Day {w.dayNumber.toString().padStart(2, '0')}</td>
                  <td className="p-3.5 text-slate-500">{w.date}</td>
                  <td className="p-3.5 font-mono font-black text-[#2F6FED]">{w.winnerMemberId}</td>
                  <td className="p-3.5 font-bold text-[#0B1E39]">{w.winnerName}</td>
                  <td className="p-3.5 text-amber-700 font-bold">1 Gram 24K Gold</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                      {w.dispatchStatus}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">{w.auditHash}</td>
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-8 border border-amber-300 shadow-2xl space-y-6 relative text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

              <button
                onClick={() => setSelectedWinner(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-3xl font-black"
                >
                  🏆
                </motion.div>

                <div>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider">
                    Day {selectedWinner.dayNumber} Panai Gold Winner Announced
                  </span>
                  <h3 className="text-2xl font-black text-[#0B1E39] mt-2 tracking-tight">
                    {selectedWinner.winnerName}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-[#2F6FED] mt-0.5">
                    Member ID: {selectedWinner.winnerMemberId}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-left space-y-2 text-xs font-medium">
                <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
                  <span className="text-slate-600 font-bold">Awarded Prize:</span>
                  <span className="text-amber-900 font-black">1 Gram 24K Gold Coin</span>
                </div>
                <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
                  <span className="text-slate-600 font-bold">Group Batch:</span>
                  <span className="text-[#0B1E39] font-extrabold">{group.groupName}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-bold">Audit Hash:</span>
                  <span className="font-mono text-[10px] text-slate-700 truncate max-w-[160px]">{selectedWinner.auditHash}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWinner(null)}
                className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40"
              >
                Close & View Winner Hall of Fame
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
