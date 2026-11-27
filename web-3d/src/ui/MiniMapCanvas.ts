import { type RoadSimulation, ROAD_HALF_WIDTH } from '../core/RoadSimulation';

/**
 * GTA V-style live tactical radar mini-map rendered on Canvas 2D.
 */
export function renderMiniMap(canvas: HTMLCanvasElement, sim: RoadSimulation, nowMs: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Terrain / Water background
  if (sim.isOnBridge) {
    ctx.fillStyle = '#023e8a';
  } else if (sim.currentBiome === 'marine_drive') {
    ctx.fillStyle = '#1b4332';
  } else {
    ctx.fillStyle = '#141a24';
  }
  ctx.fillRect(0, 0, w, h);

  if (sim.currentBiome === 'marine_drive') {
    ctx.fillStyle = '#0077b6';
    ctx.fillRect(w * 0.68, 0, w * 0.32, h);
  }

  // Highway strip
  const roadLeft = w * 0.24;
  const roadW = w * 0.52;
  ctx.fillStyle = '#2b303a';
  ctx.fillRect(roadLeft, 0, roadW, h);

  // Road edges & center yellow line
  ctx.strokeStyle = '#ffbe0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(roadLeft, 0, roadW, h);

  // Map world coordinates to radar pixels (player sits at 76% down)
  const playerScreenY = h * 0.76;
  const toScreenX = (worldX: number) => w / 2 + (worldX / ROAD_HALF_WIDTH) * (roadW * 0.46);
  const toScreenY = (worldZ: number) => playerScreenY + worldZ * 0.62;

  // Passing train on right parallel track
  if (sim.trainActive) {
    const ty = toScreenY(sim.trainZ);
    ctx.fillStyle = '#d90429';
    ctx.fillRect(roadLeft + roadW + 5, ty - 16, 6, 32);
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(roadLeft + roadW + 5, ty - 6, 6, 12);
  }

  // Road entities
  for (const ent of sim.entities) {
    const sy = toScreenY(ent.z);
    if (sy < -10 || sy > h + 10) continue;
    const sx = toScreenX(ent.x);

    if (ent.kind === 'toll_gate') {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(roadLeft, sy - 2.5, roadW, 5);
    } else if (ent.kind === 'deshi_tesla') {
      ctx.fillStyle = '#ef476f';
      ctx.beginPath();
      ctx.moveTo(sx, sy + 5);
      ctx.lineTo(sx - 4, sy - 4);
      ctx.lineTo(sx + 4, sy - 4);
      ctx.closePath();
      ctx.fill();
    } else if (ent.kind === 'bus_stop') {
      ctx.fillStyle = '#06d6a0';
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (ent.kind === 'sergeant') {
      ctx.fillStyle = Math.floor(nowMs / 180) % 2 === 0 ? '#3a86ff' : '#ef233c';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (ent.kind === 'rival_bus') {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(sx - 3.5, sy - 6, 7, 12);
    } else if (ent.kind === 'wrench_pickup' || ent.kind === 'nitro_pickup') {
      ctx.fillStyle = ent.kind === 'wrench_pickup' ? '#38bdf8' : '#fb8500';
      ctx.fillRect(sx - 3, sy - 3, 6, 6);
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sx - 2.5, sy - 4, 5, 8);
    }
  }

  // Player directional arrow (GTA style)
  const px = toScreenX(sim.playerX);
  ctx.fillStyle = '#ffbe0b';
  ctx.strokeStyle = '#1b1f2a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, playerScreenY - 8);
  ctx.lineTo(px + 6, playerScreenY + 6);
  ctx.lineTo(px, playerScreenY + 3);
  ctx.lineTo(px - 6, playerScreenY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
