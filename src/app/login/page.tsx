'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function LoginRoute() {
  const { currentView, setCurrentView } = useApp();

  useEffect(() => {
    if (!currentView.startsWith('user-') && currentView !== 'public-landing') {
      setCurrentView('auth-login');
    }
  }, []);

  return <Home />;
}
