export interface MurirTinSave {
  taka: number;
  bestScore: number;
  bestDistanceM: number;
  selectedSkin: string;
  unlockedSkins: string[];
  engineLevel: number;
  armorLevel: number;
  nitroLevel: number;
  soundEnabled: boolean;
  voiceCalloutsEnabled: boolean;
}

const SAVE_KEY = 'murir_tin_3d_save_v1';

export function createDefaultSave(): MurirTinSave {
  return {
    taka: 250,
    bestScore: 0,
    bestDistanceM: 0,
    selectedSkin: 'classic_mirpur',
    unlockedSkins: ['classic_mirpur'],
    engineLevel: 1,
    armorLevel: 1,
    nitroLevel: 1,
    soundEnabled: true,
    voiceCalloutsEnabled: true,
  };
}

export class SaveStore {
  private data: MurirTinSave;

  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null = typeof localStorage !== 'undefined' ? localStorage : null) {
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
        unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : ['classic_mirpur'],
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
