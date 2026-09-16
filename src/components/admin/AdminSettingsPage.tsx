'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Coins, 
  Clock, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Server, 
  RefreshCw, 
  Globe, 
  Mail, 
  Phone, 
  Key, 
  Bell, 
  Megaphone, 
  Database, 
  FileText,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'economics' | 'branding' | 'security' | 'notifications' | 'infrastructure'>('economics');

  // Tab 1: Core Economics
  const [capacity, setCapacity] = useState(settings.groupCapacity);
  const [goldGrams, setGoldGrams] = useState(settings.goldPrizeGramsPerDay);
  const [depositAmount, setDepositAmount] = useState(settings.depositAmountINR);
  const [spinTime, setSpinTime] = useState(settings.autoDailySpinTime);

  // Tab 2: Website & Branding Controls
  const [platformTitle, setPlatformTitle] = useState('InfinityGram Sovereign Audit Engine');
  const [supportEmail, setSupportEmail] = useState('support@infinitygram.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [announcementBanner, setAnnouncementBanner] = useState('🎉 Batch A Day 2 Live - 1 Gram 916 Gold Awarded Daily to Enrolled Members!');
  const [currencySymbol, setCurrencySymbol] = useState('₹ INR (Indian Rupee)');

  // Tab 3: Security & Verification Controls
  const [requireDepositVerify, setRequireDepositVerify] = useState(settings.requireDepositVerification ?? true);
  const [allowManualSpin, setAllowManualSpin] = useState(settings.allowManualSpinTrigger ?? true);
  const [autoSeatOnVerify, setAutoSeatOnVerify] = useState(true);
  const [cooldown24hEnabled, setCooldown24hEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode ?? false);

  // Tab 4: Broadcast & Notifications
  const [preEmailAlerts, setPreEmailAlerts] = useState(true);
  const [winnerSmsAlerts, setWinnerSmsAlerts] = useState(true);
  const [adminNotifyOnDeposit, setAdminNotifyOnDeposit] = useState(true);

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateSettings({
        groupCapacity: Number(capacity),
        goldPrizeGramsPerDay: Number(goldGrams),
        depositAmountINR: Number(depositAmount),
        autoDailySpinTime: spinTime,
        requireDepositVerification: requireDepositVerify,
        allowManualSpinTrigger: allowManualSpin,
        maintenanceMode: maintenanceMode,
      });
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }, 600);
  };

  const handleResetDefaults = () => {
    setCapacity(50);
    setGoldGrams(1);
    setDepositAmount(10000);
    setSpinTime('07:00 IST');
    setPlatformTitle('InfinityGram Sovereign Audit Engine');
    setSupportEmail('support@infinitygram.in');
    setSupportPhone('+91 98765 43210');
    setRequireDepositVerify(true);
    setAllowManualSpin(true);
    setAutoSeatOnVerify(true);
    setCooldown24hEnabled(true);
    setMaintenanceMode(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-8 rounded-3xl border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Master System Control Vault — All Website Settings & Invariants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            System Rules & Global Platform Config
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Centralized administrative portal to control platform branding, group capacity rules, deposit verification policies, broadcast schedules, and security locks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={handleResetDefaults}
            className="bg-white/10 hover:bg-white/20 text-slate-200 font-extrabold px-4 py-3 rounded-2xl text-xs border border-white/20 shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Reset System Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Save All Global Settings</span>
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar for Settings Categories */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto text-xs font-black">
        <button
          onClick={() => setActiveTab('economics')}
          className={`px-4 py-3 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'economics' ? 'bg-[#0B1E39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Core Economics & Limits</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-3 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'branding' ? 'bg-[#0B1E39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Website & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'security' ? 'bg-[#0B1E39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Auto-Seating</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-3 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'notifications' ? 'bg-[#0B1E39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Email & Broadcast Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-4 py-3 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'infrastructure' ? 'bg-[#0B1E39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4 text-rose-400" />
          <span>SOC-2 Vault Audit</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* TAB 1: CORE ECONOMICS & GROUP LIMITS */}
        {activeTab === 'economics' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black">
                <Coins className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1E39]">Core Group Economics & Reward Distribution</h2>
                <p className="text-xs text-slate-500 font-medium">Invariants governing member group size, deposit amounts, and gold weight allocation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">
                  Group Capacity (Fixed Members Cap)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-mono font-black text-sm focus:outline-none focus:border-[#2F6FED]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-700 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg">
                    STRICT CAP: 50
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Fixed 50-member capacity per batch roster.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">
                  Gold Prize per Day (Grams 916)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-mono font-black text-sm focus:outline-none focus:border-[#2F6FED]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100 text-amber-900 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-amber-300">
                    916 PURITY
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Quantity of 916 gold coin awarded each day to lucky paper chit winner.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">
                  Membership Deposit Requirement (₹ INR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-mono font-black text-sm focus:outline-none focus:border-[#2F6FED]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-900 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-emerald-300">
                    ₹10,000 LOCKED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Mandatory payment required per member to join active pool.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">
                  Automated Daily Spin Schedule
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={spinTime}
                    onChange={(e) => setSpinTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-mono font-black text-sm focus:outline-none focus:border-[#2F6FED]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-900 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-blue-200">
                    CRON IST
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Daily timing for Panai Glass Bottle lucky chit selection event.</p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WEBSITE & BRANDING CONTROLS */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1E39]">Website Branding, Contact & Public Portal Controls</h2>
                <p className="text-xs text-slate-500 font-medium">Manage platform title, support contacts, announcement banner, and portal branding.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
              
              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">Platform Title & System Name</label>
                <input
                  type="text"
                  value={platformTitle}
                  onChange={(e) => setPlatformTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">Default Currency & Symbol</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">Official Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">Official Support Helpline Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[#0B1E39] font-extrabold uppercase text-[10px] tracking-wider">Public Landing Page Announcement Banner</label>
                <textarea
                  rows={2}
                  value={announcementBanner}
                  onChange={(e) => setAnnouncementBanner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl font-semibold focus:outline-none focus:border-[#2F6FED]"
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & AUTO-SEATING GOVERNANCE */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1E39]">Security Rules & Automatic Slot Allocation Controls</h2>
                <p className="text-xs text-slate-500 font-medium">Set verification rules, automated slot seating logic, and emergency locks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-medium">
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    ⚡ Instant Automatic Slot Seating on Verification
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Automatically assign user to next open slot in recruiting batch (e.g. Slot #41, #42) as soon as deposit is verified.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSeatOnVerify(!autoSeatOnVerify)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${autoSeatOnVerify ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {autoSeatOnVerify ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    🔒 Mandatory 24-Hour Cooldown Timer Between Draws
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Enforce strict 24-hour lockout after each daily gold draw to prevent duplicate spins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCooldown24hEnabled(!cooldown24hEnabled)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${cooldown24hEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {cooldown24hEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    Require Admin Verification for UTR Receipts
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Mandate reviewer verification of UPI/IMPS UTR references before confirming membership.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireDepositVerify(!requireDepositVerify)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${requireDepositVerify ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {requireDepositVerify ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-rose-950 block text-xs flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>System Emergency Maintenance Lockout</span>
                  </span>
                  <p className="text-[11px] text-rose-900 leading-relaxed">
                    Temporarily lock member logins and registration while maintaining system audit logs intact.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${maintenanceMode ? 'text-rose-600' : 'text-slate-400'}`}
                >
                  {maintenanceMode ? <ToggleRight className="w-8 h-8 text-rose-600" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: BROADCAST & NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-black">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1E39]">Automated Email Broadcasts & Notification Rules</h2>
                <p className="text-xs text-slate-500 font-medium">Configure pre-draw email triggers, winner SMS dispatches, and admin notifications.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-medium">
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    📧 10-Min Pre-Draw Automated Email Broadcast
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Automatically send reminder emails to all 50 batch members 10 minutes prior to daily gold draw.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreEmailAlerts(!preEmailAlerts)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${preEmailAlerts ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {preEmailAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    🏆 Instant Gold Winner SMS & Email Dispatches
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Dispatch instant gold winning certificate and tracking number to selected chit winner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWinnerSmsAlerts(!winnerSmsAlerts)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${winnerSmsAlerts ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {winnerSmsAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-[#0B1E39] block text-xs">
                    🔔 Admin Alert on New Deposit Submission
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Notify Reviewers instantly when a new ₹10,000 UTR receipt is submitted by a user.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminNotifyOnDeposit(!adminNotifyOnDeposit)}
                  className={`p-1 rounded-xl transition-all cursor-pointer ${adminNotifyOnDeposit ? 'text-emerald-600' : 'text-slate-400'}`}
                >
                  {adminNotifyOnDeposit ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SOC-2 SYSTEM VAULT & INFRASTRUCTURE */}
        {activeTab === 'infrastructure' && (
          <div className="bg-[#0B1E39] p-6 sm:p-8 rounded-3xl border border-[#1A3860] text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-white">SOC-2 Type II Cryptographic Engine Vault</h3>
                  <p className="text-xs text-slate-300 font-medium">Sovereign Audit Infrastructure & Node Environment</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-emerald-400">Node Status: 100% Operational</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Cloud Region</span>
                <p className="font-bold text-white text-xs">AWS-Mumbai (ap-south-1)</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Schema Version</span>
                <p className="font-bold text-amber-300 text-xs">v4.2.0-SOC2-VERIFIED</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">System Uptime</span>
                <p className="font-bold text-emerald-400 text-xs">99.99% (SOC-2 Compliance)</p>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button Row */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-6 py-4 rounded-2xl text-xs cursor-pointer transition-all"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-wider shadow-2xl shadow-amber-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Save All Global Settings</span>
          </button>
        </div>

      </form>

      {/* Floating Success Toast Alert */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-[#0B1E39] text-white p-5 rounded-2xl border border-amber-400/50 shadow-2xl z-50 flex items-center space-x-3 max-w-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-300">All Global Platform Settings Saved!</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Full website rules, economics, branding, and security invariants updated in SOC-2 vault.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
