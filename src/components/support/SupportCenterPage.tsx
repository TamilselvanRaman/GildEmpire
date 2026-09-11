'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';

export type SupportMode = 'home' | 'ticket' | 'ticket-success';

interface Props {
  mode?: SupportMode;
}

export const SupportCenterPage: React.FC<Props> = ({ mode = 'home' }) => {
  const { setCurrentView, user } = useApp();
  const [activeMode, setActiveMode] = useState<SupportMode>(mode);

  // Form State
  const [category, setCategory] = useState('Deposit Verification');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setActiveMode('ticket-success');
  };

  const faqs = [
    {
      q: 'How does the 50-Member Group daily gold selection work?',
      a: 'When 50 members complete their verified ₹10,000 deposits, the group locks and begins a 50-day active cycle. Each day at 07:00 AM IST, 1 member wins 1 Gram of 24K Gold Coin via our SOC-2 audited random selection algorithm.',
    },
    {
      q: 'How do I claim my 5% instant referral cash bonus?',
      a: 'When a new member joins using your unique invitation link and completes their ₹10,000 deposit, ₹500 (5%) is instantly credited to your digital wallet for immediate withdrawal.',
    },
    {
      q: 'What payment methods are accepted for member deposits?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), IMPS / NEFT Direct Bank Transfer, and Instant Payment Gateways with manual UTR audit verification.',
    },
    {
      q: 'Is my ₹10,000 deposit 100% refundable?',
      a: 'Yes! Your deposit is held in a sovereign asset-locked vault. Once the 50-day group cycle completes or per program terms, the principal deposit is 100% refundable.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Dark Sovereign Hero */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
            <Headphones className="w-3.5 h-3.5 text-blue-400" />
            <span>24/7 MEMBER AUDIT SUPPORT DESK</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Get instant answers to your 50-member group questions, track ticket resolution status, or contact our dedicated member audit team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setActiveMode('ticket')}
            className="bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-500/30 transition-all cursor-pointer flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SUPPORT HOME & FAQ */}
      {activeMode === 'home' && (
        <div className="space-y-8">
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#0B1E39]">Toll-Free Member Line</h3>
              <p className="text-xs text-slate-500 font-medium">+91 1800-425-9920</p>
              <p className="text-[11px] text-slate-400 font-mono">Mon–Sat, 09:00 AM – 07:00 PM IST</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#0B1E39]">Email Support Audit Desk</h3>
              <p className="text-xs text-slate-500 font-medium">support@infinitygram.in</p>
              <p className="text-[11px] text-emerald-600 font-mono font-bold">24-Hour Guaranteed SLA Response</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#0B1E39]">Ticket Audit Desk</h3>
              <p className="text-xs text-slate-500 font-medium">Submit specific UTR or slot inquiry</p>
              <button
                onClick={() => setActiveMode('ticket')}
                className="text-xs font-black text-[#2F6FED] hover:underline cursor-pointer inline-flex items-center space-x-1"
              >
                <span>Open New Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-black text-[#0B1E39] flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-xs sm:text-sm text-[#0B1E39] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-5 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: TICKET CREATION FORM */}
      {activeMode === 'ticket' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-[#0B1E39]">Submit Audit Support Ticket</h2>
              <p className="text-xs text-slate-500 font-medium">Fill in ticket details for instant review by our support team.</p>
            </div>
            <button
              onClick={() => setActiveMode('home')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Inquiry Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="Deposit Verification">Deposit & UTR Verification</option>
                <option value="Group Seating">50-Member Group Seating</option>
                <option value="Gold Reward Claim">Daily 1g Gold Reward Claim</option>
                <option value="Referral Bonus">5% Referral Cash Bonus</option>
                <option value="Technical Issue">Technical & Account Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Ticket Subject
              </label>
              <input
                type="text"
                required
                placeholder="Brief summary of your inquiry..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Message & Transaction Details
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide bank reference UTR, group code, or specific details..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket to Audit Desk</span>
            </button>
          </form>
        </div>
      )}

      {/* MODE 3: TICKET SUCCESS RECEIPT */}
      {activeMode === 'ticket-success' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-widest">
              TICKET SUBMITTED SUCCESSFULLY
            </span>
            <h2 className="text-2xl font-black text-[#0B1E39]">Ticket Ref: {ticketId}</h2>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Your inquiry has been assigned to a sovereign audit specialist. You will receive an email update within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left font-medium">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-slate-900">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600">Active & Assigned</span>
            </div>
          </div>

          <button
            onClick={() => setActiveMode('home')}
            className="w-full bg-[#0B1E39] hover:bg-[#15345E] text-white text-xs font-black py-3.5 px-6 rounded-xl shadow-lg cursor-pointer"
          >
            Return to Support Center
          </button>
        </div>
      )}

    </div>
  );
};
