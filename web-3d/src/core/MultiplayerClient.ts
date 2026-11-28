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
  region?: string;
  rttMs?: number;
}

const REQUEST_TIMEOUT_MS = 4500;

async function fetchRaceJson(
  url: string,
  init: RequestInit
): Promise<RaceApiResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const t0 = performance.now();
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = (await res.json()) as RaceApiResponse & { error?: string };
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    data.rttMs = Math.max(1, Math.round(performance.now() - t0));
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function postRaceApi(payload: Record<string, unknown>): Promise<RaceApiResponse> {
  return fetchRaceJson('./api/race', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });
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
  return fetchRaceJson(`./api/race?code=${encodeURIComponent(code.trim().toUpperCase())}`, {
    method: 'GET',
    cache: 'no-store',
  });
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
  lastSeen: number;
  receivedAtMs: number;
  serverStaleSec: number;
  rttHalfSec: number;
  curX: number;
  curDist: number;
  curSpeed: number;
  curTilt: number;
}

/**
 * Smoothly dead-reckons & interpolates network snapshots at 60fps so opponents never freeze,
 * snap backwards on duplicate snapshots, or rubber-band on mobile latency.
 */
export class OpponentInterpolator {
  private readonly tracks = new Map<string, SnapshotTrack>();
  private finishM: number | null = null;

  public clear(): void {
    this.tracks.clear();
    this.finishM = null;
  }

  public updateFromRoom(
    room: RaceRoomState,
    localPlayerId: string,
    nowMs: number,
    rttMs = 120,
    serverTime?: number
  ): void {
    this.finishM = room.route.finishM;
    const refServerTime =
      typeof serverTime === 'number' && Number.isFinite(serverTime) ? serverTime : room.updatedAt;
    const rttHalfSec = Math.min(0.45, Math.max(0, rttMs / 2000));
    const seen = new Set<string>();

    for (const p of room.players) {
      if (p.id === localPlayerId) continue;
      seen.add(p.id);
      const finished = p.finishedAt !== null;
      const serverStaleSec = finished
        ? 0
        : Math.min(0.45, Math.max(0, (refServerTime - p.lastSeen) / 1000));
      const existing = this.tracks.get(p.id);
      if (existing) {
        const isFresh =
          p.lastSeen > existing.lastSeen ||
          p.distanceM !== existing.latest.distanceM ||
          p.finishedAt !== existing.latest.finishedAt ||
          p.x !== existing.latest.x;
        existing.rttHalfSec = rttHalfSec;
        if (isFresh) {
          existing.latest = p;
          existing.lastSeen = p.lastSeen;
          existing.receivedAtMs = nowMs;
          existing.serverStaleSec = serverStaleSec;
        } else {
          // Preserve receivedAtMs/serverStaleSec when the server echoes the same snapshot so
          // dead-reckoning keeps advancing cleanly instead of snapping backwards.
          existing.latest = {
            ...existing.latest,
            name: p.name,
            busId: p.busId,
            color: p.color,
            nitroActive: p.nitroActive,
            crashed: p.crashed,
          };
        }
      } else {
        let initialDist = finished
          ? p.distanceM
          : p.distanceM + p.speed * (serverStaleSec + rttHalfSec);
        if (this.finishM !== null) {
          initialDist = Math.min(this.finishM, initialDist);
        }
        this.tracks.set(p.id, {
          latest: p,
          lastSeen: p.lastSeen,
          receivedAtMs: nowMs,
          serverStaleSec,
          rttHalfSec,
          curX: p.x,
          curDist: initialDist,
          curSpeed: p.speed,
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
    const safeDt = Math.min(0.08, Math.max(0.001, dt));
    const speedAlpha = 1 - Math.exp(-10 * safeDt);
    const distAlpha = 1 - Math.exp(-7.5 * safeDt);
    const xAlpha = 1 - Math.exp(-12 * safeDt);
    const tiltAlpha = 1 - Math.exp(-12 * safeDt);

    for (const tr of this.tracks.values()) {
      const p = tr.latest;
      const finished = p.finishedAt !== null;

      tr.curSpeed += ((finished ? 0 : p.speed) - tr.curSpeed) * speedAlpha;
      if (!finished) {
        tr.curDist += tr.curSpeed * safeDt;
      }

      const ageSec = finished ? 0 : Math.min(1.4, Math.max(0, (nowMs - tr.receivedAtMs) / 1000));
      let targetDist = finished
        ? p.distanceM
        : p.distanceM + p.speed * (ageSec + tr.serverStaleSec + tr.rttHalfSec);
      if (this.finishM !== null) {
        targetDist = Math.min(this.finishM, targetDist);
      }

      if (Math.abs(targetDist - tr.curDist) > 45) {
        tr.curDist = targetDist;
      } else {
        tr.curDist += (targetDist - tr.curDist) * distAlpha;
      }

      tr.curX += (p.x - tr.curX) * xAlpha;
      tr.curTilt += (p.tiltAngle - tr.curTilt) * tiltAlpha;

      out.push({
        id: p.id,
        name: p.name,
        busId: p.busId,
        color: p.color,
        x: tr.curX,
        distanceM: tr.curDist,
        speed: tr.curSpeed,
        tiltAngle: tr.curTilt,
        nitroActive: p.nitroActive,
        finished,
      });
    }
    return out;
  }
}
