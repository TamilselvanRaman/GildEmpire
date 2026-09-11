'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function CatchAllRoutePage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      
      const pathToViewMap: Record<string, string> = {
        '/': 'public-landing',
        '/how-it-works': 'public-about',
        '/about': 'public-about',
        '/faq': 'public-faq',
        '/terms': 'public-terms',
        '/privacy': 'public-privacy',
        '/contact': 'public-contact',
        '/login': 'auth-login',
        '/register': 'auth-register',
        '/admin': 'auth-admin-login',
        '/admin/dashboard': 'admin-dashboard',
        '/admin/users': 'admin-users',
        '/admin/deposits': 'admin-deposits',
        '/admin/groups': 'admin-groups',
        '/admin/groups/detail': 'admin-group-detail',
        '/admin/group-detail': 'admin-group-detail',
        '/admin/groups/GROUP-001': 'admin-group-detail',
        '/admin/groups/GROUP-002': 'admin-group-detail',
        '/admin/groups/GROUP-003': 'admin-group-detail',
        '/admin/groups/GROUP-004': 'admin-group-detail',
        '/admin/slots': 'admin-slots',
        '/admin/rewards': 'admin-rewards',
        '/admin/referrals': 'admin-referrals',
        '/admin/reports': 'admin-reports',
        '/admin/team': 'admin-team',
        '/admin/logs': 'admin-audit-logs',
        '/admin/audit-logs': 'admin-audit-logs',
        '/admin/settings': 'admin-settings',
        '/dashboard': 'user-dashboard',
        '/wallet': 'user-wallet',
        '/deposit': 'user-deposit-overview',
        '/group': 'user-my-group',
        '/rewards': 'user-rewards-overview',
        '/referral': 'user-referral-dashboard',
        '/settings': 'user-settings',
        '/help': 'support-home',
        '/404': 'system-404',
        '/403': 'system-403',
        '/500': 'system-500',
        '/503': 'system-503',
        '/429': 'system-429',
        '/access-denied': 'system-access-denied',
        '/unauthorized': 'system-unauthorized',
        '/session-expired': 'system-session-expired',
        '/offline': 'system-offline',
        '/maintenance': 'system-maintenance',
        '/coming-soon': 'system-coming-soon',
        '/verify-email': 'auth-verify-email',
        '/change-password': 'auth-change-password',
        '/account-locked': 'auth-account-locked',
        '/payment': 'user-deposit-overview',
        '/payment-processing': 'payment-processing',
        '/payment-success': 'payment-success',
        '/payment-failed': 'payment-failed',
        '/payment-cancelled': 'payment-cancelled',
        '/invoice': 'payment-invoice',
        '/transaction-details': 'payment-transaction-details',
        '/support': 'support-home',
        '/support/ticket': 'support-ticket',
        '/support/ticket-success': 'support-ticket-success',
        '/privacy-policy': 'legal-privacy',
        '/terms-conditions': 'legal-terms',
        '/cookie-policy': 'legal-cookies',
        '/refund-cancellation': 'legal-refund',
        '/disclaimer': 'legal-disclaimer',
        '/acceptable-use-policy': 'legal-acceptable-use',
        '/grievance-redressal': 'legal-grievance',
        '/data-deletion': 'legal-data-deletion',
        '/announcements': 'system-announcements',
        '/system-notice': 'system-notice',
      };

      const matchedView = pathToViewMap[path];
      if (matchedView) {
        setCurrentView(matchedView as any);
      }
    }
  }, [setCurrentView]);

  return <Home />;
}
