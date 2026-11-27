import * as THREE from 'three';
import { type GraphicsPreset } from '../core/SaveStore';

const PRESET_TEX_SCALE: Record<GraphicsPreset, number> = {
  low: 0.25,
  medium: 0.5,
  high: 1.0,
  ultra: 2.0,
};

function makeCanvasTex(
  baseW: number,
  baseH: number,
  scale: number,
  anisotropy: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const w = Math.max(64, Math.round(baseW * scale));
  const h = Math.max(32, Math.round(baseH * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(w / baseW, h / baseH);
  draw(ctx, baseW, baseH);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, anisotropy);
  return tex;
}

export function disposeLivery(group: THREE.Group): void {
  const livery = group.getObjectByName('rajdhani-livery');
  if (!livery) return;
  livery.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry.dispose();
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
  });
  group.remove(livery);
}

/**
 * Attaches crisp, graphics-preset-scaled Bengali signage & colorful Rajdhani Express art decals.
 * Low = fast 256px textures; Ultra = 2048px sharp textures with full anisotropic filtering.
 */
export function attachRajdhaniLivery(
  busGroup: THREE.Group,
  preset: GraphicsPreset,
  maxAnisotropy: number
): void {
  disposeLivery(busGroup);

  const scale = PRESET_TEX_SCALE[preset] ?? 1.0;
  const aniso = preset === 'ultra' ? maxAnisotropy : preset === 'high' ? Math.min(8, maxAnisotropy) : 2;
  const livery = new THREE.Group();
  livery.name = 'rajdhani-livery';

  const makeDecal = (w: number, h: number, tex: THREE.CanvasTexture, roughness = 0.35) =>
    new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: tex, roughness, metalness: 0.08 })
    );

  // 1. Front Windshield Banner ("রাজধানী সুপার সার্ভিস লিঃ" + Route Strip)
  const frontBannerTex = makeCanvasTex(1024, 192, scale, aniso, (ctx, w, h) => {
    ctx.fillStyle = '#d90429';
    ctx.fillRect(0, 0, w, h * 0.72);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 84px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('রাজধানী সুপার সার্ভিস লিঃ', w / 2, 102, w - 40);
    ctx.fillStyle = '#ffbe0b';
    ctx.font = 'bold 34px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('মিরপুর ১৪ • গাবতলী • সাভার • ঢাকা • কক্সবাজার', w / 2, 174, w - 40);
  });
  const frontBanner = makeDecal(2.02, 0.36, frontBannerTex);
  frontBanner.position.set(0, 2.22, -2.895);
  frontBanner.rotation.y = Math.PI;
  frontBanner.rotation.x = 0.14;
  livery.add(frontBanner);

  // 2. Front & Rear BD Green License Plates ("ঢাকা মেট্রো-ব ১৫-৪০২৫")
  const plateTex = makeCanvasTex(384, 160, scale, aniso, (ctx, w, h) => {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, w - 10, h - 10);
    ctx.fillStyle = '#062c22';
    ctx.textAlign = 'center';
    ctx.font = 'bold 46px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('ঢাকা মেট্রো-ব', w / 2, 68, w - 24);
    ctx.font = 'bold 54px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('১৫-৪০২৫', w / 2, 132, w - 24);
  });
  const frontPlate = makeDecal(0.54, 0.22, plateTex, 0.3);
  frontPlate.position.set(0, 0.50, -2.975);
  frontPlate.rotation.y = Math.PI;
  const rearPlate = makeDecal(0.54, 0.22, plateTex.clone(), 0.3);
  rearPlate.material.map!.needsUpdate = true;
  rearPlate.position.set(0, 0.50, 2.965);
  livery.add(frontPlate, rearPlate);

  // 3. Left & Right Colorful Side Livery Skirts (Diagonal Chevron Stripes + VIP + Sunburst)
  const sideTex = makeCanvasTex(1024, 256, scale, aniso, (ctx, w, h) => {
    ctx.fillStyle = '#b81d38';
    ctx.fillRect(0, 0, w, h);

    // Bold diagonal blue/yellow/green chevron waves matching the Rajdhani reference
    const drawWave = (color: string, yOff: number, thick: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = thick;
      ctx.beginPath();
      ctx.moveTo(0, h - 24 - yOff);
      ctx.lineTo(w * 0.28, 60 - yOff);
      ctx.lineTo(w * 0.52, 130 - yOff);
      ctx.lineTo(w * 0.78, 46 - yOff);
      ctx.lineTo(w, h - 30 - yOff);
      ctx.stroke();
    };
    drawWave('#1d4ed8', 18, 22);
    drawWave('#ffbe0b', 0, 16);
    drawWave('#06d6a0', -16, 10);

    // Golden Sunburst Emblem
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.arc(w * 0.48, h * 0.54, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.arc(w * 0.48, h * 0.54, 30, 0, Math.PI * 2);
    ctx.fill();

    // Multicolor VIP Badge
    ctx.font = '900 58px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('V', w * 0.16, h * 0.78);
    ctx.fillStyle = '#ffbe0b';
    ctx.fillText('I', w * 0.21, h * 0.78);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('P', w * 0.24, h * 0.78);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.font = 'bold 42px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('রাজধানী সুপার সার্ভিস', w - 34, 58, 420);
  });

  const leftSide = makeDecal(5.38, 0.88, sideTex);
  leftSide.position.set(-1.164, 0.94, 0.10);
  leftSide.rotation.y = -Math.PI / 2;

  const rightSide = makeDecal(5.38, 0.88, sideTex.clone());
  rightSide.material.map!.needsUpdate = true;
  rightSide.position.set(1.164, 0.94, 0.10);
  rightSide.rotation.y = Math.PI / 2;
  livery.add(leftSide, rightSide);

  // 4. Rear Graphics (what players see 95% of the race behind the bus!)
  const rearArtTex = makeCanvasTex(1024, 384, scale, aniso, (ctx, w, h) => {
    ctx.fillStyle = '#b81d38';
    ctx.fillRect(0, 0, w, h);

    // Colorful Rickshaw-art diagonal wings
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w * 0.5, h * 0.25);
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(w, h * 0.8);
    ctx.lineTo(w * 0.5, h * 0.4);
    ctx.lineTo(0, h * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 0, w, 92);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 58px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('রাজধানী সুপার সার্ভিস লিঃ', w / 2, 66, w - 40);

    ctx.fillStyle = '#fffdf7';
    ctx.font = 'bold 42px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('দূরত্ব বজায় রাখুন • ব্রেক নাই!', w / 2, h - 38, w - 60);
  });
  const rearArt = makeDecal(2.14, 0.80, rearArtTex);
  rearArt.position.set(0, 1.02, 2.895);
  livery.add(rearArt);

  busGroup.add(livery);
}
