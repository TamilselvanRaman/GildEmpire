'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  WifiOff, 
  Clock, 
  Lock, 
  RotateCcw, 
  Home, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ServerCrash, 
  Activity, 
  Search,
  Key,
  UserX,
  Construction,
  Hourglass
} from 'lucide-react';
import { motion } from 'framer-motion';

export type ErrorType = 
  | '404'
  | '403'
  | '500'
  | '503'
  | '429'
  | 'access-denied'
  | 'unauthorized'
  | 'session-expired'
  | 'offline'
  | 'maintenance'
  | 'coming-soon';

interface Props {
  type?: ErrorType;
}

export const SystemErrorPage: React.FC<Props> = ({ type = '404' }) => {
  const { setCurrentView } = useApp();
  const [activeType, setActiveType] = useState<ErrorType>(type);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    setActiveType(type);
  }, [type]);

  const handleReconnect = () => {
    setIsReconnecting(true);
    setTimeout(() => {
      setIsReconnecting(false);
      setCurrentView('public-landing');
    }, 1500);
  };

  const getErrorContent = () => {
    switch (activeType) {
      case '404':
        return {
          code: '404',
          badge: 'PAGE NOT FOUND',
          badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          title: 'The Sovereign Route Does Not Exist',
          description: 'The requested page URL might have been moved, renamed, or is temporarily unavailable under audit verification protocols.',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          primaryBtn: 'Return to Homepage',
          primaryAction: () => setCurrentView('public-landing'),
          secondaryBtn: 'View 50-Member Groups',
          secondaryAction: () => setCurrentView('user-my-group'),
          showSearch: true,
        };
      case '403':
      case 'access-denied':
        return {
          code: '403',
          badge: 'SECURITY ACCESS DENIED',
          badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          title: 'Restricted Security Clearance Required',
          description: 'Access to this administrative or vault module is restricted. Your current account role does not hold the required SOC-2 permission level.',
          icon: Lock,
          iconColor: 'text-rose-400',
          primaryBtn: 'Return to Member Dashboard',
          primaryAction: () => setCurrentView('user-dashboard'),
          secondaryBtn: 'Admin Re-Login',
          secondaryAction: () => setCurrentView('auth-admin-login'),
        };
      case 'unauthorized':
      case 'session-expired':
        return {
          code: '401',
          badge: 'SESSION EXPIRED',
          badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          title: 'Your Security Token Has Expired',
          description: 'For your security and asset protection, your active session timed out after period of inactivity. Please re-authenticate your account.',
          icon: Key,
          iconColor: 'text-purple-400',
          primaryBtn: 'Log In Again',
          primaryAction: () => setCurrentView('auth-login'),
          secondaryBtn: 'Back to Landing',
          secondaryAction: () => setCurrentView('public-landing'),
        };
      case '500':
        return {
          code: '500',
          badge: 'INTERNAL SERVER ERROR',
          badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
          title: 'Unexpected Audit Engine Failure',
          description: 'Our sovereign cluster encountered a temporary data verification anomaly. The incident log has been dispatched to engineering automatically.',
          icon: ServerCrash,
          iconColor: 'text-red-400',
          primaryBtn: 'Retry Connection',
          primaryAction: () => handleReconnect(),
          secondaryBtn: 'Support Hotline',
          secondaryAction: () => setCurrentView('support-home'),
        };
      case '503':
      case 'maintenance':
        return {
          code: '503',
          badge: 'SCHEDULED SYSTEM MAINTENANCE',
          badgeColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          title: 'Sovereign Audit Vault Upgrading',
          description: 'GildEmpire is performing routine 50-day cycle database optimization and daily gold audit sync. Platform access will resume shortly.',
          icon: Construction,
          iconColor: 'text-blue-400',
          primaryBtn: 'Check System Status',
          primaryAction: () => setCurrentView('system-states'),
          secondaryBtn: 'Return to Home',
          secondaryAction: () => setCurrentView('public-landing'),
        };
      case '429':
        return {
          code: '429',
          badge: 'RATE LIMIT EXCEEDED',
          badgeColor: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          title: 'Too Many Requests Sent',
          description: 'You have exceeded the maximum API request threshold. Please wait 60 seconds before initiating further deposit or spin actions.',
          icon: Hourglass,
          iconColor: 'text-orange-400',
          primaryBtn: 'Cooldown & Retry',
          primaryAction: () => handleReconnect(),
          secondaryBtn: 'Member Dashboard',
          secondaryAction: () => setCurrentView('user-dashboard'),
        };
      case 'offline':
        return {
          code: 'OFFLINE',
          badge: 'NO INTERNET CONNECTION',
          badgeColor: 'bg-slate-500/20 border-slate-500/30 text-slate-300',
          title: 'Connection to Network Lost',
          description: 'Unable to connect to GildEmpire server. Please verify your Wi-Fi or mobile data connection and try refreshing.',
          icon: WifiOff,
          iconColor: 'text-slate-300',
          primaryBtn: isReconnecting ? 'Reconnecting...' : 'Test Connection Again',
          primaryAction: () => handleReconnect(),
          secondaryBtn: 'View FAQ',
          secondaryAction: () => setCurrentView('public-faq'),
        };
      case 'coming-soon':
        return {
          code: 'PREVIEW',
          badge: 'FEATURE COMING SOON',
          badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          title: 'Next-Gen 50-Group Cycle Engine',
          description: 'This feature is currently undergoing SOC-2 compliance testing and sovereign audit certification. Launching in the next scheduled release.',
          icon: Sparkles,
          iconColor: 'text-emerald-400',
          primaryBtn: 'Explore Live Batches',
          primaryAction: () => setCurrentView('user-my-group'),
          secondaryBtn: 'Return to Landing',
          secondaryAction: () => setCurrentView('public-landing'),
        };
    }
  };

  const content = getErrorContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#0B1E39] text-white flex flex-col justify-between p-6 sm:p-10 font-sans select-none relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Brand */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('public-landing')}>
          <div className="w-10 h-10 rounded-2xl bg-[#2F6FED] text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wider uppercase font-mono">GildEmpire</h2>
            <p className="text-[10px] text-emerald-400 font-mono font-bold">Audited Sovereign Platform</p>
          </div>
        </div>

        {/* Quick Error Code Switcher for Pre-Deployment Testing */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/80 text-[11px] font-bold font-mono">
          {(['404', '403', '500', '503', '429', 'session-expired', 'offline', 'maintenance', 'coming-soon'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeType === t ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Center Card */}
      <div className="max-w-xl mx-auto w-full my-auto py-12 relative z-10 text-center space-y-6">
        
        {/* Animated Icon Box */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-b from-[#15345E] to-[#0F284B] border border-slate-700/80 text-white flex items-center justify-center shadow-2xl mx-auto">
            <Icon className={`w-14 h-14 ${content.iconColor}`} />
          </div>
          <div className="absolute -top-3 -right-3 bg-slate-900 text-amber-400 text-xs font-mono font-black px-3 py-1 rounded-full border border-amber-400/40 shadow-md">
            {content.code}
          </div>
        </motion.div>

        <div className="space-y-3">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono font-black tracking-wider ${content.badgeColor}`}>
            <span>{content.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {content.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-medium">
            {content.description}
          </p>
        </div>

        {/* Optional Search Bar for 404 Page */}
        {content.showSearch && (
          <div className="max-w-sm mx-auto relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search website pages or help articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#102747] border border-[#1A3860] text-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={content.primaryAction}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>{content.primaryBtn}</span>
          </button>

          <button
            onClick={content.secondaryAction}
            className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs py-3.5 px-6 rounded-2xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{content.secondaryBtn}</span>
          </button>
        </div>

      </div>

      {/* Footer System Audit Note */}
      <div className="relative z-10 text-center text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 pt-6">
        <p>© 2026 GILDEMPIRE SOVEREIGN ENGINE &bull; ALL RIGHTS RESERVED</p>
        <p>AUDIT INCIDENT TRACKER: <span className="text-amber-400">TRK-9048-SEC</span></p>
      </div>

    </div>
  );
};
