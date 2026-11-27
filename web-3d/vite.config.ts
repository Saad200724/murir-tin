import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.resolve(__dirname, '.local-leaderboard.json');

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

export default defineConfig({
  base: './',
  plugins: [localLeaderboardDevPlugin()],
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
