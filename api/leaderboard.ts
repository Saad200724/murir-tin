import { get, put } from '@vercel/blob';

const BLOB_PATH = 'leaderboard.json';
const MAX_ENTRIES = 50;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const HAS_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);
const LB_HASH_KEY = 'murirtin:leaderboard:players';
const LB_META_KEY = 'murirtin:leaderboard:updatedAt';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  distanceM: number;
  stopName: string;
  padmaCrossings: number;
  updatedAt: string;
}

export interface LeaderboardData {
  updatedAt: string;
  entries: LeaderboardEntry[];
}

function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

function sanitizeStop(raw: unknown): string {
  if (typeof raw !== 'string') return 'মিরপুর ১০';
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40);
  return cleaned || 'মিরপুর ১০';
}

function clampInt(raw: unknown, min: number, max: number): number | null {
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num)) return null;
  const val = Math.round(num);
  if (val < min || val > max) return null;
  return val;
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.distanceM !== a.distanceM) return b.distanceM - a.distanceM;
    return b.padmaCrossings - a.padmaCrossings;
  });
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
    throw new Error(`Upstash leaderboard pipeline HTTP ${res.status}`);
  }
  return (await res.json()) as { result?: unknown; error?: string }[];
}

function parseRedisHashEntries(rawArr: unknown): LeaderboardEntry[] {
  if (!Array.isArray(rawArr) || rawArr.length === 0) return [];
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < rawArr.length; i += 2) {
    try {
      const parsed = JSON.parse(String(rawArr[i + 1])) as LeaderboardEntry;
      if (parsed && typeof parsed.name === 'string' && typeof parsed.score === 'number') {
        entries.push(parsed);
      }
    } catch {
      // Ignore malformed entry
    }
  }
  return entries;
}

async function readLeaderboardFromBlob(): Promise<{ data: LeaderboardData; jsonUrl: string | null }> {
  try {
    const res = await get(BLOB_PATH, { access: 'public', useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) {
      return {
        data: { updatedAt: new Date().toISOString(), entries: [] },
        jsonUrl: null,
      };
    }
    const text = await new Response(res.stream).text();
    const parsed = JSON.parse(text) as Partial<LeaderboardData>;
    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    return {
      data: {
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
        entries: sortEntries(entries).slice(0, MAX_ENTRIES),
      },
      jsonUrl: res.blob.url,
    };
  } catch (err) {
    const name = err instanceof Error ? err.name : '';
    if (name === 'BlobNotFoundError') {
      return {
        data: { updatedAt: new Date().toISOString(), entries: [] },
        jsonUrl: null,
      };
    }
    console.error('Failed to read leaderboard from Vercel Blob:', err);
    throw err;
  }
}

async function seedRedisFromBlobIfEmpty(): Promise<LeaderboardEntry[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { data } = await readLeaderboardFromBlob();
    if (data.entries.length === 0) return [];
    const cmds: unknown[][] = [];
    for (const entry of data.entries) {
      const key = entry.name.toLowerCase();
      cmds.push(['HSET', LB_HASH_KEY, key, JSON.stringify(entry)]);
    }
    cmds.push(['SET', LB_META_KEY, data.updatedAt]);
    await redisPipeline(cmds);
    return data.entries;
  } catch {
    return [];
  }
}

async function readLeaderboardFromRedis(): Promise<LeaderboardData> {
  const resp = await redisPipeline([
    ['HGETALL', LB_HASH_KEY],
    ['GET', LB_META_KEY],
  ]);
  let entries = parseRedisHashEntries(resp[0]?.result);
  let updatedAt =
    typeof resp[1]?.result === 'string' && resp[1].result ? resp[1].result : new Date().toISOString();

  if (entries.length === 0) {
    const migrated = await seedRedisFromBlobIfEmpty();
    if (migrated.length > 0) {
      entries = migrated;
      updatedAt = new Date().toISOString();
    }
  }

  return {
    updatedAt,
    entries: sortEntries(entries).slice(0, MAX_ENTRIES),
  };
}

