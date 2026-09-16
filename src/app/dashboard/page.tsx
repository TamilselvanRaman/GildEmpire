'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function DashboardRoute() {
  const { currentView, setCurrentView } = useApp();

  useEffect(() => {
    if (currentView !== 'user-dashboard') {
      setCurrentView('user-dashboard');
    }
  }, []);

  return <Home />;
}
