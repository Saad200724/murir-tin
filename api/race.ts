const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const HAS_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);
const ROOM_TTL_SEC = 1800;
const ROOM_TTL_MS = ROOM_TTL_SEC * 1000;
const MAX_PLAYERS = 6;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LANE_CENTERS = [-4.5, -1.5, 1.5, 4.5] as const;
const RACER_COLORS = ['#06d6a0', '#ffbe0b', '#ef476f', '#38bdf8', '#fb8500', '#c77dff'] as const;

type RoomStatus = 'lobby' | 'countdown' | 'racing' | 'finished';

interface SprintRouteConfig {
  id: string;
  label: string;
  subtitle: string;
  startM: number;
  finishM: number;
}

interface RacePlayerState {
  id: string;
  name: string;
  busId: string;
  color: string;
  laneIndex: number;
  ready: boolean;
  x: number;
  distanceM: number;
  speed: number;
  elevationY: number;
  tiltAngle: number;
  nitroActive: boolean;
  crashed: boolean;
  finishedAt: number | null;
  finishMs: number | null;
  score: number;
  lastSeen: number;
}

interface RaceRoomState {
  code: string;
  hostId: string;
  route: SprintRouteConfig;
  seed: number;
  status: RoomStatus;
  startAt: number;
  createdAt: number;
  updatedAt: number;
  players: RacePlayerState[];
}

interface RoomMeta {
  code: string;
  hostId: string;
  route: SprintRouteConfig;
  seed: number;
  status: RoomStatus;
  startAt: number;
  createdAt: number;
  updatedAt: number;
}

declare global {
  var __murirTinRaceRooms: Map<string, RaceRoomState> | undefined;
}

const memRooms = (globalThis.__murirTinRaceRooms ??= new Map<string, RaceRoomState>());

const DEFAULT_ROUTE: SprintRouteConfig = {
  id: 'bogura_sirajganj',
  label: 'বগুড়া ➔ সিরাজগঞ্জ',
  subtitle: 'বগুড়া বাইপাস ফ্লাইওভার হয়ে সিরাজগঞ্জ স্প্রিন্ট (~৫০ কিমি)',
  startM: 14500,
  finishM: 19500,
};

function sanitizeStr(raw: unknown, maxLen: number, fallback = ''): string {
  if (typeof raw !== 'string') return fallback;
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
  return cleaned || fallback;
}

