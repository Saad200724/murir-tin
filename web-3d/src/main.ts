import './styles/main.css';
import { DeshiAudioEngine } from './audio/DeshiAudioEngine';
import { BUS_SKINS, UPGRADES, getUpgradeCost } from './core/GarageCatalog';
import {
  fetchLeaderboard,
  submitLeaderboardScore,
  type LeaderboardEntry,
} from './core/LeaderboardClient';
import { RoadSimulation, getViralTitle, type InputState } from './core/RoadSimulation';
import { SaveStore } from './core/SaveStore';
import { DhakaWorld3D } from './scene/DhakaWorld3D';
import { wireNativeDialogs } from './ui/DialogHelpers';
import { renderMemeScorecard } from './ui/ScorecardCanvas';

class MurirTinApp {
  private readonly store = new SaveStore();
  private readonly audio = new DeshiAudioEngine();
  private world!: DhakaWorld3D;
  private sim!: RoadSimulation;

  private isPlaying = false;
  private isPaused = false;
  private modalPaused = false;
  private lastTime = 0;
  private calloutTimeout = 0;
  private flashTimeout = 0;

  private bankedTakaInRun = 0;
  private isSubmittingScore = false;
  private scoreSubmittedForRun = false;

  private readonly keys = new Set<string>();
  private touchSteer = 0;
  private touchBrake = false;
  private touchNitro = false;
  private dragPointerId: number | null = null;
  private dragLastX = 0;
  private dragSteerVelocity = 0;

  // DOM Elements
  private readonly stageEl = document.getElementById('game-stage')!;
  private readonly screenFlashEl = document.getElementById('screen-flash')!;
  private readonly floatingFxEl = document.getElementById('floating-fx')!;
  private readonly titleOverlay = document.getElementById('title-overlay')!;
  private readonly driveControls = document.getElementById('drive-controls')!;
  private readonly helperCallout = document.getElementById('helper-callout')!;
  private readonly helperCalloutText = document.getElementById('helper-callout-text')!;

  private readonly hudTaka = document.getElementById('hud-taka')!;
  private readonly hudScore = document.getElementById('hud-score')!;
  private readonly hudHealth = document.getElementById('hud-health')!;
  private readonly hudPax = document.getElementById('hud-pax')!;
  private readonly hudStopLabel = document.getElementById('hud-stop-label')!;
  private readonly hudSpeed = document.getElementById('hud-speed')!;
  private readonly hudCombo = document.getElementById('hud-combo')!;
  private readonly hudNitroFill = document.getElementById('hud-nitro-fill') as HTMLElement;

  private readonly titleNameInput = document.getElementById('input-player-name-title') as HTMLInputElement;
  private readonly gameoverNameInput = document.getElementById('input-player-name-gameover') as HTMLInputElement;
  private readonly submitStatusEl = document.getElementById('leaderboard-submit-status')!;
  private readonly submitBtn = document.getElementById('btn-submit-score') as HTMLButtonElement;
  private readonly reviveBtn = document.getElementById('btn-revive-mistry') as HTMLButtonElement;

  private readonly garageDialog = document.getElementById('garage-dialog') as HTMLDialogElement;
  private readonly gameoverDialog = document.getElementById('gameover-dialog') as HTMLDialogElement;
  private readonly settingsDialog = document.getElementById('settings-dialog') as HTMLDialogElement;
  private readonly leaderboardDialog = document.getElementById('leaderboard-dialog') as HTMLDialogElement;
  private readonly scorecardCanvas = document.getElementById('scorecard-canvas') as HTMLCanvasElement;

  public async init(): Promise<void> {
    wireNativeDialogs();

    this.world = new DhakaWorld3D(this.stageEl);
    this.createSimulationFromSave();
    this.bindControls();
    this.setupLifecyclePause();
    this.syncNameInputs();
    this.refreshTitleStats();
    this.refreshHud();

    await this.world.preloadModels();
    this.world.setBusSkin(this.store.get().selectedSkin);
    this.world.sync(this.sim, 0.016);

    window.addEventListener('resize', () => this.world.resize());
    this.startLoop();
  }

