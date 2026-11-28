export type GraphicsPreset = 'low' | 'medium' | 'high' | 'ultra';
export type CameraMode = 'chase' | 'close' | 'wide';

export interface KeymapConfig {
  left: string;
  right: string;
  accelerate: string;
  brake: string;
  horn: string;
  nitro: string;
  map: string;
  pause: string;
}

export interface MurirTinSave {
  playerName: string;
  taka: number;
  bestScore: number;
  bestDistanceM: number;
  selectedSkin: string;
  unlockedSkins: string[];
  unlockedHubs: string[];
  engineLevel: number;
  armorLevel: number;
  nitroLevel: number;
  soundEnabled: boolean;
  voiceCalloutsEnabled: boolean;
  sfxVolume: number;
  engineVolume: number;
  steerSensitivity: number;
  cameraMode: CameraMode;
  graphicsPreset: GraphicsPreset;
  showFps: boolean;
  gamepadVibration: boolean;
  keymap: KeymapConfig;
}

const SAVE_KEY = 'murir_tin_3d_save_v1';

export function createDefaultKeymap(): KeymapConfig {
  return {
    left: 'KeyA',
    right: 'KeyD',
    accelerate: 'KeyW',
    brake: 'KeyS',
    horn: 'Space',
    nitro: 'ShiftLeft',
    map: 'KeyM',
    pause: 'Escape',
  };
}

export function createDefaultSave(): MurirTinSave {
  return {
    playerName: '',
    taka: 250,
    bestScore: 0,
    bestDistanceM: 0,
    selectedSkin: 'classic_mirpur',
    unlockedSkins: ['classic_mirpur'],
    unlockedHubs: ['thakurgaon'],
    engineLevel: 1,
    armorLevel: 1,
    nitroLevel: 1,
    soundEnabled: true,
    voiceCalloutsEnabled: false,
    sfxVolume: 0.85,
    engineVolume: 0.7,
    steerSensitivity: 1.0,
    cameraMode: 'chase',
    graphicsPreset: 'high',
    showFps: false,
    gamepadVibration: true,
    keymap: createDefaultKeymap(),
  };
}

export class SaveStore {
  private data: MurirTinSave;

  constructor(
    private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null =
      typeof localStorage !== 'undefined' ? localStorage : null
  ) {
    this.data = this.load();
  }

  private load(): MurirTinSave {
    const def = createDefaultSave();
    if (!this.storage) return def;
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw) as Partial<MurirTinSave>;
      return {
        ...def,
        ...parsed,
        playerName: typeof parsed.playerName === 'string' ? parsed.playerName.slice(0, 24) : '',
        unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : ['classic_mirpur'],
        unlockedHubs:
          Array.isArray(parsed.unlockedHubs) && parsed.unlockedHubs.length > 0
            ? parsed.unlockedHubs
            : ['thakurgaon'],
        keymap: { ...def.keymap, ...(parsed.keymap ?? {}) },
      };
    } catch {
      return def;
    }
  }

  public get(): Readonly<MurirTinSave> {
    return this.data;
  }

  public update(mutator: (draft: MurirTinSave) => void): MurirTinSave {
    mutator(this.data);
    this.save();
    return this.data;
  }

  public save(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore storage limits
    }
  }

  public reset(): MurirTinSave {
    this.data = createDefaultSave();
    this.save();
    return this.data;
  }
}
