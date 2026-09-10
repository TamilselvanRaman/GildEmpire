'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, Users, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-[#0B1E39] border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('public-landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#2F6FED] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-[#0B1E39]">GildEmpire</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Gold Scheme Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-[13px] font-bold tracking-wide text-slate-700">
            <button onClick={() => setCurrentView('public-landing')} className="group relative py-2 hover:text-[#2F6FED] transition-colors cursor-pointer">
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F6FED] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => setCurrentView('public-about')} className="group relative py-2 hover:text-[#2F6FED] transition-colors cursor-pointer">
              <span>How It Works</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F6FED] transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button onClick={() => setCurrentView('public-terms')} className="group relative py-2 hover:text-[#2F6FED] transition-colors cursor-pointer">
              <span>Terms & Rules</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F6FED] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => setCurrentView('public-faq')} className="group relative py-2 hover:text-[#2F6FED] transition-colors cursor-pointer">
              <span>Support & FAQ</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F6FED] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => setCurrentView('public-contact')} className="group relative py-2 hover:text-[#2F6FED] transition-colors cursor-pointer">
              <span>Contact Us</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F6FED] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('auth-login')}
              className="text-[#0B1E39] hover:text-[#2F6FED] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('auth-register')}
              className="btn-sovereign-blue text-xs font-bold px-6 py-2.5 rounded-full shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Create Account</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-[#0B1E39] p-2 rounded-lg focus:outline-none cursor-pointer"
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
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3"
          >
            <button onClick={() => { setCurrentView('public-landing'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-800 font-bold">Home</button>
            <button onClick={() => { setCurrentView('public-about'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-800 font-bold">How It Works</button>
            <button onClick={() => { setCurrentView('public-terms'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-800 font-bold">Terms & Conditions</button>
            <button onClick={() => { setCurrentView('public-faq'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-800 font-bold">Support & FAQ</button>
            <button onClick={() => { setCurrentView('public-contact'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-800 font-bold">Contact Us</button>

            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2">
              <button
                onClick={() => { setCurrentView('auth-login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-slate-800 font-bold bg-slate-100 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => { setCurrentView('auth-register'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-white font-bold bg-[#2F6FED] rounded-xl shadow-md"
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
