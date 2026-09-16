'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, ShieldCheck, Lock, FileText, HelpCircle, PhoneCall, Mail } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-[#081E26] text-white border-t border-[#0D3B43] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#0D3B43]/80">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <img 
                src="/logo.png" 
                alt="InfinityGram Logo" 
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,194,184,0.4)]" 
              />
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                Infinity<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#a855f7]">Gram</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              InfinityGram Audited Sovereign digital platform for verified member registration, transparent deposit management, 50-member group progression, and daily 1 Gram 916 Gold reward status tracking.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#00C2B8] bg-[#0D3B43]/60 border border-[#00C2B8]/40 px-3 py-1.5 rounded-xl w-fit font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#00C2B8]" />
              <span>100% Audited Sovereign Compliance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#F2C868] mb-4 uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li><button onClick={() => setCurrentView('public-landing')} className="hover:text-[#00C2B8] transition-colors">Home & Overview</button></li>
              <li><button onClick={() => setCurrentView('public-about')} className="hover:text-[#00C2B8] transition-colors">50-Day How It Works</button></li>
              <li><button onClick={() => setCurrentView('user-dashboard')} className="hover:text-[#00C2B8] transition-colors">Member Dashboard</button></li>
              <li><button onClick={() => setCurrentView('user-my-group')} className="hover:text-[#00C2B8] transition-colors">50-Member Group Grid</button></li>
              <li><button onClick={() => setCurrentView('user-rewards-overview')} className="hover:text-[#00C2B8] transition-colors">Reward Status</button></li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#F2C868] mb-4 uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li><button onClick={() => setCurrentView('public-terms')} className="hover:text-[#00C2B8] transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => setCurrentView('public-privacy')} className="hover:text-[#00C2B8] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setCurrentView('public-faq')} className="hover:text-[#00C2B8] transition-colors">Help Center & FAQ</button></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-xs font-bold text-[#F2C868] mb-4 uppercase tracking-wider">Member Support</h4>
            <div className="space-y-3 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#00C2B8]" />
                <a href="mailto:gildemphire07@gmail.com" className="hover:text-[#00C2B8] transition-colors break-all">gildemphire07@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-[#00C2B8]" />
                <span className="hover:text-[#00C2B8] transition-colors">Mon–Sat, 09:00 AM – 07:00 PM IST</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2">
                Operational Hours: Mon–Sat, 09:00 AM – 07:00 PM IST
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium space-y-4 md:space-y-0">
          <p>© 2026 InfinityGram Platform. Audited Sovereign Digital Membership Platform.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E1A238]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span>Indian Digital Economy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

