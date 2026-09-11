'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FORTUNE_MESSAGES } from '@/data/fortuneMessages';

export const MysteryLetterExperience: React.FC = () => {
  const [remainingChits] = useState<number>(49);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [drawnChitId, setDrawnChitId] = useState<number>(24);
  const [drawnFortune, setDrawnFortune] = useState<string>(
    'Fortune favors the bold. The golden path is opening for you now.'
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bowlContainerRef = useRef<HTMLDivElement>(null);
  const rippleWaveRef = useRef<HTMLDivElement>(null);
  const risingChitRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Canvas Particles Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      vx: number;
      vy: number;
      isBurst?: boolean;
      life?: number;
      decay?: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.8 + 0.8,
        baseAlpha: Math.random() * 0.7 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.15),
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.isBurst) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          if (p.life !== undefined && p.decay !== undefined) {
            p.life -= p.decay;
            p.alpha = p.life * p.baseAlpha;
          }
          if ((p.life ?? 0) <= 0) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.twinklePhase += p.twinkleSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.twinklePhase) * 0.35;

          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.2);
          grad.addColorStop(0, '#FFF5D0');
          grad.addColorStop(0.4, '#F5D76E');
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Web Audio API Audio Engine
  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playCrystalChime = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.5);
      });
    } catch {}
  };

  const playRustleSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.45;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.3);
      filter.Q.setValueAtTime(3.0, now);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
    } catch {}
  };

  const triggerRipple = () => {
    if (!rippleWaveRef.current) return;
    rippleWaveRef.current.classList.remove('opacity-0', 'scale-75');
    rippleWaveRef.current.classList.add('opacity-100', 'scale-125');
    setTimeout(() => {
      if (rippleWaveRef.current) {
        rippleWaveRef.current.classList.remove('opacity-100', 'scale-125');
        rippleWaveRef.current.classList.add('opacity-0', 'scale-75');
      }
    }, 700);
  };

  const stirChitsAction = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    playRustleSound();
    playCrystalChime();
    triggerRipple();

    if (bowlContainerRef.current) {
      bowlContainerRef.current.classList.remove('bowl-ambient');
      bowlContainerRef.current.classList.add('bowl-shaking');
    }

    setTimeout(() => {
      if (bowlContainerRef.current) {
        bowlContainerRef.current.classList.remove('bowl-shaking');
        bowlContainerRef.current.classList.add('bowl-ambient');
      }
      setIsAnimating(false);
    }, 850);
  };

  const drawChitAction = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    playRustleSound();
    playCrystalChime();
    triggerRipple();

    if (bowlContainerRef.current) {
      bowlContainerRef.current.classList.remove('bowl-ambient');
      bowlContainerRef.current.classList.add('bowl-shaking');
    }

    const randomChitNum = Math.floor(Math.random() * 49) + 1;
    const fortuneText = FORTUNES_LIST[Math.floor(Math.random() * FORTUNES_LIST.length)];

    setDrawnChitId(randomChitNum);
    setDrawnFortune(fortuneText);

    if (risingChitRef.current) {
      risingChitRef.current.classList.remove('hidden');
      risingChitRef.current.classList.remove('chit-rising-anim');
      void risingChitRef.current.offsetWidth;
      risingChitRef.current.classList.add('chit-rising-anim');
    }

    setTimeout(() => {
      if (bowlContainerRef.current) {
        bowlContainerRef.current.classList.remove('bowl-shaking');
        bowlContainerRef.current.classList.add('bowl-ambient');
      }

      setShowModal(true);

      if (typeof window !== 'undefined' && (window as unknown as { confetti?: (options: object) => void }).confetti) {
        try {
          (window as unknown as { confetti: (options: object) => void }).confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.55 },
            colors: ['#FDE68A', '#F5D76E', '#E5A922', '#FFFFFF', '#D4AF37'],
          });
        } catch {}
      }

      setIsAnimating(false);
    }, 1100);
  };

  const closeModal = () => {
    setShowModal(false);
    if (risingChitRef.current) {
      risingChitRef.current.classList.add('hidden');
      risingChitRef.current.classList.remove('chit-rising-anim');
    }
  };

  return (
    <div className="h-screen w-screen m-0 overflow-hidden select-none bg-[#050B14] text-amber-100 font-sans relative flex flex-col justify-between">
      {/* Dynamic Global Luxury Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;1,400&family=Inter:wght@400;500;600&display=swap');

        .luxury-pill-badge {
          background: radial-gradient(120% 120% at 50% 10%, rgba(20, 24, 33, 0.94) 0%, rgba(6, 11, 19, 0.98) 100%);
          border: 1.5px solid rgba(220, 180, 85, 0.85);
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.35), inset 0 0 12px rgba(245, 215, 110, 0.2);
          backdrop-filter: blur(16px);
          letter-spacing: 0.16em;
        }

        .luxury-pill-badge:hover {
          border-color: rgba(255, 235, 140, 1);
          box-shadow: 0 0 28px rgba(245, 215, 110, 0.55), inset 0 0 18px rgba(255, 235, 140, 0.35);
        }

        .gold-glow-text {
          color: #F7DF94;
          text-shadow: 0 0 14px rgba(245, 215, 110, 0.7), 0 0 28px rgba(212, 175, 55, 0.4);
        }

        .gold-primary-btn {
          background: linear-gradient(180deg, #FDE68A 0%, #F5D76E 25%, #E5A922 65%, #C98808 100%);
          box-shadow: 0 0 35px rgba(245, 200, 75, 0.65), 0 4px 18px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.7);
        }

        .gold-primary-btn:hover {
          background: linear-gradient(180deg, #FFF1B5 0%, #FDE07B 25%, #EDB12D 65%, #D6940E 100%);
          box-shadow: 0 0 50px rgba(250, 215, 95, 0.9), 0 4px 22px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.9);
          transform: translateY(-2px) scale(1.03);
        }

        .glass-pill-btn {
          background: rgba(10, 16, 26, 0.85);
          border: 1px solid rgba(220, 180, 85, 0.6);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.25), inset 0 0 12px rgba(212, 175, 55, 0.12);
          backdrop-filter: blur(14px);
        }

        .glass-pill-btn:hover {
          border-color: rgba(253, 230, 138, 0.9);
          box-shadow: 0 0 30px rgba(245, 215, 110, 0.4), inset 0 0 16px rgba(245, 215, 110, 0.2);
          transform: translateY(-2px) scale(1.03);
        }

        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.008); }
        }

        .bowl-ambient {
          animation: subtleFloat 6s ease-in-out infinite;
        }

        .bowl-shaking {
          animation: bowlShakeAnim 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes bowlShakeAnim {
          10%, 90% { transform: translate3d(-3px, 0, 0) rotate(-0.5deg); }
          20%, 80% { transform: translate3d(4px, -2px, 0) rotate(0.8deg); }
          30%, 50%, 70% { transform: translate3d(-5px, -3px, 0) rotate(-1deg); }
          40%, 60% { transform: translate3d(5px, 0, 0) rotate(1deg); }
        }

        @keyframes chitFlyOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -10%) scale(0.25) rotate(-25deg);
          }
          35% {
            opacity: 1;
            transform: translate(-50%, -65%) scale(0.7) rotate(15deg);
          }
          75% {
            transform: translate(-50%, -100%) scale(1.15) rotate(-8deg);
          }
          100% {
            opacity: 0.95;
            transform: translate(-50%, -85%) scale(1) rotate(0deg);
          }
        }

        .chit-rising-anim {
          animation: chitFlyOut 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .pedestal-aura {
          background: radial-gradient(circle at 50% 50%, rgba(245, 200, 75, 0.28) 0%, rgba(212, 160, 30, 0.12) 45%, rgba(5, 11, 20, 0) 72%);
        }

        .font-cinzel { font-family: 'Cinzel', serif; }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />

      {/* Ambient Halos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,#0D192B_0%,#07101C_50%,#03060B_100%)]" />
        <div className="absolute left-1/2 bottom-[12%] -translate-x-1/2 w-[720px] h-[340px] pedestal-aura pointer-events-none blur-2xl" />
        <div className="absolute top-[25%] left-[20%] w-96 h-96 rounded-full bg-amber-400/5 blur-[100px]" />
        <div className="absolute top-[28%] right-[18%] w-96 h-96 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-30 pt-8 px-8 md:pt-10 md:px-14 flex items-center justify-between w-full pointer-events-none">
        <div className="pointer-events-auto luxury-pill-badge px-7 py-3 md:px-8 md:py-3.5 rounded-full flex items-center gap-3.5 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FBE492] drop-shadow-[0_0_8px_rgba(251,228,146,0.9)] fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
            <circle cx="5" cy="5" r="1.5" fill="#FBE492" opacity="0.8" />
            <circle cx="19" cy="19" r="1.2" fill="#FBE492" opacity="0.7" />
          </svg>
          <span className="font-cinzel font-bold text-xs md:text-sm tracking-[0.22em] text-[#F7DF94] uppercase gold-glow-text">
            3D GLASS BOWL
          </span>
        </div>

        <div className="pointer-events-auto luxury-pill-badge px-8 py-3 md:px-9 md:py-3.5 rounded-full flex items-center gap-3 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg">
          <span className="font-cinzel font-extrabold text-sm md:text-base tracking-[0.14em] text-[#F7DF94] gold-glow-text">
            {remainingChits}
          </span>
          <span className="font-cinzel font-bold text-xs md:text-sm tracking-[0.22em] text-[#F7DF94] uppercase gold-glow-text">
            CHITS INSIDE
          </span>
        </div>
      </header>

      {/* Hero Display */}
      <main className="relative z-20 flex-1 flex items-center justify-center w-full px-4">
        <div className="relative w-full max-w-[580px] md:max-w-[680px] lg:max-w-[760px] aspect-square flex items-center justify-center select-none">
          <div ref={rippleWaveRef} className="absolute inset-0 rounded-full border-2 border-amber-300/60 scale-75 opacity-0 pointer-events-none transition-all duration-700 ease-out" />

          <div
            ref={bowlContainerRef}
            onClick={drawChitAction}
            className="relative w-full h-full flex items-center justify-center bowl-ambient cursor-pointer transition-transform duration-300"
            title="Click to draw a chit"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1C2AD0MfJHw6LS9kK56GWunbbifgCoMSI3vSt3HIoIK6OI4-7jpqeYqLJc2WYb29j1Lo4BZ8Dpk0Yo1q6DHIvOqJ1mXORD8tnbWdQ2Z8UcTGSnYFo_cNfR4NLJKWrqDfl08pNDGVB9JgSjlZDV5TZG-ndt_1tU5FMucJlFMCXHSMqUnndsHup2sMVnpNyoVdkkqWb2SCCtvC_CpYpw6ciaxWDurobyvDeLw3b9F5locvJNvXPbhOc"
              alt="3D Glass Bowl with 49 folded paper chits"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] pointer-events-auto"
              draggable="false"
            />
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-48 h-20 rounded-full bg-amber-300/10 blur-xl pointer-events-none" />
          </div>

          <div ref={risingChitRef} className="hidden absolute top-[36%] left-1/2 z-40 pointer-events-none">
            <div className="relative w-28 h-28 md:w-36 md:h-36 bg-[#F8ECD5] rounded-md shadow-[0_10px_35px_rgba(245,215,110,0.8)] border border-amber-300/80 p-3 transform rotate-6 flex flex-col justify-between items-center text-center">
              <div className="w-full border-b border-amber-800/20 pb-1 flex justify-between items-center text-[9px] font-cinzel text-amber-900 font-bold uppercase tracking-widest">
                <span>✦ DESTINY</span>
                <span>#{drawnChitId}</span>
              </div>
              <p className="font-serif italic text-[11px] md:text-xs text-amber-950 font-semibold leading-tight my-auto px-1">
                "{drawnFortune}"
              </p>
              <div className="text-[8px] font-cinzel uppercase tracking-widest text-amber-800/80 font-bold">
                BLESSED CHIT
              </div>
              <div className="absolute -inset-4 bg-amber-400/25 blur-lg -z-10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-30 pb-8 md:pb-11 px-4 flex flex-col items-center justify-center gap-3.5 w-full pointer-events-none">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 pointer-events-auto">
          <button
            type="button"
            onClick={stirChitsAction}
            aria-label="Stir the chits inside the bowl"
            className="glass-pill-btn group relative px-7 py-3 md:px-8 md:py-3.5 rounded-full text-amber-200 uppercase font-cinzel font-bold text-xs md:text-sm tracking-[0.18em] flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#F5D76E] group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="gold-glow-text">STIR THE CHITS</span>
          </button>

          <button
            type="button"
            onClick={drawChitAction}
            aria-label="Draw a lucky fortune chit"
            className="gold-primary-btn group relative px-9 py-3 md:px-10 md:py-3.5 rounded-full text-slate-950 uppercase font-cinzel font-extrabold text-xs md:text-sm tracking-[0.22em] flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-xl"
          >
            <svg className="w-4 h-4 text-slate-950 fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
            </svg>
            <span className="drop-shadow-sm font-black">✦ DRAW A CHIT ✦</span>
          </button>
        </div>

        <p className="text-[11px] md:text-xs font-cinzel tracking-[0.24em] text-amber-300/70 uppercase select-none text-center">
          CLICK TO DRAW YOUR FORTUNE CHIT • OR CLICK THE BOWL
        </p>
      </footer>

      {/* Reveal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-500">
          <div className="relative max-w-lg w-full rounded-2xl p-8 md:p-10 text-center luxury-pill-badge border-2 border-[#E5A922] shadow-[0_0_60px_rgba(229,169,34,0.45)]">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close fortune modal"
              className="absolute top-4 right-4 text-amber-300/70 hover:text-amber-100 p-2 rounded-full hover:bg-amber-400/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mx-auto w-14 h-14 mb-4 rounded-full bg-amber-400/15 flex items-center justify-center border border-[#F5D76E]/60 shadow-[0_0_20px_rgba(245,215,110,0.4)]">
              <svg className="w-7 h-7 text-[#F5D76E] fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
              </svg>
            </div>

            <span className="text-[11px] uppercase font-cinzel tracking-[0.25em] text-amber-400/80 block mb-1">
              SACRED DESTINY REVELATION
            </span>

            <h3 className="font-cinzel text-xl md:text-2xl font-bold text-[#F7DF94] mb-6 tracking-[0.14em] gold-glow-text">
              ✦ LUCKY CHIT #{drawnChitId} OF 49 ✦
            </h3>

            <div className="bg-[#F8EEDA] text-amber-950 font-serif p-6 md:p-8 rounded-xl shadow-[inset_0_2px_12px_rgba(80,50,10,0.25),0_12px_30px_rgba(0,0,0,0.5)] border border-[#C98808]/50 relative mb-7 transform -rotate-1">
              <p className="italic text-base md:text-lg leading-relaxed font-semibold text-amber-950 tracking-wide">
                "{drawnFortune}"
              </p>
              <div className="mt-4 pt-3 border-t border-amber-900/20 text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold text-amber-900/90 font-cinzel">
                ✦ Blessed Golden Chit ✦
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  setTimeout(() => stirChitsAction(), 300);
                }}
                className="gold-primary-btn px-8 py-3 rounded-full text-slate-950 font-cinzel font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
              >
                ✦ DRAW ANOTHER CHIT ✦
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FORTUNES_LIST = FORTUNE_MESSAGES;
