export interface GamepadFrameState {
  connected: boolean;
  label: string;
  steer: number;
  accelerate: boolean;
  brake: boolean;
  nitro: boolean;
  hornPressed: boolean;
  cameraPressed: boolean;
  mapPressed: boolean;
  pausePressed: boolean;
  confirmPressed: boolean;
  cancelPressed: boolean;
}

export type RumbleKind = 'chapani' | 'crash' | 'horn' | 'nitro' | 'bridge';

interface HapticActuatorLike {
  playEffect?: (
    type: string,
    params: {
      startDelay?: number;
      duration: number;
      weakMagnitude: number;
      strongMagnitude: number;
    }
  ) => Promise<unknown>;
}

const RUMBLE_PROFILES: Record<RumbleKind, { duration: number; weak: number; strong: number }> = {
  chapani: { duration: 110, weak: 0.45, strong: 0.2 },
  horn: { duration: 75, weak: 0.25, strong: 0.1 },
  nitro: { duration: 90, weak: 0.35, strong: 0.25 },
  bridge: { duration: 180, weak: 0.5, strong: 0.35 },
  crash: { duration: 320, weak: 0.85, strong: 0.9 },
};

const EMPTY_STATE: GamepadFrameState = {
  connected: false,
  label: '',
  steer: 0,
  accelerate: false,
  brake: false,
  nitro: false,
  hornPressed: false,
  cameraPressed: false,
  mapPressed: false,
  pausePressed: false,
  confirmPressed: false,
  cancelPressed: false,
};

export function formatGamepadLabel(rawId: string): string {
  const lower = rawId.toLowerCase();
  if (lower.includes('xbox') || lower.includes('xinput')) return 'Xbox Controller';
  if (lower.includes('dualsense')) return 'PS5 DualSense';
  if (lower.includes('dualshock') || lower.includes('sony') || lower.includes('054c')) {
    return 'PS DualShock';
  }
  if (lower.includes('nintendo') || lower.includes('pro controller')) return 'Switch Pro';
  const cleaned = rawId.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return (cleaned || 'Gamepad').slice(0, 24);
}

/**
 * Pure snapshot sampler so analog deadzones, triggers, D-pad overrides, and rising-edge actions
 * are deterministically testable without browser hardware.
 */
export function sampleGamepadSnapshot(
  axes: readonly number[],
  buttonValues: readonly number[],
  prevPressed: readonly boolean[],
  deadzone = 0.14
): {
  state: Omit<GamepadFrameState, 'connected' | 'label'>;
  nextPressed: boolean[];
} {
  const pressed = buttonValues.map((v) => v > 0.45);
  const rising = (idx: number): boolean => Boolean(pressed[idx] && !prevPressed[idx]);
  const triggerHeld = (idx: number): boolean => (buttonValues[idx] ?? 0) > 0.15;

  const rawAxis = axes[0] ?? 0;
  let steer = 0;
  if (Math.abs(rawAxis) > deadzone) {
    const sign = Math.sign(rawAxis);
    const scaled = (Math.abs(rawAxis) - deadzone) / (1 - deadzone);
    steer = sign * Math.min(1, Math.max(0, scaled));
  }

  // Digital D-Pad Left (14) / Right (15) overrides analog stick when held
  if (pressed[14]) steer = -1;
  else if (pressed[15]) steer = 1;

  const accelerate = triggerHeld(7) || Boolean(pressed[12]);
  const brake = triggerHeld(6) || Boolean(pressed[1]);
  const nitro = Boolean(pressed[0]) || Boolean(pressed[5]);

  return {
    state: {
      steer,
      accelerate,
      brake,
      nitro,
      hornPressed: rising(2) || rising(4) || rising(10),
      cameraPressed: rising(3),
      mapPressed: rising(8),
      pausePressed: rising(9),
      confirmPressed: rising(0) || rising(9),
      cancelPressed: rising(1),
    },
    nextPressed: pressed,
  };
}

export class GamepadController {
  private prevPressed: boolean[] = [];
  private connected = false;
  private activeLabel = '';

  constructor(private readonly onConnectionChange?: (connected: boolean, label: string) => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('gamepadconnected', (e) => {
        const label = formatGamepadLabel(e.gamepad.id);
        this.setConnectionState(true, label);
      });
      window.addEventListener('gamepaddisconnected', () => {
        const pad = this.findActiveGamepad();
        if (pad) {
          this.setConnectionState(true, formatGamepadLabel(pad.id));
        } else {
          this.prevPressed = [];
          this.setConnectionState(false, '');
        }
      });
    }
  }

  private setConnectionState(connected: boolean, label: string): void {
    if (this.connected === connected && this.activeLabel === label) return;
    this.connected = connected;
    this.activeLabel = label;
    this.onConnectionChange?.(connected, label);
  }

  private findActiveGamepad(): Gamepad | null {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return null;
    }
    const pads = navigator.getGamepads();
    let fallback: Gamepad | null = null;
    for (const pad of pads) {
      if (!pad || !pad.connected) continue;
      if (pad.mapping === 'standard') return pad;
      if (!fallback) fallback = pad;
    }
    return fallback;
  }

  public poll(): GamepadFrameState {
    const pad = this.findActiveGamepad();
    if (!pad) {
      if (this.connected) {
        this.prevPressed = [];
        this.setConnectionState(false, '');
      }
      return EMPTY_STATE;
    }

    const label = formatGamepadLabel(pad.id);
    this.setConnectionState(true, label);

    const values = pad.buttons.map((b) => (b.pressed ? Math.max(b.value, 1) : b.value));
    const { state, nextPressed } = sampleGamepadSnapshot(pad.axes, values, this.prevPressed);
    this.prevPressed = nextPressed;

    return {
      connected: true,
      label,
      ...state,
    };
  }

  public rumble(kind: RumbleKind, enabled: boolean): void {
    if (!enabled) return;
    const pad = this.findActiveGamepad();
    const actuator = (pad as (Gamepad & { vibrationActuator?: HapticActuatorLike }) | null)?.vibrationActuator;
    if (!actuator?.playEffect) return;

    const prof = RUMBLE_PROFILES[kind];
    try {
      void actuator
        .playEffect('dual-rumble', {
          startDelay: 0,
          duration: prof.duration,
          weakMagnitude: prof.weak,
          strongMagnitude: prof.strong,
        })
        ?.catch?.(() => {});
    } catch {
      // Ignore browsers where dual-rumble throws
    }
  }
}
