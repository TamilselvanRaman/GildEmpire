'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { 
  Award, 
  ShieldCheck, 
  Users, 
  Wallet, 
  Share2, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  Search, 
  Lock,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const { setCurrentView } = useApp();
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const steps = [
    { num: '01', title: 'Register Account', desc: 'Create your secure member profile with verified mobile OTP & email identification.' },
    { num: '02', title: 'Complete Deposit', desc: 'Submit ₹10,000 membership deposit with instant UPI or Bank IMPS UTR proof.' },
    { num: '03', title: 'Join 50-Member Group', desc: 'Automatically assigned to a verified 50-member group cycle.' },
    { num: '04', title: 'Daily 1g Gold Selection', desc: '50-day cycle distributes 1 Gram 916 Gold daily (1 winner/day).' },
    { num: '05', title: 'Complete 50-Day Rewards', desc: 'Every single member receives 1 Gram Gold by Day 50 of the group.' },
  ];

  const features = [
    { icon: ShieldCheck, title: 'Secure Member Account', desc: '256-bit encryption with multi-factor mobile OTP authentication.' },
    { icon: Wallet, title: 'Deposit Verification', desc: 'Transparent reference tracking with instant bank UTR validation.' },
    { icon: Users, title: '50-Member Groups', desc: 'Structured group formation ensuring fair 50-day progression.' },
    { icon: Award, title: '1 Gram Gold Daily', desc: '1 winner selected daily for 50 days until all 50 members are awarded.' },
    { icon: Bell, title: 'Real-Time Notifications', desc: 'Instant SMS & portal notifications for daily selections & dispatches.' },
    { icon: CheckCircle2, title: 'Audited Sovereign Logs', desc: 'Cryptographic audit hashes for all daily selection outcomes.' },
  ];

  const faqs = [
    { q: 'How does the 50-day 1 Gram Gold distribution process work?', a: 'Each group consists of exactly 50 verified members. Over a 50-day cycle, 1 Gram 916 Gold is awarded each day. Day 1 selects 1 winner from 50 members. Day 2 removes the Day 1 winner, leaving 49 members in the spin pool. This continues daily until all 50 members receive 1 Gram Gold by Day 50.' },
    { q: 'Is my ₹10,000 deposit secure and verified?', a: 'Yes. All deposits are verified by our bank reconciliation team against official transaction UTR numbers before group allocation.' },
    { q: 'What happens after I receive my 1 Gram Gold coin?', a: 'Your reward coin is shipped via insured BlueDart express courier with tracking details provided on your member dashboard.' },
    { q: 'Can I refer friends to join a group?', a: 'Yes, your unique referral link is available on your dashboard to invite colleagues and track their deposit eligibility.' },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col font-sans">
      <Navbar />

      {/* InfinityGram Dark Teal & Midnight Navy Hero Section */}
      <section className="bg-[#081E26] pt-12 pb-20 lg:pt-20 lg:pb-28 relative overflow-hidden border-b border-[#0D3B43]">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00C2B8]/10 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E1A238]/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center space-x-2 bg-[#0D3B43] border border-[#E1A238]/50 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#F2C868] mb-4 shadow-md">
                  <Sparkles className="w-4 h-4 text-[#00C2B8]" />
                  <span>EXCLUSIVE NEW LAUNCH — INFINITYGRAM GOLD PLAN</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
                  Your Membership. <br />
                  Your Progress. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C868] via-[#E1A238] to-[#00C2B8]">
                    Your 1 Gram Gold Rewards.
                  </span>
                </h1>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Official plan prospectus for structured 50-member group progression. Every 50-day cycle awards <strong className="text-[#00C2B8] font-bold">1 Gram 916 Gold</strong> daily, ensuring all 50 members receive their prize by Day 50.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
              >
                <button
                  onClick={() => setCurrentView('auth-register')}
                  className="w-full sm:w-auto btn-infinity-cyan text-sm font-black px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('auth-login')}
                  className="w-full sm:w-auto bg-[#0D3B43] hover:bg-[#0D3B43]/80 text-[#F2C868] border border-[#E1A238]/50 text-sm font-serif font-bold px-8 py-4 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Member Login
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-300 font-bold border-t border-[#0D3B43]"
              >
                <span className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#00C2B8]" />
                  <span>Bank UTR Verified</span>
                </span>
                <span className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Users className="w-4 h-4 text-[#00C2B8]" />
                  <span>Strict 50-Member Groups</span>
                </span>
                <span className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Award className="w-4 h-4 text-[#E1A238]" />
                  <span>916 Hallmarked Gold</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Right Visual Audited Prototype Card with Smooth Floating Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="infinity-card p-8 shadow-2xl relative bg-[#0D3B43] border-2 border-[#E1A238]/60 rounded-[2.5rem]"
              >
                
                {/* Sleek Header */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#081E26]">
                  <div className="flex items-center space-x-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2B8] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C2B8]"></span>
                    </span>
                    <span className="text-sm font-serif font-black text-white tracking-tight">Audited Engine v2.4</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest bg-[#081E26] px-3 py-1 rounded-full border border-[#E1A238]/40">
                    BATCH: GRP-50-01
                  </span>
                </div>

                {/* Live Card Preview */}
                <div className="space-y-6">
                  
                  {/* Status Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono font-bold text-[#F2C868] uppercase tracking-widest mb-1">Current Cycle</p>
                      <h4 className="text-2xl font-serif font-black text-white tracking-tight flex items-center space-x-3">
                        <span>Day 15 / 50</span>
                        <span className="text-[10px] font-mono font-bold text-[#00C2B8] bg-[#081E26] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#00C2B8]/40">14 AWARDED</span>
                      </h4>
                    </div>
                  </div>

                  {/* 50-Slot Minimalist Grid */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-3">
                      <span className="text-slate-300 font-mono font-bold uppercase tracking-widest">Group Progression</span>
                      <span className="text-[#00C2B8] font-mono font-bold uppercase tracking-widest">36 Pending</span>
                    </div>
                    <div className="grid grid-cols-10 gap-1.5">
                      {Array.from({ length: 50 }, (_, i) => {
                        const slotNum = i + 1;
                        const isWon = slotNum <= 14;
                        const isUser = slotNum === 14;
                        return (
                          <motion.div
                            key={slotNum}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + (i * 0.01) }}
                            className={`aspect-square rounded-full flex items-center justify-center text-[9px] font-mono transition-all ${
                              isWon 
                                ? 'bg-gradient-to-br from-[#F2C868] to-[#E1A238] text-[#081E26] font-black shadow-xs' 
                                : isUser 
                                  ? 'bg-[#00C2B8] text-[#081E26] font-black ring-2 ring-offset-1 ring-[#00C2B8]' 
                                  : 'bg-[#081E26] text-slate-400 border border-[#0D3B43]'
                            }`}
                            title={`Slot #${slotNum}: ${isWon ? 'Won 1g Gold' : 'In Pool'}`}
                          >
                            {slotNum}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Schedule */}
                  <div className="pt-5 border-t border-[#081E26] flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-mono font-bold uppercase tracking-widest">Daily Selection</span>
                    <span className="font-mono font-black text-[#F2C868]">18:00 IST</span>
                  </div>
                </div>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#081E26] border-b border-[#0D3B43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <h2 className="text-3xl font-serif font-black text-white">How The Platform Works</h2>
            <p className="text-sm text-slate-300 font-medium">
              Clear 5-step progression ensuring every member in a 50-person group receives 1 Gram 916 Gold.
            </p>
          </motion.div>

          {/* Premium Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((s, idx) => (
              <motion.div 
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group bg-[#0D3B43] rounded-3xl p-6 relative overflow-hidden shadow-md hover:shadow-2xl border border-[#E1A238]/40 hover:border-[#00C2B8] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between cursor-default"
              >
                {/* Giant Faint Watermark Number */}
                <div className="absolute -right-2 -bottom-6 text-[100px] font-mono font-black text-[#081E26] opacity-60 group-hover:text-[#00C2B8]/10 transition-colors duration-500 pointer-events-none select-none">
                  {s.num}
                </div>
                
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 font-mono font-black text-xs flex items-center justify-center mb-5 group-hover:bg-[#00C2B8] group-hover:text-[#081E26] group-hover:scale-110 transition-all duration-300 shadow-md">
                    {parseInt(s.num)}
                  </div>
                  <h3 className="text-[13px] font-serif font-black text-white mb-2.5 tracking-tight leading-tight">{s.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 bg-[#081E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <h2 className="text-3xl font-serif font-black text-white">Platform Features</h2>
            <p className="text-sm text-slate-300 font-medium">Engineered with Audited Sovereign precision, transparency, and high-trust user experience.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group bg-[#0D3B43] rounded-3xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,194,184,0.2)] border border-[#E1A238]/40 hover:border-[#00C2B8] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 group-hover:bg-[#00C2B8] group-hover:text-[#081E26] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[15px] font-serif font-black text-white mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-[13px] text-slate-300 leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Premium Referral Program CTA */}
      <section className="py-24 bg-[#081E26] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0D3B43] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl border-2 border-[#E1A238]/60 relative overflow-hidden"
          >
            
            {/* Elegant Background Glows inside the card */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2B8]/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E1A238]/15 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex-1 space-y-8 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-[#081E26] border border-[#E1A238]/40 px-4 py-1.5 rounded-full">
                <Users className="w-4 h-4 text-[#F2C868]" />
                <span className="text-[10px] font-mono font-black text-[#F2C868] uppercase tracking-[0.2em]">Referral Program</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight leading-[1.1]">
                Invite Friends. <br />
                Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C868] via-[#E1A238] to-[#00C2B8]">5% Deposit Bonus</span>.
              </h2>
              
              <p className="text-[15px] text-slate-300 leading-relaxed max-w-xl font-medium">
                When your referred contacts join the platform and complete their ₹10,000 membership deposit, you instantly receive 5% (₹500) credited to your secure digital wallet. Withdraw your earnings at any time.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-5 sm:space-y-0 sm:space-x-10 pt-4 border-t border-[#081E26]">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#081E26] border border-[#00C2B8]/40 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <Wallet className="w-5 h-5 text-[#00C2B8]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest mb-0.5">Automated</p>
                    <p className="text-[13px] font-bold text-white tracking-wide">Instant Wallet Credit</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#081E26] border border-[#E1A238]/40 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <TrendingUp className="w-5 h-5 text-[#E1A238]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#F2C868] uppercase tracking-widest mb-0.5">Flexible</p>
                    <p className="text-[13px] font-bold text-white tracking-wide">Unlimited Withdrawals</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto relative z-10">
              <button 
                onClick={() => setCurrentView('auth-register')}
                className="group w-full md:w-auto btn-infinity-cyan text-[15px] font-black px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>Start Referring Now</span>
                <div className="w-8 h-8 rounded-full bg-[#081E26] text-[#00C2B8] flex items-center justify-center group-hover:bg-[#081E26] group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

          </motion.div>
        </div>
      </section>





      <Footer />
    </div>
  );
};
