import { getViralTitle } from '../core/RoadSimulation';

export interface ScorecardStats {
  score: number;
  distanceM: number;
  takaEarned: number;
  plasticScrapes: number;
  teslaDodges: number;
  passengers: number;
  stopName: string;
}

/**
 * Renders a shareable Dhaka Meme Scorecard image onto a <canvas> for Facebook / Messenger flexing!
 */
export function renderMemeScorecard(canvas: HTMLCanvasElement, stats: ScorecardStats): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = 640;
  const h = 380;
  canvas.width = w;
  canvas.height = h;

  // Rickshaw-art vibrant gradient background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1b1f2a');
  grad.addColorStop(1, '#2d1e3e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Rickshaw yellow & crimson double border
  ctx.strokeStyle = '#ffbe0b';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Header
  ctx.fillStyle = '#ffbe0b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText('🚌 মুড়ির টিন এক্সপ্রেস — রিপোর্ট কার্ড', w / 2, 66);

  // Viral Title Badge
  const title = getViralTitle(stats.score);
  ctx.fillStyle = '#06d6a0';
  ctx.font = 'bold 24px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText(`খেতাব: ${title}`, w / 2, 108);

  // Stats Grid
  const rows: [string, string][] = [
    ['🏆 মোট পয়েন্ট:', `${stats.score.toLocaleString()} pts`],
    ['📍 শেষ স্টপ:', `${stats.stopName} (${Math.floor(stats.distanceM)}m)`],
    ['💥 প্লাস্টিক ঘষা:', `${stats.plasticScrapes} টি`],
    ['⚡ দেশি টেসলা ডজ:', `${stats.teslaDodges} টি`],
    ['👥 বাদুড়ঝোলা যাত্রী:', `${stats.passengers} জন`],
    ['💵 ভাড়া আদায়:', `৳ ${stats.takaEarned.toLocaleString()}`],
  ];

  ctx.font = '600 20px "Hind Siliguri", "Segoe UI", sans-serif';
  rows.forEach(([label, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 52 : 342;
    const y = 162 + row * 52;

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x - 12, y - 28, 272, 40);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(label, x, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffbe0b';
    ctx.fillText(val, x + 248, y);
  });

  // Footer CTA
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffb3c6';
  ctx.font = 'bold 17px "Hind Siliguri", "Segoe UI", sans-serif';
  ctx.fillText('ব্রেক নাই, লুকিং গ্লাস নাই — সাহস থাকলে এই স্কোর ভাঙ্গো! 🔥', w / 2, 344);
}
