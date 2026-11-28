import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.resolve(__dirname, '.local-leaderboard.json');

const RACE_LANE_CENTERS = [-4.5, -1.5, 1.5, 4.5] as const;
const RACE_COLORS = ['#06d6a0', '#ffbe0b', '#ef476f', '#38bdf8', '#fb8500', '#c77dff'] as const;
const RACE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

interface LocalRacePlayer {
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

interface LocalRaceRoom {
  code: string;
  hostId: string;
  route: { id: string; label: string; subtitle: string; startM: number; finishM: number };
  seed: number;
  status: 'lobby' | 'countdown' | 'racing' | 'finished';
  startAt: number;
  createdAt: number;
  updatedAt: number;
  players: LocalRacePlayer[];
}

const localRaceRooms = new Map<string, LocalRaceRoom>();

interface LocalEntry {
  id: string;
  name: string;
  score: number;
  distanceM: number;
  stopName: string;
  padmaCrossings: number;
  updatedAt: string;
}

function readLocalDb(): { updatedAt: string; entries: LocalEntry[] } {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      return { updatedAt: new Date().toISOString(), entries: [] };
    }
    const parsed = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
    return {
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch {
    return { updatedAt: new Date().toISOString(), entries: [] };
  }
}

function localLeaderboardDevPlugin(): Plugin {
  return {
    name: 'local-leaderboard-dev',
    configureServer(server) {
      server.middlewares.use('/api/leaderboard', (req, res, next) => {
        if (req.method === 'GET') {
          const data = readLocalDb();
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify({ ...data, storage: 'local-dev-json', jsonUrl: null }));
          return;
        }
        if (req.method === 'POST') {
          let raw = '';
          req.on('data', (chunk) => {
            raw += chunk;
          });
          req.on('end', () => {
            try {
              const body = JSON.parse(raw || '{}');
              const name = String(body.name ?? '')
                .replace(/[\u0000-\u001F\u007F<>]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 24);
              if (!name) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'ওস্তাদের নাম লিখুন (১-২৪ অক্ষর)!' }));
                return;
              }
              const score = Math.max(0, Math.min(5_000_000, Math.round(Number(body.score) || 0)));
              const distanceM = Math.max(0, Math.round(Number(body.distanceM) || 0));
              const padmaCrossings = Math.max(0, Math.round(Number(body.padmaCrossings) || 0));
              const stopName = String(body.stopName ?? 'মিরপুর ১০').slice(0, 40);
              const now = new Date().toISOString();

              const data = readLocalDb();
              const entries = [...data.entries];
              const key = name.toLowerCase();
              const idx = entries.findIndex((e) => e.name.toLowerCase() === key);
              let isNewBest = false;

              if (idx >= 0) {
                if (score > entries[idx].score || (score === entries[idx].score && distanceM > entries[idx].distanceM)) {
                  entries[idx] = {
                    ...entries[idx],
                    name,
                    score,
                    distanceM,
                    stopName,
                    padmaCrossings: Math.max(entries[idx].padmaCrossings ?? 0, padmaCrossings),
                    updatedAt: now,
                  };
                  isNewBest = true;
                }
              } else {
                entries.push({
                  id: crypto.randomUUID(),
                  name,
                  score,
                  distanceM,
                  stopName,
                  padmaCrossings,
                  updatedAt: now,
                });
                isNewBest = true;
              }

              entries.sort((a, b) => b.score - a.score || b.distanceM - a.distanceM);
              const ranked = entries.slice(0, 50);
              fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ updatedAt: now, entries: ranked }, null, 2));
              const rank = ranked.findIndex((e) => e.name.toLowerCase() === key) + 1;

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, rank, isNewBest, updatedAt: now, entries: ranked, jsonUrl: null }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

function localRaceDevPlugin(): Plugin {
  const genCode = () => {
    let c = '';
    for (let i = 0; i < 5; i++) c += RACE_ALPHABET[Math.floor(Math.random() * RACE_ALPHABET.length)];
    return c;
  };
  const makeSeed = () => Math.floor(100000 + Math.random() * 2_000_000_000);
  const cleanStr = (v: unknown, maxLen: number, fb = '') => {
    const s = String(v ?? '')
      .replace(/[\u0000-\u001F\u007F<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen);
    return s || fb;
  };
  const advanceRoom = (room: LocalRaceRoom, now: number) => {
    if (room.status === 'countdown' && room.startAt > 0 && now >= room.startAt) {
      room.status = 'racing';
      room.updatedAt = now;
    }
    if (room.status === 'racing' && room.players.length > 0) {
      const active = room.players.filter((p) => now - p.lastSeen < 25_000 || p.finishedAt !== null);
      if (active.length > 0 && active.every((p) => p.finishedAt !== null)) {
        room.status = 'finished';
        room.updatedAt = now;
      }
    }
  };

  return {
    name: 'local-race-dev',
    configureServer(server) {
      server.middlewares.use('/api/race', (req, res, next) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(payload));
        };

        if (req.method === 'GET') {
          const url = new URL(req.url || '/', 'http://127.0.0.1');
          const code = cleanStr(url.searchParams.get('code'), 8).toUpperCase();
          const room = localRaceRooms.get(code);
          if (!room) return send(404, { error: 'রুম খুঁজে পাওয়া যায়নি।' });
          const now = Date.now();
          advanceRoom(room, now);
          return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
        }

        if (req.method === 'POST') {
          let raw = '';
          req.on('data', (chunk) => {
            raw += chunk;
          });
          req.on('end', () => {
            try {
              const body = JSON.parse(raw || '{}') as Record<string, unknown>;
              const action = cleanStr(body.action, 24);
              const now = Date.now();

              if (action === 'create') {
                let code = genCode();
                while (localRaceRooms.has(code)) code = genCode();
                const rawRoute = (body.route || {}) as Record<string, unknown>;
                const startM = Math.max(0, Math.round(Number(rawRoute.startM) || 14500));
                const finishM = Math.max(startM + 800, Math.round(Number(rawRoute.finishM) || 19500));
                const route = {
                  id: cleanStr(rawRoute.id, 40, 'bogura_sirajganj'),
                  label: cleanStr(rawRoute.label, 60, 'বগুড়া ➔ সিরাজগঞ্জ'),
                  subtitle: cleanStr(rawRoute.subtitle, 80, ''),
                  startM,
                  finishM,
                };
                const playerId = crypto.randomUUID();
                const room: LocalRaceRoom = {
                  code,
                  hostId: playerId,
                  route,
                  seed: makeSeed(),
                  status: 'lobby',
                  startAt: 0,
                  createdAt: now,
                  updatedAt: now,
                  players: [
                    {
                      id: playerId,
                      name: cleanStr(body.playerName, 24, 'হোস্ট ওস্তাদ'),
                      busId: cleanStr(body.busId, 32, 'classic_mirpur'),
                      color: RACE_COLORS[0],
                      laneIndex: 0,
                      ready: true,
                      x: RACE_LANE_CENTERS[0],
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
                    },
                  ],
                };
                localRaceRooms.set(code, room);
                return send(200, { ok: true, code, playerId, room, serverTime: now, storage: 'local-dev-memory' });
              }

              const code = cleanStr(body.code, 8).toUpperCase();
              const room = localRaceRooms.get(code);
              if (!room) return send(404, { error: 'এই কোডের রুম পাওয়া যায়নি।' });

              if (action === 'join') {
                if (room.status !== 'lobby') return send(409, { error: 'রেস শুরু হয়ে গেছে!' });
                if (room.players.length >= 6) return send(409, { error: 'রুম ফুল (৬ জন)!' });
                const playerId = crypto.randomUUID();
                const idx = room.players.length;
                const laneIndex = idx % 4;
                room.players.push({
                  id: playerId,
                  name: cleanStr(body.playerName, 24, `ওস্তাদ ${idx + 1}`),
                  busId: cleanStr(body.busId, 32, 'classic_mirpur'),
                  color: RACE_COLORS[idx % RACE_COLORS.length],
                  laneIndex,
                  ready: false,
                  x: RACE_LANE_CENTERS[laneIndex],
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
                });
                room.updatedAt = now;
                return send(200, { ok: true, code, playerId, room, serverTime: now, storage: 'local-dev-memory' });
              }

              const playerId = cleanStr(body.playerId, 64);
              const pIdx = room.players.findIndex((p) => p.id === playerId);
              if (pIdx < 0) return send(404, { error: 'প্লেয়ার পাওয়া যায়নি।' });
              const player = room.players[pIdx];

              if (action === 'ready') {
                player.ready = Boolean(body.ready);
                if (typeof body.busId === 'string') player.busId = cleanStr(body.busId, 32, player.busId);
                player.lastSeen = now;
                room.updatedAt = now;
                return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
              }
              if (action === 'route' && room.hostId === playerId && room.status === 'lobby') {
                const rawRoute = (body.route || {}) as Record<string, unknown>;
                const startM = Math.max(0, Math.round(Number(rawRoute.startM) || 14500));
                const finishM = Math.max(startM + 800, Math.round(Number(rawRoute.finishM) || 19500));
                room.route = {
                  id: cleanStr(rawRoute.id, 40, 'custom'),
                  label: cleanStr(rawRoute.label, 60, 'কাস্টম রুট'),
                  subtitle: cleanStr(rawRoute.subtitle, 80, ''),
                  startM,
                  finishM,
                };
                room.players.forEach((p) => (p.distanceM = startM));
                room.updatedAt = now;
                return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
              }
              if (action === 'start' && room.hostId === playerId && room.status === 'lobby') {
                room.status = 'countdown';
                room.startAt = now + 3600;
                room.seed = makeSeed();
                room.updatedAt = now;
                room.players.forEach((p, idx) => {
                  p.laneIndex = idx % 4;
                  p.x = RACE_LANE_CENTERS[p.laneIndex];
                  p.distanceM = room.route.startM;
                  p.speed = 0;
                  p.finishedAt = null;
                  p.finishMs = null;
                  p.score = 0;
                  p.lastSeen = now;
                });
                return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
              }
              if (action === 'sync') {
                player.x = Number(body.x) || 0;
                player.distanceM = Math.max(room.route.startM, Number(body.distanceM) || room.route.startM);
                player.speed = Math.max(0, Number(body.speed) || 0);
                player.tiltAngle = Number(body.tiltAngle) || 0;
                player.nitroActive = Boolean(body.nitroActive);
                player.score = Math.round(Number(body.score) || 0);
                if (typeof body.busId === 'string') player.busId = cleanStr(body.busId, 32, player.busId);
                player.lastSeen = now;
                if (body.finished && player.finishedAt === null) {
                  player.finishedAt = now;
                  player.finishMs = Math.max(250, Math.round(Number(body.finishMs) || now - room.startAt));
                  player.distanceM = Math.max(player.distanceM, room.route.finishM);
                }
                advanceRoom(room, now);
                room.updatedAt = now;
                return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
              }
              if (action === 'rematch' && room.hostId === playerId) {
                room.status = 'lobby';
                room.startAt = 0;
                room.seed = makeSeed();
                room.updatedAt = now;
                room.players.forEach((p) => {
                  p.distanceM = room.route.startM;
                  p.finishedAt = null;
                  p.finishMs = null;
                  p.ready = p.id === room.hostId;
                });
                return send(200, { ok: true, room, serverTime: now, storage: 'local-dev-memory' });
              }
              if (action === 'leave') {
                room.players.splice(pIdx, 1);
                if (room.players.length === 0) {
                  localRaceRooms.delete(code);
                } else if (room.hostId === playerId) {
                  room.hostId = room.players[0].id;
                  room.players[0].ready = true;
                }
                return send(200, { ok: true, serverTime: now, storage: 'local-dev-memory' });
              }
              return send(400, { error: 'Unknown action' });
            } catch {
              return send(400, { error: 'Invalid JSON' });
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [localLeaderboardDevPlugin(), localRaceDevPlugin()],
  build: {
    outDir: '../build/webgl',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
  preview: {
    host: '127.0.0.1',
    port: 4174,
  },
});
