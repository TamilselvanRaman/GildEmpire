'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode, ViewportMode } from '../../types';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ShieldCheck, 
  UserCheck, 
  Globe, 
  Sliders, 
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

export const ViewportToolbar = () => {
  const { currentView, setCurrentView, viewportMode, setViewportMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'auth' | 'user' | 'admin' | 'system'>('user');

  const screenGroups = {
    public: [
      { id: 'public-landing', label: '01. Landing / Home' },
      { id: 'public-about', label: '02. About / How It Works' },
      { id: 'public-faq', label: '03. Searchable FAQ' },
      { id: 'public-terms', label: '04. Terms & Conditions' },
      { id: 'public-privacy', label: '05. Privacy Policy' },
      { id: 'public-contact', label: '06. Contact & Support' },
    ],
    auth: [
      { id: 'auth-login', label: '07. Login (Split-Screen)' },
      { id: 'auth-register', label: '08. Register (Strength Meter)' },
      { id: 'auth-otp', label: '09. OTP Verification (6-Digit)' },
      { id: 'auth-forgot', label: '10. Forgot Password' },
      { id: 'auth-reset', label: '11. Reset Password' },
    ],
    user: [
      { id: 'user-dashboard', label: '12. Main Dashboard (50-Day Status)' },
      { id: 'user-profile', label: '13. My Profile' },
      { id: 'user-edit-profile', label: '14. Edit Profile' },
      { id: 'user-deposit-overview', label: '15. Deposit Overview' },
      { id: 'user-submit-deposit', label: '16. Submit Deposit Form' },
      { id: 'user-deposit-history', label: '17. Deposit History' },
      { id: 'user-my-group', label: '18. My Group (50-Slot Grid)' },
      { id: 'user-group-details', label: '19. Group Details' },
      { id: 'user-group-history', label: '20. Group Cycle History' },
      { id: 'user-rewards-overview', label: '21. Rewards Overview' },
      { id: 'user-reward-spin', label: '22. Daily 1g Gold Spin Prototype' },
      { id: 'user-reward-history', label: '23. Reward History (50 Winners)' },
      { id: 'user-referral-dashboard', label: '24. Referral Dashboard' },
      { id: 'user-referral-details', label: '25. Referral Details' },
      { id: 'user-notifications', label: '26. Notifications Center' },
      { id: 'user-notification-detail', label: '27. Notification Detail' },
      { id: 'user-settings', label: '28. Account & Security Settings' },
      { id: 'user-help', label: '29. Help & Support Center' },
    ],
    admin: [
      { id: 'admin-dashboard', label: '30. Admin Dashboard (8 KPIs)' },
      { id: 'admin-users', label: '31. User Management Table' },
      { id: 'admin-user-detail', label: '32. User Details Audit' },
      { id: 'admin-deposits', label: '33. Deposit Queue' },
      { id: 'admin-deposit-review', label: '34. Deposit Proof Reviewer' },
      { id: 'admin-groups', label: '35. Group Management' },
      { id: 'admin-group-detail', label: '36. Group 50-Slot Admin' },
      { id: 'admin-slots', label: '37. Slot Management Table' },
      { id: 'admin-referrals', label: '38. Referral Analytics' },
      { id: 'admin-rewards', label: '39. Gold Reward Administration' },
      { id: 'admin-reward-cycle-detail', label: '40. 50-Day Cycle Details' },
      { id: 'admin-reward-flow-control', label: '41. Daily Selection Controller' },
      { id: 'admin-notifications', label: '42. Notification Admin' },
      { id: 'admin-reports', label: '43. Reports & Export Suite' },
      { id: 'admin-audit-logs', label: '44. Enterprise Audit Logs' },
      { id: 'admin-team', label: '45. Admin Users & RBAC Roles' },
      { id: 'admin-settings', label: '46. System Rules & Config' },
    ],
    system: [
      { id: 'system-404', label: '47. 404 Page Not Found' },
      { id: 'system-403', label: '48. 403 Access Denied' },
      { id: 'system-500', label: '49. 500 Internal Server Error' },
      { id: 'system-states', label: '50. System States (Empty, Loading, Toasts)' },
    ]
  };

  const getPortalLabel = (view: ViewMode) => {
    if (view.startsWith('public-')) return { label: 'Public Site', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (view.startsWith('auth-')) return { label: 'Authentication', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (view.startsWith('user-')) return { label: 'Member Portal', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    if (view.startsWith('admin-')) return { label: 'Admin Control Panel', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { label: 'System Edge State', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const currentBadge = getPortalLabel(currentView);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand & Active Screen Selector Trigger */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-xs tracking-wider text-amber-400 uppercase">Lucky One Get Prize</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="max-w-[200px] sm:max-w-[280px] truncate">
                {currentView}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${currentBadge.color}`}>
                {currentBadge.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Drawer for 54 Screens */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-[340px] sm:w-[480px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select View (54 Prototype Screens)</span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded">50-Day Gold Cycle Enabled</span>
                </div>

                {/* Category Pills */}
                <div className="flex space-x-1 mb-3 overflow-x-auto pb-1">
                  <button 
                    onClick={() => setActiveTab('public')} 
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === 'public' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Public (6)
                  </button>
                  <button 
                    onClick={() => setActiveTab('auth')} 
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === 'auth' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Auth (5)
                  </button>
                  <button 
                    onClick={() => setActiveTab('user')} 
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    User (18)
                  </button>
                  <button 
                    onClick={() => setActiveTab('admin')} 
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Admin (17)
                  </button>
                  <button 
                    onClick={() => setActiveTab('system')} 
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === 'system' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    System (4)
                  </button>
                </div>

                {/* Screen Links Grid */}
                <div className="grid grid-cols-1 gap-1">
                  {screenGroups[activeTab].map(screen => (
                    <button
                      key={screen.id}
                      onClick={() => {
                        setCurrentView(screen.id as ViewMode);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${
                        currentView === screen.id 
                          ? 'bg-blue-600 text-white font-medium shadow-sm' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{screen.label}</span>
                      {currentView === screen.id && <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Viewport Width Controls */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewportMode === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1440px</span>
          </button>

          <button
            onClick={() => setViewportMode('tablet')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewportMode === 'tablet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet 1024px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1024px</span>
          </button>

          <button
            onClick={() => setViewportMode('mobile')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewportMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile 390px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">390px</span>
          </button>
        </div>

      </div>
    </header>
  );
};
