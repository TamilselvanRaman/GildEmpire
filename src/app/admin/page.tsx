'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function AdminPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView('auth-admin-login');
  }, [setCurrentView]);

  return <Home />;
}
