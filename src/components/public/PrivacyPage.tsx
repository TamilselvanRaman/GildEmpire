'use client';

import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Lock, ShieldCheck } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-300 leading-relaxed font-medium">
        <div className="border-b border-[#0D3B43] pb-4">
          <div className="inline-flex items-center space-x-2 bg-[#0D3B43] border border-[#E1A238]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F2C868] mb-2">
            <Lock className="w-3.5 h-3.5 text-[#E1A238]" />
            <span>256-Bit SSL Encrypted Standard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">InfinityGram Privacy & Data Security Policy</h1>
          <p className="text-slate-400 font-bold">Enterprise Data Protection Guarantee | Compliant with Indian IT Act 2000</p>
        </div>

        <div className="p-8 bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 space-y-6 shadow-2xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#F2C868]">1. Data Collection & Purpose</h2>
            <p>We collect essential personal information required for identity verification, deposit reconciliation, group allocation, and insured courier delivery of 1 Gram Gold prizes. Collected data includes Full Name, Mobile Number, Email Address, Payment UTR references, and Shipping Address.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#F2C868]">2. Member Anonymity in 50-Group Views</h2>
            <p>To preserve member privacy, public and group slot visualizers display masked Member IDs (e.g., #MB-8924) and partial first names. Full phone numbers and email addresses are never exposed to other group participants.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#F2C868]">3. Security Standards</h2>
            <p>All transmitted payload data is secured with 256-bit SSL encryption. Audit log hashes are generated to prevent unauthorized manipulation of daily selection results.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
