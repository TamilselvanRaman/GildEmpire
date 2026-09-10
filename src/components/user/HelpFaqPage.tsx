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
      answer: 'Each structured group consists of 50 verified members. Every member makes a single ₹5,000 deposit. For 50 consecutive days, exactly 1 member is awarded 1 Gram of 24K Gold daily through an audited selection process until all 50 members have received their 1 Gram Gold coin.'
    },
    {
      category: 'draw',
      question: 'How is the daily 1g Gold winner selected?',
      answer: 'Selections take place daily at 18:00 IST using an authentic traditional paper chit lucky pot ("Panai"). All active member IDs are folded into paper slips inside the vessel. Once a member wins, their ID is removed from the active pool for the remaining days of that cycle.'
    },
    {
      category: 'deposit',
      question: 'How is my ₹5,000 deposit verified?',
      answer: 'Upon submitting your UPI/Bank transaction reference (UTR ID), our financial desk verifies the credit against banking logs within 2 to 4 business hours. Once verified, your status updates to "Active" and you are assigned a slot number.'
    },
    {
      category: 'delivery',
      question: 'How and when will my 1 Gram Gold Coin be delivered?',
      answer: 'Awarded 1 Gram 24K Gold coins are packed with tamper-evident security seals, accompanied by an audited authenticity certificate, and shipped via insured courier (Blue Dart/Delhivery) within 3 to 5 business days.'
    },
    {
      category: 'referral',
      question: 'How does the 5% Referral Bonus work?',
      answer: 'When you invite friends or colleagues using your unique referral link, you receive an instant 5% cash bonus (₹250 per verified member) credited to your digital wallet upon their deposit confirmation. You can withdraw your earnings anytime.'
    },
    {
      category: 'security',
      question: 'Is the platform regulated and secure?',
      answer: 'Yes, GildEmpire operates under strict audited sovereign standards with 256-bit encryption. All group progression logs, deposit verifications, and daily Panai chit selections are cryptographically hashed and logged on public audit ledgers.'
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans relative z-10">
      
      {/* Executive Dark Sovereign Support Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-black">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>24/7 Sovereign Member Support & Knowledge Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              How Can We Assist You Today?
            </h1>
            
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Explore our member knowledge base or reach out to our dedicated sovereign support desk regarding 50-member group cycles, deposit verifications, Panai lucky draws, and 1g gold dispatches.
            </p>
          </div>

          {/* SLA Quick Status Pill Badge */}
          <div className="bg-[#102747]/80 backdrop-blur-md border border-[#1A3860] p-4 rounded-2xl shrink-0 space-y-2 max-w-xs">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Desk Online & Active</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Average response time: <strong className="text-amber-400 font-black">&lt; 15 Mins</strong>
            </p>
            <div className="text-[10px] text-blue-300/80 pt-1 border-t border-[#1A3860] font-bold">
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
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] flex items-center space-x-4 group hover:shadow-xl hover:border-blue-200 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#0B1E39]">Live Support Desk</h4>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Available 09:00 - 21:00 IST</span>
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] flex items-center space-x-4 group hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#0B1E39]">Official Email</h4>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">support@gildempire.in</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_15px_30px_-10px_rgba(11,30,57,0.06)] flex items-center space-x-4 group hover:shadow-xl hover:border-amber-200 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#0B1E39]">Toll-Free Helpline</h4>
            <p className="text-[11px] text-amber-800 font-bold mt-0.5">+91 1800 500 GOLD</p>
          </div>
        </motion.div>
      </div>

      {/* Category Tabs & FAQ Accordion List */}
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-[#0B1E39]">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Select a category to filter common member inquiries.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
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
                    ? 'bg-[#0B1E39] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
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
                    ? 'border-[#2F6FED] bg-blue-50/20 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left font-extrabold text-sm text-[#0B1E39] flex items-center justify-between space-x-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#2F6FED] shrink-0" />
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
                      className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3"
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
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-6">
        <div>
          <h3 className="text-lg font-black text-[#0B1E39] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#2F6FED]" />
            <span>Submit Official Support Ticket</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Need direct assistance from our audit desk? Send a ticket and receive a response within 2 hours.
          </p>
        </div>

        {ticketSubmitted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Ticket successfully submitted. Ticket Reference #TKT-892401 logged. Response will be sent to your registered email.</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                Inquiry Category
              </label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED]"
              >
                <option>Deposit Inquiry</option>
                <option>Panai Selection Question</option>
                <option>Gold Coin Shipping & Courier</option>
                <option>Referral Earnings & Withdrawal</option>
                <option>KYC / Document Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                Subject / Brief Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deposit UTR status verification update"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
              Detailed Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your request or question in detail..."
              value={ticketForm.message}
              onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
              className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-medium p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-[#0B1E39] hover:bg-[#142d52] text-white text-xs font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center space-x-2.5 cursor-pointer"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Submit Ticket to Sovereign Support</span>
          </button>
        </form>
      </div>

    </div>
  );
};
