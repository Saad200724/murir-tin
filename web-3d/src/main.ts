import './styles/main.css';
import { DeshiAudioEngine } from './audio/DeshiAudioEngine';
import {
  BD_ROUTE_SEGMENTS,
  FAST_TRAVEL_HUBS,
  toHighwayKm,
} from './core/BangladeshRoute';
import { BUS_SKINS, UPGRADES, getUpgradeCost } from './core/GarageCatalog';
import {
  fetchLeaderboard,
  submitLeaderboardScore,
  type LeaderboardEntry,
} from './core/LeaderboardClient';
import { RoadSimulation, type InputState } from './core/RoadSimulation';
import {
  SaveStore,
  createDefaultKeymap,
  type CameraMode,
  type GraphicsPreset,
  type KeymapConfig,
} from './core/SaveStore';
import { DhakaWorld3D } from './scene/DhakaWorld3D';
import { BangladeshMapView } from './ui/BangladeshMapView';
import { wireNativeDialogs } from './ui/DialogHelpers';
import { GarageShowroom3D } from './ui/GarageShowroom3D';
import { renderMiniMap } from './ui/MiniMapCanvas';
import { renderMemeScorecard } from './ui/ScorecardCanvas';

const GEAR_LIFE_SVG = `<svg class="gear-life-svg" viewBox="0 0 64 64" aria-hidden="true"><path fill="#2196f3" d="M36 6h-8l-1.8 6.4a19 19 0 0 0-5.4 2.2l-5.8-3.4-5.6 5.6 3.4 5.8a19 19 0 0 0-2.2 5.4L6 28v8l6.4 1.8a19 19 0 0 0 2.2 5.4l-3.4 5.8 5.6 5.6 5.8-3.4a19 19 0 0 0 5.4 2.2L28 58h8l1.8-6.4a19 19 0 0 0 5.4-2.2l5.8 3.4 5.6-5.6-3.4-5.8a19 19 0 0 0 2.2-5.4L58 36v-8l-6.4-1.8a19 19 0 0 0-2.2-5.4l3.4-5.8-5.6-5.6-5.8 3.4a19 19 0 0 0-5.4-2.2z"/><circle cx="32" cy="32" r="11" fill="#e2e8f0"/><path fill="#cbd5e1" stroke="#1b1f2a" stroke-width="2.5" d="M41 18a9 9 0 0 0-11 11L14 45a4 4 0 0 0 5.6 5.6L35.5 35A9 9 0 0 0 46 23l-4.5 4.5-4-4z"/></svg>`;

const KEY_LABELS: Record<keyof KeymapConfig, string> = {
  left: 'বামে চাপানো',
  right: 'ডানে চাপানো',
  accelerate: 'গতি বাড়ানো',
  brake: 'ব্রেক ধরা',
  horn: 'হাইড্রোলিক হর্ন',
  nitro: 'নাইট্রো টান',
  map: 'বাংলাদেশ ম্যাপ',
  pause: 'পজ মেনু',
};

interface ChallengeTarget {
  challenger: string;
  targetScore: number;
  stopName: string;
  beaten: boolean;
}

class MurirTinApp {
  private readonly store = new SaveStore();
  private readonly audio = new DeshiAudioEngine();
  private world!: DhakaWorld3D;
  private sim!: RoadSimulation;
  private bdMap!: BangladeshMapView;
  private showroom!: GarageShowroom3D;
  private showroomIndex = 0;

  private isPlaying = false;
  private isPaused = false;
  private modalPaused = false;
  private lastTime = 0;
  private calloutTimeout = 0;
  private flashTimeout = 0;

  private fpsFrames = 0;
  private fpsAccum = 0;
  private currentFps = 60;

  private bankedTakaInRun = 0;
  private isSubmittingScore = false;
  private scoreSubmittedForRun = false;
  private activeStartM = 0;
  private waitingForRebind: keyof KeymapConfig | null = null;
  private challenge: ChallengeTarget | null = null;

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
  private readonly minimapWidget = document.getElementById('minimap-widget')!;
  private readonly minimapCanvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
  private readonly mmHealthFill = document.getElementById('mm-health-fill') as HTMLElement;
  private readonly mmNitroFill = document.getElementById('mm-nitro-fill') as HTMLElement;
  private readonly helperCallout = document.getElementById('helper-callout')!;
  private readonly helperCalloutText = document.getElementById('helper-callout-text')!;

