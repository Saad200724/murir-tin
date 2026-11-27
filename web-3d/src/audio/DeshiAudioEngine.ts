/**
 * Procedural WebAudio Deshi Bus Sound Engine:
 * - Continuous diesel rumble synced to bus speed
 * - Multi-tone Hydraulic Air Horn ("প্যাঁ-পোঁ-প্যাঁ!")
 * - Helper metal door double-slap ("ঠক্-ঠক্!")
 * - Sparks, Combo chimes, Toll ETC chime, Train horn, Police siren, Mission fanfare, Wrench repair
 * - Ready for real Puran Dhaka voiceover clips in /voices/<id>.mp3
 */
export class DeshiAudioEngine {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private soundEnabled = true;
  private sfxVolume = 0.85;
  private engineVolume = 0.7;

  public setPreferences(soundEnabled: boolean, sfxVolume = 0.85, engineVolume = 0.7): void {
    this.soundEnabled = soundEnabled;
    this.sfxVolume = Math.max(0, Math.min(1, sfxVolume));
    this.engineVolume = Math.max(0, Math.min(1, engineVolume));
    if (!soundEnabled && this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
    }
  }

  public unlock(): void {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.ensureEngineLoop();
  }

  private ensureEngineLoop(): void {
    if (!this.ctx || this.engineOsc) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 54;
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    gain.gain.value = 0.0001;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();

    this.engineOsc = osc;
    this.engineGain = gain;
  }

  public updateEngineRumble(speed: number, isDriving: boolean, nitro: boolean): void {
    if (!this.ctx || !this.engineOsc || !this.engineGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (!this.soundEnabled || !isDriving || this.engineVolume <= 0.01) {
      this.engineGain.gain.setTargetAtTime(0.0001, now, 0.08);
      return;
    }
    const freq = 46 + speed * 1.35 + (nitro ? 24 : 0);
    const targetGain = (nitro ? 0.055 : 0.032) * this.engineVolume;
    this.engineOsc.frequency.setTargetAtTime(freq, now, 0.08);
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.08);
  }

  public pauseAll(): void {
    if (this.ctx && this.ctx.state === 'running') {
      void this.ctx.suspend();
    }
  }

  public resumeAll(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, endFreq?: number, delay = 0): void {
    if (!this.ctx || this.ctx.state !== 'running' || !this.soundEnabled || this.sfxVolume <= 0.01) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), t0 + dur);
    }
    const scaledVol = vol * this.sfxVolume;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(scaledVol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  public playHydraulicHorn(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(330, 0.13, 'sawtooth', 0.12, 315, 0);
    this.tone(415, 0.13, 'sawtooth', 0.1, 395, 0);
    this.tone(330, 0.11, 'sawtooth', 0.12, 315, 0.16);
    this.tone(415, 0.11, 'sawtooth', 0.1, 395, 0.16);
    this.tone(392, 0.24, 'sawtooth', 0.13, 360, 0.3);
    this.tone(494, 0.24, 'sawtooth', 0.1, 460, 0.3);
  }

  public playTrainHorn(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    // Deep two-chord Bangladesh Railway locomotive horn
    this.tone(185, 0.45, 'sawtooth', 0.11, 180, 0);
    this.tone(233, 0.45, 'sawtooth', 0.09, 228, 0);
    this.tone(185, 0.55, 'sawtooth', 0.12, 175, 0.52);
    this.tone(233, 0.55, 'sawtooth', 0.1, 222, 0.52);
  }

  public playPoliceSiren(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(660, 0.18, 'triangle', 0.12, 920, 0);
    this.tone(920, 0.18, 'triangle', 0.12, 660, 0.18);
  }

  public playChapaniSparks(combo = 1): void {
    if (!this.soundEnabled) return;
    this.unlock();
    const pitchBoost = Math.min(600, Math.max(0, combo - 1) * 75);
    this.tone(900 + pitchBoost, 0.09, 'triangle', 0.15, 1360 + pitchBoost, 0);
    this.tone(1220 + pitchBoost, 0.14, 'sine', 0.14, 1680 + pitchBoost, 0.06);
  }

  public playHelperDoorSlap(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(190, 0.06, 'square', 0.15, 95, 0);
    this.tone(210, 0.06, 'square', 0.15, 105, 0.09);
    this.tone(720, 0.16, 'triangle', 0.12, 980, 0.16);
  }

  public playWrenchRepair(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(440, 0.08, 'triangle', 0.14, 660, 0);
    this.tone(660, 0.14, 'sine', 0.15, 990, 0.08);
  }

  public playTollPaid(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(880, 0.1, 'sine', 0.14, 880, 0);
    this.tone(1174, 0.18, 'triangle', 0.15, 1318, 0.1);
  }

  public playBarrierSmash(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(180, 0.25, 'sawtooth', 0.2, 55, 0);
    this.tone(620, 0.18, 'triangle', 0.15, 1280, 0.05);
  }

  public playMilestoneFanfare(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(523, 0.12, 'triangle', 0.14, 523, 0);
    this.tone(659, 0.12, 'triangle', 0.14, 659, 0.11);
    this.tone(784, 0.26, 'triangle', 0.16, 1046, 0.22);
  }

  public playCrash(): void {
    if (!this.soundEnabled) return;
    this.unlock();
    this.tone(140, 0.36, 'sawtooth', 0.24, 38, 0);
    this.tone(95, 0.42, 'square', 0.18, 32, 0.03);
  }

  /**
   * Plays an optional real recorded Puran Dhaka MP3 clip from /voices/<clipId>.mp3 if present.
   */
  public playVoicePackClip(clipId: string): void {
    if (!this.soundEnabled || this.sfxVolume <= 0.01) return;
    try {
      const audio = new Audio(`./voices/${clipId}.mp3`);
      audio.volume = Math.min(1, this.sfxVolume);
      void audio.play().catch(() => {
        // Optional voicepack clip not installed yet
      });
    } catch {
      // Ignore audio element errors
    }
  }
}
