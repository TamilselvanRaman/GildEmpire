'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MysteryLetterExperience = dynamic(
  () => import('@/components/mystery-letter/MysteryLetterExperience').then((mod) => mod.MysteryLetterExperience),
  { ssr: false }
);

export default function MysteryLetterPage() {
  return <MysteryLetterExperience />;
}