export async function GET(): Promise<Response> {
  try {
    if (HAS_REDIS) {
      const data = await readLeaderboardFromRedis();
      return Response.json(
        {
          ...data,
          storage: 'upstash-redis',
          jsonUrl: null,
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    const { data, jsonUrl } = await readLeaderboardFromBlob();
    return Response.json(
      {
        ...data,
        storage: 'vercel-blob',
        jsonUrl,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('GET /api/leaderboard error:', err);
    return Response.json(
      { error: 'লাইভ পয়েন্ট টেবিল লোড করা যায়নি।' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const name = sanitizeName(body.name);
    if (!name) {
      return Response.json({ error: 'ওস্তাদের নাম লিখুন (১-২৪ অক্ষর)!' }, { status: 400 });
    }

    const score = clampInt(body.score, 0, 5_000_000);
    const distanceM = clampInt(body.distanceM ?? 0, 0, 1_000_000);
    const padmaCrossings = clampInt(body.padmaCrossings ?? 0, 0, 1_000);
    if (score === null || distanceM === null || padmaCrossings === null) {
      return Response.json({ error: 'Invalid score values' }, { status: 400 });
    }

    const stopName = sanitizeStop(body.stopName);
    const now = new Date().toISOString();
    const key = name.toLowerCase();

    if (HAS_REDIS) {
      // Ensure one-time migration from Vercel Blob runs before first Redis write if hash is empty
      const checkResp = await redisPipeline([['HGET', LB_HASH_KEY, key], ['HLEN', LB_HASH_KEY]]);
      let existingRaw = checkResp[0]?.result;
      const hashLen = Number(checkResp[1]?.result || 0);
      if (hashLen === 0) {
        const migrated = await seedRedisFromBlobIfEmpty();
        const found = migrated.find((m) => m.name.toLowerCase() === key);
        if (found) existingRaw = JSON.stringify(found);
      }

      let isNewBest = false;
      let nextEntry: LeaderboardEntry | null = null;

      if (typeof existingRaw === 'string' && existingRaw) {
        const existing = JSON.parse(existingRaw) as LeaderboardEntry;
        if (score > existing.score || (score === existing.score && distanceM > existing.distanceM)) {
          nextEntry = {
            ...existing,
            name,
            score,
            distanceM,
            stopName,
            padmaCrossings: Math.max(existing.padmaCrossings ?? 0, padmaCrossings),
            updatedAt: now,
          };
          isNewBest = true;
        } else if (name !== existing.name) {
          nextEntry = { ...existing, name };
        }
      } else {
        nextEntry = {
          id: crypto.randomUUID(),
          name,
          score,
          distanceM,
          stopName,
          padmaCrossings,
          updatedAt: now,
        };
        isNewBest = true;
      }

      if (nextEntry) {
        await redisPipeline([
          ['HSET', LB_HASH_KEY, key, JSON.stringify(nextEntry)],
          ['SET', LB_META_KEY, now],
        ]);
      }

      const allResp = await redisPipeline([['HGETALL', LB_HASH_KEY]]);
      const ranked = sortEntries(parseRedisHashEntries(allResp[0]?.result)).slice(0, MAX_ENTRIES);
      const rankIdx = ranked.findIndex((e) => e.name.toLowerCase() === key);

      return Response.json(
        {
          ok: true,
          rank: rankIdx >= 0 ? rankIdx + 1 : null,
          isNewBest,
          updatedAt: now,
          entries: ranked,
          storage: 'upstash-redis',
          jsonUrl: null,
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    const { data } = await readLeaderboardFromBlob();
    const entries = [...data.entries];
    const existingIdx = entries.findIndex((e) => e.name.toLowerCase() === key);

    let isNewBest = false;
    if (existingIdx >= 0) {
      const existing = entries[existingIdx];
      if (score > existing.score || (score === existing.score && distanceM > existing.distanceM)) {
        entries[existingIdx] = {
          ...existing,
          name,
          score,
          distanceM,
          stopName,
          padmaCrossings: Math.max(existing.padmaCrossings ?? 0, padmaCrossings),
          updatedAt: now,
        };
        isNewBest = true;
      } else if (name !== existing.name) {
        entries[existingIdx] = { ...existing, name };
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

    const ranked = sortEntries(entries).slice(0, MAX_ENTRIES);
    const payload: LeaderboardData = {
      updatedAt: now,
      entries: ranked,
    };

    const blob = await put(BLOB_PATH, JSON.stringify(payload, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });

    const rankIdx = ranked.findIndex((e) => e.name.toLowerCase() === key);

    return Response.json(
      {
        ok: true,
        rank: rankIdx >= 0 ? rankIdx + 1 : null,
        isNewBest,
        updatedAt: payload.updatedAt,
        entries: ranked,
        storage: 'vercel-blob',
        jsonUrl: blob.url,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('POST /api/leaderboard error:', err);
    return Response.json(
      { error: 'পয়েন্ট সেভ করতে সমস্যা হয়েছে।' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
