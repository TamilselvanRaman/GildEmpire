'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyGoldWinner } from '../../types';
import { Award, Sparkles, ShieldCheck, Play, Pause, CheckCircle2, RotateCw, AlertTriangle, Mail, Send, Clock, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminRewardFlowControlPage = () => {
  const { group, pastWinners, executeDailySpin, setCurrentView } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSelected, setLastSelected] = useState<DailyGoldWinner | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const activePoolMembers = group.slots.filter(s => s.status !== 'Won 1g Gold');

  const handleRunSpin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const winner = executeDailySpin();
      setLastSelected(winner);
      setIsProcessing(false);
    }, 2500);
  };

  const handleSendEmailNotification = () => {
    setEmailSent(true);
    setShowEmailModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Title */}
      <div className="bg-[#0B1E39] text-white p-8 rounded-[2.5rem] border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Admin Operational Controller: 50-Day Panai Gold Engine</span>
          </div>
          <h1 className="text-3xl font-black">Batch A Daily Selection Command</h1>
          <p className="text-xs text-slate-300 font-medium">
            Group: <strong className="text-white">{group.groupName}</strong> ({group.groupId}) | Current Cycle: Day {group.currentCycleDay} Panai Draw Ready
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          {/* Send 10-Min Pre-Draw Email Button */}
          <button
            onClick={handleSendEmailNotification}
            className={`px-5 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
              emailSent 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{emailSent ? '📧 10-Min Email Sent to Members' : '📧 Dispatch 10-Min Pre-Draw Email'}</span>
          </button>

          {/* Trigger Panai Selection Button */}
          <button
            onClick={handleRunSpin}
            disabled={isProcessing || activePoolMembers.length === 0}
            className={`px-7 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
              isProcessing 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow-amber-500/30'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Shaking Panai & Drawing...' : `🏺 Execute Day ${group.currentCycleDay} Panai Draw`}</span>
          </button>
        </div>
      </div>

      {/* 3 Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-sans">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xs space-y-1">
          <p className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">Current Cycle Day</p>
          <p className="text-2xl font-black text-[#0B1E39]">Day {group.currentCycleDay} of 50</p>
          <p className="text-amber-700 font-extrabold mt-0.5">14 Grams Gold Awarded</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xs space-y-1">
          <p className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">Active Panai Pool Size</p>
          <p className="text-2xl font-black text-[#2F6FED]">{activePoolMembers.length} Members</p>
          <p className="text-slate-500 font-medium mt-0.5">36 folded paper chits inside pot</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xs space-y-1">
          <p className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">Scheduled Daily Execution</p>
          <p className="text-2xl font-black text-[#0B1E39] font-mono">18:00 IST</p>
          <p className="text-emerald-600 font-bold mt-0.5 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>10-Min Auto Email Trigger Active</span>
          </p>
        </div>
      </div>

      {/* Recent Execution Output */}
      {lastSelected && (
        <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-[2rem] space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-emerald-900 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Day {lastSelected.dayNumber} Panai Lucky Draw Successfully Executed & Audited</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-emerald-950">
            <div>
              <span className="text-slate-500 font-sans font-bold">Winner Name:</span>
              <p className="font-black text-sm font-sans">{lastSelected.winnerName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-sans font-bold">Member ID:</span>
              <p className="font-black text-sm text-blue-700">{lastSelected.winnerMemberId}</p>
            </div>
            <div>
              <span className="text-slate-500 font-sans font-bold">Audit Hash:</span>
              <p className="truncate text-[10px]">{lastSelected.auditHash}</p>
            </div>
          </div>
        </div>
      )}

      {/* Past 50 Winners Log */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#0B1E39]">Historical 50-Day Winner Dispatch Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-3.5">Day #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Winner Member ID</th>
                <th className="p-3.5">Winner Name</th>
                <th className="p-3.5">Prize</th>
                <th className="p-3.5">Courier Dispatch Status</th>
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

      {/* Email Dispatch Preview Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0 border border-blue-100">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full uppercase">
                    Broadcast Successfully Sent
                  </span>
                  <h3 className="text-lg font-black text-[#0B1E39] mt-1">10-Minute Pre-Selection Email Broadcast</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="border-b border-slate-200 pb-2 space-y-1 font-mono">
                  <p className="text-slate-500"><strong>From:</strong> notifications@gildempire.in</p>
                  <p className="text-slate-500"><strong>Recipients:</strong> All 36 Active Members in Batch A</p>
                  <p className="text-[#0B1E39] font-black font-sans text-sm pt-1">
                    Subject: ⏰ Live 1 Gram Gold Panai Selection Starts in 10 Minutes!
                  </p>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium pt-1">
                  "Dear Member, your group's daily 1 Gram 24K Gold Panai lucky pot selection starts in 10 minutes (18:00 IST). Click the direct link below to open the portal and watch the live paper chit draw!"
                </p>

                <div className="pt-2">
                  <div className="bg-[#0B1E39] text-white text-center py-3.5 rounded-xl font-black text-xs flex items-center justify-center space-x-2">
                    <span>🏺 Open Live 1g Gold Rewards Selection Portal</span>
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setShowEmailModal(false); setCurrentView('user-reward-spin'); }}
                className="w-full bg-[#2F6FED] hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-xs transition-all shadow-lg cursor-pointer"
              >
                View User Side Live Stream Countdown
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