  private createSimulationFromSave(): void {
    const s = this.store.get();
    this.sim = new RoadSimulation(s.engineLevel, s.armorLevel, s.nitroLevel);
    this.bankedTakaInRun = 0;
    this.scoreSubmittedForRun = false;
    this.audio.setPreferences(s.soundEnabled, s.voiceCalloutsEnabled);
  }

  private clearActiveInputs(): void {
    this.keys.clear();
    this.touchSteer = 0;
    this.touchBrake = false;
    this.touchNitro = false;
    this.dragPointerId = null;
    this.dragSteerVelocity = 0;
  }

  private anyDialogOpen(): boolean {
    return (
      this.garageDialog.open ||
      this.gameoverDialog.open ||
      this.settingsDialog.open ||
      this.leaderboardDialog.open
    );
  }

  private isTypingInInput(): boolean {
    const el = document.activeElement;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
  }

  private syncNameInputs(): void {
    const name = this.store.get().playerName;
    if (this.titleNameInput.value !== name) this.titleNameInput.value = name;
    if (this.gameoverNameInput.value !== name) this.gameoverNameInput.value = name;
  }

  private savePlayerName(raw: string): string {
    const cleaned = raw.replace(/[\u0000-\u001F\u007F<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
    this.store.update((d) => {
      d.playerName = cleaned;
    });
    this.syncNameInputs();
    return cleaned;
  }

  private setupLifecyclePause(): void {
    const onSkip = (skipped: boolean) => {
      this.isPaused = skipped;
      if (skipped) {
        this.clearActiveInputs();
        this.audio.pauseAll();
      } else {
        this.lastTime = performance.now();
        this.audio.resumeAll();
      }
    };

    if ('contentVisibility' in document.documentElement.style) {
      this.stageEl.addEventListener('contentvisibilityautostatechange', (e) => {
        onSkip((e as Event & { skipped: boolean }).skipped);
      });
    } else if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) onSkip(!entry.isIntersecting);
        },
        { rootMargin: '200px' }
      );
      obs.observe(this.stageEl);
    }

    document.addEventListener('visibilitychange', () => onSkip(document.hidden));
    window.addEventListener('blur', () => {
      this.clearActiveInputs();
    });
  }

  private bindControls(): void {
    const startRun = () => {
      if (this.titleNameInput.value.trim()) {
        this.savePlayerName(this.titleNameInput.value);
      }
      this.audio.unlock();
      this.audio.playHydraulicHorn();
      this.clearActiveInputs();
      this.world.resetEffects();
      this.createSimulationFromSave();
      this.world.setBusSkin(this.store.get().selectedSkin);
      this.titleOverlay.classList.add('hidden');
      this.driveControls.classList.remove('hidden');
      this.isPlaying = true;
      this.showCallout('ওস্তাদ বামে চাপান! পদ্মা সেতু টোল ৳২৫০ তুলুন!', true);
    };

    document.getElementById('btn-start-drive')!.addEventListener('click', startRun);

    this.titleNameInput.addEventListener('change', () => {
      this.savePlayerName(this.titleNameInput.value);
    });

    const openGarage = () => {
      this.modalPaused = true;
      this.clearActiveInputs();
      this.renderGarage();
      this.garageDialog.showModal();
    };
    document.getElementById('btn-open-garage-title')!.addEventListener('click', openGarage);
    document.getElementById('btn-garage')!.addEventListener('click', openGarage);

    const openLeaderboard = () => {
      this.modalPaused = true;
      this.clearActiveInputs();
      this.leaderboardDialog.showModal();
      void this.loadAndRenderLeaderboard();
    };
    document.getElementById('btn-leaderboard')!.addEventListener('click', openLeaderboard);
    document.getElementById('btn-open-leaderboard-title')!.addEventListener('click', openLeaderboard);
    document.getElementById('btn-open-lb-gameover')!.addEventListener('click', () => {
      this.leaderboardDialog.showModal();
      void this.loadAndRenderLeaderboard();
    });
    document.getElementById('btn-refresh-lb')!.addEventListener('click', () => {
      void this.loadAndRenderLeaderboard();
    });

    document.getElementById('btn-settings')!.addEventListener('click', () => {
      this.modalPaused = true;
      this.clearActiveInputs();
      const s = this.store.get();
      (document.getElementById('toggle-sfx') as HTMLInputElement).checked = s.soundEnabled;
      (document.getElementById('toggle-voice') as HTMLInputElement).checked = s.voiceCalloutsEnabled;
      this.settingsDialog.showModal();
    });

    this.garageDialog.addEventListener('close', () => {
      this.modalPaused = this.anyDialogOpen();
      if (!this.isPlaying) {
        this.createSimulationFromSave();
        this.refreshHud();
      }
      this.lastTime = performance.now();
    });
    this.settingsDialog.addEventListener('close', () => {
      this.modalPaused = this.anyDialogOpen();
      this.lastTime = performance.now();
    });
    this.leaderboardDialog.addEventListener('close', () => {
      this.modalPaused = this.anyDialogOpen();
      this.lastTime = performance.now();
    });

    // Keyboard controls (ignored while typing or modal open)
    window.addEventListener('keydown', (e) => {
      if (this.isTypingInInput() || this.anyDialogOpen()) return;
      this.keys.add(e.code);
      if (e.code === 'Space' && this.isPlaying && !this.sim.crashed) {
        e.preventDefault();
        this.triggerHorn();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Touch / Mouse Hold Steering Buttons
    const bindHold = (id: string, onDown: () => void, onUp: () => void) => {
      const el = document.getElementById(id)!;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.audio.unlock();
        onDown();
      });
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
      el.addEventListener('pointerleave', onUp);
    };

    bindHold('btn-left', () => (this.touchSteer = -1), () => {
      if (this.touchSteer === -1) this.touchSteer = 0;
    });
    bindHold('btn-right', () => (this.touchSteer = 1), () => {
      if (this.touchSteer === 1) this.touchSteer = 0;
    });
    bindHold('btn-brake', () => (this.touchBrake = true), () => (this.touchBrake = false));
    bindHold('btn-nitro', () => (this.touchNitro = true), () => (this.touchNitro = false));

    document.getElementById('btn-horn')!.addEventListener('click', () => this.triggerHorn());

    // Smooth drag-steering on the 3D road
    this.stageEl.addEventListener('pointerdown', (e) => {
      if (!this.isPlaying || this.sim.crashed || this.anyDialogOpen()) return;
      this.audio.unlock();
      this.dragPointerId = e.pointerId;
      this.dragLastX = e.clientX;
    });
    this.stageEl.addEventListener('pointermove', (e) => {
      if (this.dragPointerId !== e.pointerId || !this.isPlaying) return;
      const dx = e.clientX - this.dragLastX;
      this.dragLastX = e.clientX;
      this.dragSteerVelocity = Math.max(-1, Math.min(1, this.dragSteerVelocity + dx * 0.045));
    });
    const endDrag = (e: PointerEvent) => {
      if (this.dragPointerId === e.pointerId) {
        this.dragPointerId = null;
      }
    };
    this.stageEl.addEventListener('pointerup', endDrag);
    this.stageEl.addEventListener('pointercancel', endDrag);

    // Game Over Actions
    document.getElementById('btn-retry-now')!.addEventListener('click', () => {
      this.gameoverDialog.close();
      this.clearActiveInputs();
      this.world.resetEffects();
      this.createSimulationFromSave();
      this.isPlaying = true;
      this.audio.playHydraulicHorn();
      this.showCallout('নতুন ট্রিপ শুরু! বামে চাপান ওস্তাদ!', false);
    });

    this.reviveBtn.addEventListener('click', () => {
      if (!this.sim.revive()) return;
      this.gameoverDialog.close();
      this.clearActiveInputs();
      this.isPlaying = true;
      this.audio.playHelperDoorSlap();
      this.showCallout('ধোলাইখাল মিস্ত্রি ঠিক করে দিছে! আবার চালান!', false);
    });

    document.getElementById('leaderboard-submit-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.submitCurrentScore(false);
    });

    document.getElementById('btn-download-card')!.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `murir-tin-score-${this.sim.score}.png`;
      link.href = this.scorecardCanvas.toDataURL('image/png');
      link.click();
      document.getElementById('share-feedback')!.textContent = 'মিম কার্ড ডাউনলোড হয়েছে!';
    });

    document.getElementById('btn-copy-flex')!.addEventListener('click', async () => {
      const namePrefix = this.store.get().playerName ? `${this.store.get().playerName}: ` : '';
      const txt = `🚌 ${namePrefix}মুড়ির টিন 3D-তে আমার স্কোর ${this.sim.score} (${getViralTitle(this.sim.score)})! পদ্মা সেতু পার: ${this.sim.padmaCrossings} বার, প্লাস্টিক ঘষা: ${this.sim.plasticScrapes}টি! সাহস থাকলে এই স্কোর ভাঙ্গো!`;
      try {
        await navigator.clipboard.writeText(txt);
        document.getElementById('share-feedback')!.textContent = 'ফেসবুক চ্যালেঞ্জ টেক্সট কপি হয়েছে!';
      } catch {
        document.getElementById('share-feedback')!.textContent = txt;
      }
    });

    // Settings
    document.getElementById('toggle-sfx')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).checked;
      this.store.update((d) => {
        d.soundEnabled = val;
      });
      this.audio.setPreferences(val, this.store.get().voiceCalloutsEnabled);
    });

    document.getElementById('toggle-voice')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).checked;
      this.store.update((d) => {
        d.voiceCalloutsEnabled = val;
      });
      this.audio.setPreferences(this.store.get().soundEnabled, val);
    });

    document.getElementById('btn-reset-save')!.addEventListener('click', () => {
      const fresh = this.store.reset();
      this.syncNameInputs();
      this.world.setBusSkin(fresh.selectedSkin);
      this.world.resetEffects();
      this.createSimulationFromSave();
      this.refreshTitleStats();
      this.refreshHud();
      this.settingsDialog.close();
    });
  }

  private triggerHorn(): void {
    this.audio.playHydraulicHorn();
    const events = this.sim.blastHorn();
    for (const ev of events) {
      this.showCallout(ev.callout, false);
      this.spawnFloatPop('+৳35 সাইড!', 'pop-green');
    }
  }

  private readInput(dt: number): InputState {
    let steer = this.touchSteer;
    if (Math.abs(this.dragSteerVelocity) > 0.01) {
      steer = this.dragSteerVelocity;
      this.dragSteerVelocity *= Math.pow(0.004, dt);
    }
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) steer = -1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) steer = 1;

    const accelerate = this.keys.has('ArrowUp') || this.keys.has('KeyW');
    const brake = this.touchBrake || this.keys.has('ArrowDown') || this.keys.has('KeyS');
    const nitro = this.touchNitro || this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    return { steer, accelerate, brake, nitro };
  }

  private startLoop(): void {
    this.lastTime = performance.now();
    const tick = (now: number) => {
      requestAnimationFrame(tick);
      if (this.isPaused) return;

      const dt = Math.min(0.05, (now - this.lastTime) / 1000);
      this.lastTime = now;

      if (this.isPlaying && !this.sim.crashed && !this.modalPaused) {
        const input = this.readInput(dt);
        const events = this.sim.step(dt, input);
        this.audio.updateEngineRumble(this.sim.speed, true, this.sim.nitroActive);

        for (const ev of events) {
          this.handleSimEvent(ev);
        }
        this.refreshHud();
      } else {
        this.audio.updateEngineRumble(0, false, false);
      }

      this.world.sync(this.sim, dt);
    };
    requestAnimationFrame(tick);
  }

  private spawnFloatPop(text: string, variant: 'pop-gold' | 'pop-green' | 'pop-crimson' = 'pop-gold'): void {
    if (this.floatingFxEl.childElementCount > 6) {
      this.floatingFxEl.firstElementChild?.remove();
    }
    const el = document.createElement('div');
    el.className = `float-pop ${variant}`;
    el.textContent = text;
    this.floatingFxEl.appendChild(el);
    window.setTimeout(() => el.remove(), 1100);
  }

  private triggerFlash(kind: 'flash-crash' | 'flash-fever'): void {
    this.screenFlashEl.className = `screen-flash ${kind}`;
    window.clearTimeout(this.flashTimeout);
    this.flashTimeout = window.setTimeout(() => {
      this.screenFlashEl.className = 'screen-flash';
    }, 240);
  }

  private handleSimEvent(ev: ReturnType<RoadSimulation['step']>[number]): void {
    const speak =
      ev.type === 'chapani' ||
      ev.type === 'toll_approaching' ||
      ev.type === 'toll_paid' ||
      ev.type === 'toll_smash' ||
      ev.type === 'bridge_complete' ||
      ev.type === 'gameover';
    this.showCallout(ev.callout, speak);

    if (ev.type === 'chapani' || ev.type === 'tesla_dodge' || ev.type === 'pit_smash') {
      this.audio.playChapaniSparks(this.sim.chapaniCombo);
      this.world.triggerSparkBurst(ev.x ?? this.sim.playerX, ev.z ?? 0, '#ffbe0b');
      this.spawnFloatPop(`+৳${ev.takaDelta}`, 'pop-gold');
    } else if (ev.type === 'fever_mode') {
      this.audio.playMilestoneFanfare();
      this.triggerFlash('flash-fever');
      this.spawnFloatPop('🔥 ১.৫x ফিভার!', 'pop-gold');
    } else if (ev.type === 'passenger_pickup' || ev.type === 'rival_win' || ev.type === 'wrench_heal') {
      this.audio.playHelperDoorSlap();
      if (ev.takaDelta > 0) this.spawnFloatPop(`+৳${ev.takaDelta}`, 'pop-green');
    } else if (ev.type === 'toll_paid') {
      this.audio.playTollPaid();
      this.spawnFloatPop('🌉 টোল ক্লিয়ার!', 'pop-green');
    } else if (ev.type === 'toll_smash') {
      this.audio.playBarrierSmash();
      this.world.triggerSparkBurst(this.sim.playerX, 0, '#00f5d4');
      this.world.triggerMinorShake();
      this.spawnFloatPop('🔥 ব্যারিকেড উড়াল!', 'pop-gold');
    } else if (ev.type === 'bridge_complete') {
      this.audio.playMilestoneFanfare();
      this.triggerFlash('flash-fever');
      this.spawnFloatPop('🌉 পদ্মা সেতু +৳300!', 'pop-green');
    } else if (ev.type === 'toll_fine' || ev.type === 'crash') {
      this.audio.playCrash();
      this.triggerFlash('flash-crash');
      this.world.triggerMinorShake();
      this.world.triggerSparkBurst(this.sim.playerX, 0, '#ef476f');
      this.spawnFloatPop('💥 -১ 🔧', 'pop-crimson');
    } else if (ev.type === 'gameover') {
      this.audio.playCrash();
      this.triggerFlash('flash-crash');
      this.world.triggerCrashBurst();
      this.onGameOver();
    }
  }

  private onGameOver(): void {
    this.isPlaying = false;
    this.clearActiveInputs();

    const newTakaDelta = Math.max(0, this.sim.takaEarned - this.bankedTakaInRun);
    this.bankedTakaInRun += newTakaDelta;

    this.store.update((d) => {
      d.taka += newTakaDelta;
      d.bestScore = Math.max(d.bestScore, this.sim.score);
      d.bestDistanceM = Math.max(d.bestDistanceM, Math.floor(this.sim.distanceM));
    });
    this.refreshTitleStats();
    this.refreshHud();

    const savedName = this.store.get().playerName;
    this.gameoverNameInput.value = savedName;
    this.reviveBtn.disabled = this.sim.revivesUsed >= 1;
    this.reviveBtn.textContent =
      this.sim.revivesUsed >= 1
        ? '🔧 ফ্রি রিভাইভ ব্যবহার হয়েছে'
        : '🔧 ধোলাইখাল ফ্রি রিভাইভ (Keep Score!)';

    renderMemeScorecard(this.scorecardCanvas, {
      playerName: savedName,
      score: this.sim.score,
      distanceM: this.sim.distanceM,
      takaEarned: this.sim.takaEarned,
      plasticScrapes: this.sim.plasticScrapes,
      teslaDodges: this.sim.teslaDodges,
      passengers: this.sim.passengers,
      stopName: this.sim.getCurrentStopName(),
      padmaCrossings: this.sim.padmaCrossings,
      totalTollPaid: this.sim.totalTollPaid,
    });
    document.getElementById('share-feedback')!.textContent = '';

    if (savedName && !this.scoreSubmittedForRun) {
      this.submitStatusEl.textContent = 'লাইভ পয়েন্ট টেবিলে স্কোর সেভ হচ্ছে...';
      void this.submitCurrentScore(true);
    } else {
      this.submitStatusEl.textContent = 'নাম লিখে 💾 সেভ চাপলেই বিশ্ব লাইভ টেবিলে উঠবে!';
      this.submitBtn.disabled = false;
    }

    window.setTimeout(() => {
      if (!this.gameoverDialog.open) {
        this.gameoverDialog.showModal();
      }
    }, 480);
  }

  private async submitCurrentScore(isAuto: boolean): Promise<void> {
    if (this.isSubmittingScore) return;
    const rawName = this.gameoverNameInput.value;
    const name = this.savePlayerName(rawName);
    if (!name) {
      if (!isAuto) {
        this.submitStatusEl.textContent = 'দয়া করে আপনার নাম লিখুন!';
        this.gameoverNameInput.focus();
      }
      return;
    }

    this.isSubmittingScore = true;
    this.submitBtn.disabled = true;
    this.submitStatusEl.textContent = 'সেভ হচ্ছে...';

    // Re-render scorecard with the player's entered name so downloaded PNG includes it!
    renderMemeScorecard(this.scorecardCanvas, {
      playerName: name,
      score: this.sim.score,
      distanceM: this.sim.distanceM,
      takaEarned: this.sim.takaEarned,
      plasticScrapes: this.sim.plasticScrapes,
      teslaDodges: this.sim.teslaDodges,
      passengers: this.sim.passengers,
      stopName: this.sim.getCurrentStopName(),
      padmaCrossings: this.sim.padmaCrossings,
      totalTollPaid: this.sim.totalTollPaid,
    });

    try {
      const res = await submitLeaderboardScore({
        name,
        score: this.sim.score,
        distanceM: Math.floor(this.sim.distanceM),
        stopName: this.sim.getCurrentStopName(),
        padmaCrossings: this.sim.padmaCrossings,
      });
      this.scoreSubmittedForRun = true;
      const rankLabel = res.rank ? `#${res.rank}` : 'টপ ৫০';
      this.submitStatusEl.textContent = res.isNewBest
        ? `✅ লাইভ টেবিলে সেভ হয়েছে! আপনার র‍্যাংক: ${rankLabel} 🎉`
        : `✅ র‍্যাংক ${rankLabel} (আপনার আগের বেস্ট স্কোর আরও বেশি!)`;
    } catch (err) {
      this.submitStatusEl.textContent =
        err instanceof Error ? `⚠️ সেভ ব্যর্থ: ${err.message}` : '⚠️ নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন';
    } finally {
      this.isSubmittingScore = false;
      this.submitBtn.disabled = false;
    }
  }

  private async loadAndRenderLeaderboard(): Promise<void> {
    const metaEl = document.getElementById('lb-meta')!;
    const tbody = document.getElementById('lb-tbody')!;
    const jsonLink = document.getElementById('lb-json-link') as HTMLAnchorElement;
    metaEl.textContent = 'লাইভ ডাটা আনা হচ্ছে...';
    tbody.innerHTML = '';

    try {
      const data = await fetchLeaderboard();
      const myName = this.store.get().playerName.trim().toLowerCase();
      metaEl.textContent = `মোট ${data.entries.length} জন ওস্তাদ • আপডেট: ${new Date(data.updatedAt).toLocaleTimeString('bn-BD')}`;
      if (data.jsonUrl) {
        jsonLink.href = data.jsonUrl;
        jsonLink.classList.remove('hidden');
      } else {
        jsonLink.classList.add('hidden');
      }

      if (data.entries.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'এখনো কেউ স্কোর সেভ করেনি — আপনিই প্রথম ওস্তাদ হোন!';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      data.entries.forEach((entry: LeaderboardEntry, idx: number) => {
        const tr = document.createElement('tr');
        if (myName && entry.name.toLowerCase() === myName) {
          tr.classList.add('is-self');
        }

        const rankTd = document.createElement('td');
        rankTd.textContent = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`;

        const nameTh = document.createElement('th');
        nameTh.scope = 'row';
        nameTh.textContent = entry.name;

        const scoreTd = document.createElement('td');
        scoreTd.className = 'lb-score-cell';
        scoreTd.textContent = `${entry.score.toLocaleString()} pts`;

        const stopTd = document.createElement('td');
        stopTd.textContent = `${entry.stopName} (${entry.distanceM}m)`;

        const bridgeTd = document.createElement('td');
        bridgeTd.textContent = entry.padmaCrossings > 0 ? `🌉 ${entry.padmaCrossings} বার` : '—';

        tr.append(rankTd, nameTh, scoreTd, stopTd, bridgeTd);
        tbody.appendChild(tr);
      });
    } catch {
      metaEl.textContent = 'লাইভ পয়েন্ট টেবিল লোড করা যায়নি।';
    }
  }

  private showCallout(text: string, speak: boolean): void {
    this.helperCalloutText.textContent = text;
    this.helperCallout.classList.remove('hidden');
    if (speak) {
      this.audio.speakHelperLine(text);
    }
    window.clearTimeout(this.calloutTimeout);
    this.calloutTimeout = window.setTimeout(() => {
      this.helperCallout.classList.add('hidden');
    }, 2400);
  }

  private renderGarage(): void {
    const save = this.store.get();
    document.getElementById('garage-taka')!.textContent = `৳ ${save.taka}`;

    const upGrid = document.getElementById('upgrade-list')!;
    upGrid.innerHTML = '';
    for (const up of UPGRADES) {
      const lv =
        up.id === 'engine' ? save.engineLevel : up.id === 'armor' ? save.armorLevel : save.nitroLevel;
      const maxed = lv >= up.maxLevel;
      const cost = getUpgradeCost(up, lv);

      const card = document.createElement('div');
      card.className = 'garage-card';
      card.innerHTML = `
        <strong>${up.emoji} ${up.name} (Lv ${lv}/${up.maxLevel})</strong>
        <p>${up.description}</p>
      `;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = maxed ? 'btn-outline' : 'btn-primary';
      btn.textContent = maxed ? 'ম্যাক্সড ✓' : `আপগ্রেড ৳ ${cost}`;
      btn.disabled = maxed || save.taka < cost;
      btn.addEventListener('click', () => {
        if (maxed || this.store.get().taka < cost) return;
        this.audio.playHelperDoorSlap();
        this.store.update((d) => {
          d.taka -= cost;
          if (up.id === 'engine') d.engineLevel++;
          else if (up.id === 'armor') d.armorLevel++;
          else d.nitroLevel++;
        });
        this.refreshTitleStats();
        this.refreshHud();
        this.renderGarage();
      });
      card.appendChild(btn);
      upGrid.appendChild(card);
    }

    const skinGrid = document.getElementById('skin-list')!;
    skinGrid.innerHTML = '';
    for (const skin of BUS_SKINS) {
      const owned = save.unlockedSkins.includes(skin.id);
      const selected = save.selectedSkin === skin.id;

      const card = document.createElement('div');
      card.className = 'garage-card';
      card.innerHTML = `
        <div style="height:18px;border-radius:8px;background:linear-gradient(90deg,${skin.bodyHex},${skin.stripeHex})"></div>
        <strong>${skin.name}</strong>
        <p>${skin.routeBadge}</p>
      `;
      const btn = document.createElement('button');
      btn.type = 'button';
      if (selected) {
        btn.className = 'btn-secondary';
        btn.textContent = 'সিলেক্টেড ✓';
        btn.disabled = true;
      } else if (owned) {
        btn.className = 'btn-outline';
        btn.textContent = 'সিলেক্ট করুন';
        btn.addEventListener('click', () => {
          this.store.update((d) => {
            d.selectedSkin = skin.id;
          });
          this.world.setBusSkin(skin.id);
          this.renderGarage();
        });
      } else {
        btn.className = 'btn-primary';
        btn.textContent = `কিনুন ৳ ${skin.cost}`;
        btn.disabled = save.taka < skin.cost;
        btn.addEventListener('click', () => {
          if (this.store.get().taka < skin.cost) return;
          this.audio.playHydraulicHorn();
          this.store.update((d) => {
            d.taka -= skin.cost;
            d.unlockedSkins.push(skin.id);
            d.selectedSkin = skin.id;
          });
          this.world.setBusSkin(skin.id);
          this.refreshTitleStats();
          this.renderGarage();
        });
      }
      card.appendChild(btn);
      skinGrid.appendChild(card);
    }
  }

  private refreshTitleStats(): void {
    const s = this.store.get();
    document.getElementById('title-best-score')!.textContent = String(s.bestScore);
    document.getElementById('title-total-taka')!.textContent = `৳ ${s.taka}`;
  }

  private refreshHud(): void {
    const unbanked = Math.max(0, this.sim.takaEarned - this.bankedTakaInRun);
    const totalTaka = this.store.get().taka + (this.isPlaying ? unbanked : 0);
    this.hudTaka.textContent = String(totalTaka);
    this.hudScore.textContent = String(this.sim.score);
    this.hudPax.textContent = String(this.sim.passengers);
    this.hudHealth.textContent = '🔧'.repeat(Math.max(0, this.sim.health)) || '💥';
    this.hudStopLabel.textContent = `📍 ${this.sim.getCurrentStopName()} ➔ ${this.sim.getNextStopName()}`;
    this.hudSpeed.textContent = `${this.sim.speedKmh} km/h`;

    if (this.sim.chapaniCombo >= 2) {
      this.hudCombo.textContent = this.sim.feverActive
        ? `🔥 FEVER x${this.sim.chapaniCombo}`
        : `⚡ x${this.sim.chapaniCombo}`;
      this.hudCombo.classList.remove('hidden');
    } else {
      this.hudCombo.classList.add('hidden');
    }

    this.hudNitroFill.style.width = `${Math.round(this.sim.nitroCharge)}%`;
  }
}

const app = new MurirTinApp();
void app.init();
