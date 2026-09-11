'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import Home from '../../page';

export default function AdminLoginRoute() {
  const { currentView, setCurrentView } = useApp();

  useEffect(() => {
    if (!currentView.startsWith('admin-')) {
      setCurrentView('auth-admin-login');
    }
  }, [currentView, setCurrentView]);

  return <Home />;
}