  private readonly hudTaka = document.getElementById('hud-taka')!;
  private readonly hudScore = document.getElementById('hud-score')!;
  private readonly hudHealth = document.getElementById('hud-health')!;
  private readonly hudPax = document.getElementById('hud-pax')!;
  private readonly hudStopLabel = document.getElementById('hud-stop-label')!;
  private readonly hudKm = document.getElementById('hud-km')!;
  private readonly hudSpeed = document.getElementById('hud-speed')!;
  private readonly hudCombo = document.getElementById('hud-combo')!;
  private readonly hudWanted = document.getElementById('hud-wanted')!;
  private readonly hudFps = document.getElementById('hud-fps')!;
  private readonly hudNitroFill = document.getElementById('hud-nitro-fill') as HTMLElement;
  private readonly hudMission = document.getElementById('hud-mission')!;
  private readonly hudChallenge = document.getElementById('hud-challenge')!;

  private readonly titleNameInput = document.getElementById('input-player-name-title') as HTMLInputElement;
  private readonly startHubSelect = document.getElementById('select-start-hub') as HTMLSelectElement;
  private readonly gameoverNameInput = document.getElementById('input-player-name-gameover') as HTMLInputElement;
  private readonly submitStatusEl = document.getElementById('leaderboard-submit-status')!;
  private readonly submitBtn = document.getElementById('btn-submit-score') as HTMLButtonElement;
  private readonly reviveBtn = document.getElementById('btn-revive-mistry') as HTMLButtonElement;

  private readonly pauseDialog = document.getElementById('pause-dialog') as HTMLDialogElement;
  private readonly garageDialog = document.getElementById('garage-dialog') as HTMLDialogElement;
  private readonly gameoverDialog = document.getElementById('gameover-dialog') as HTMLDialogElement;
  private readonly leaderboardDialog = document.getElementById('leaderboard-dialog') as HTMLDialogElement;
  private readonly scorecardCanvas = document.getElementById('scorecard-canvas') as HTMLCanvasElement;

  public async init(): Promise<void> {
    wireNativeDialogs();
    this.parseChallengeParams();

    this.world = new DhakaWorld3D(this.stageEl);
    this.showroom = new GarageShowroom3D(document.getElementById('showroom-stage')!);
    this.applySavedVisualAudioSettings();

    this.bdMap = new BangladeshMapView(document.getElementById('bd-map-mount')!, (seg) => {
      this.activeStartM = seg.startM;
      this.pauseDialog.close();
      this.startNewRun(seg.startM);
    });

    this.createSimulationFromSave(0);
    this.populateHubSelector();
    this.bindPauseTabs();
    this.bindGarageControls();
    this.bindControls();
    this.setupLifecycleAndBackHandler();
    this.syncNameInputs();
    this.refreshTitleStats();
    this.refreshHud();

    await this.world.preloadModels();
    this.world.setBusSkin(this.store.get().selectedSkin);
    this.world.sync(this.sim, 0.016);

    // Fetch live #1 Champion for 3D Highway Billboard #0!
    void this.syncLiveChampionBillboard();

    window.addEventListener('resize', () => this.world.resize());
    this.startLoop();
  }

  private parseChallengeParams(): void {
    const params = new URLSearchParams(window.location.search);
    const vs = params.get('vs')?.trim();
    const target = Number(params.get('target') || 0);
    const stop = params.get('stop')?.trim() || '';
    if (vs && Number.isFinite(target) && target > 0) {
      this.challenge = {
        challenger: vs.slice(0, 24),
        targetScore: Math.round(target),
        stopName: stop,
        beaten: false,
      };
      const banner = document.getElementById('title-challenge-banner')!;
      banner.textContent = `⚔️ ${this.challenge.challenger} আপনাকে চ্যালেঞ্জ করেছে! টার্গেট: ${this.challenge.targetScore.toLocaleString()} pts`;
      banner.classList.remove('hidden');
    }
  }

  private async syncLiveChampionBillboard(): Promise<void> {
    try {
      const lb = await fetchLeaderboard();
      if (lb.entries.length > 0) {
        const top = lb.entries[0];
        this.world.updateChampionBillboard(top.name, top.score);
      }
    } catch {
      // Keep default billboard if offline
    }
  }

  private applySavedVisualAudioSettings(): void {
    const s = this.store.get();
    this.audio.setPreferences(s.soundEnabled, s.sfxVolume, s.engineVolume);
    this.world.applyGraphicsPreset(s.graphicsPreset);
    this.world.setCameraMode(s.cameraMode);
    this.hudFps.classList.toggle('hidden', !s.showFps);
  }

