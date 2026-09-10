'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts
import { UserSidebar } from '../components/layout/UserSidebar';
import { UserHeader } from '../components/layout/UserHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { AdminHeader } from '../components/layout/AdminHeader';

// Public Pages
import { LandingPage } from '../components/public/LandingPage';
import { AboutPage } from '../components/public/AboutPage';
import { FaqPage } from '../components/public/FaqPage';
import { TermsPage } from '../components/public/TermsPage';
import { PrivacyPage } from '../components/public/PrivacyPage';
import { ContactPage } from '../components/public/ContactPage';

// Auth Pages
import { LoginPage } from '../components/auth/LoginPage';
import { RegisterPage } from '../components/auth/RegisterPage';
import { OtpPage } from '../components/auth/OtpPage';
import { ForgotPasswordPage } from '../components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../components/auth/ResetPasswordPage';
import { AdminLoginPage } from '../components/auth/AdminLoginPage';

// User Portal Pages
import { UserDashboardPage } from '../components/user/UserDashboardPage';
import { ProfilePage } from '../components/user/ProfilePage';
import { DepositOverviewPage } from '../components/user/DepositOverviewPage';
import { MyGroupPage } from '../components/user/MyGroupPage';
import { RewardSpinPage } from '../components/user/RewardSpinPage';
import { ReferralDashboardPage } from '../components/user/ReferralDashboardPage';
import { NotificationsPage } from '../components/user/NotificationsPage';
import { SettingsPage } from '../components/user/SettingsPage';
import { HelpFaqPage } from '../components/user/HelpFaqPage';
import { WalletPage } from '../components/user/WalletPage';

// Admin Pages
import { AdminDashboardPage } from '../components/admin/AdminDashboardPage';
import { AdminUsersPage } from '../components/admin/AdminUsersPage';
import { AdminDepositsPage } from '../components/admin/AdminDepositsPage';
import { AdminRewardFlowControlPage } from '../components/admin/AdminRewardFlowControlPage';
import { AdminAuditLogsPage } from '../components/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '../components/admin/AdminSettingsPage';

// System Pages
import { SystemStatesPage } from '../components/system/SystemStatesPage';

export default function Home() {
  const { currentView, setCurrentView } = useApp();
  const [showAdminToast, setShowAdminToast] = React.useState(false);

  // Check URL pathname for /admin and set up Ctrl + Alt + A keyboard shortcut
  useEffect(() => {
    // 1. Check if URL contains /admin
    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
      setCurrentView('auth-admin-login');
    }

    // 2. Global Shortcut: Ctrl + Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView('auth-admin-login');
        setShowAdminToast(true);
        setTimeout(() => setShowAdminToast(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentView]);

  // Ensure window scrolls to top on any view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const renderContent = () => {
    // 1. PUBLIC PORTAL
    if (currentView === 'public-landing') return <LandingPage />;
    if (currentView === 'public-[#2F6FED]') return <LandingPage />;
    if (currentView === 'public-about') return <AboutPage />;
    if (currentView === 'public-faq') return <FaqPage />;
    if (currentView === 'public-terms') return <TermsPage />;
    if (currentView === 'public-privacy') return <PrivacyPage />;
    if (currentView === 'public-contact') return <ContactPage />;

    // 2. AUTHENTICATION PORTAL
    if (currentView === 'auth-login') return <LoginPage />;
    if (currentView === 'auth-register') return <RegisterPage />;
    if (currentView === 'auth-otp') return <OtpPage />;
    if (currentView === 'auth-forgot') return <ForgotPasswordPage />;
    if (currentView === 'auth-reset') return <ResetPasswordPage />;
    if (currentView === 'auth-admin-login') return <AdminLoginPage />;

    // 3. MEMBER PORTAL (Wrapped with User Sidebar + Header + Mobile Bottom Nav)
    if (currentView.startsWith('user-')) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row pb-16 md:pb-0">
          <UserSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
              {currentView === 'user-dashboard' && <UserDashboardPage />}
              {(currentView === 'user-profile' || currentView === 'user-edit-profile') && <ProfilePage />}
              {(currentView.startsWith('user-deposit')) && <DepositOverviewPage />}
              {(currentView.startsWith('user-group') || currentView === 'user-my-group') && <MyGroupPage />}
              {(currentView.startsWith('user-reward') || currentView === 'user-rewards-overview' || currentView === 'user-reward-spin' || currentView === 'user-reward-history') && <RewardSpinPage />}
              {(currentView.startsWith('user-referral')) && <ReferralDashboardPage />}
              {(currentView.startsWith('user-notification')) && <NotificationsPage />}
              {(currentView === 'user-wallet' || currentView.startsWith('user-wallet')) && <WalletPage />}
              {currentView === 'user-settings' && <SettingsPage />}
              {currentView === 'user-help' && <HelpFaqPage />}
            </main>
          </div>
          <MobileBottomNav />
        </div>
      );
    }

    // 4. ADMIN PORTAL (Wrapped with Admin Sidebar + Header)
    if (currentView.startsWith('admin-')) {
      return (
        <div className="min-h-screen bg-[#071325] flex flex-col md:flex-row text-slate-100 font-sans">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
              {(currentView === 'admin-dashboard' || currentView === 'admin-overview') && <AdminDashboardPage />}
              {(currentView === 'admin-users' || currentView === 'admin-members') && <AdminUsersPage />}
              {(currentView === 'admin-deposits' || currentView === 'admin-reconciliation') && <AdminDepositsPage />}
              {(currentView.startsWith('admin-reward') || currentView === 'admin-rewards-overview' || currentView === 'admin-reward-flow') && <AdminRewardFlowControlPage />}
              {(currentView === 'admin-logs' || currentView === 'admin-audit') && <AdminAuditLogsPage />}
              {currentView === 'admin-settings' && <AdminSettingsPage />}
            </main>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex flex-col justify-center">
        <SystemStatesPage />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Shortcut Key Toast Banner */}
      <AnimatePresence>
        {showAdminToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0B1E39] text-white px-6 py-3.5 rounded-2xl border border-amber-400/40 shadow-2xl flex items-center space-x-3 text-xs font-black"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-extrabold shadow-md">
              ⚡
            </div>
            <div>
              <p className="text-amber-400 font-mono text-[10px] uppercase tracking-widest">Shortcut Triggered</p>
              <p className="text-white text-sm">Admin Control Panel Opened via <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ctrl + Alt + A</kbd></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
