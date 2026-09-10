'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ShieldCheck, Award, Users, CheckCircle2, ArrowRight, Truck, Lock, FileText, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutPage = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0B1E39] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4 pt-4"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1E39] tracking-tight leading-tight pt-1">
            What is GildEmpire?
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-medium pt-1">
            GildEmpire is a high-trust Indian digital membership platform engineered for structured 50-member group progression. Every 50-day cycle guarantees <strong className="text-[#2F6FED]">1 Gram 24K Hallmarked Gold</strong> to all 50 registered members.
          </p>
        </motion.div>

        {/* Detailed 50-Day Mechanism Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start sovereign-card p-6 sm:p-8 bg-white shadow-xl"
        >
          <div className="lg:col-span-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2F6FED] flex items-center justify-center border border-[#BFDBFE]">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0B1E39]">
              The 50-Day Pool Shrinking Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Unlike traditional lotteries or random schemes, our group model is strictly limited to 50 members per cycle and operates on an audited non-repeating selection algorithm:
            </p>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#1E9E64] shrink-0 mt-0.5" />
                <span><strong>Day 1:</strong> 50 active group members in pool <span className="text-[#2F6FED] font-bold">→</span> 1 member selected for 1 Gram Gold.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#1E9E64] shrink-0 mt-0.5" />
                <span><strong>Day 2:</strong> Previous winner removed <span className="text-[#2F6FED] font-bold">→</span> 49 remaining members spin for 2nd prize.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#1E9E64] shrink-0 mt-0.5" />
                <span><strong>Day 3 to Day 50:</strong> The active pool shrinks by 1 member each day until all 50 members receive 1g Gold.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-[#FAFAFC] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-[#0B1E39] uppercase tracking-wider text-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>50-Day Cycle Progression Schedule</span>
            </h3>
            
            {/* Structured Table Alignment */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="pb-3 pr-2 w-1/3">Cycle Day</th>
                    <th className="pb-3 px-2 w-1/3 text-center">Active Pool Size</th>
                    <th className="pb-3 pl-2 w-1/3 text-right">Awarded Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2.5 pr-2 font-bold text-[#0B1E39]">Day 01</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">50 Members</td>
                    <td className="py-2.5 pl-2 text-right text-amber-700 font-bold">1g 24K Gold Coin</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2 font-bold text-[#0B1E39]">Day 02</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">49 Members</td>
                    <td className="py-2.5 pl-2 text-right text-amber-700 font-bold">1g 24K Gold Coin</td>
                  </tr>
                  <tr className="bg-[#EFF6FF] font-bold">
                    <td className="py-2.5 pl-2 rounded-l-lg text-[#2F6FED]">Day 15 (Current)</td>
                    <td className="py-2.5 px-2 text-center text-[#2F6FED]">36 Members</td>
                    <td className="py-2.5 pr-2 rounded-r-lg text-right text-[#2F6FED]">1g 24K Gold Coin</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2 font-bold text-[#0B1E39]">Day 50 (Final)</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">1 Member</td>
                    <td className="py-2.5 pl-2 text-right text-amber-700 font-bold">1g 24K Gold Coin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Premium Corporate Business Model Grid */}
        <div className="bg-[#0B1E39] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 relative z-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Full GildEmpire Business Model</h2>
            <p className="text-sm text-slate-300 font-medium">Comprehensive breakdown of how our membership, deposit protection, and gold courier systems operate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Business Pillar 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 shadow-inner transition-all duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-[15px] font-black text-white mb-3 tracking-tight">1. ₹5,000 Deposit Reconciliation</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                Every member submits a ₹5,000 deposit via UPI or IMPS. Our banking team verifies official bank UTR reference codes before assigning the user to a verified 50-member group slot.
              </p>
            </motion.div>

            {/* Business Pillar 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 shadow-inner transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-[15px] font-black text-white mb-3 tracking-tight">2. 50-Member Group Allocation</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                Groups are capped at exactly 50 members (Slots #1 to #50). Once filled, the 50-day gold distribution cycle starts automatically with 18:00 IST daily selections.
              </p>
            </motion.div>

            {/* Business Pillar 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 shadow-inner transition-all duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-[15px] font-black text-white mb-3 tracking-tight">3. Insured BlueDart Gold Courier</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                Prize winners receive 1 Gram 24K Hallmarked Gold coins packaged in tamper-evident security boxes and shipped directly via BlueDart insured express courier.
              </p>
            </motion.div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center pt-6">
          <button
            onClick={() => setCurrentView('auth-register')}
            className="btn-sovereign-blue text-sm font-bold px-8 py-4 rounded-xl shadow-lg inline-flex items-center space-x-2"
          >
            <span>Create Your GildEmpire Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

