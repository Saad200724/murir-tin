export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  distanceM: number;
  stopName: string;
  padmaCrossings: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  updatedAt: string;
  entries: LeaderboardEntry[];
  storage?: string;
  jsonUrl?: string | null;
}

export interface SubmitScorePayload {
  name: string;
  score: number;
  distanceM: number;
  stopName: string;
  padmaCrossings: number;
}

export interface SubmitScoreResult {
  ok: boolean;
  rank: number | null;
  isNewBest: boolean;
  updatedAt: string;
  entries: LeaderboardEntry[];
  jsonUrl?: string | null;
  error?: string;
}

const CACHE_KEY = 'murir_tin_lb_cache_v1';

function readCached(): LeaderboardResponse | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardResponse) : null;
  } catch {
    return null;
  }
}

function writeCached(data: LeaderboardResponse): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const res = await fetch('/api/leaderboard', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as LeaderboardResponse;
    writeCached(data);
    return data;
  } catch (err) {
    const cached = readCached();
    if (cached) return cached;
    throw err;
  }
}

export async function submitLeaderboardScore(payload: SubmitScorePayload): Promise<SubmitScoreResult> {
  const res = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as SubmitScoreResult;
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  writeCached({ updatedAt: data.updatedAt, entries: data.entries, jsonUrl: data.jsonUrl });
  return data;
}
