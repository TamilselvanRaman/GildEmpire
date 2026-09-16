// Web Audio API and Real Audio File playback engine
class MysteryAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSpinAudio: HTMLAudioElement | null = null;
  private currentWinningAudio: HTMLAudioElement | null = null;
  private spinTimer: any = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public stopAllAudio() {
    if (this.spinTimer) {
      clearTimeout(this.spinTimer);
      this.spinTimer = null;
    }
    if (this.currentSpinAudio) {
      try {
        this.currentSpinAudio.pause();
        this.currentSpinAudio.currentTime = 0;
      } catch (e) {}
      this.currentSpinAudio = null;
    }
    if (this.currentWinningAudio) {
      try {
        this.currentWinningAudio.pause();
        this.currentWinningAudio.currentTime = 0;
      } catch (e) {}
      this.currentWinningAudio = null;
    }
  }

  // Plays spin_sound.mp3 for EXCLUSIVELY 7 SECONDS ONLY, then stops
  public playSpin7Seconds(on7sEnd?: () => void) {
    if (typeof window === 'undefined') return;
    this.stopAllAudio();

    try {
      const spinAudio = new Audio('/spin_sound.mp3');
      spinAudio.currentTime = 0;
      this.currentSpinAudio = spinAudio;

      const playPromise = spinAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Spin audio playback notice:', err);
        });
      }

      // Stop spin audio after EXACTLY 7 SECONDS (7000ms)
      this.spinTimer = setTimeout(() => {
        try {
          if (this.currentSpinAudio) {
            this.currentSpinAudio.pause();
            this.currentSpinAudio.currentTime = 0;
            this.currentSpinAudio = null;
          }
        } catch (e) {}

        // Trigger winning audio and callback
        this.playWinningSound();
        if (on7sEnd) on7sEnd();
      }, 7000);
    } catch (err) {
      console.warn('Audio play exception:', err);
      if (on7sEnd) on7sEnd();
    }
  }

  // Plays winning sound .mp3 when winner is drawn / revealed
  public playWinningSound() {
    if (typeof window === 'undefined') return;
    try {
      if (this.currentWinningAudio) {
        this.currentWinningAudio.pause();
        this.currentWinningAudio.currentTime = 0;
      }

      const winningAudio = new Audio('/winning_sound.mp3');
      winningAudio.currentTime = 0;
      this.currentWinningAudio = winningAudio;

      const playPromise = winningAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Winning audio playback notice:', err);
        });
      }
    } catch (err) {
      console.warn('Winning audio play exception:', err);
    }
  }

  public playChime(freq = 880, type: OscillatorType = 'sine', duration = 1.2, gainVal = 0.15) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  }

  public playShakeClink() {
    const freqs = [1200, 1480, 1760, 2040, 2300];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playChime(f, 'sine', 0.15, 0.08);
  }

  public playGoldenAscend() {
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
      setTimeout(() => this.playChime(f, 'sine', 1.8, 0.12), i * 140);
    });
  }

  public playRevealSparkle() {
    [880, 1174, 1396, 1760, 2093].forEach((f, i) => {
      setTimeout(() => this.playChime(f, 'triangle', 2.2, 0.15), i * 100);
    });
  }
}

export const mysteryAudio = new MysteryAudioEngine();
