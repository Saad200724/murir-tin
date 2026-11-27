import './styles/main.css';
import { DeshiAudioEngine } from './audio/DeshiAudioEngine';
import { BUS_SKINS, UPGRADES, getUpgradeCost } from './core/GarageCatalog';
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

  private readonly keys = new Set<string>();
  private touchSteer = 0;
  private touchBrake = false;
  private touchNitro = false;
  private dragPointerId: number | null = null;
  private dragLastX = 0;

  // DOM Elements
  private readonly stageEl = document.getElementById('game-stage')!;
  private readonly titleOverlay = document.getElementById('title-overlay')!;
  private readonly driveControls = document.getElementById('drive-controls')!;
  private readonly helperCallout = document.getElementById('helper-callout')!;
  private readonly helperCalloutText = document.getElementById('helper-callout-text')!;

  private readonly hudTaka = document.getElementById('hud-taka')!;
  private readonly hudScore = document.getElementById('hud-score')!;
  private readonly hudHealth = document.getElementById('hud-health')!;
  private readonly hudPax = document.getElementById('hud-pax')!;
  private readonly hudStopLabel = document.getElementById('hud-stop-label')!;
  private readonly hudNitroFill = document.getElementById('hud-nitro-fill') as HTMLElement;

  private readonly garageDialog = document.getElementById('garage-dialog') as HTMLDialogElement;
  private readonly gameoverDialog = document.getElementById('gameover-dialog') as HTMLDialogElement;
  private readonly settingsDialog = document.getElementById('settings-dialog') as HTMLDialogElement;
  private readonly scorecardCanvas = document.getElementById('scorecard-canvas') as HTMLCanvasElement;

  public async init(): Promise<void> {
    wireNativeDialogs();

    this.world = new DhakaWorld3D(this.stageEl);
    this.createSimulationFromSave();
    this.bindControls();
    this.setupLifecyclePause();
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
    this.audio.setPreferences(s.soundEnabled, s.voiceCalloutsEnabled);
  }

  private setupLifecyclePause(): void {
    const onSkip = (skipped: boolean) => {
      this.isPaused = skipped;
      if (skipped) {
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
  }

  private bindControls(): void {
    const startRun = () => {
      this.audio.unlock();
      this.audio.playHydraulicHorn();
      this.createSimulationFromSave();
      this.world.setBusSkin(this.store.get().selectedSkin);
      this.titleOverlay.classList.add('hidden');
      this.driveControls.classList.remove('hidden');
      this.isPlaying = true;
      this.showCallout('ওস্তাদ বামে চাপান! রানিংয়ে যাত্রী তোলেন!', true);
    };

    document.getElementById('btn-start-drive')!.addEventListener('click', startRun);

    document.getElementById('btn-open-garage-title')!.addEventListener('click', () => {
      this.renderGarage();
      this.garageDialog.showModal();
    });

    document.getElementById('btn-garage')!.addEventListener('click', () => {
      this.modalPaused = true;
      this.renderGarage();
      this.garageDialog.showModal();
    });

    document.getElementById('btn-settings')!.addEventListener('click', () => {
      this.modalPaused = true;
      const s = this.store.get();
      (document.getElementById('toggle-sfx') as HTMLInputElement).checked = s.soundEnabled;
      (document.getElementById('toggle-voice') as HTMLInputElement).checked = s.voiceCalloutsEnabled;
      this.settingsDialog.showModal();
    });

    this.garageDialog.addEventListener('close', () => {
      this.modalPaused = false;
      this.lastTime = performance.now();
    });
    this.settingsDialog.addEventListener('close', () => {
      this.modalPaused = false;
      this.lastTime = performance.now();
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
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

    // Drag directly on the 3D road to steer smoothly on mobile or mouse!
    this.stageEl.addEventListener('pointerdown', (e) => {
      if (!this.isPlaying || this.sim.crashed) return;
      this.audio.unlock();
      this.dragPointerId = e.pointerId;
      this.dragLastX = e.clientX;
    });
    this.stageEl.addEventListener('pointermove', (e) => {
      if (this.dragPointerId !== e.pointerId || !this.isPlaying) return;
      const dx = e.clientX - this.dragLastX;
      this.dragLastX = e.clientX;
      this.sim.playerX = Math.max(-5.0, Math.min(5.0, this.sim.playerX + dx * 0.028));
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
      this.createSimulationFromSave();
      this.isPlaying = true;
      this.audio.playHydraulicHorn();
      this.showCallout('নতুন ট্রিপ শুরু! বামে চাপান ওস্তাদ!', false);
    });

    document.getElementById('btn-revive-mistry')!.addEventListener('click', () => {
      this.gameoverDialog.close();
      this.sim.revive();
      this.isPlaying = true;
      this.audio.playHelperDoorSlap();
      this.showCallout('ধোলাইখাল মিস্ত্রি ঠিক করে দিছে! আবার চালান!', false);
    });

    document.getElementById('btn-download-card')!.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `murir-tin-score-${this.sim.score}.png`;
      link.href = this.scorecardCanvas.toDataURL('image/png');
      link.click();
      document.getElementById('share-feedback')!.textContent = 'মিম কার্ড ডাউনলোড হয়েছে!';
    });

    document.getElementById('btn-copy-flex')!.addEventListener('click', async () => {
      const txt = `🚌 মুড়ির টিন 3D-তে আমার স্কোর ${this.sim.score} (${getViralTitle(this.sim.score)})! প্লাস্টিক ঘষা: ${this.sim.plasticScrapes}টি, বাদুড়ঝোলা: ${this.sim.passengers} জন! সাহস থাকলে এই স্কোর ভাঙ্গো!`;
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
      this.world.setBusSkin(fresh.selectedSkin);
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
    }
  }

  private readInput(): InputState {
    let steer = this.touchSteer;
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
        const input = this.readInput();
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

  private handleSimEvent(ev: ReturnType<RoadSimulation['step']>[number]): void {
    this.showCallout(ev.callout, ev.type === 'chapani' || ev.type === 'gameover');

    if (ev.type === 'chapani' || ev.type === 'tesla_dodge' || ev.type === 'pit_smash') {
      this.audio.playChapaniSparks();
      this.world.triggerSparkBurst(ev.x ?? this.sim.playerX, ev.z ?? 0, '#ffbe0b');
    } else if (ev.type === 'passenger_pickup' || ev.type === 'rival_win' || ev.type === 'wrench_heal') {
      this.audio.playHelperDoorSlap();
    } else if (ev.type === 'crash') {
      this.audio.playCrash();
      this.world.triggerMinorShake();
      this.world.triggerSparkBurst(this.sim.playerX, 0, '#ef476f');
    } else if (ev.type === 'gameover') {
      this.audio.playCrash();
      this.world.triggerCrashBurst();
      this.onGameOver();
    }
  }

  private onGameOver(): void {
    this.isPlaying = false;
    const earned = Math.max(0, this.sim.takaEarned);
    this.store.update((d) => {
      d.taka += earned;
      d.bestScore = Math.max(d.bestScore, this.sim.score);
      d.bestDistanceM = Math.max(d.bestDistanceM, Math.floor(this.sim.distanceM));
    });
    this.refreshTitleStats();
    this.refreshHud();

    renderMemeScorecard(this.scorecardCanvas, {
      score: this.sim.score,
      distanceM: this.sim.distanceM,
      takaEarned: this.sim.takaEarned,
      plasticScrapes: this.sim.plasticScrapes,
      teslaDodges: this.sim.teslaDodges,
      passengers: this.sim.passengers,
      stopName: this.sim.getCurrentStopName(),
    });
    document.getElementById('share-feedback')!.textContent = '';

    window.setTimeout(() => {
      if (!this.gameoverDialog.open) {
        this.gameoverDialog.showModal();
      }
    }, 520);
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
    }, 2200);
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
    const totalTaka = this.store.get().taka + (this.isPlaying ? this.sim.takaEarned : 0);
    this.hudTaka.textContent = String(totalTaka);
    this.hudScore.textContent = String(this.sim.score);
    this.hudPax.textContent = String(this.sim.passengers);
    this.hudHealth.textContent = '🔧'.repeat(Math.max(0, this.sim.health)) || '💥';
    this.hudStopLabel.textContent = `📍 ${this.sim.getCurrentStopName()} ➔ ${this.sim.getNextStopName()}`;
    this.hudNitroFill.style.width = `${Math.round(this.sim.nitroCharge)}%`;
  }
}

const app = new MurirTinApp();
void app.init();
