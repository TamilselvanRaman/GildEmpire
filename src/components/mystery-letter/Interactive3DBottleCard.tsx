'use client';

import React, { useState, useRef } from 'react';
import { DailyGoldWinner } from '@/types';
import { Sparkles, Trophy, Lock } from 'lucide-react';
import dynamic from 'next/dynamic';

const GlassBottleScene = dynamic(
  () => import('./GlassBottleScene').then((mod) => mod.GlassBottleScene),
  { ssr: false }
);

interface Interactive3DBottleCardProps {
  drawState: 'idle' | 'shaking' | 'drawing' | 'revealed';
  winner: DailyGoldWinner | null;
  activeChitCount: number;
  onTriggerDraw?: () => void;
  isLocked24h?: boolean;
  lockCountdown?: { hours: number; minutes: number; seconds: number } | null;
  isAdminView?: boolean;
}

export const Interactive3DBottleCard: React.FC<Interactive3DBottleCardProps> = ({
  drawState,
  winner,
  activeChitCount = 49,
  onTriggerDraw,
  isLocked24h = false,
  lockCountdown,
  isAdminView = false,
}) => {
  const [isStirring, setIsStirring] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStir = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStirring) return;
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 900);
  };

  const isBowlShaking = drawState === 'shaking' || isStirring;

  return (
    <div
      className={`relative w-full max-w-[440px] ${
        isAdminView ? 'h-[440px]' : 'h-[360px] sm:h-[380px]'
      } bg-[#081E26] rounded-[2.5rem] border-2 border-[#E1A238]/60 shadow-[0_25px_60px_rgba(8,30,38,0.95),0_0_40px_rgba(0,194,184,0.2)] overflow-hidden flex flex-col items-center justify-between p-4 select-none mx-auto font-serif`}
    >
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,#0D3B43_0%,#081E26_65%,#040D11_100%)]" />
        <div className="absolute left-1/2 bottom-[12%] -translate-x-1/2 w-[340px] h-[180px] bg-[radial-gradient(circle_at_50%_50%,rgba(0,194,184,0.22)_0%,rgba(225,162,56,0.15)_45%,rgba(8,30,38,0)_75%)] blur-xl pointer-events-none" />
      </div>

      {/* Top Badges (Only visible in Admin View) */}
      {isAdminView && (
        <div className="relative z-20 w-full flex items-center justify-between pointer-events-none px-1 pt-1">
          {/* Left Badge: ✦ 3D GLASS BOWL */}
          <div className="pointer-events-auto bg-gradient-to-b from-[#0D3B43]/95 to-[#081E26]/98 border border-[#E1A238]/85 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_16px_rgba(0,194,184,0.3)]">
            <svg className="w-4 h-4 text-[#00C2B8] fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
            </svg>
            <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.18em] text-[#F2C868] uppercase drop-shadow-[0_0_8px_rgba(242,200,104,0.5)]">
              3D GLASS BOWL
            </span>
          </div>

          {/* Right Badge: 49 CHITS INSIDE */}
          <div className="pointer-events-auto bg-gradient-to-b from-[#0D3B43]/95 to-[#081E26]/98 border border-[#E1A238]/85 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_16px_rgba(0,194,184,0.3)]">
            <span className="font-mono font-extrabold text-xs text-[#00C2B8] tracking-widest">{activeChitCount}</span>
            <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.18em] text-[#F2C868] uppercase drop-shadow-[0_0_8px_rgba(242,200,104,0.5)]">
              CHITS INSIDE
            </span>
          </div>
        </div>
      )}

      {/* Hero Display: 3D Crystal Glass Bowl WebGL Stage */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-1 overflow-hidden">
        <div
          ref={containerRef}
          onClick={isAdminView ? onTriggerDraw : undefined}
          className={`relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center ${
            isAdminView ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
          } transition-transform duration-300 ${
            isBowlShaking ? 'animate-bowl-shake-smooth' : ''
          }`}
        >
          {/* Interactive 3D WebGL Glass Bowl Scene with Transparent Background */}
          <GlassBottleScene
            currentState={
              isBowlShaking
                ? 'SHAKING'
                : drawState === 'drawing'
                ? 'BUILDUP'
                : drawState === 'revealed'
                ? 'REVEAL'
                : 'IDLE'
            }
            onStateTransition={() => {}}
            chitCount={activeChitCount}
            onBowlClick={isAdminView ? onTriggerDraw : undefined}
          />
        </div>
      </div>

      {/* Revealed Winner Floating Banner Overlay */}
      {drawState === 'revealed' && winner && (
        <div className="absolute bottom-16 z-30 w-[92%] bg-[#081E26]/95 backdrop-blur-xl border-2 border-[#E1A238] text-white p-4 rounded-2xl text-center shadow-[0_0_40px_rgba(225,162,56,0.5)] font-serif">
          <div className="flex items-center justify-center space-x-1 text-[#F2C868] text-xs font-black uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4 text-[#F2C868]" />
            <span>DAY {winner.dayNumber} GOLD WINNER</span>
          </div>

          <div className="text-base font-black text-white tracking-tight">
            {winner.winnerName} ({winner.winnerMemberId})
          </div>

          <div className="text-xs font-bold text-[#00C2B8] mt-0.5 font-sans">
            🏆 {winner.prizeDescription || '1 Gram 916 Gold Coin'}
          </div>
        </div>
      )}

      {/* Bottom Action Controls (Only visible in Admin View) */}
      {isAdminView && (
        <div className="relative z-20 w-full flex items-center justify-center gap-3 pt-1 pb-1">
          {/* Stir Button */}
          <button
            type="button"
            onClick={handleStir}
            className="bg-[#0D3B43]/90 hover:border-[#00C2B8] border border-[#E1A238]/70 text-[#F2C868] font-serif font-bold text-[10px] sm:text-xs tracking-widest px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C2B8]" />
            <span>STIR CHITS</span>
          </button>

          {/* Draw Button */}
          <button
            type="button"
            onClick={onTriggerDraw}
            disabled={isLocked24h || activeChitCount === 0}
            className={`font-serif font-black text-[10px] sm:text-xs tracking-[0.18em] px-6 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-xl uppercase cursor-pointer ${
              isLocked24h
                ? 'bg-[#040D11] text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00C2B8] to-[#009890] text-[#081E26] hover:brightness-110 shadow-[0_0_25px_rgba(0,194,184,0.6)] hover:scale-105 active:scale-95'
            }`}
          >
            {isLocked24h ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#E1A238]" />
                <span>
                  LOCKED ({String(lockCountdown?.hours).padStart(2, '0')}:
                  {String(lockCountdown?.minutes).padStart(2, '0')}:
                  {String(lockCountdown?.seconds).padStart(2, '0')})
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#081E26] fill-current" />
                <span>✦ DRAW A CHIT ✦</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
