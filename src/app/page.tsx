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
import { AdminSlotsControlPage } from '../components/admin/AdminSlotsControlPage';
import { AdminGroupsOverviewPage } from '../components/admin/AdminGroupsOverviewPage';
import { AdminGroupDetailPage } from '../components/admin/AdminGroupDetailPage';
import { AdminAuditLogsPage } from '../components/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '../components/admin/AdminSettingsPage';
import { AdminReferralsPage } from '../components/admin/AdminReferralsPage';
import { AdminMobileRestrictionPage } from '../components/admin/AdminMobileRestrictionPage';

// Pre-Deployment System, Payment, Support, Legal & Error Components
import { SystemErrorPage } from '../components/system/SystemErrorPage';
import { AuthExtensionsPage } from '../components/auth/AuthExtensionsPage';
import { PaymentStatesPage } from '../components/payment/PaymentStatesPage';
import { SupportCenterPage } from '../components/support/SupportCenterPage';
import { LegalSuitePage } from '../components/public/LegalSuitePage';
import { SystemNoticePage } from '../components/system/SystemNoticePage';

// System Pages
import { SystemStatesPage } from '../components/system/SystemStatesPage';
import { Preloader } from '../components/system/Preloader';

export default function Home() {
  const { currentView, setCurrentView, isAuthenticated } = useApp();
  const [showAdminToast, setShowAdminToast] = React.useState(false);

  // Check URL pathname for /admin or /admin/login and set up Ctrl + Alt + A keyboard shortcut
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if ((path === '/admin' || path === '/admin/login') && !currentView.startsWith('admin-')) {
        setCurrentView('auth-admin-login');
      }
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
  }, [currentView, setCurrentView]);

  // Ensure window scrolls to top on any view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const renderContent = () => {
    // 1. PUBLIC PORTAL
    if (currentView === 'public-landing') return <LandingPage />;
    if (currentView === 'public-about') return <AboutPage />;
    if (currentView === 'public-faq') return <FaqPage />;
    if (currentView === 'public-terms' || currentView === 'legal-terms') return <LegalSuitePage docType="terms" />;
    if (currentView === 'public-privacy' || currentView === 'legal-privacy') return <LegalSuitePage docType="privacy" />;
    if (currentView === 'public-contact') return <ContactPage />;
    if (currentView === 'legal-cookies') return <LegalSuitePage docType="cookies" />;
    if (currentView === 'legal-refund') return <LegalSuitePage docType="refund" />;
    if (currentView === 'legal-disclaimer') return <LegalSuitePage docType="disclaimer" />;
    if (currentView === 'legal-acceptable-use') return <LegalSuitePage docType="acceptable-use" />;
    if (currentView === 'legal-grievance') return <LegalSuitePage docType="grievance" />;
    if (currentView === 'legal-data-deletion') return <LegalSuitePage docType="data-deletion" />;

    // 2. AUTHENTICATION PORTAL & EXTENSIONS
    if (currentView === 'auth-login') return <LoginPage />;
    if (currentView === 'auth-register') return <RegisterPage />;
    if (currentView === 'auth-otp') return <OtpPage />;
    if (currentView === 'auth-forgot') return <ForgotPasswordPage />;
    if (currentView === 'auth-reset') return <ResetPasswordPage />;
    if (currentView === 'auth-admin-login') return <AdminLoginPage />;
    if (currentView === 'auth-verify-email') return <AuthExtensionsPage mode="verify-email" />;
    if (currentView === 'auth-change-password') return <AuthExtensionsPage mode="change-password" />;
    if (currentView === 'auth-account-locked') return <AuthExtensionsPage mode="account-locked" />;

    // 3. PAYMENT STATES & INVOICE RECEIPT
    if (currentView === 'payment-processing') return <PaymentStatesPage status="processing" />;
    if (currentView === 'payment-success') return <PaymentStatesPage status="success" />;
    if (currentView === 'payment-failed') return <PaymentStatesPage status="failed" />;
    if (currentView === 'payment-cancelled') return <PaymentStatesPage status="cancelled" />;
    if (currentView === 'payment-invoice' || currentView === 'payment-transaction-details') return <PaymentStatesPage status="invoice" />;

    // 4. SUPPORT & HELP CENTER
    if (currentView === 'support-home') return <SupportCenterPage mode="home" />;
    if (currentView === 'support-ticket') return <SupportCenterPage mode="ticket" />;
    if (currentView === 'support-ticket-success') return <SupportCenterPage mode="ticket-success" />;

    // 5. SYSTEM NOTICES & ANNOUNCEMENTS
    if (currentView === 'system-announcements' || currentView === 'system-notice') return <SystemNoticePage />;

    // 6. SYSTEM ERROR STATES
    if (currentView === 'system-404') return <SystemErrorPage type="404" />;
    if (currentView === 'system-403') return <SystemErrorPage type="403" />;
    if (currentView === 'system-500') return <SystemErrorPage type="500" />;
    if (currentView === 'system-503') return <SystemErrorPage type="503" />;
    if (currentView === 'system-429') return <SystemErrorPage type="429" />;
    if (currentView === 'system-access-denied') return <SystemErrorPage type="access-denied" />;
    if (currentView === 'system-unauthorized') return <SystemErrorPage type="unauthorized" />;
    if (currentView === 'system-session-expired') return <SystemErrorPage type="session-expired" />;
    if (currentView === 'system-offline') return <SystemErrorPage type="offline" />;
    if (currentView === 'system-maintenance') return <SystemErrorPage type="maintenance" />;
    if (currentView === 'system-coming-soon') return <SystemErrorPage type="coming-soon" />;

    // 7. MEMBER PORTAL (Wrapped with User Sidebar + Header + Mobile Bottom Nav)
    if (currentView.startsWith('user-')) {
      const hasStoredSession = typeof window !== 'undefined' && !!localStorage.getItem('infinity_gold_user_session');
      if (!isAuthenticated && !hasStoredSession) {
        return <LoginPage />;
      }
      return (
        <div className="min-h-screen bg-[#081E26] text-white flex flex-col md:flex-row pb-16 md:pb-0">
          <UserSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
              {currentView === 'user-dashboard' && <UserDashboardPage />}
              {(currentView === 'user-profile' || currentView === 'user-edit-profile') && <ProfilePage />}
              {(currentView.startsWith('user-deposit')) && <DepositOverviewPage />}
              {(currentView.startsWith('user-group') || currentView === 'user-my-group') && <MyGroupPage />}
              {(currentView.startsWith('user-reward')) && <RewardSpinPage />}
              {(currentView.startsWith('user-referral')) && <ReferralDashboardPage />}
              {(currentView.startsWith('user-notification')) && <NotificationsPage />}
              {(currentView.startsWith('user-wallet')) && <WalletPage />}
              {currentView === 'user-settings' && <SettingsPage />}
              {currentView === 'user-help' && <HelpFaqPage />}
            </main>
          </div>
          <MobileBottomNav />
        </div>
      );
    }

    // 8. ADMIN PORTAL (Wrapped with Admin Sidebar + Header with Mobile Screen Blocker)
    if (currentView.startsWith('admin-')) {
      return (
        <>
          {/* Mobile Screen Blocker (< 1024px) */}
          <div className="block lg:hidden">
            <AdminMobileRestrictionPage />
          </div>

          {/* Laptop & Desktop Workspace (>= 1024px) */}
          <div className="hidden lg:flex min-h-screen bg-[#F8FAFC] flex-col lg:flex-row text-slate-900 font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AdminHeader />
              <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
                {currentView === 'admin-dashboard' && <AdminDashboardPage />}
                {(currentView === 'admin-users' || currentView === 'admin-user-detail' || currentView === 'admin-team') && <AdminUsersPage />}
                {(currentView === 'admin-deposits' || currentView === 'admin-deposit-review') && <AdminDepositsPage />}
                {currentView === 'admin-groups' && <AdminGroupsOverviewPage />}
                {currentView === 'admin-group-detail' && <AdminGroupDetailPage />}
                {currentView === 'admin-slots' && <AdminSlotsControlPage />}
                {currentView.startsWith('admin-reward') && <AdminRewardFlowControlPage />}
                {(currentView === 'admin-audit-logs' || currentView === 'admin-reports') && <AdminAuditLogsPage />}
                {currentView === 'admin-referrals' && <AdminReferralsPage />}
                {(currentView === 'admin-settings' || currentView === 'admin-notifications') && <AdminSettingsPage />}
              </main>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex flex-col justify-center">
        <SystemStatesPage />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#081E26] relative text-white">

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

      <AnimatePresence>
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
