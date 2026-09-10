'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function HowItWorksRoute() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView('public-about');
  }, [setCurrentView]);

  return <Home />;
}
