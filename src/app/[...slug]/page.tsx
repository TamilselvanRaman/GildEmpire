'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function CatchAllRoutePage() {
  const { setCurrentView, setSelectedBatchId, allGroups } = useApp();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const queryBatch = searchParams.get('batch');
      const queryView = searchParams.get('view') || searchParams.get('redirect');

      // Helper to resolve batch identifier
      const resolveBatchId = (raw: string | null) => {
        if (!raw) return '';
        const clean = raw.toLowerCase().trim();
        if (clean === 'batch-a' || clean === 'a' || clean === 'group-001') return 'GROUP-001';
        if (clean === 'batch-b' || clean === 'b' || clean === 'group-002') return 'GROUP-002';
        if (clean === 'batch-c' || clean === 'c' || clean === 'group-003') return 'GROUP-003';
        if (clean === 'batch-d' || clean === 'd' || clean === 'group-004') return 'GROUP-004';
        const found = (allGroups || []).find(g => 
          g.groupId.toLowerCase() === clean || 
          g.groupName.toLowerCase().includes(clean)
        );
        return found ? found.groupId : '';
      };

      if (queryBatch) {
        const resolved = resolveBatchId(queryBatch);
        if (resolved) {
          setSelectedBatchId(resolved);
        }
      }

      // 1. Batch dynamic routes for /admin/slots, /admin/groups, /admin/rewards, /rewards
      if (path.startsWith('/admin/rewards')) {
        setCurrentView('admin-reward-flow-control');
        const segments = path.split('/').filter(Boolean);
        const batchSegment = segments[2] || queryBatch;
        const targetBatchId = resolveBatchId(batchSegment);
        if (targetBatchId) {
          setSelectedBatchId(targetBatchId);
        }
        return;
      }

      if (path.startsWith('/rewards') || path.startsWith('/mystery-letter')) {
        setCurrentView('user-reward-spin');
        const segments = path.split('/').filter(Boolean);
        const batchSegment = segments[1] || queryBatch;
        const targetBatchId = resolveBatchId(batchSegment);
        if (targetBatchId) {
          setSelectedBatchId(targetBatchId);
        }
        return;
      }

      if (path.startsWith('/admin/slots')) {
        setCurrentView('admin-slots');
        const segments = path.split('/').filter(Boolean);
        const batchSegment = segments[2] || queryBatch;
        const targetBatchId = resolveBatchId(batchSegment);
        if (targetBatchId) {
          setSelectedBatchId(targetBatchId);
        }
        return;
      }
      
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
        '/forgot-password': 'auth-forgot',
        '/forgot': 'auth-forgot',
        '/auth-forgot': 'auth-forgot',
        '/reset-password': 'auth-reset',
        '/auth-reset': 'auth-reset',
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
        '/rewards': 'user-reward-spin',
        '/mystery-letter': 'user-reward-spin',
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
        '/verify email': 'auth-verify-email',
        '/verify%20email': 'auth-verify-email',
        '/verify_email': 'auth-verify-email',
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

      if (path.startsWith('/user/') || path.startsWith('/admin/users/')) {
        setCurrentView('admin-users');
        return;
      }

      if (queryView && (queryView === 'user-reward-spin' || queryView === 'rewards')) {
        setCurrentView('user-reward-spin');
        return;
      }

      const matchedView = pathToViewMap[path];
      if (matchedView) {
        setCurrentView(matchedView as any);
      }
    }
  }, [setCurrentView, setSelectedBatchId, allGroups]);

  return <Home />;
}


