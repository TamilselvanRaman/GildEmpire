'use client';

import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Search, ChevronDown, HelpCircle, ShieldCheck, ThumbsUp, ThumbsDown, MessageSquare, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export const FaqPage = () => {
  const { setCurrentView } = useApp();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Account' | 'Deposit' | 'Groups' | 'Rewards' | 'Referral'>('All');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedback, setFeedback] = useState<Record<number, 'yes' | 'no'>>({});

  const categories = ['All', 'Account', 'Deposit', 'Groups', 'Rewards', 'Referral'] as const;

  const faqData = [
    { 
      cat: 'Account', 
      q: 'How do I complete KYC verification for my account?', 
      a: 'Provide your Full Name, Mobile Number (verified via instant SMS OTP), Email address, and valid PAN/Aadhaar reference number. Our system verifies your identity within 5 minutes for group eligibility.' 
    },
    { 
      cat: 'Account', 
      q: 'Can an individual create multiple accounts to join multiple groups?', 
      a: 'No. To ensure strict compliance and operational fairness across 50-member groups, each individual is restricted to one verified account linked to their government ID and mobile number.' 
    },
    { 
      cat: 'Deposit', 
      q: 'What payment methods are supported for deposit submission?', 
      a: 'We accept instant UPI transfers (Google Pay, PhonePe, Paytm, BHIM) and Direct Bank Transfers (IMPS/NEFT). You must submit your 12-digit UTR bank reference number for verification.' 
    },
    { 
      cat: 'Deposit', 
      q: 'How long does deposit verification take?', 
      a: 'Our automated financial reconciliation engine verifies UTR references against bank transaction feeds within 15 to 30 minutes during desk hours (09:00 AM – 09:00 PM IST).' 
    },
    { 
      cat: 'Groups', 
      q: 'How are 50-member groups formed and assigned?', 
      a: 'Once your deposit of ₹10,000 is verified, you are automatically assigned to the next available 50-member group batch. Member slots (#1 to #50) are filled sequentially in real time.' 
    },
    { 
      cat: 'Groups', 
      q: 'When does a 50-member group cycle officially start?', 
      a: 'A group cycle commences immediately once the 50th member’s deposit is verified. Day 1’s gold reward spin is conducted on the same day at 08:00 PM IST.' 
    },
    { 
      cat: 'Rewards', 
      q: 'Does every single member receive 1 Gram 24K Gold?', 
      a: 'Yes, 100% guaranteed! Over the 50-day cycle, exactly 1 member is selected daily. Each day’s winner is removed from subsequent daily spins, ensuring that by Day 50, all 50 members have received 1 Gram 24K Gold.' 
    },
    { 
      cat: 'Rewards', 
      q: 'How is the 1 Gram 24K Gold delivered to my address?', 
      a: 'All gold coins are 24K 999 purity hallmarked by BIS-certified refiners and shipped via insured BlueDart/DTDC express couriers. Live tracking code is provided on your dashboard.' 
    },
    { 
      cat: 'Referral', 
      q: 'How does the InfinityGram referral incentive program work?', 
      a: 'Share your unique referral link from your user dashboard. When a referred friend registers and completes their deposit verification, you earn referral commission credit and priority group placement perks.' 
    },
  ];

  const filteredFaqs = faqData.filter(item => {
    const matchesCat = activeCategory === 'All' || item.cat === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFeedback = (index: number, val: 'yes' | 'no') => {
    setFeedback(prev => ({ ...prev, [index]: val }));
  };

  return (
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center space-x-2 bg-[#0D3B43] border border-[#E1A238]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F2C868]">
            <HelpCircle className="w-3.5 h-3.5 text-[#E1A238]" />
            <span>InfinityGram Enterprise Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Searchable Help & FAQ Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Clear, transparent answers regarding account verification, ₹10,000 deposits, 50-member groups, and daily 1g 24K Gold distribution.
          </p>
        </motion.div>

        {/* Corporate Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
          <input
            type="text"
            placeholder="Search questions (e.g. KYC, Deposit, Spin, Gold Courier)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D3B43] border border-[#E1A238]/30 text-xs sm:text-sm text-white pl-11 pr-10 py-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8] focus:ring-2 focus:ring-[#00C2B8]/20 shadow-xs font-medium placeholder:text-slate-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat 
                  ? 'bg-[#00C2B8] text-[#081E26] shadow-md shadow-[#00C2B8]/20' 
                  : 'bg-[#0D3B43] border border-[#E1A238]/20 text-slate-300 hover:bg-[#0D3B43]/80 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-[#0D3B43] rounded-2xl border border-[#E1A238]/20 p-8 text-center space-y-2">
              <p className="text-xs font-bold text-slate-300">No matching questions found for "{search}".</p>
              <p className="text-[11px] text-slate-400">Try adjusting your query or contact our operations desk.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`rounded-2xl border overflow-hidden bg-[#0D3B43] transition-all ${
                  openIndex === i ? 'ring-1 ring-[#00C2B8] border-[#00C2B8]' : 'border-[#E1A238]/20 hover:border-[#E1A238]/40'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left p-4 sm:p-5 text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:bg-[#081E26]/40 transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#081E26] text-[#F2C868] border border-[#E1A238]/30">
                      {faq.cat}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180 text-[#00C2B8]' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#081E26] bg-[#081E26]"
                    >
                      <div className="p-4 sm:p-5 text-xs text-slate-300 leading-relaxed font-medium space-y-4">
                        <p>{faq.a}</p>

                        <div className="pt-3 border-t border-[#0D3B43] flex items-center justify-between text-[11px] text-slate-400">
                          <span>Was this answer helpful?</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleFeedback(i, 'yes')}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold transition-all ${
                                feedback[i] === 'yes' ? 'bg-[#00C2B8]/20 text-[#00C2B8] border-[#00C2B8]' : 'bg-[#0D3B43] border-[#E1A238]/20 hover:bg-[#0D3B43]/80 text-slate-300'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Yes</span>
                            </button>
                            <button 
                              onClick={() => handleFeedback(i, 'no')}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold transition-all ${
                                feedback[i] === 'no' ? 'bg-rose-900/30 text-rose-400 border-rose-700/50' : 'bg-[#0D3B43] border-[#E1A238]/20 hover:bg-[#0D3B43]/80 text-slate-300'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Support Desk Banner */}
        <div className="rounded-3xl bg-[#0D3B43] border border-[#E1A238]/30 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#081E26] border border-[#00C2B8]/30 flex items-center justify-center text-[#00C2B8]">
              <MessageSquare className="w-6 h-6 text-[#00C2B8]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Still have questions about InfinityGram?</h3>
              <p className="text-xs text-slate-300 font-medium">Our corporate support desk is ready to assist you via email or phone.</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('public-contact')}
            className="btn-infinity-cyan px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 shadow-md"
          >
            <span>Contact Support Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

