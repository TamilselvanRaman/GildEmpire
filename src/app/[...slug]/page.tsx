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
        '/admin/rewards': 'admin-rewards',
        '/admin/logs': 'admin-logs',
        '/admin/settings': 'admin-settings',
        '/dashboard': 'user-dashboard',
        '/wallet': 'user-wallet',
        '/deposit': 'user-deposit-overview',
        '/group': 'user-my-group',
        '/rewards': 'user-rewards-overview',
        '/referral': 'user-referral-dashboard',
        '/settings': 'user-settings',
        '/help': 'user-help',
      };

      const matchedView = pathToViewMap[path];
      if (matchedView) {
        setCurrentView(matchedView as any);
      }
    }
  }, [setCurrentView]);

  return <Home />;
}
