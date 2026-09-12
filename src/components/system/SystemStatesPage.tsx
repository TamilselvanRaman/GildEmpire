'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Lock, Server, WifiOff, RefreshCw, Layers, CheckCircle2, Info, AlertCircle, XCircle } from 'lucide-react';

export const SystemStatesPage = () => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'404' | '403' | '500' | 'session' | 'network' | 'empty' | 'loading' | 'toast'>('404');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info', text: string } | null>(null);

  const triggerToast = (type: 'success' | 'error' | 'warning' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <span>System Views, Edge States & Feedback Systems</span>
          </h1>
          <p className="text-xs text-slate-500">Inspect error pages, session timeouts, empty data placeholders, skeleton loaders, and toast alerts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <button onClick={() => setActiveTab('404')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === '404' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>404 Not Found</button>
        <button onClick={() => setActiveTab('403')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === '403' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>403 Access Denied</button>
        <button onClick={() => setActiveTab('500')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === '500' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>500 Server Error</button>
        <button onClick={() => setActiveTab('session')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === 'session' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Session Expired</button>
        <button onClick={() => setActiveTab('network')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === 'network' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Network Offline</button>
        <button onClick={() => setActiveTab('empty')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === 'empty' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Empty State</button>
        <button onClick={() => setActiveTab('loading')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === 'loading' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Skeleton Loaders</button>
        <button onClick={() => setActiveTab('toast')} className={`px-3 py-1.5 rounded-lg font-bold ${activeTab === 'toast' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Toast Alerts</button>
      </div>

      {/* Render Active View State */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs min-h-[340px] flex items-center justify-center relative">
        
        {activeTab === '404' && (
          <div className="text-center space-y-3 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto text-xl font-mono font-extrabold">
              404
            </div>
            <h3 className="text-lg font-bold text-slate-900">Requested Page Not Found</h3>
            <p className="text-xs text-slate-500">The URL you navigated to does not exist or may have been moved within the platform.</p>
            <button onClick={() => setCurrentView('user-dashboard')} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Return to Dashboard</button>
          </div>
        )}

        {activeTab === '403' && (
          <div className="text-center space-y-3 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">403 - Permission Restricted</h3>
            <p className="text-xs text-slate-500">You require Super Admin or Operations role clearance to access this module.</p>
            <button onClick={() => setCurrentView('user-dashboard')} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Return to Dashboard</button>
          </div>
        )}

        {activeTab === '500' && (
          <div className="text-center space-y-3 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <Server className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">500 - Internal Engine Exception</h3>
            <p className="text-xs text-slate-500">Our automated monitoring alert system has logged this incident. Please retry in a few moments.</p>
            <button onClick={() => setCurrentView('user-dashboard')} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Reload System</button>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 text-center space-y-3 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Session Security Expiration</h3>
            <p className="text-xs text-slate-300">Your enterprise session has expired after 15 minutes of inactivity for compliance protection.</p>
            <button onClick={() => setCurrentView('auth-login')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs">Re-authenticate Now</button>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="w-full space-y-3">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center justify-between text-xs text-rose-900">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4 text-rose-600" />
                <span><strong>Connection Interrupted:</strong> Unable to connect to bank UTR reconciliation engine.</span>
              </div>
              <button className="bg-rose-600 text-white px-3 py-1 rounded-lg font-bold">Retry</button>
            </div>
          </div>
        )}

        {activeTab === 'empty' && (
          <div className="text-center space-y-2 py-8">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Records Found</h4>
            <p className="text-xs text-slate-400">There are currently no active items matching your query.</p>
          </div>
        )}

        {activeTab === 'loading' && (
          <div className="w-full space-y-4">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3 animate-pulse"></div>
            <div className="h-20 bg-slate-100 rounded-xl w-full animate-pulse"></div>
            <div className="h-20 bg-slate-100 rounded-xl w-full animate-pulse"></div>
          </div>
        )}

        {activeTab === 'toast' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-600 font-medium">Click buttons below to trigger toast notification banners:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => triggerToast('success', '₹10,000 Deposit verified successfully!')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Success Toast</button>
              <button onClick={() => triggerToast('error', 'Invalid UTR reference number entered.')} className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Error Toast</button>
              <button onClick={() => triggerToast('warning', 'Group filling fast: 3 slots remaining!')} className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold">Warning Toast</button>
              <button onClick={() => triggerToast('info', 'Day 15 daily gold spin scheduled for 18:00 IST.')} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Info Toast</button>
            </div>
          </div>
        )}

      </div>

      {/* Floating Toast Notification Preview */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2 z-50 text-white ${
          toastMessage.type === 'success' ? 'bg-emerald-600' : toastMessage.type === 'error' ? 'bg-rose-600' : toastMessage.type === 'warning' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {toastMessage.type === 'error' && <XCircle className="w-4 h-4" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
};
