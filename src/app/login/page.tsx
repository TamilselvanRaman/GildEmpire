'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function LoginRoute() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView('auth-login');
  }, [setCurrentView]);

  return <Home />;
}
