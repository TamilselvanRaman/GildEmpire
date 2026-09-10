'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyGoldWinner } from '../../types';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Lock, 
  Play, 
  FileText,
  RotateCw,
  Eye,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RewardSpinPage = () => {
  const { group, executeDailySpin, setCurrentView } = useApp();
  const [vesselType, setVesselType] = useState<'panai' | 'glass'>('panai');
  const [isShaking, setIsShaking] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<DailyGoldWinner | null>(null);
  const [drawnChitMemberId, setDrawnChitMemberId] = useState<string | null>(null);
  const [showAdminSimNotice, setShowAdminSimNotice] = useState(false);

  // Eligible pool members
  const activePoolMembers = group.slots.filter(s => s.status !== 'Won 1g Gold');

  const handleStartDraw = () => {
    if (isShaking || isDrawing || activePoolMembers.length === 0) return;

    setIsShaking(true);
    setDrawnChitMemberId(null);
    setSelectedWinner(null);

    // Step 1: Shake the Panai/Glass Jar vigorously for 3.5 seconds
    setTimeout(() => {
      setIsShaking(false);
      setIsDrawing(true);

      // Step 2: Pick the winning chit and execute spin backend logic
      const winner = executeDailySpin();
      setDrawnChitMemberId(winner.winnerMemberId);

      // Step 3: Reveal winner modal after paper chit unfolds (2.5s)
      setTimeout(() => {
        setIsDrawing(false);
        setSelectedWinner(winner);
      }, 2500);

    }, 3500);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto font-sans">
      
      {/* Unified Single-Screen Card Container */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
        
        {/* Integrated Sleek Executive Header */}
        <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="space-y-0.5 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-black bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Panai Selection</span>
              </span>
              <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/60">
                {activePoolMembers.length} Active Member Chits
              </span>
            </div>
            <h1 className="text-lg font-black text-white tracking-tight">
              Day {group.currentCycleDay} Traditional 1 Gram Gold Selection
            </h1>
          </div>

          {/* Vessel Style Selector Tabs */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/20 text-xs font-black relative z-10 backdrop-blur-md">
            <button
              onClick={() => setVesselType('panai')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                vesselType === 'panai' 
                  ? 'bg-amber-400 text-amber-950 shadow-sm font-extrabold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-xs">🏺</span>
              <span>Clay Panai Pot</span>
            </button>
            <button
              onClick={() => setVesselType('glass')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                vesselType === 'glass' 
                  ? 'bg-amber-400 text-amber-950 shadow-sm font-extrabold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-xs">🫙</span>
              <span>Glass Lucky Jar</span>
            </button>
          </div>
        </div>

        {/* Compact Content Area */}
        <div className="p-6 flex flex-col items-center space-y-4 text-center">
          
          {/* Admin Access Notice Bar */}
          <div className="bg-amber-50/90 border border-amber-200 px-4 py-2 rounded-xl text-[11px] text-amber-950 max-w-md flex items-center justify-center space-x-2 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="font-extrabold text-amber-900">
              🔒 Admin-Only Execution Policy: <span className="font-medium text-amber-800">Members watch live stream.</span>
            </span>
          </div>

          {/* Compact Vessel Container Area */}
          <div className="relative w-full max-w-sm h-64 flex flex-col items-center justify-center py-2">
            
            {/* Animated Vessel Wrapper */}
            <motion.div
              animate={
                isShaking 
                  ? { 
                      rotate: [-8, 8, -6, 6, -4, 4, -8, 8, 0],
                      x: [-10, 10, -8, 8, -5, 5, -10, 10, 0],
                      y: [-4, 4, -2, 2, 0]
                    } 
                  : { y: [0, -4, 0] }
              }
              transition={
                isShaking 
                  ? { repeat: Infinity, duration: 0.35, ease: "easeInOut" } 
                  : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
              }
              className="relative flex flex-col items-center justify-center"
            >
              {vesselType === 'panai' ? (
                /* Compact Clay Panai Graphic */
                <div className="relative w-52 h-52 flex items-center justify-center drop-shadow-xl">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-4 border-amber-600/80 relative overflow-hidden shadow-xl flex flex-col items-center justify-center">
                    
                    {/* Pot Rim Header */}
                    <div className="absolute top-0 w-28 h-6 bg-amber-600 border-b-2 border-amber-950 rounded-b-lg shadow-xs flex items-center justify-center">
                      <div className="w-20 h-1.5 bg-amber-900 rounded-full"></div>
                    </div>

                    {/* Ribbon */}
                    <div className="absolute top-8 w-full h-3.5 bg-amber-500/90 border-y border-amber-400 flex items-center justify-around px-3 text-[9px] font-black text-amber-950">
                      <span>🌿</span>
                      <span>50 GOLD</span>
                      <span>🌿</span>
                    </div>

                    {/* Inside Floating Paper Chits */}
                    <div className="w-36 h-28 mt-6 relative overflow-hidden flex flex-wrap items-center justify-center gap-1 p-1">
                      {activePoolMembers.slice(0, 15).map((member, i) => (
                        <motion.div
                          key={member.memberId}
                          animate={
                            isShaking 
                              ? { 
                                  x: [Math.random() * 16 - 8, Math.random() * 16 - 8], 
                                  y: [Math.random() * 16 - 8, Math.random() * 16 - 8],
                                  rotate: [0, 360]
                                } 
                              : { y: [0, -3, 0] }
                          }
                          transition={
                            isShaking 
                              ? { repeat: Infinity, duration: 0.2 } 
                              : { repeat: Infinity, duration: 2 + i * 0.2 }
                          }
                          className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black border shadow-xs ${
                            i % 3 === 0 
                              ? 'bg-amber-300 text-amber-950 border-amber-400' 
                              : i % 3 === 1 
                                ? 'bg-blue-200 text-blue-950 border-blue-300' 
                                : 'bg-emerald-200 text-emerald-950 border-emerald-300'
                          }`}
                        >
                          📄 {member.memberId}
                        </motion.div>
                      ))}
                    </div>

                  </div>
                </div>
              ) : (
                /* Compact Glass Bottle Graphic */
                <div className="relative w-52 h-52 flex items-center justify-center drop-shadow-xl">
                  <div className="w-48 h-52 rounded-[2.5rem] bg-white/20 backdrop-blur-md border-4 border-blue-200/60 relative overflow-hidden shadow-xl flex flex-col items-center justify-end p-3">
                    <div className="absolute top-0 w-24 h-5 bg-amber-800 border-b border-amber-950 rounded-b shadow-inner"></div>
                    <div className="w-full h-36 relative overflow-hidden flex flex-wrap items-center justify-center gap-1 p-1">
                      {activePoolMembers.slice(0, 15).map((member, i) => (
                        <motion.div
                          key={member.memberId}
                          animate={
                            isShaking 
                              ? { 
                                  x: [Math.random() * 20 - 10, Math.random() * 20 - 10], 
                                  y: [Math.random() * 20 - 10, Math.random() * 20 - 10],
                                  rotate: [0, 360]
                                } 
                              : { y: [0, -3, 0] }
                          }
                          transition={
                            isShaking 
                              ? { repeat: Infinity, duration: 0.2 } 
                              : { repeat: Infinity, duration: 2 + i * 0.15 }
                          }
                          className="px-1.5 py-0.5 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 border border-amber-400 rounded text-[8px] font-mono font-black shadow-xs"
                        >
                          🏷️ {member.memberId}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Rising Winner Chit */}
            <AnimatePresence>
              {isDrawing && (
                <motion.div
                  initial={{ y: 40, scale: 0.4, opacity: 0 }}
                  animate={{ y: -40, scale: 1.2, opacity: 1, rotate: [0, 360] }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute top-1/2 z-30 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-amber-950 border-2 border-amber-600 px-5 py-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-0.5"
                >
                  <div className="flex items-center space-x-1 text-[10px] font-black">
                    <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                    <span>WINNING CHIT DRAWN</span>
                  </div>
                  <span className="text-lg font-black font-mono tracking-widest text-[#0B1E39]">
                    {drawnChitMemberId || 'PICKING...'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Action Controls & Live Status */}
          <div className="space-y-2.5 w-full max-w-sm">
            <div className="bg-[#0B1E39] text-white p-3 rounded-xl border border-[#1A3860] text-center shadow-md flex items-center justify-center space-x-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
              <span className="font-extrabold text-amber-400 text-[11px]">LIVE SELECTION BROADCAST ACTIVE</span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartDraw}
                className="text-[10px] font-bold text-slate-400 hover:text-[#2F6FED] underline transition-colors cursor-pointer"
              >
                Simulate Admin Shaking Pot & Drawing Winner (Prototype Test)
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Selected Winner Chit Unfolded Modal */}
      <AnimatePresence>
        {selectedWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/20 rounded-full blur-[50px] pointer-events-none"></div>

              <button
                onClick={() => setSelectedWinner(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
                <Award className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Official Paper Chit Drawn
                </span>
                <h3 className="text-2xl font-black text-[#0B1E39] mt-3">Day {selectedWinner.dayNumber} Winner Selected</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">1 Gram 24K Gold Coin awarded from Panai Lucky Draw</p>
              </div>

              {/* Unfolded Paper Slip Details */}
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-left font-mono shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-sans font-bold">Drawn Paper Chit ID:</span>
                  <span className="font-extrabold text-blue-600 text-sm font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedWinner.winnerMemberId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans font-bold">Winner Name:</span>
                  <span className="font-black text-[#0B1E39] font-sans text-sm">{selectedWinner.winnerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans font-bold">Prize Awarded:</span>
                  <span className="font-black text-amber-700 font-sans">1 Gram 24K Gold</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans font-bold">Remaining Pool:</span>
                  <span className="font-bold text-slate-900 font-sans">{activePoolMembers.length - 1} Members</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 truncate">
                  <span className="font-sans font-bold">Audit Ledger Hash:</span>
                  <span className="truncate max-w-[180px] font-mono">{selectedWinner.auditHash}</span>
                </div>
              </div>

              <button
                onClick={() => { setSelectedWinner(null); setCurrentView('user-my-group'); }}
                className="w-full bg-[#0B1E39] hover:bg-[#142d52] text-white font-black py-4 rounded-2xl text-xs transition-all shadow-lg cursor-pointer"
              >
                Inspect Updated 50-Slot Grid
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

