'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function TermsRoute() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView('public-terms');
  }, [setCurrentView]);

  return <Home />;
}
