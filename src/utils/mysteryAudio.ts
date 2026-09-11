// Synthesized Web Audio API sound engine for luxury acoustic feedback
class MysteryAudioEngine {
  private ctx: AudioContext | null = null;

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