  private createSimulationFromSave(startM = 0): void {
    const s = this.store.get();
    const skin = BUS_SKINS.find((b) => b.id === s.selectedSkin) ?? BUS_SKINS[0];
    this.sim = new RoadSimulation(
      s.engineLevel,
      s.armorLevel,
      s.nitroLevel,
      skin.bonusSpeed,
      skin.bonusArmor
    );
    this.sim.reset(startM);
    this.bankedTakaInRun = 0;
    this.scoreSubmittedForRun = false;
    if (this.challenge) this.challenge.beaten = false;
    this.audio.setPreferences(s.soundEnabled, s.sfxVolume, s.engineVolume);
  }

  private populateHubSelector(): void {
    const unlocked = this.store.get().unlockedHubs;
    this.startHubSelect.innerHTML = '';
    for (const hub of FAST_TRAVEL_HUBS) {
      const opt = document.createElement('option');
      const isOpen = hub.id === 'thakurgaon' || unlocked.includes(hub.id);
      opt.value = String(hub.startM);
      opt.disabled = !isOpen;
      opt.textContent = isOpen
        ? `শুরু: ${hub.name.replace(' 🌉', '').replace(' 🏖️', '')}`
        : `🔒 ${hub.name.replace(' 🌉', '').replace(' 🏖️', '')}`;
      this.startHubSelect.appendChild(opt);
    }
    this.startHubSelect.value = String(this.activeStartM);
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
      this.pauseDialog.open ||
      this.garageDialog.open ||
      this.gameoverDialog.open ||
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

  private startNewRun(startM = 0): void {
    if (this.titleNameInput.value.trim()) {
      this.savePlayerName(this.titleNameInput.value);
    }
    this.activeStartM = startM;
    this.audio.unlock();
    this.audio.playHydraulicHorn();
    this.clearActiveInputs();
    this.world.resetEffects();
    this.createSimulationFromSave(startM);
    this.world.setBusSkin(this.store.get().selectedSkin);
    this.titleOverlay.classList.add('hidden');
    this.driveControls.classList.remove('hidden');
    this.minimapWidget.classList.remove('hidden');
    this.isPlaying = true;

    try {
      window.history.pushState({ murirTinPlaying: true }, '');
    } catch {
      // Ignore history restrictions
    }

    this.showCallout(`ওস্তাদ ${this.sim.getCurrentStopName()} থেকে টান দেন! টোল জমাবেন!`);
    this.refreshHud();
  }

  private openPauseMenu(tabId: 'tab-map' | 'tab-settings' | 'tab-keymap' | 'tab-graphics' = 'tab-map'): void {
    if (this.gameoverDialog.open) return;
    this.modalPaused = true;
    this.clearActiveInputs();
    this.syncPauseControlsFromSave();
    this.selectPauseTab(tabId);
    this.bdMap.sync(this.sim, this.store.get().unlockedHubs);
    if (!this.pauseDialog.open) {
      this.pauseDialog.showModal();
    }
  }

  private selectPauseTab(tabId: 'tab-map' | 'tab-settings' | 'tab-keymap' | 'tab-graphics'): void {
    const tabs = Array.from(this.pauseDialog.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(this.pauseDialog.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    for (const tab of tabs) {
      const selected = tab.id === tabId;
      tab.setAttribute('aria-selected', String(selected));
      if (selected) {
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
    for (const panel of panels) {
      const match = panel.getAttribute('aria-labelledby') === tabId;
      panel.hidden = !match;
    }
    if (tabId === 'tab-map') {
      this.bdMap.sync(this.sim, this.store.get().unlockedHubs);
    }
  }

  private bindPauseTabs(): void {
    const tabs = Array.from(this.pauseDialog.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    for (const tab of tabs) {
      tab.addEventListener('click', () => {
        this.selectPauseTab(tab.id as 'tab-map' | 'tab-settings' | 'tab-keymap' | 'tab-graphics');
      });
      tab.addEventListener('keydown', (e) => {
        const idx = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') {
          const next = tabs[(idx + 1) % tabs.length];
          next.focus();
          this.selectPauseTab(next.id as 'tab-map' | 'tab-settings' | 'tab-keymap' | 'tab-graphics');
        } else if (e.key === 'ArrowLeft') {
          const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
          prev.focus();
          this.selectPauseTab(prev.id as 'tab-map' | 'tab-settings' | 'tab-keymap' | 'tab-graphics');
        }
      });
    }
  }

  private syncPauseControlsFromSave(): void {
    const s = this.store.get();
    (document.getElementById('toggle-sfx') as HTMLInputElement).checked = s.soundEnabled;
    (document.getElementById('range-sfx-vol') as HTMLInputElement).value = String(Math.round(s.sfxVolume * 100));
    (document.getElementById('range-engine-vol') as HTMLInputElement).value = String(Math.round(s.engineVolume * 100));
    (document.getElementById('range-steer-sens') as HTMLInputElement).value = String(Math.round(s.steerSensitivity * 100));
    (document.getElementById('select-camera-mode') as HTMLSelectElement).value = s.cameraMode;
    (document.getElementById('select-graphics') as HTMLSelectElement).value = s.graphicsPreset;
    (document.getElementById('toggle-fps') as HTMLInputElement).checked = s.showFps;
    this.renderKeymapList();
  }

  private renderKeymapList(): void {
    const km = this.store.get().keymap;
    const mount = document.getElementById('keymap-list')!;
    mount.innerHTML = '';

    (Object.keys(KEY_LABELS) as (keyof KeymapConfig)[]).forEach((action) => {
      const row = document.createElement('div');
      row.className = 'keymap-row';
      const lbl = document.createElement('span');
      lbl.textContent = KEY_LABELS[action];

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = this.waitingForRebind === action ? 'btn-primary' : 'btn-outline';
      btn.textContent = this.waitingForRebind === action ? 'চাপুন...' : km[action];
      btn.addEventListener('click', () => {
        this.waitingForRebind = action;
        this.renderKeymapList();
      });

      row.append(lbl, btn);
      mount.appendChild(row);
    });
  }

  private setupLifecycleAndBackHandler(): void {
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
    window.addEventListener('blur', () => this.clearActiveInputs());

    // Mobile Hardware Back button opens AAA Pause Menu instead of exiting!
    window.addEventListener('popstate', () => {
      if (this.isPlaying && !this.sim.crashed && !this.pauseDialog.open) {
        this.openPauseMenu('tab-map');
        try {
          window.history.pushState({ murirTinPlaying: true }, '');
        } catch {
          // Ignore
        }
      }
    });
  }

  private bindControls(): void {
    document.getElementById('btn-start-drive')!.addEventListener('click', () => {
      const startM = Number(this.startHubSelect.value) || 0;
      this.startNewRun(startM);
    });

    this.titleNameInput.addEventListener('change', () => {
      this.savePlayerName(this.titleNameInput.value);
    });

    document.getElementById('btn-open-pause-title')!.addEventListener('click', () => {
      this.openPauseMenu('tab-map');
    });
    document.getElementById('btn-pause')!.addEventListener('click', () => {
      this.openPauseMenu('tab-map');
    });
    this.minimapWidget.addEventListener('click', () => {
      this.openPauseMenu('tab-map');
    });

    const openGarage = () => {
      this.modalPaused = true;
      this.clearActiveInputs();
      const selIdx = BUS_SKINS.findIndex((b) => b.id === this.store.get().selectedSkin);
      this.showroomIndex = selIdx >= 0 ? selIdx : 0;
      this.selectGarageTab('gtab-showroom');
      this.renderGarage();
      this.garageDialog.showModal();
      this.showroom.start();
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

    // Pause Footer Actions
    document.getElementById('btn-pause-resume')!.addEventListener('click', () => {
      this.pauseDialog.close();
    });
    document.getElementById('btn-pause-restart')!.addEventListener('click', () => {
      this.pauseDialog.close();
      this.startNewRun(this.activeStartM);
    });
    document.getElementById('btn-pause-home')!.addEventListener('click', () => {
      this.pauseDialog.close();
      this.isPlaying = false;
      this.clearActiveInputs();
      this.driveControls.classList.add('hidden');
      this.minimapWidget.classList.add('hidden');
      this.titleOverlay.classList.remove('hidden');
      this.populateHubSelector();
    });

    const onModalClose = () => {
      this.waitingForRebind = null;
      this.modalPaused = this.anyDialogOpen();
      if (!this.isPlaying) {
        this.createSimulationFromSave(this.activeStartM);
        this.refreshHud();
      }
      this.lastTime = performance.now();
    };
    this.pauseDialog.addEventListener('close', onModalClose);
    this.garageDialog.addEventListener('close', () => {
      this.showroom.stop();
      onModalClose();
    });
    this.leaderboardDialog.addEventListener('close', onModalClose);

    // Keyboard controls + ESC Pause + M Map + Keymap Rebind
    window.addEventListener('keydown', (e) => {
      if (this.waitingForRebind) {
        e.preventDefault();
        const action = this.waitingForRebind;
        this.waitingForRebind = null;
        this.store.update((d) => {
          d.keymap[action] = e.code;
        });
        this.renderKeymapList();
        return;
      }

      if (this.isTypingInInput()) return;

      const km = this.store.get().keymap;
      if (e.code === km.pause || e.code === 'Escape') {
        if (this.pauseDialog.open) {
          this.pauseDialog.close();
          return;
        }
        if (!this.anyDialogOpen() && this.isPlaying && !this.sim.crashed) {
          e.preventDefault();
          this.openPauseMenu('tab-map');
          return;
        }
      }

      if (e.code === km.map && !this.anyDialogOpen()) {
        e.preventDefault();
        this.openPauseMenu('tab-map');
        return;
      }

      if (this.anyDialogOpen()) return;
      this.keys.add(e.code);

      if (e.code === km.horn && this.isPlaying && !this.sim.crashed) {
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

    // Pause Menu Settings, Keymap & Graphics Bindings
    document.getElementById('toggle-sfx')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).checked;
      this.store.update((d) => {
        d.soundEnabled = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('range-sfx-vol')!.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value) / 100;
      this.store.update((d) => {
        d.sfxVolume = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('range-engine-vol')!.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value) / 100;
      this.store.update((d) => {
        d.engineVolume = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('range-steer-sens')!.addEventListener('input', (e) => {
      const val = Number((e.target as HTMLInputElement).value) / 100;
      this.store.update((d) => {
        d.steerSensitivity = val;
      });
    });

    document.getElementById('select-camera-mode')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as CameraMode;
      this.store.update((d) => {
        d.cameraMode = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('select-graphics')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as GraphicsPreset;
      this.store.update((d) => {
        d.graphicsPreset = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('toggle-fps')!.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).checked;
      this.store.update((d) => {
        d.showFps = val;
      });
      this.applySavedVisualAudioSettings();
    });

    document.getElementById('btn-reset-keymap')!.addEventListener('click', () => {
      this.waitingForRebind = null;
      this.store.update((d) => {
        d.keymap = createDefaultKeymap();
      });
      this.renderKeymapList();
    });

    document.getElementById('btn-reset-save')!.addEventListener('click', () => {
      const fresh = this.store.reset();
      this.syncNameInputs();
      this.applySavedVisualAudioSettings();
      this.populateHubSelector();
      this.world.setBusSkin(fresh.selectedSkin);
      this.world.resetEffects();
      this.createSimulationFromSave(0);
      this.refreshTitleStats();
      this.refreshHud();
      this.pauseDialog.close();
    });

    // Game Over Actions
    document.getElementById('btn-retry-now')!.addEventListener('click', () => {
      this.gameoverDialog.close();
      this.startNewRun(this.activeStartM);
    });

    this.reviveBtn.addEventListener('click', () => {
      if (!this.sim.revive()) return;
      this.gameoverDialog.close();
      this.clearActiveInputs();
      this.isPlaying = true;
      this.audio.playWrenchRepair();
      this.showCallout('ধোলাইখাল মিস্ত্রি ঠিক করে দিছে! আবার চালান!');
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
      const myName = this.store.get().playerName || 'ওস্তাদ';
      const stop = this.sim.getCurrentStopName();
      const challengeUrl = `https://murirtin-express.vercel.app/?vs=${encodeURIComponent(myName)}&target=${this.sim.score}&stop=${encodeURIComponent(stop)}`;
      const txt = `🚌 ${myName} তোমাকে চ্যালেঞ্জ করেছে! মুড়ির টিন 3D-তে স্কোর ${this.sim.score} (${stop}, ${this.sim.bridgesCrossed} সেতু পার)!\nসাহস থাকলে এই লিংকে ঢুকে রেকর্ড ভাঙো 👉 ${challengeUrl}`;
      try {
        await navigator.clipboard.writeText(txt);
        document.getElementById('share-feedback')!.textContent = '⚔️ বন্ধু চ্যালেঞ্জ লিংক কপি হয়েছে!';
      } catch {
        document.getElementById('share-feedback')!.textContent = challengeUrl;
      }
    });
  }

  private triggerHorn(): void {
    this.audio.playHydraulicHorn();
    const events = this.sim.blastHorn();
    for (const ev of events) {
      this.showCallout(ev.callout);
      this.spawnFloatPop('+৳35 সাইড!', 'pop-green');
    }
  }

  private readInput(dt: number): InputState {
    const km = this.store.get().keymap;
    let steer = this.touchSteer;
    if (Math.abs(this.dragSteerVelocity) > 0.01) {
      steer = this.dragSteerVelocity;
      this.dragSteerVelocity *= Math.pow(0.004, dt);
    }
    if (this.keys.has('ArrowLeft') || this.keys.has(km.left)) steer = -1;
    if (this.keys.has('ArrowRight') || this.keys.has(km.right)) steer = 1;

    const accelerate = this.keys.has('ArrowUp') || this.keys.has(km.accelerate);
    const brake = this.touchBrake || this.keys.has('ArrowDown') || this.keys.has(km.brake);
    const nitro = this.touchNitro || this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.keys.has(km.nitro);
    return { steer, accelerate, brake, nitro };
  }

  private startLoop(): void {
    this.lastTime = performance.now();
    const tick = (now: number) => {
      requestAnimationFrame(tick);
      if (this.isPaused) return;

      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
      this.lastTime = now;

      // FPS counter
      this.fpsFrames++;
      this.fpsAccum += dt;
      if (this.fpsAccum >= 0.4) {
        this.currentFps = Math.round(this.fpsFrames / this.fpsAccum);
        this.fpsFrames = 0;
        this.fpsAccum = 0;
        if (this.store.get().showFps) {
          this.hudFps.textContent = `${this.currentFps} FPS`;
        }
      }

      if (this.isPlaying && !this.sim.crashed && !this.modalPaused) {
        const input = this.readInput(dt);
        const events = this.sim.step(dt, input, Math.random, this.store.get().steerSensitivity);
        this.audio.updateEngineRumble(this.sim.speed, true, this.sim.nitroActive);

        for (const ev of events) {
          this.handleSimEvent(ev);
        }

        if (this.challenge && !this.challenge.beaten && this.sim.score > this.challenge.targetScore) {
          this.challenge.beaten = true;
          this.audio.playMilestoneFanfare();
          this.triggerFlash('flash-fever');
          this.showCallout(`👑 ${this.challenge.challenger}-এর ${this.challenge.targetScore} রেকর্ড ভেঙে দিয়েছেন!`);
          this.spawnFloatPop('⚔️ RECORD BROKEN!', 'pop-gold');
        }

        this.refreshHud();
        renderMiniMap(this.minimapCanvas, this.sim, now);
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
    this.showCallout(ev.callout);

    if (ev.type === 'chapani' || ev.type === 'tesla_dodge' || ev.type === 'pit_smash') {
      this.audio.playChapaniSparks(this.sim.chapaniCombo);
      this.world.triggerSparkBurst(ev.x ?? this.sim.playerX, ev.z ?? 0, '#ffbe0b');
      this.spawnFloatPop(`+৳${ev.takaDelta}`, 'pop-gold');
    } else if (ev.type === 'fever_mode' || ev.type === 'mission_complete' || ev.type === 'wanted_cleared' || ev.type === 'route_complete') {
      this.audio.playMilestoneFanfare();
      this.triggerFlash('flash-fever');
      this.spawnFloatPop(ev.type === 'mission_complete' ? '🎯 মিশন ডান!' : '🔥 বোনাস!', 'pop-gold');
    } else if (ev.type === 'passenger_pickup' || ev.type === 'rival_win') {
      this.audio.playHelperDoorSlap();
      if (ev.takaDelta > 0) this.spawnFloatPop(`+৳${ev.takaDelta}`, 'pop-green');
    } else if (ev.type === 'wrench_heal') {
      this.audio.playWrenchRepair();
      this.spawnFloatPop('+১ ⚙️ লাইফ!', 'pop-green');
    } else if (ev.type === 'toll_paid') {
      this.audio.playTollPaid();
      this.spawnFloatPop('🌉 টোল ক্লিয়ার!', 'pop-green');
    } else if (ev.type === 'toll_smash') {
      this.audio.playBarrierSmash();
      this.audio.playPoliceSiren();
      this.world.triggerSparkBurst(this.sim.playerX, 0, '#00f5d4');
      this.world.triggerMinorShake();
      this.spawnFloatPop('🔥 ব্যারিকেড উড়াল!', 'pop-gold');
    } else if (ev.type === 'wanted_up') {
      this.audio.playPoliceSiren();
    } else if (ev.type === 'train_passing') {
      this.audio.playTrainHorn();
    } else if (ev.type === 'hub_unlocked' && ev.hubId) {
      this.store.update((d) => {
        if (!d.unlockedHubs.includes(ev.hubId!)) {
          d.unlockedHubs.push(ev.hubId!);
        }
      });
      this.populateHubSelector();
      this.audio.playMilestoneFanfare();
    } else if (ev.type === 'bridge_complete') {
      this.audio.playMilestoneFanfare();
      this.triggerFlash('flash-fever');
      this.spawnFloatPop('🌉 সেতু পার +৳300!', 'pop-green');
    } else if (ev.type === 'toll_fine' || ev.type === 'crash') {
      this.audio.playCrash();
      this.triggerFlash('flash-crash');
      this.world.triggerMinorShake();
      this.world.triggerSparkBurst(this.sim.playerX, 0, '#ef476f');
      this.spawnFloatPop('💥 -১ লাইফ', 'pop-crimson');
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
      padmaCrossings: this.sim.bridgesCrossed,
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

    renderMemeScorecard(this.scorecardCanvas, {
      playerName: name,
      score: this.sim.score,
      distanceM: this.sim.distanceM,
      takaEarned: this.sim.takaEarned,
      plasticScrapes: this.sim.plasticScrapes,
      teslaDodges: this.sim.teslaDodges,
      passengers: this.sim.passengers,
      stopName: this.sim.getCurrentStopName(),
      padmaCrossings: this.sim.bridgesCrossed,
      totalTollPaid: this.sim.totalTollPaid,
    });

    try {
      const res = await submitLeaderboardScore({
        name,
        score: this.sim.score,
        distanceM: Math.floor(this.sim.distanceM),
        stopName: this.sim.getCurrentStopName(),
        padmaCrossings: this.sim.bridgesCrossed,
      });
      this.scoreSubmittedForRun = true;
      const rankLabel = res.rank ? `#${res.rank}` : 'টপ ৫০';
      this.submitStatusEl.textContent = res.isNewBest
        ? `✅ লাইভ টেবিলে সেভ হয়েছে! আপনার র‍্যাংক: ${rankLabel} 🎉`
        : `✅ র‍্যাংক ${rankLabel} (আপনার আগের বেস্ট স্কোর আরও বেশি!)`;

      if (res.entries.length > 0) {
        this.world.updateChampionBillboard(res.entries[0].name, res.entries[0].score);
      }
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

      if (data.entries.length > 0) {
        this.world.updateChampionBillboard(data.entries[0].name, data.entries[0].score);
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
        stopTd.textContent = `${entry.stopName} (${toHighwayKm(entry.distanceM)} km)`;

        const bridgeTd = document.createElement('td');
        bridgeTd.textContent = entry.padmaCrossings > 0 ? `🌉 ${entry.padmaCrossings} টি` : '—';

        tr.append(rankTd, nameTh, scoreTd, stopTd, bridgeTd);
        tbody.appendChild(tr);
      });
    } catch {
      metaEl.textContent = 'লাইভ পয়েন্ট টেবিল লোড করা যায়নি।';
    }
  }

  private showCallout(text: string): void {
    this.helperCalloutText.textContent = text;
    this.helperCallout.classList.remove('hidden');
    window.clearTimeout(this.calloutTimeout);
    this.calloutTimeout = window.setTimeout(() => {
      this.helperCallout.classList.add('hidden');
    }, 2400);
  }

  private selectGarageTab(tabId: 'gtab-showroom' | 'gtab-upgrades'): void {
    const tabs = Array.from(this.garageDialog.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(this.garageDialog.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    for (const tab of tabs) {
      tab.setAttribute('aria-selected', String(tab.id === tabId));
    }
    for (const panel of panels) {
      panel.hidden = panel.getAttribute('aria-labelledby') !== tabId;
    }
    if (tabId === 'gtab-showroom') {
      this.showroom.resize();
    }
  }

  private bindGarageControls(): void {
    document.getElementById('gtab-showroom')!.addEventListener('click', () => {
      this.selectGarageTab('gtab-showroom');
    });
    document.getElementById('gtab-upgrades')!.addEventListener('click', () => {
      this.selectGarageTab('gtab-upgrades');
    });

    document.getElementById('btn-bus-prev')!.addEventListener('click', () => {
      this.showroomIndex = (this.showroomIndex - 1 + BUS_SKINS.length) % BUS_SKINS.length;
      this.renderShowroomBus();
    });
    document.getElementById('btn-bus-next')!.addEventListener('click', () => {
      this.showroomIndex = (this.showroomIndex + 1) % BUS_SKINS.length;
      this.renderShowroomBus();
    });

    document.getElementById('btn-bus-action')!.addEventListener('click', () => {
      const skin = BUS_SKINS[this.showroomIndex];
      const save = this.store.get();
      const owned = save.unlockedSkins.includes(skin.id);
      if (save.selectedSkin === skin.id) return;

      if (owned) {
        this.audio.playHelperDoorSlap();
        this.store.update((d) => {
          d.selectedSkin = skin.id;
        });
      } else {
        if (save.taka < skin.cost) return;
        this.audio.playHydraulicHorn();
        this.store.update((d) => {
          d.taka -= skin.cost;
          d.unlockedSkins.push(skin.id);
          d.selectedSkin = skin.id;
        });
      }
      this.world.setBusSkin(skin.id);
      this.refreshTitleStats();
      this.refreshHud();
      this.renderGarage();
    });
  }

  private renderShowroomBus(): void {
    const save = this.store.get();
    const skin = BUS_SKINS[this.showroomIndex] ?? BUS_SKINS[0];
    const owned = save.unlockedSkins.includes(skin.id);
    const selected = save.selectedSkin === skin.id;

    document.getElementById('showroom-bus-name')!.textContent = skin.name;
    document.getElementById('showroom-bus-route')!.textContent = skin.routeBadge;
    document.getElementById('showroom-bus-tagline')!.textContent = skin.tagline;

    const statEntries: [string, number][] = [
      ['⚡ টপ স্পিড', skin.stats.speed],
      ['🛡️ বাম্পার হেলথ', skin.stats.armor],
      ['🔥 নাইট্রো পাওয়ার', skin.stats.nitro],
      ['👥 যাত্রী ক্ষমতা', skin.stats.capacity],
    ];
    const statsMount = document.getElementById('showroom-stats')!;
    statsMount.innerHTML = statEntries
      .map(
        ([label, val]) => `
        <div class="stat-bar-row">
          <span>${label} (${val}%)</span>
          <div class="stat-bar-track"><span class="stat-bar-fill" style="width:${val}%"></span></div>
        </div>
      `
      )
      .join('');

    const actionBtn = document.getElementById('btn-bus-action') as HTMLButtonElement;
    if (selected) {
      actionBtn.className = 'btn-secondary';
      actionBtn.textContent = 'সিলেক্টেড ✓';
      actionBtn.disabled = true;
    } else if (owned) {
      actionBtn.className = 'btn-outline';
      actionBtn.textContent = 'সিলেক্ট করুন';
      actionBtn.disabled = false;
    } else {
      actionBtn.className = 'btn-primary';
      actionBtn.textContent = `কিনুন ৳ ${skin.cost}`;
      actionBtn.disabled = save.taka < skin.cost;
    }

    const dotsMount = document.getElementById('showroom-dots')!;
    dotsMount.innerHTML = '';
    BUS_SKINS.forEach((b, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `showroom-dot ${idx === this.showroomIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', b.name);
      dot.addEventListener('click', () => {
        this.showroomIndex = idx;
        this.renderShowroomBus();
      });
      dotsMount.appendChild(dot);
    });

    this.showroom.showBus(this.world.buildBusPreviewClone(skin.id));
  }

  private renderGarage(): void {
    const save = this.store.get();
    document.getElementById('garage-taka')!.textContent = `৳ ${save.taka}`;
    this.renderShowroomBus();

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

    const hp = Math.max(0, this.sim.health);
    this.hudHealth.innerHTML = hp > 0 ? GEAR_LIFE_SVG.repeat(hp) : '💥';

    this.hudStopLabel.textContent = `📍 ${this.sim.getCurrentStopName()} ➔ ${this.sim.getNextStopName()}`;
    this.hudKm.textContent = `${toHighwayKm(this.sim.distanceM)} / 840 km`;
    this.hudSpeed.textContent = `${this.sim.speedKmh} km/h`;

    if (this.sim.chapaniCombo >= 2) {
      this.hudCombo.textContent = this.sim.feverActive
        ? `🔥 FEVER x${this.sim.chapaniCombo}`
        : `⚡ x${this.sim.chapaniCombo}`;
      this.hudCombo.classList.remove('hidden');
    } else {
      this.hudCombo.classList.add('hidden');
    }

    if (this.sim.wantedLevel > 0) {
      this.hudWanted.textContent = '⭐'.repeat(this.sim.wantedLevel);
      this.hudWanted.classList.remove('hidden');
    } else {
      this.hudWanted.classList.add('hidden');
    }

    const nitroPct = `${Math.round(this.sim.nitroCharge)}%`;
    this.hudNitroFill.style.width = nitroPct;
    this.mmNitroFill.style.width = nitroPct;
    this.mmHealthFill.style.width = `${Math.round((hp / Math.max(1, this.sim.maxHealth)) * 100)}%`;

    if (this.isPlaying) {
      const m = this.sim.activeMission;
      this.hudMission.textContent = `🎯 ${m.title} (${m.progress}/${m.target})`;
      this.hudMission.classList.remove('hidden');

      if (this.challenge) {
        this.hudChallenge.textContent = this.challenge.beaten
          ? `👑 ${this.challenge.challenger}-কে হারিয়েছেন!`
          : `⚔️ vs ${this.challenge.challenger}: ${this.sim.score}/${this.challenge.targetScore}`;
        this.hudChallenge.classList.remove('hidden');
      }
    } else {
      this.hudMission.classList.add('hidden');
      this.hudChallenge.classList.add('hidden');
    }
  }
}

// Keep unused import reference check satisfied
void BD_ROUTE_SEGMENTS;

const app = new MurirTinApp();
void app.init();
