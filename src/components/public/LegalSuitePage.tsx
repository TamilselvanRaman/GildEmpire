'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
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
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col justify-between font-sans selection:bg-[#00C2B8] selection:text-[#081E26]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Executive Hero */}
        <div className="bg-gradient-to-r from-[#0D3B43] via-[#124e58] to-[#0D3B43] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00C2B8]/20 border border-[#00C2B8]/40 text-[#00C2B8] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C2B8]" />
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
              className="px-4 py-2.5 rounded-xl bg-[#081E26] hover:bg-[#051319] border border-[#E1A238]/30 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 text-[#F2C868]" />
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
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#00C2B8] to-[#009b93] text-[#081E26] shadow-lg shadow-[#00C2B8]/20 border-[#00C2B8] font-black' 
                      : 'bg-[#0D3B43]/80 text-slate-300 hover:text-white hover:bg-[#0D3B43] border-[#E1A238]/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#081E26]' : 'text-[#F2C868]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Document Display Container */}
          <div className="lg:col-span-3 bg-[#0D3B43]/90 backdrop-blur-md rounded-3xl border border-[#E1A238]/20 shadow-2xl p-8 space-y-6 text-slate-200 text-xs leading-relaxed font-medium">
            
            <div className="flex flex-wrap items-center justify-between border-b border-[#081E26] pb-4 gap-2">
              <h2 className="text-xl font-black text-white">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center space-x-4 text-[11px] text-slate-300 font-mono">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F2C868]" />
                  <span>Effective Date: 01 Jan 2026</span>
                </span>
                <span>&bull;</span>
                <span>Last Updated: 11 Sep 2026</span>
              </div>
            </div>

            {/* DOCUMENT CONTENT SWITCHER */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Information We Collect</h3>
                <p>InfinityGram collects verified personal information including full name, mobile number, email address, PAN/KYC identification documents, and bank UTR transaction details required for 50-member group seating and 24K gold coin shipment dispatch.</p>
                <h3 className="text-sm font-black text-[#F2C868]">2. Asset & Data Security Protocols</h3>
                <p>All sensitive member data is protected using 256-Bit SSL transport layer encryption and stored in SOC-2 compliant isolated database vaults. We do not sell or rent member data to third-party advertisers.</p>
                <h3 className="text-sm font-black text-[#F2C868]">3. User Privacy Rights</h3>
                <p>Members maintain the right to inspect, update, or request data deletion of personal identification records subject to statutory financial audit retention mandates.</p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. 50-Member Group Execution Invariants</h3>
                <p>Each group consists of exactly 50 verified members who have submitted their ₹5,000 deposit. Group cycles run for 50 active days, during which 1 Gram of 24K Gold Coin is awarded daily via automated audited selection.</p>
                <h3 className="text-sm font-black text-[#F2C868]">2. Deposit & Refund Conditions</h3>
                <p>Deposits are held in locked asset vaults. Member principal deposits are 100% refundable upon group cycle completion or per defined program rules.</p>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Essential Authentication Cookies</h3>
                <p>We use essential session tokens and cookies strictly required to maintain secure member login state, CSRF protection, and viewport layout preferences.</p>
              </div>
            )}

            {activeTab === 'refund' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. 100% Refundable Deposit Policy</h3>
                <p>Deposits submitted to 50-member groups are 100% refundable upon completion of the 50-day cycle or cancellation prior to group filling verification.</p>
                <h3 className="text-sm font-black text-[#F2C868]">2. Processing Timelines</h3>
                <p>Refund requests are verified by our audit desk and processed directly to the member&apos;s registered bank account within 3–5 business days.</p>
              </div>
            )}

            {activeTab === 'disclaimer' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Non-Investment Platform Notice</h3>
                <p>InfinityGram is a digital membership savings and gold reward allocation platform. It does not provide speculative stock trading, guaranteed interest yields, or financial advisory services.</p>
              </div>
            )}

            {activeTab === 'acceptable-use' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Prohibited Activities</h3>
                <p>Members shall not submit fraudulent UTR bank receipts, attempt unauthorized automated API scraping, or create fake referral accounts.</p>
              </div>
            )}

            {activeTab === 'grievance' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Grievance Officer Contact</h3>
                <p>In accordance with Information Technology Rules, member grievances may be directed to our Nodal Officer:</p>
                <div className="p-4 bg-[#081E26] border border-[#E1A238]/30 rounded-2xl font-mono text-xs space-y-1">
                  <p className="font-bold text-[#00C2B8]">Nodal Grievance Officer: Mr. S. Raman</p>
                  <p className="text-slate-300">Email: grievance@infinitygram.in</p>
                  <p className="text-slate-300">Address: InfinityGram Audit Operations, Cyber City, Phase-2, India</p>
                </div>
              </div>
            )}

            {activeTab === 'data-deletion' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#F2C868]">1. Account & Data Deletion Request</h3>
                <p>To request permanent deletion of your profile and non-audit personal data, submit your request through our support portal or email support@infinitygram.in.</p>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('support-ticket')}
                    className="bg-[#00C2B8] hover:bg-[#009b93] text-[#081E26] font-black text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-md transition-all"
                  >
                    Submit Data Deletion Ticket
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

