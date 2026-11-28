import {
  type InterpolatedOpponent,
  type RacePlayerState,
  type RaceRoomState,
  type SprintRouteConfig,
} from './MultiplayerTypes';

export interface RaceApiResponse {
  ok: boolean;
  code?: string;
  playerId?: string;
  room: RaceRoomState;
  serverTime: number;
  storage?: string;
}

async function postRaceApi(payload: Record<string, unknown>): Promise<RaceApiResponse> {
  const res = await fetch('./api/race', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as RaceApiResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export async function createRaceRoom(
  playerName: string,
  busId: string,
  route: SprintRouteConfig
): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'create', playerName, busId, route });
}

export async function joinRaceRoom(
  code: string,
  playerName: string,
  busId: string
): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'join', code: code.trim().toUpperCase(), playerName, busId });
}

export async function fetchRaceRoom(code: string): Promise<RaceApiResponse> {
  const res = await fetch(`./api/race?code=${encodeURIComponent(code.trim().toUpperCase())}`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = (await res.json()) as RaceApiResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export async function setRaceReady(
  code: string,
  playerId: string,
  ready: boolean,
  busId: string,
  playerName?: string
): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'ready', code, playerId, ready, busId, playerName });
}

export async function setRaceRoute(
  code: string,
  playerId: string,
  route: SprintRouteConfig
): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'route', code, playerId, route });
}

export async function startRaceRoom(code: string, playerId: string): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'start', code, playerId });
}

export async function syncRaceTelemetry(
  code: string,
  playerId: string,
  telemetry: {
    x: number;
    distanceM: number;
    speed: number;
    elevationY: number;
    tiltAngle: number;
    nitroActive: boolean;
    crashed: boolean;
    busId: string;
    score: number;
    finished?: boolean;
    finishMs?: number;
  }
): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'sync', code, playerId, ...telemetry });
}

export async function rematchRaceRoom(code: string, playerId: string): Promise<RaceApiResponse> {
  return postRaceApi({ action: 'rematch', code, playerId });
}

export async function leaveRaceRoom(code: string, playerId: string): Promise<void> {
  try {
    await fetch('./api/race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ action: 'leave', code, playerId }),
    });
  } catch {
    // Ignore disconnect cleanup failures
  }
}

export function buildRoomInviteUrl(code: string): string {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host === '127.0.0.1' || host === 'localhost') {
    return `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(code)}`;
  }
  return `https://murirtin-express.vercel.app/?room=${encodeURIComponent(code)}`;
}

interface SnapshotTrack {
  latest: RacePlayerState;
  receivedAtMs: number;
  curX: number;
  curDist: number;
  curTilt: number;
}

/** Smoothly dead-reckons & interpolates 250ms network snapshots to 60fps for 3D opponent buses. */
export class OpponentInterpolator {
  private readonly tracks = new Map<string, SnapshotTrack>();

  public clear(): void {
    this.tracks.clear();
  }

  public updateFromRoom(room: RaceRoomState, localPlayerId: string, nowMs: number): void {
    const seen = new Set<string>();
    for (const p of room.players) {
      if (p.id === localPlayerId) continue;
      seen.add(p.id);
      const existing = this.tracks.get(p.id);
      if (existing) {
        existing.latest = p;
        existing.receivedAtMs = nowMs;
      } else {
        this.tracks.set(p.id, {
          latest: p,
          receivedAtMs: nowMs,
          curX: p.x,
          curDist: p.distanceM,
          curTilt: p.tiltAngle,
        });
      }
    }
    for (const id of this.tracks.keys()) {
      if (!seen.has(id)) {
        this.tracks.delete(id);
      }
    }
  }

  public sample(dt: number, nowMs: number): InterpolatedOpponent[] {
    const out: InterpolatedOpponent[] = [];
    const safeDt = Math.min(0.1, Math.max(0.001, dt));
    const blend = Math.min(1, safeDt * 12);

    for (const tr of this.tracks.values()) {
      const p = tr.latest;
      const finished = p.finishedAt !== null;
      const ageSec = finished ? 0 : Math.min(0.35, Math.max(0, (nowMs - tr.receivedAtMs) / 1000));
      const targetDist = p.distanceM + p.speed * ageSec;

      tr.curX += (p.x - tr.curX) * blend;
      tr.curDist += (targetDist - tr.curDist) * blend;
      tr.curTilt += (p.tiltAngle - tr.curTilt) * blend;

      out.push({
        id: p.id,
        name: p.name,
        busId: p.busId,
        color: p.color,
        x: tr.curX,
        distanceM: tr.curDist,
        speed: p.speed,
        tiltAngle: tr.curTilt,
        nitroActive: p.nitroActive,
        finished,
      });
    }
    return out;
  }
}
