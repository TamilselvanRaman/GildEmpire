'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Lock, Bell, Shield, KeyRound, Check, UserCheck, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage = () => {
  const { user } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user.fullName || 'Rajesh Kumar Sharma',
    email: user.email || 'rajesh@gildempire.in',
    mobile: user.mobile || '+91 98765 43210',
    address: 'Flat 402, Royal Sovereign Heights, Bandra West, Mumbai, Maharashtra 400050',
    panNumber: 'ABCDE1234F',
    aadharNumber: 'XXXX-XXXX-9823',
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans relative z-10">
      
      {/* Executive Dark Sovereign Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#0B1E39] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A3860] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="flex items-center space-x-5 relative z-10">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B1E39] flex items-center justify-center">
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-white tracking-tight">{user.fullName}</h1>
              <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase">
                {user.memberId}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium flex items-center space-x-2">
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audited KYC Verified</span>
              </span>
              <span className="text-slate-500">•</span>
              <span>Account Active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <span className="text-xs font-mono text-slate-300 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            256-Bit Encrypted
          </span>
        </div>
      </motion.div>

      {/* Grid Layout: Profile Form & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Details (Left Column) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0B1E39] flex items-center space-x-2.5">
                <Shield className="w-4.5 h-4.5 text-[#2F6FED]" />
                <span>Personal Profile & Identity</span>
              </h3>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-black text-[#2F6FED] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile Details'}
              </button>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile details successfully updated and saved.</span>
              </div>
            )}

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">
                  Full Legal Name (Matching Aadhar / PAN)
                </label>
                <input 
                  type="text" 
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-all disabled:opacity-75" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-all disabled:opacity-75" 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={profileData.mobile}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-bold p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-all disabled:opacity-75" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">Residential Address</label>
                <textarea 
                  value={profileData.address}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-medium p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20 transition-all disabled:opacity-75 h-24 resize-none" 
                ></textarea>
              </div>

              {/* Verified Documents Summary Box */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verified Identity Documents</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-500 font-bold">PAN Card:</span>
                    <span className="font-mono font-black text-[#0B1E39]">{profileData.panNumber}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Aadhar Card:</span>
                    <span className="font-mono font-black text-[#0B1E39]">{profileData.aadharNumber}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-xs uppercase tracking-wider mt-4 cursor-pointer"
                >
                  <span>Save Profile Updates</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Security & Preferences (Right Column) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-5 space-y-6"
        >
          
          {/* Security Box */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-5">
            <h3 className="text-base font-black text-[#0B1E39] flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <KeyRound className="w-4.5 h-4.5 text-[#2F6FED]" />
              <span>Security & Password</span>
            </h3>

            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] font-bold" 
                />
              </div>
              <div>
                <label className="block text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest text-[10px]">New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] p-3.5 rounded-2xl focus:outline-none focus:border-[#2F6FED] font-bold" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#0B1E39] hover:bg-[#142d52] text-white font-black py-4 rounded-2xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Update Access Password
              </button>
            </form>
          </div>

          {/* Notifications Preferences */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_40px_-15px_rgba(11,30,57,0.08)] space-y-5">
            <h3 className="text-base font-black text-[#0B1E39] flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <Bell className="w-4.5 h-4.5 text-[#2F6FED]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 cursor-pointer hover:border-[#2F6FED] transition-colors group">
                <div className="pr-4 space-y-0.5">
                  <p className="font-extrabold text-[#0B1E39] group-hover:text-[#2F6FED] transition-colors">SMS Daily Selection Alerts</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Instant SMS when daily 1g Gold Panai selection finishes.</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded-lg w-4 h-4 bg-white border-slate-300 text-[#2F6FED] focus:ring-[#2F6FED] shrink-0" />
              </label>

              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 cursor-pointer hover:border-[#2F6FED] transition-colors group">
                <div className="pr-4 space-y-0.5">
                  <p className="font-extrabold text-[#0B1E39] group-hover:text-[#2F6FED] transition-colors">Dispatch & Courier Tracking</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Notifications when your 1g Gold coin is dispatched.</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded-lg w-4 h-4 bg-white border-slate-300 text-[#2F6FED] focus:ring-[#2F6FED] shrink-0" />
              </label>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
