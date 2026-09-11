'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { ShieldCheck, Award, Users, Menu, X, ChevronRight, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewMode; label: string }[] = [
    { id: 'public-landing', label: 'Home' },
    { id: 'public-about', label: 'How It Works' },
    { id: 'public-terms', label: 'Terms & Rules' },
    { id: 'public-faq', label: 'Support & FAQ' },
    { id: 'public-contact', label: 'Contact Us' },
  ];

  return (
    <nav className="bg-[#0D3B43]/95 backdrop-blur-xl text-white border-b border-[#E1A238]/30 sticky top-0 z-50 shadow-[0_10px_30px_rgba(8,30,38,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Executive InfinityGram Brand Logo Image & Name */}
          <div 
            onClick={() => setCurrentView('public-landing')} 
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center">
              <img 
                src="/infinitygram-icon.png" 
                alt="InfinityGram Official Logo" 
                className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,194,184,0.4)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2B8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2B8]"></span>
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#00C2B8] transition-colors flex items-center">
              Infinity<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2B8] to-[#a855f7]">Gram</span>
            </span>
          </div>

          {/* Desktop Navigation Links — Normal Standard Web Navbar Design */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'public-terms' && currentView.startsWith('legal-'));
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`text-xs sm:text-sm font-extrabold transition-all cursor-pointer py-1.5 relative ${
                    isActive
                      ? 'text-[#00C2B8]'
                      : 'text-slate-200 hover:text-[#00C2B8]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C2B8] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('auth-login')}
              className="text-[#F2C868] hover:text-[#00C2B8] text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-[#E1A238]/30 hover:border-[#00C2B8]/50 bg-[#081E26]/40 hover:bg-[#081E26]"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('auth-register')}
              className="bg-gradient-to-r from-[#00C2B8] to-[#009b93] hover:brightness-110 text-[#081E26] text-xs font-black px-5 py-2.5 rounded-full shadow-lg shadow-[#00C2B8]/20 transition-all flex items-center space-x-1.5 cursor-pointer group"
            >
              <span>Create Account</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-200 hover:text-[#00C2B8] p-2 rounded-xl bg-[#081E26]/60 border border-[#E1A238]/20 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#081E26] border-b border-[#E1A238]/30 px-5 pt-3 pb-6 space-y-3"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
                  currentView === item.id
                    ? 'bg-[#0D3B43] text-[#00C2B8] border border-[#00C2B8]/30'
                    : 'text-slate-200 hover:text-[#00C2B8]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#0D3B43] flex flex-col space-y-2.5">
              <button
                onClick={() => { setCurrentView('auth-login'); setMobileMenuOpen(false); }}
                className="w-full py-3 text-center text-[#F2C868] font-extrabold bg-[#0D3B43] rounded-xl border border-[#E1A238]/30 text-xs"
              >
                Login
              </button>
              <button
                onClick={() => { setCurrentView('auth-register'); setMobileMenuOpen(false); }}
                className="w-full py-3 text-center text-[#081E26] font-black bg-gradient-to-r from-[#00C2B8] to-[#009b93] rounded-xl shadow-md text-xs"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


