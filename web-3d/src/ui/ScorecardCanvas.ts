import { toHighwayKm } from '../core/BangladeshRoute';
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
