'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Home from '../page';

export default function ContactRoute() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView('public-contact');
  }, [setCurrentView]);

  return <Home />;
}
