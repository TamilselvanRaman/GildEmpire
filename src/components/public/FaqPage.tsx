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
      a: 'Once your deposit of ₹5,000 is verified, you are automatically assigned to the next available 50-member group batch. Member slots (#1 to #50) are filled sequentially in real time.' 
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
      q: 'How does the GildEmpire referral incentive program work?', 
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#0B1E39] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center space-x-2 bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2F6FED]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GildEmpire Enterprise Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E39] tracking-tight">Searchable Help & FAQ Center</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Clear, transparent answers regarding account verification, ₹5,000 deposits, 50-member groups, and daily 1g 24K Gold distribution.
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
            className="w-full bg-white border border-[#DCE4F0] text-xs sm:text-sm text-[#0B1E39] pl-11 pr-10 py-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10 shadow-xs font-medium placeholder:text-slate-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1"
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
                  ? 'bg-[#2F6FED] text-white shadow-md shadow-[#2F6FED]/20' 
                  : 'bg-white border border-[#DCE4F0] text-slate-600 hover:bg-[#F0F4FA] hover:text-[#0B1E39]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="sovereign-card bg-white p-8 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600">No matching questions found for "{search}".</p>
              <p className="text-[11px] text-slate-400">Try adjusting your query or contact our operations desk.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`sovereign-card overflow-hidden bg-white transition-all ${
                  openIndex === i ? 'ring-1 ring-[#2F6FED]/30 border-[#2F6FED]' : 'hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left p-4 sm:p-5 text-xs sm:text-sm font-bold text-[#0B1E39] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#F0F4FA] text-[#2F6FED] border border-[#DCE4F0]">
                      {faq.cat}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180 text-[#2F6FED]' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#DCE4F0] bg-[#FAFAFC]"
                    >
                      <div className="p-4 sm:p-5 text-xs text-slate-600 leading-relaxed font-medium space-y-4">
                        <p>{faq.a}</p>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Was this answer helpful?</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleFeedback(i, 'yes')}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold transition-all ${
                                feedback[i] === 'yes' ? 'bg-[#E8F7F0] text-[#1E9E64] border-[#1E9E64]' : 'bg-white border-[#DCE4F0] hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Yes</span>
                            </button>
                            <button 
                              onClick={() => handleFeedback(i, 'no')}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold transition-all ${
                                feedback[i] === 'no' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white border-[#DCE4F0] hover:bg-slate-50 text-slate-600'
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
        <div className="sovereign-card bg-gradient-to-r from-[#0B1E39] to-[#1E3A60] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#2F6FED]">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Still have questions about GildEmpire?</h3>
              <p className="text-xs text-slate-300 font-medium">Our corporate support desk is ready to assist you via email or phone.</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('public-contact')}
            className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#2558C9] text-white text-xs font-bold transition-all shrink-0 flex items-center space-x-2 shadow-md"
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

