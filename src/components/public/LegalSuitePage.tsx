'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  RotateCcw, 
  AlertTriangle, 
  Scale, 
  UserCheck, 
  Trash2, 
  Download, 
  Printer, 
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

export type LegalDocType = 
  | 'privacy' 
  | 'terms' 
  | 'cookies' 
  | 'refund' 
  | 'disclaimer' 
  | 'acceptable-use' 
  | 'grievance' 
  | 'data-deletion';

interface Props {
  docType?: LegalDocType;
}

export const LegalSuitePage: React.FC<Props> = ({ docType = 'privacy' }) => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<LegalDocType>(docType);

  const tabs: { id: LegalDocType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', icon: ShieldCheck },
    { id: 'refund', label: 'Refund & Cancellation', icon: RotateCcw },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'acceptable-use', label: 'Acceptable Use Policy', icon: Scale },
    { id: 'grievance', label: 'Grievance Redressal', icon: UserCheck },
    { id: 'data-deletion', label: 'Data Deletion Request', icon: Trash2 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Hero */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AUDITED LEGAL & GOVERNANCE COMPLIANCE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Legal & Policy Governance Framework
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Transparent governance standards protecting member deposits, 50-member group allocations, 24K gold disbursements, and data privacy.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs Nav & Right Document Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Vertical Navigation Tabs */}
        <div className="space-y-2 lg:col-span-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-[#0B1E39] text-amber-400 shadow-md border border-amber-400/30 font-black' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Document Display Container */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 space-y-6 text-slate-700 text-xs leading-relaxed font-medium">
          
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <h2 className="text-xl font-black text-[#0B1E39]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Effective Date: 01 Jan 2026</span>
              </span>
              <span>&bull;</span>
              <span>Last Updated: 11 Sep 2026</span>
            </div>
          </div>

          {/* DOCUMENT CONTENT SWITCHER */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Information We Collect</h3>
              <p>GildEmpire collects verified personal information including full name, mobile number, email address, PAN/KYC identification documents, and bank UTR transaction details required for 50-member group seating and 24K gold coin shipment dispatch.</p>
              <h3 className="text-sm font-black text-[#0B1E39]">2. Asset & Data Security Protocols</h3>
              <p>All sensitive member data is protected using 256-Bit SSL transport layer encryption and stored in SOC-2 compliant isolated database vaults. We do not sell or rent member data to third-party advertisers.</p>
              <h3 className="text-sm font-black text-[#0B1E39]">3. User Privacy Rights</h3>
              <p>Members maintain the right to inspect, update, or request data deletion of personal identification records subject to statutory financial audit retention mandates.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. 50-Member Group Execution Invariants</h3>
              <p>Each group consists of exactly 50 verified members who have submitted their ₹10,000 deposit. Group cycles run for 50 active days, during which 1 Gram of 24K Gold Coin is awarded daily via automated audited selection.</p>
              <h3 className="text-sm font-black text-[#0B1E39]">2. Deposit & Refund Conditions</h3>
              <p>Deposits are held in locked asset vaults. Member principal deposits are 100% refundable upon group cycle completion or per defined program rules.</p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Essential Authentication Cookies</h3>
              <p>We use essential session tokens and cookies strictly required to maintain secure member login state, CSRF protection, and viewport layout preferences.</p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. 100% Refundable Deposit Policy</h3>
              <p>Deposits submitted to 50-member groups are 100% refundable upon completion of the 50-day cycle or cancellation prior to group filling verification.</p>
              <h3 className="text-sm font-black text-[#0B1E39]">2. Processing Timelines</h3>
              <p>Refund requests are verified by our audit desk and processed directly to the member&apos;s registered bank account within 3–5 business days.</p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Non-Investment Platform Notice</h3>
              <p>GildEmpire is a digital membership savings and gold reward allocation platform. It does not provide speculative stock trading, guaranteed interest yields, or financial advisory services.</p>
            </div>
          )}

          {activeTab === 'acceptable-use' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Prohibited Activities</h3>
              <p>Members shall not submit fraudulent UTR bank receipts, attempt unauthorized automated API scraping, or create fake referral accounts.</p>
            </div>
          )}

          {activeTab === 'grievance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Grievance Officer Contact</h3>
              <p>In accordance with Information Technology Rules, member grievances may be directed to our Nodal Officer:</p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs space-y-1">
                <p className="font-bold text-slate-900">Nodal Grievance Officer: Mr. S. Raman</p>
                <p className="text-slate-600">Email: grievance@gildempire.in</p>
                <p className="text-slate-600">Address: GildEmpire Audit Operations, Cyber City, Phase-2, India</p>
              </div>
            </div>
          )}

          {activeTab === 'data-deletion' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0B1E39]">1. Account & Data Deletion Request</h3>
              <p>To request permanent deletion of your profile and non-audit personal data, submit your request through our support portal or email support@gildempire.in.</p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('support-ticket')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Submit Data Deletion Ticket
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
