'use client';

import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Download, Printer, Scale } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0D3B43] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#0D3B43] border border-[#E1A238]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F2C868] mb-2">
              <Scale className="w-3.5 h-3.5 text-[#E1A238]" />
              <span>InfinityGram Sovereign Enterprise Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Terms & Conditions of Service</h1>
            <p className="text-xs text-slate-300 font-medium">Effective Date: 01 August 2026 | Jurisdiction: Republic of India</p>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-[#0D3B43] border border-[#E1A238]/30 text-slate-200 hover:bg-[#0D3B43]/80 text-xs font-bold transition-all flex items-center space-x-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#F2C868]" />
              <span>Print Terms</span>
            </button>
            <button 
              onClick={() => alert("Downloading InfinityGram_Terms_2026.pdf...")}
              className="btn-infinity-cyan px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Legal Document Content */}
        <div className="w-full p-6 sm:p-10 bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium shadow-2xl">
          
          <section id="general" className="space-y-3 pt-2 scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">1. General Terms & Operating Scope</h2>
            <p>Welcome to the InfinityGram digital platform. By registering an account, submitting a deposit, or engaging in 50-member group activities, you agree to comply with these binding enterprise terms and conditions governing platform operations, identity verification, deposit reconciliation, and gold reward distribution.</p>
            <p>InfinityGram operates as a structured digital membership service based in India. All transactions and group progressions are monitored under internal audit compliance.</p>
          </section>

          <section id="account" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">2. Member Account & KYC Verification</h2>
            <p>Each user must create a single, unique member account authenticated via registered Indian mobile number (verified via instant SMS OTP) and valid email address. Full identity verification (KYC) requires PAN and Aadhaar documentation.</p>
            <p className="bg-[#081E26] border border-[#00C2B8]/40 p-3.5 rounded-xl text-[#00C2B8] font-semibold text-xs">
              <strong>Notice:</strong> Multiple duplicate accounts created by the same individual to manipulate group placement or spin odds are strictly prohibited and subject to immediate account suspension without refund.
            </p>
          </section>

          <section id="deposits" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">3. ₹10,000 Deposit & UTR Verification</h2>
            <p>Membership participation requires a one-time verified deposit of ₹10,000 per 50-member group cycle. Payments are accepted exclusively through official Instant UPI (GPay, PhonePe, Paytm, BHIM) or Direct Bank Transfer (NEFT/IMPS).</p>
            <p>Members must upload the exact 12-digit UTR bank reference code for financial reconciliation. Deposits are verified by our operations desk prior to group assignment.</p>
          </section>

          <section id="groups" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">4. 50-Member Group Structure</h2>
            <p>Groups are fixed at exactly 50 verified members per batch (#1 to #50). Member positions are assigned sequentially upon deposit verification. Group cycles commence immediately once the 50th slot is filled.</p>
          </section>

          <section id="rewards" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">5. 50-Day Gold Reward Rules</h2>
            <p>Each group cycle operates over 50 consecutive calendar days. On each day, 1 member is selected to receive a 1 Gram 24K Hallmarked Gold coin via audited daily selection.</p>
            <p><strong>Non-Repeating Pool Guarantee:</strong> Selected daily winners are automatically removed from the active selection pool for subsequent days. Over 50 days, every single member (#1 through #50) is guaranteed to receive 1 Gram 24K Gold.</p>
          </section>

          <section id="referrals" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">6. Referral Incentive System</h2>
            <p>Members may invite friends using their unique dashboard referral link. Referral incentives reflect on the referrer’s dashboard network tree once the referred candidate completes deposit verification.</p>
          </section>

          <section id="compliance" className="space-y-3 pt-2 border-t border-[#081E26] scroll-mt-28">
            <h2 className="text-lg font-extrabold text-white border-b border-[#081E26] pb-2">7. Regulatory & Legal Compliance</h2>
            <p>InfinityGram operates in strict compliance with Indian financial laws and consumer guidelines. All gold coins distributed are certified 24K 999 purity with BIS Hallmark authentication and dispatched via insured courier.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

