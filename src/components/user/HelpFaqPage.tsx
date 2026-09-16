'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HelpFaqPage = () => {
  const { setCurrentView } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    category: 'Deposit Inquiry',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      category: 'cycle',
      question: 'How does the 50-Member 1 Gram Gold Group work?',
      answer: 'Each structured group consists of 50 verified members. Every member makes a single ₹10,000 deposit. For 50 consecutive days, exactly 1 member is awarded 1 Gram of 916 Gold daily through an audited selection process until all 50 members have received their 1 Gram Gold coin.'
    },
    {
      category: 'draw',
      question: 'How is the daily 1g Gold winner selected?',
      answer: 'Selections take place daily at 18:00 IST using an authentic traditional paper chit lucky pot ("Panai"). All active member IDs are folded into paper slips inside the vessel. Once a member wins, their ID is removed from the active pool for the remaining days of that cycle.'
    },
    {
      category: 'deposit',
      question: 'How is my ₹10,000 deposit verified?',
      answer: 'Upon submitting your UPI/Bank transaction reference (UTR ID), our financial desk verifies the credit against banking logs within 2 to 4 business hours. Once verified, your status updates to "Active" and you are assigned a slot number.'
    },
    {
      category: 'delivery',
      question: 'How and when will my 1 Gram Gold Coin be delivered?',
      answer: 'Awarded 1 Gram 916 Gold coins are packed with tamper-evident security seals, accompanied by an audited authenticity certificate, and shipped via insured courier (Blue Dart/Delhivery) within 3 to 5 business days.'
    },
    {
      category: 'referral',
      question: 'How does the 5% Referral Bonus work?',
      answer: 'When you invite friends or colleagues using your unique referral link, you receive an instant 5% cash bonus (₹500 per verified member) credited to your digital wallet upon their deposit confirmation. You can withdraw your earnings anytime.'
    },
    {
      category: 'security',
      question: 'Is the platform regulated and secure?',
      answer: 'Yes, InfinityGram operates under strict audited sovereign standards with 256-bit encryption. All group progression logs, deposit verifications, and daily Panai chit selections are cryptographically hashed and logged on public audit ledgers.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    return activeCategory === 'all' || faq.category === activeCategory;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketForm({ category: 'Deposit Inquiry', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans relative z-10 text-white">
      
      {/* Executive Dark Sovereign Support Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0D3B43] via-[#124e58] to-[#0D3B43] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/30 space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#E1A238]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 px-3.5 py-1 rounded-full text-xs font-black">
              <HelpCircle className="w-4 h-4 text-[#00C2B8]" />
              <span>24/7 Sovereign Member Support & Knowledge Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              How Can We Assist You Today?
            </h1>
            
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              Explore our member knowledge base or reach out to our dedicated sovereign support desk regarding 50-member group cycles, deposit verifications, Panai lucky draws, and 1g gold dispatches.
            </p>
          </div>

          {/* SLA Quick Status Pill Badge */}
          <div className="bg-[#081E26]/80 backdrop-blur-md border border-[#E1A238]/30 p-4 rounded-2xl shrink-0 space-y-2 max-w-xs">
            <div className="flex items-center space-x-2 text-[#00C2B8] text-xs font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C2B8] animate-ping"></span>
              <span>Desk Online & Active</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Average response time: <strong className="text-[#F2C868] font-black">&lt; 15 Mins</strong>
            </p>
            <div className="text-[10px] text-[#00C2B8]/80 pt-1 border-t border-[#0D3B43] font-bold">
              256-Bit Encrypted Communication
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Contact Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0D3B43]/90 backdrop-blur-md p-6 rounded-[2rem] border border-[#E1A238]/20 shadow-xl flex items-center space-x-4 group hover:border-[#00C2B8] transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00C2B8]/20 text-[#00C2B8] flex items-center justify-center shrink-0 border border-[#00C2B8]/30 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Live Support Desk</h4>
            <p className="text-[11px] text-[#00C2B8] font-bold mt-0.5 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#00C2B8]"></span>
              <span>Available 09:00 - 21:00 IST</span>
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#0D3B43]/90 backdrop-blur-md p-6 rounded-[2rem] border border-[#E1A238]/20 shadow-xl flex items-center space-x-4 group hover:border-[#F2C868] transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E1A238]/20 text-[#F2C868] flex items-center justify-center shrink-0 border border-[#E1A238]/30 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Official Email</h4>
            <p className="text-[11px] text-slate-300 font-bold mt-0.5">support@infinitygram.in</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0D3B43]/90 backdrop-blur-md p-6 rounded-[2rem] border border-[#E1A238]/20 shadow-xl flex items-center space-x-4 group hover:border-[#E1A238] transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F2C868]/20 text-[#F2C868] flex items-center justify-center shrink-0 border border-[#F2C868]/30 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Toll-Free Helpline</h4>
            <p className="text-[11px] text-[#F2C868] font-bold mt-0.5">+91 1800 500 GOLD</p>
          </div>
        </motion.div>
      </div>

      {/* Category Tabs & FAQ Accordion List */}
      <div className="bg-[#0D3B43]/90 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/20 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#081E26]">
          <div>
            <h3 className="text-lg font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Select a category to filter common member inquiries.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#081E26] p-1.5 rounded-2xl border border-[#E1A238]/20 text-xs font-black">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'cycle', label: '50-Group Cycle' },
              { id: 'draw', label: 'Panai Selection' },
              { id: 'deposit', label: 'Deposits' },
              { id: 'delivery', label: 'Gold Delivery' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeCategory === tab.id 
                    ? 'bg-gradient-to-r from-[#00C2B8] to-[#009b93] text-[#081E26] font-black shadow-md' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? 'border-[#00C2B8] bg-[#081E26]/80 shadow-md' 
                    : 'border-[#081E26] hover:border-[#E1A238]/40 bg-[#081E26]/40'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left font-extrabold text-sm text-white flex items-center justify-between space-x-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#00C2B8] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-xs text-slate-300 font-medium leading-relaxed border-t border-[#0D3B43] pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>

      {/* Submit Support Ticket Form */}
      <div className="bg-[#0D3B43]/90 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/20 shadow-2xl space-y-6">
        <div>
          <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#00C2B8]" />
            <span>Submit Official Support Ticket</span>
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Need direct assistance from our audit desk? Send a ticket and receive a response within 2 hours.
          </p>
        </div>

        {ticketSubmitted && (
          <div className="bg-[#00C2B8]/20 border border-[#00C2B8] text-white p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#00C2B8] shrink-0" />
            <span>Ticket successfully submitted. Ticket Reference #TKT-892401 logged. Response will be sent to your registered email.</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F2C868] font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                Inquiry Category
              </label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full bg-[#081E26] border border-[#E1A238]/30 text-white font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8]"
              >
                <option className="bg-[#081E26] text-white">Deposit Inquiry</option>
                <option className="bg-[#081E26] text-white">Panai Selection Question</option>
                <option className="bg-[#081E26] text-white">Gold Coin Shipping & Courier</option>
                <option className="bg-[#081E26] text-white">Referral Earnings & Withdrawal</option>
                <option className="bg-[#081E26] text-white">KYC / Document Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-[#F2C868] font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                Subject / Brief Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deposit UTR status verification update"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full bg-[#081E26] border border-[#E1A238]/30 text-white font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8] placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F2C868] font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
              Detailed Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your request or question in detail..."
              value={ticketForm.message}
              onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
              className="w-full bg-[#081E26] border border-[#E1A238]/30 text-white font-medium p-3.5 rounded-2xl focus:outline-none focus:border-[#00C2B8] resize-none placeholder:text-slate-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#00C2B8] to-[#009b93] hover:brightness-110 text-[#081E26] text-xs font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center space-x-2.5 cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#081E26]" />
            <span>Submit Ticket to Sovereign Support</span>
          </button>
        </form>
      </div>

    </div>
  );
};