function sanitizeCode(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

function clampNum(raw: unknown, min: number, max: number, fallback = 0): number {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function sanitizeRoute(raw: unknown): SprintRouteConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_ROUTE;
  const obj = raw as Record<string, unknown>;
  const startM = Math.round(clampNum(obj.startM, 0, 82000, DEFAULT_ROUTE.startM));
  const finishM = Math.round(clampNum(obj.finishM, startM + 800, 84000, Math.max(startM + 1000, DEFAULT_ROUTE.finishM)));
  return {
    id: sanitizeStr(obj.id, 40, DEFAULT_ROUTE.id),
    label: sanitizeStr(obj.label, 60, DEFAULT_ROUTE.label),
    subtitle: sanitizeStr(obj.subtitle, 80, DEFAULT_ROUTE.subtitle),
    startM,
    finishM,
  };
}

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

function makeSeed(): number {
  return Math.floor(100000 + Math.random() * 2_000_000_000);
}

function roomKey(code: string): string {
  return `murirtin:race:${code}`;
}

async function redisPipeline(commands: unknown[][]): Promise<{ result?: unknown; error?: string }[]> {
  const res = await fetch(`${REDIS_URL.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    throw new Error(`Upstash pipeline HTTP ${res.status}`);
  }
  return (await res.json()) as { result?: unknown; error?: string }[];
}

function purgeExpiredMemory(): void {
  const now = Date.now();
  for (const [code, room] of memRooms.entries()) {
    if (now - room.updatedAt > ROOM_TTL_MS) {
      memRooms.delete(code);
    }
  }
}

async function loadRoom(code: string): Promise<RaceRoomState | null> {
  if (!code) return null;
  if (HAS_REDIS) {
    const resp = await redisPipeline([['HGETALL', roomKey(code)]]);
    const rawArr = resp[0]?.result;
    if (!Array.isArray(rawArr) || rawArr.length === 0) return null;

    let meta: RoomMeta | null = null;
    const players: RacePlayerState[] = [];
    for (let i = 0; i < rawArr.length; i += 2) {
      const field = String(rawArr[i]);
      const val = String(rawArr[i + 1]);
      if (field === 'meta') {
        meta = JSON.parse(val) as RoomMeta;
      } else if (field.startsWith('p:')) {
        players.push(JSON.parse(val) as RacePlayerState);
      }
    }
    if (!meta) return null;
    players.sort((a, b) => a.laneIndex - b.laneIndex || a.name.localeCompare(b.name));
    return { ...meta, players };
  }

  purgeExpiredMemory();
  return memRooms.get(code) ?? null;
}

async function saveRoomMeta(room: RaceRoomState): Promise<void> {
  if (HAS_REDIS) {
    const meta: RoomMeta = {
      code: room.code,
      hostId: room.hostId,
      route: room.route,
      seed: room.seed,
      status: room.status,
      startAt: room.startAt,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
    const cmds: unknown[][] = [['HSET', roomKey(room.code), 'meta', JSON.stringify(meta)]];
    for (const p of room.players) {
      cmds.push(['HSET', roomKey(room.code), `p:${p.id}`, JSON.stringify(p)]);
    }
    cmds.push(['EXPIRE', roomKey(room.code), ROOM_TTL_SEC]);
    await redisPipeline(cmds);
    return;
  }
  memRooms.set(room.code, room);
}

async function savePlayerField(code: string, player: RacePlayerState, meta?: RaceRoomState): Promise<void> {
  if (HAS_REDIS) {
    const cmds: unknown[][] = [['HSET', roomKey(code), `p:${player.id}`, JSON.stringify(player)]];
    if (meta) {
      const m: RoomMeta = {
        code: meta.code,
        hostId: meta.hostId,
        route: meta.route,
        seed: meta.seed,
        status: meta.status,
        startAt: meta.startAt,
        createdAt: meta.createdAt,
        updatedAt: meta.updatedAt,
      };
      cmds.push(['HSET', roomKey(code), 'meta', JSON.stringify(m)]);
    }
    cmds.push(['EXPIRE', roomKey(code), ROOM_TTL_SEC]);
    await redisPipeline(cmds);
    return;
  }
  if (meta) {
    memRooms.set(code, meta);
  }
}

async function removePlayerField(room: RaceRoomState, playerId: string): Promise<void> {
  if (HAS_REDIS) {
    if (room.players.length === 0) {
      await redisPipeline([['DEL', roomKey(room.code)]]);
    } else {
      const m: RoomMeta = {
        code: room.code,
        hostId: room.hostId,
        route: room.route,
        seed: room.seed,
        status: room.status,
        startAt: room.startAt,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      };
      await redisPipeline([
        ['HDEL', roomKey(room.code), `p:${playerId}`],
        ['HSET', roomKey(room.code), 'meta', JSON.stringify(m)],
        ['EXPIRE', roomKey(room.code), ROOM_TTL_SEC],
      ]);
    }
    return;
  }
  if (room.players.length === 0) {
    memRooms.delete(room.code);
  } else {
    memRooms.set(room.code, room);
  }
}

function advanceRaceLifecycle(room: RaceRoomState, now: number): boolean {
  let changed = false;
  if (room.status === 'countdown' && room.startAt > 0 && now >= room.startAt) {
    room.status = 'racing';
    room.updatedAt = now;
    changed = true;
  }
  if (room.status === 'racing' && room.players.length > 0) {
    const active = room.players.filter((p) => now - p.lastSeen < 25_000 || p.finishedAt !== null);
    if (active.length > 0 && active.every((p) => p.finishedAt !== null)) {
      room.status = 'finished';
      room.updatedAt = now;
      changed = true;
    }
  }
  return changed;
}

function jsonRes(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

function storageLabel(): string {
  return HAS_REDIS ? 'upstash-redis' : 'fluid-memory';
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const code = sanitizeCode(url.searchParams.get('code'));
    if (!code) {
      return jsonRes({ error: 'রুম কোড দেওয়া হয়নি।' }, 400);
    }

    const room = await loadRoom(code);
    if (!room) {
      return jsonRes({ error: 'রুম খুঁজে পাওয়া যায়নি বা মেয়াদ শেষ হয়ে গেছে।' }, 404);
    }

    const now = Date.now();
    if (advanceRaceLifecycle(room, now)) {
      await saveRoomMeta(room);
    }

    return jsonRes({
      ok: true,
      room,
      serverTime: now,
      storage: storageLabel(),
    });
  } catch (err) {
    console.error('GET /api/race error:', err);
    return jsonRes({ error: 'রেস রুম লোড করা যায়নি।' }, 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonRes({ error: 'Invalid JSON payload' }, 400);
    }

    const action = sanitizeStr(body.action, 24);
    const now = Date.now();

    if (action === 'create') {
      const name = sanitizeStr(body.playerName, 24, 'হোস্ট ওস্তাদ');
      const busId = sanitizeStr(body.busId, 32, 'classic_mirpur');
      const route = sanitizeRoute(body.route);

      let code = generateRoomCode();
      for (let i = 0; i < 6; i++) {
        const exists = await loadRoom(code);
        if (!exists) break;
        code = generateRoomCode();
      }

      const playerId = crypto.randomUUID();
      const hostPlayer: RacePlayerState = {
        id: playerId,
        name,
        busId,
        color: RACER_COLORS[0],
        laneIndex: 0,
        ready: true,
        x: LANE_CENTERS[0],
        distanceM: route.startM,
        speed: 0,
        elevationY: 0,
        tiltAngle: 0,
        nitroActive: false,
        crashed: false,
        finishedAt: null,
        finishMs: null,
        score: 0,
        lastSeen: now,
      };

      const room: RaceRoomState = {
        code,
        hostId: playerId,
        route,
        seed: makeSeed(),
        status: 'lobby',
        startAt: 0,
        createdAt: now,
        updatedAt: now,
        players: [hostPlayer],
      };

      await saveRoomMeta(room);
      return jsonRes({ ok: true, code, playerId, room, serverTime: now, storage: storageLabel() });
    }

    const code = sanitizeCode(body.code);
    if (!code) {
      return jsonRes({ error: 'সঠিক রুম কোড লিখুন!' }, 400);
    }

    const room = await loadRoom(code);
    if (!room) {
      return jsonRes({ error: 'এই কোডের কোনো রুম পাওয়া যায়নি!' }, 404);
    }

    if (action === 'join') {
      if (room.status !== 'lobby') {
        return jsonRes({ error: 'এই রুমে রেস ইতিমধ্যে শুরু হয়ে গেছে!' }, 409);
      }
      if (room.players.length >= MAX_PLAYERS) {
        return jsonRes({ error: 'রুম ফুল (সর্বোচ্চ ৬ জন)!' }, 409);
      }

      const name = sanitizeStr(body.playerName, 24, `ওস্তাদ ${room.players.length + 1}`);
      const busId = sanitizeStr(body.busId, 32, 'classic_mirpur');
      const playerId = crypto.randomUUID();
      const idx = room.players.length;
      const laneIndex = idx % 4;
      const newPlayer: RacePlayerState = {
        id: playerId,
        name,
        busId,
        color: RACER_COLORS[idx % RACER_COLORS.length],
        laneIndex,
        ready: false,
        x: LANE_CENTERS[laneIndex],
        distanceM: room.route.startM,
        speed: 0,
        elevationY: 0,
        tiltAngle: 0,
        nitroActive: false,
        crashed: false,
        finishedAt: null,
        finishMs: null,
        score: 0,
        lastSeen: now,
      };

      room.players.push(newPlayer);
      room.updatedAt = now;
      await savePlayerField(code, newPlayer, room);
      return jsonRes({ ok: true, code, playerId, room, serverTime: now, storage: storageLabel() });
    }

    const playerId = sanitizeStr(body.playerId, 64);
    const pIdx = room.players.findIndex((p) => p.id === playerId);
    if (pIdx < 0) {
      return jsonRes({ error: 'আপনি এই রুমে নেই।' }, 404);
    }
    const player = room.players[pIdx];

    if (action === 'ready') {
      player.ready = Boolean(body.ready);
      if (typeof body.busId === 'string') {
        player.busId = sanitizeStr(body.busId, 32, player.busId);
      }
      if (typeof body.playerName === 'string') {
        player.name = sanitizeStr(body.playerName, 24, player.name);
      }
      player.lastSeen = now;
      room.updatedAt = now;
      await savePlayerField(code, player, room);
      return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
    }

    if (action === 'route') {
      if (room.hostId !== playerId) {
        return jsonRes({ error: 'শুধু হোস্ট রুট পাল্টাতে পারবে!' }, 403);
      }
      if (room.status !== 'lobby') {
        return jsonRes({ error: 'রেস শুরু হওয়ার পর রুট পাল্টানো যাবে না!' }, 409);
      }
      room.route = sanitizeRoute(body.route);
      room.updatedAt = now;
      for (const p of room.players) {
        p.distanceM = room.route.startM;
      }
      await saveRoomMeta(room);
      return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
    }

    if (action === 'start') {
      if (room.hostId !== playerId) {
        return jsonRes({ error: 'শুধু হোস্ট রেস শুরু করতে পারবে!' }, 403);
      }
      if (room.status !== 'lobby') {
        return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
      }
      room.status = 'countdown';
      room.startAt = now + 3600;
      room.seed = makeSeed();
      room.updatedAt = now;
      for (let i = 0; i < room.players.length; i++) {
        const p = room.players[i];
        p.laneIndex = i % 4;
        p.x = LANE_CENTERS[p.laneIndex];
        p.distanceM = room.route.startM;
        p.speed = 0;
        p.elevationY = 0;
        p.tiltAngle = 0;
        p.nitroActive = false;
        p.crashed = false;
        p.finishedAt = null;
        p.finishMs = null;
        p.score = 0;
        p.lastSeen = now;
      }
      await saveRoomMeta(room);
      return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
    }

    if (action === 'sync') {
      player.x = clampNum(body.x, -6, 6, player.x);
      player.distanceM = clampNum(body.distanceM, room.route.startM, room.route.finishM + 1000, player.distanceM);
      player.speed = clampNum(body.speed, 0, 120, player.speed);
      player.elevationY = clampNum(body.elevationY, 0, 10, 0);
      player.tiltAngle = clampNum(body.tiltAngle, -0.5, 0.5, 0);
      player.nitroActive = Boolean(body.nitroActive);
      player.crashed = Boolean(body.crashed);
      player.score = Math.round(clampNum(body.score, 0, 5_000_000, player.score));
      if (typeof body.busId === 'string') {
        player.busId = sanitizeStr(body.busId, 32, player.busId);
      }
      player.lastSeen = now;

      let metaChanged = false;
      if (body.finished && player.finishedAt === null) {
        player.finishedAt = now;
        const rawMs = typeof body.finishMs === 'number' ? body.finishMs : now - room.startAt;
        player.finishMs = Math.max(250, Math.round(rawMs));
        player.distanceM = Math.max(player.distanceM, room.route.finishM);
        metaChanged = true;
      }

      if (advanceRaceLifecycle(room, now)) {
        metaChanged = true;
      }
      room.updatedAt = now;
      await savePlayerField(code, player, metaChanged ? room : undefined);
      return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
    }

    if (action === 'rematch') {
      if (room.hostId !== playerId) {
        return jsonRes({ error: 'শুধু হোস্ট রি-ম্যাচ শুরু করতে পারবে!' }, 403);
      }
      room.status = 'lobby';
      room.startAt = 0;
      room.seed = makeSeed();
      room.updatedAt = now;
      for (let i = 0; i < room.players.length; i++) {
        const p = room.players[i];
        p.laneIndex = i % 4;
        p.x = LANE_CENTERS[p.laneIndex];
        p.distanceM = room.route.startM;
        p.speed = 0;
        p.tiltAngle = 0;
        p.nitroActive = false;
        p.crashed = false;
        p.finishedAt = null;
        p.finishMs = null;
        p.score = 0;
        p.ready = p.id === room.hostId;
        p.lastSeen = now;
      }
      await saveRoomMeta(room);
      return jsonRes({ ok: true, room, serverTime: now, storage: storageLabel() });
    }

    if (action === 'leave') {
      room.players.splice(pIdx, 1);
      if (room.hostId === playerId && room.players.length > 0) {
        room.hostId = room.players[0].id;
        room.players[0].ready = true;
      }
      room.updatedAt = now;
      await removePlayerField(room, playerId);
      return jsonRes({ ok: true, serverTime: now, storage: storageLabel() });
    }

    return jsonRes({ error: 'Unknown action' }, 400);
  } catch (err) {
    console.error('POST /api/race error:', err);
    return jsonRes({ error: 'মাল্টিপ্লেয়ার সার্ভারে সমস্যা হয়েছে।' }, 500);
  }
}
