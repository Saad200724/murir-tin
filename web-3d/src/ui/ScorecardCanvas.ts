import { toHighwayKm } from '../core/BangladeshRoute';
import { formatRaceTime } from '../core/MultiplayerTypes';
import { getViralTitle } from '../core/RoadSimulation';

export interface ScorecardStats {
  playerName?: string;
  score: number;
  distanceM: number;
  takaEarned: number;
  plasticScrapes: number;
  teslaDodges: number;
  passengers: number;
  stopName: string;
  padmaCrossings: number;
  totalTollPaid: number;
}

/**
 * Renders a crisp Dhaka Meme Scorecard without any text collision across Bengali & numeric labels.
 */
export function renderMemeScorecard(canvas: HTMLCanvasElement, stats: ScorecardStats): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = 760;
  const h = 470;
  canvas.width = w;
  canvas.height = h;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#181c28');
  grad.addColorStop(1, '#2c1b3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#ffbe0b';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.fillStyle = '#ffbe0b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 29px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText('🚌 মুড়ির টিন এক্সপ্রেস — রিপোর্ট কার্ড', w / 2, 62, w - 80);

  const cleanName = stats.playerName?.trim();
  const title = getViralTitle(stats.score);
  if (cleanName) {
    ctx.fillStyle = '#fffdf7';
    ctx.font = 'bold 20px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(`ওস্তাদ: ${cleanName}`, w / 2, 94, w - 90);
    ctx.fillStyle = '#06d6a0';
    ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(`খেতাব: ${title}`, w / 2, 124, w - 90);
  } else {
    ctx.fillStyle = '#06d6a0';
    ctx.font = 'bold 24px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(`খেতাব: ${title}`, w / 2, 108, w - 90);
  }

  const cards: [string, string][] = [
    ['🏆 মোট পয়েন্ট', `${stats.score.toLocaleString()} pts`],
    ['📍 শেষ লোকেশন ও দূরত্ব', `${stats.stopName} (${toHighwayKm(stats.distanceM)} km)`],
    ['🌉 সেতু ও টোল', `${stats.padmaCrossings} টি সেতু • টোল ৳${stats.totalTollPaid.toLocaleString()}`],
    ['💥 চাপানি ও টেসলা ডজ', `ঘষা ${stats.plasticScrapes}টি • ডজ ${stats.teslaDodges}টি`],
    ['👥 বাদুড়ঝোলা যাত্রী', `${stats.passengers} জন`],
    ['💵 নিট ভাড়া আদায়', `৳ ${stats.takaEarned.toLocaleString()}`],
  ];

  const cardW = 326;
  const cardH = 68;
  const startX = 44;
  const colGap = 20;
  const startY = 148;
  const rowGap = 14;

  cards.forEach(([label, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cardW + colGap);
    const y = startY + row * (cardH + rowGap);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(x, y, cardW, cardH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, cardW, cardH);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 15px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(label, x + 14, y + 24, cardW - 28);

    ctx.fillStyle = '#ffbe0b';
    ctx.font = 'bold 20px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(val, x + 14, y + 53, cardW - 28);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffb3c6';
  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText('ঠাকুরগাঁও ➔ কক্সবাজার! সাহস থাকলে murirtin-express.vercel.app-এ ভাঙ্গো! 🔥', w / 2, 434, w - 80);
}

export interface RacePodiumStats {
  routeLabel: string;
  roomCode: string;
  localPlayerId: string;
  standings: {
    id: string;
    name: string;
    color: string;
    finishMs: number | null;
    distanceM: number;
    busName: string;
  }[];
}

/**
 * Renders a shareable Multiplayer Race Podium scorecard on Canvas 2D.
 */
export function renderRacePodiumCard(canvas: HTMLCanvasElement, stats: RacePodiumStats): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = 760;
  const h = 470;
  canvas.width = w;
  canvas.height = h;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#10212b');
  grad.addColorStop(1, '#1d1b38');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = '#ffbe0b';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.fillStyle = '#ffbe0b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(`🏁 মুড়ির টিন বন্ধু রেস — ${stats.routeLabel}`, w / 2, 62, w - 80);

  ctx.fillStyle = '#72efdd';
  ctx.font = 'bold 18px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(`রুম কোড: ${stats.roomCode} • ${stats.standings.length} জন ওস্তাদ`, w / 2, 94, w - 80);

  const leaderMs = stats.standings[0]?.finishMs ?? null;
  const rows = stats.standings.slice(0, 6);
  const startY = 118;
  const rowH = 46;
  const gap = 6;

  rows.forEach((p, idx) => {
    const y = startY + idx * (rowH + gap);
    const isSelf = p.id === stats.localPlayerId;
    ctx.fillStyle = isSelf ? 'rgba(6, 214, 160, 0.22)' : 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(46, y, w - 92, rowH);
    ctx.strokeStyle = isSelf ? '#06d6a0' : 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = isSelf ? 2 : 1.2;
    ctx.strokeRect(46, y, w - 92, rowH);

    const medal = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffbe0b';
    ctx.font = 'bold 20px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(medal, 62, y + 29, 68);

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(140, y + 23, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffdf7';
    ctx.font = 'bold 19px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(`${p.name}${isSelf ? ' (আপনি)' : ''}`, 158, y + 23, 255);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 13px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(p.busName, 158, y + 40, 255);

    ctx.textAlign = 'right';
    ctx.fillStyle = p.finishMs !== null ? '#72efdd' : '#ffd166';
    ctx.font = 'bold 19px "Hind Siliguri", "Segoe UI", sans-serif';
    let rightText = p.finishMs !== null ? formatRaceTime(p.finishMs) : `${toHighwayKm(p.distanceM)} km`;
    if (idx > 0 && p.finishMs !== null && leaderMs !== null) {
      rightText += ` (+${((p.finishMs - leaderMs) / 1000).toFixed(1)}s)`;
    }
    ctx.fillText(rightText, w - 62, y + 29, 250);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText('বন্ধুদের সাথে রেস করতে ভিজিট করুন: murirtin-express.vercel.app 🔥', w / 2, 438, w - 80);
}
