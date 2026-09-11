'use client';

import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Mail, PhoneCall, MapPin, Send, CheckCircle2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#081E26] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto space-y-4 pt-2"
        >
          <div className="inline-flex items-center justify-center">
            <span className="inline-flex items-center text-xs font-bold text-[#F2C868] uppercase tracking-widest bg-[#0D3B43] px-4 py-1.5 rounded-full border border-[#E1A238]/40 shadow-xs">
              24/7 Corporate Operations Desk
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight pt-1">
            Contact InfinityGram Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium pt-1">
            Our dedicated support desk is available to assist with deposit reconciliation, 50-member group inquiries, and prize courier tracking.
          </p>
        </motion.div>

        {/* Support Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto p-8 sm:p-10 bg-[#0D3B43] rounded-3xl border border-[#E1A238]/30 shadow-2xl"
        >
          {submitted ? (
            <div className="text-center py-16 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/40 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#00C2B8]" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Support Inquiry Received</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto font-medium">
                Your ticket reference <strong className="text-[#F2C868]">#TK-89204</strong> has been dispatched to our operations desk. We will respond within 4 business hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-[#00C2B8] hover:text-[#00C2B8]/80 underline underline-offset-4"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="space-y-1 mb-6 border-b border-[#081E26] pb-4">
                <h3 className="text-lg font-extrabold text-white">Submit a Ticket</h3>
                <p className="text-xs text-slate-300 font-medium">Fill out the fields below and our corporate desk will email you shortly.</p>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5 text-xs">Full Name as per KYC</label>
                <input type="text" required placeholder="Rajesh Kumar Sharma" className="w-full bg-[#081E26] border border-[#0D3B43] text-white p-3.5 rounded-xl focus:outline-none focus:border-[#00C2B8] focus:ring-2 focus:ring-[#00C2B8]/20 transition-all placeholder:text-slate-400 font-medium" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs">Registered Mobile or Email</label>
                  <input type="text" required placeholder="rajesh@infinitygram.in" className="w-full bg-[#081E26] border border-[#0D3B43] text-white p-3.5 rounded-xl focus:outline-none focus:border-[#00C2B8] focus:ring-2 focus:ring-[#00C2B8]/20 transition-all placeholder:text-slate-400 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs">Inquiry Subject</label>
                  <select className="w-full bg-[#081E26] border border-[#0D3B43] text-white p-3.5 rounded-xl focus:outline-none focus:border-[#00C2B8] focus:ring-2 focus:ring-[#00C2B8]/20 transition-all font-medium">
                    <option>Deposit UTR Verification Status</option>
                    <option>Group Assignment Inquiry</option>
                    <option>Daily 1g Gold Selection Rules</option>
                    <option>BlueDart Prize Courier Dispatch</option>
                    <option>Technical Account Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5 text-xs">Detailed Message</label>
                <textarea rows={5} required placeholder="Provide your Member ID or Deposit UTR reference..." className="w-full bg-[#081E26] border border-[#0D3B43] text-white p-3.5 rounded-xl focus:outline-none focus:border-[#00C2B8] focus:ring-2 focus:ring-[#00C2B8]/20 transition-all placeholder:text-slate-400 font-medium resize-none"></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-infinity-cyan font-extrabold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket to Operations Desk</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Address and Contact Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-10 pt-10 border-t border-[#0D3B43]"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Corporate Headquarters</h2>
            <p className="text-xs text-slate-300 font-medium max-w-xl mx-auto">
              Our registered office in Hyderabad handles all financial auditing, 50-day cycle supervision, and BlueDart gold dispatch logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Email Card */}
            <div className="bg-[#0D3B43] rounded-2xl border border-[#E1A238]/30 p-6 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#081E26] text-[#00C2B8] border border-[#00C2B8]/30 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Official Email Desk</h3>
                <p className="text-xs text-slate-300 mb-3">24/7 Email Support</p>
                <a href="mailto:support@infinitygram.in" className="text-sm font-bold text-[#00C2B8] hover:underline">
                  support@infinitygram.in
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-[#0D3B43] rounded-2xl border border-[#E1A238]/30 p-6 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#081E26] text-[#E1A238] border border-[#E1A238]/40 flex items-center justify-center mx-auto">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Toll-Free Helpline</h3>
                <p className="text-xs text-slate-300 mb-3">Mon–Sat: 09:00 AM – 07:00 PM IST</p>
                <a href="tel:18004259920" className="text-sm font-bold text-[#F2C868] hover:underline">
                  +91 1800-425-9920
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-[#0D3B43] rounded-2xl border border-[#E1A238]/30 p-6 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#081E26] text-[#F2C868] border border-[#E1A238]/40 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Registered Office</h3>
                <p className="text-xs text-slate-300 mb-3">Hyderabad, India</p>
                <p className="text-xs font-bold text-slate-200">
                  Cyber City Tower B, Floor 14<br/>Financial District, Hyderabad 500032
                </p>
              </div>
            </div>

          </div>

          {/* Map Graphic */}
          <div className="rounded-3xl bg-[#0D3B43] p-0 overflow-hidden h-72 md:h-[400px] border border-[#E1A238]/30 shadow-2xl">
            
            {/* Interactive Google Map Iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272226612307!2d78.3418653!3d17.4124317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a2f8fc7085%3A0x6fbdbf0bf05bb658!2sFinancial%20District%2C%20Nanakramguda%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            ></iframe>
            
          </div>

        </motion.div>

      </main>

      <Footer />
    </div>
  );
};
