import { BD_ROUTE_SEGMENTS } from './BangladeshRoute';

export type RaceRoomStatus = 'lobby' | 'countdown' | 'racing' | 'finished';

export interface SprintRouteConfig {
  id: string;
  label: string;
  subtitle: string;
  startM: number;
  finishM: number;
}

export interface RacePlayerState {
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

export interface RaceRoomState {
  code: string;
  hostId: string;
  route: SprintRouteConfig;
  seed: number;
  status: RaceRoomStatus;
  startAt: number;
  createdAt: number;
  updatedAt: number;
  players: RacePlayerState[];
}

export interface InterpolatedOpponent {
  id: string;
  name: string;
  busId: string;
  color: string;
  x: number;
  distanceM: number;
  speed: number;
  tiltAngle: number;
  nitroActive: boolean;
  finished: boolean;
}

export const RACER_COLORS = [
  '#06d6a0',
  '#ffbe0b',
  '#ef476f',
  '#38bdf8',
  '#fb8500',
  '#c77dff',
] as const;

export const SPRINT_ROUTE_PRESETS: readonly SprintRouteConfig[] = [
  {
    id: 'bogura_sirajganj',
    label: 'বগুড়া ➔ সিরাজগঞ্জ',
    subtitle: 'বগুড়া বাইপাস ফ্লাইওভার হয়ে সিরাজগঞ্জ স্প্রিন্ট (~৫০ কিমি)',
    startM: 14500,
    finishM: 19500,
  },
  {
    id: 'jamuna_dash',
    label: 'সিরাজগঞ্জ ➔ যমুনা সেতু পার',
    subtitle: '৪.৮ কিমি যমুনা সেতু + পাশে রেলগাড়ি (~৪২ কিমি)',
    startM: 23500,
    finishM: 27700,
  },
  {
    id: 'dhaka_padma',
    label: 'ঢাকা ➔ পদ্মা সেতু স্প্রিন্ট',
    subtitle: 'মেয়র হানিফ ফ্লাইওভার ও স্বপ্নের পদ্মা সেতু (~৫৭ কিমি)',
    startM: 41800,
    finishM: 47500,
  },
  {
    id: 'daudkandi_gumti',
    label: 'দাউদকান্দি ➔ গোমতী বৃষ্টি রেস',
    subtitle: 'কালবৈশাখী বৃষ্টি ও লাল-সোনালী গোমতী সেতু (~৪৭ কিমি)',
    startM: 52500,
    finishM: 57200,
  },
  {
    id: 'ctg_karnaphuli',
    label: 'চট্টগ্রাম ➔ শাহ আমানত নাইট রেস',
    subtitle: 'পাহাড়ি সূর্যাস্ত ও ঝুলন্ত কর্ণফুলী সেতু (~৪৬ কিমি)',
    startM: 71800,
    finishM: 76400,
  },
  {
    id: 'coxs_marine',
    label: 'কক্সবাজার মেরিন ড্রাইভ ডার্বি',
    subtitle: 'বামে পাহাড়, ডানে বঙ্গোপসাগর ফাইনাল ডার্বি (~৫০ কিমি)',
    startM: 76200,
    finishM: 81200,
  },
] as const;

export function buildCustomSprintRoute(startSegId: string, endSegId: string): SprintRouteConfig | null {
  const startIdx = BD_ROUTE_SEGMENTS.findIndex((s) => s.id === startSegId);
  const endIdx = BD_ROUTE_SEGMENTS.findIndex((s) => s.id === endSegId);
  if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return null;

  const startSeg = BD_ROUTE_SEGMENTS[startIdx];
  const endSeg = BD_ROUTE_SEGMENTS[endIdx];
  const startM = startSeg.startM;
  const finishM = Math.min(endSeg.endM, startM + 15000);
  if (finishM <= startM + 800) return null;

  const clean = (s: string) => s.replace(' 🌉', '').replace(' 🏖️', '');
  const kmLabel = ((finishM - startM) / 100).toFixed(0);
  return {
    id: `custom:${startSeg.id}:${endSeg.id}`,
    label: `${clean(startSeg.name)} ➔ ${clean(endSeg.name)}`,
    subtitle: `কাস্টম রুট (~${kmLabel} কিমি)`,
    startM,
    finishM,
  };
}

export function formatRaceTime(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return 'চলছে...';
  const totalSec = ms / 1000;
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const secStr = secs < 10 ? `0${secs.toFixed(1)}` : secs.toFixed(1);
  return `${String(mins).padStart(2, '0')}:${secStr}`;
}

export function sortRaceStandings(players: RacePlayerState[]): RacePlayerState[] {
  return [...players].sort((a, b) => {
    const aDone = a.finishMs !== null && a.finishMs > 0;
    const bDone = b.finishMs !== null && b.finishMs > 0;
    if (aDone && bDone) return (a.finishMs as number) - (b.finishMs as number);
    if (aDone) return -1;
    if (bDone) return 1;
    if (b.distanceM !== a.distanceM) return b.distanceM - a.distanceM;
    return b.score - a.score;
  });
}
