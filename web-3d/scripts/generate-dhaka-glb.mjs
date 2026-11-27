/**
 * Pure Node.js Binary glTF 2.0 (.glb) Generator for Murir Tin 3D.
 * Generates 7 iconic Dhaka vehicles and NPCs with valid PBR materials & bounds:
 * 1. murir_tin_bus.glb
 * 2. plastic_sedan.glb
 * 3. deshi_tesla_auto.glb
 * 4. cng_rickshaw.glb
 * 5. cargo_truck.glb
 * 6. sergeant_npc.glb
 * 7. passenger_npc.glb
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/models');

function createRawMesh() {
  return { positions: [], normals: [], indices: [] };
}

function appendTransformed(target, src, tx = 0, ty = 0, tz = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  const baseIndex = target.positions.length / 3;
  const cx = Math.cos(rx), sxr = Math.sin(rx);
  const cy = Math.cos(ry), syr = Math.sin(ry);
  const cz = Math.cos(rz), szr = Math.sin(rz);

  const rotateVec = (x, y, z) => {
    const y1 = y * cx - z * sxr;
    const z1 = y * sxr + z * cx;
    const x1 = x;
    const x2 = x1 * cy + z1 * syr;
    const z2 = -x1 * syr + z1 * cy;
    const y2 = y1;
    return [x2 * cz - y2 * szr, x2 * szr + y2 * cz, z2];
  };

  for (let i = 0; i < src.positions.length; i += 3) {
    const [vx, vy, vz] = rotateVec(src.positions[i] * sx, src.positions[i + 1] * sy, src.positions[i + 2] * sz);
    target.positions.push(vx + tx, vy + ty, vz + tz);
    const [nx, ny, nz] = rotateVec(src.normals[i] / (sx || 1), src.normals[i + 1] / (sy || 1), src.normals[i + 2] / (sz || 1));
    const len = Math.hypot(nx, ny, nz) || 1;
    target.normals.push(nx / len, ny / len, nz / len);
  }

  for (let i = 0; i < src.indices.length; i++) {
    target.indices.push(baseIndex + src.indices[i]);
  }
}

function makeBox(w = 1, h = 1, d = 1) {
  const m = createRawMesh();
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const faces = [
    { n: [0, 0, 1], v: [[-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd]] },
    { n: [0, 0, -1], v: [[hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd]] },
    { n: [0, 1, 0], v: [[-hw, hh, hd], [hw, hh, hd], [hw, hh, -hd], [-hw, hh, -hd]] },
    { n: [0, -1, 0], v: [[-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd]] },
    { n: [1, 0, 0], v: [[hw, -hh, hd], [hw, -hh, -hd], [hw, hh, -hd], [hw, hh, hd]] },
    { n: [-1, 0, 0], v: [[-hw, -hh, -hd], [-hw, -hh, hd], [-hw, hh, hd], [-hw, hh, -hd]] },
  ];
  for (const f of faces) {
    const b = m.positions.length / 3;
    for (const vert of f.v) {
      m.positions.push(...vert);
      m.normals.push(...f.n);
    }
    m.indices.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  return m;
}

function makeCylinder(rTop = 0.4, rBottom = 0.4, height = 0.3, segs = 16) {
  const m = createRawMesh();
  const halfH = height / 2;
  const slope = (rBottom - rTop) / height;

  for (let y = 0; y <= 1; y++) {
    const py = y === 0 ? -halfH : halfH;
    const r = y === 0 ? rBottom : rTop;
    for (let i = 0; i <= segs; i++) {
      const th = (i / segs) * Math.PI * 2;
      const cos = Math.cos(th), sin = Math.sin(th);
      m.positions.push(r * cos, py, r * sin);
      const len = Math.hypot(cos, slope, sin) || 1;
      m.normals.push(cos / len, slope / len, sin / len);
    }
  }
  const stride = segs + 1;
  for (let i = 0; i < segs; i++) {
    m.indices.push(i, i + stride, i + 1, i + stride, i + 1 + stride, i + 1);
  }

  for (const cap of [
    { y: halfH, r: rTop, ny: 1, flip: true },
    { y: -halfH, r: rBottom, ny: -1, flip: false },
  ]) {
    if (cap.r <= 0.001) continue;
    const cIdx = m.positions.length / 3;
    m.positions.push(0, cap.y, 0);
    m.normals.push(0, cap.ny, 0);
    for (let i = 0; i <= segs; i++) {
      const th = (i / segs) * Math.PI * 2;
      m.positions.push(cap.r * Math.cos(th), cap.y, cap.r * Math.sin(th));
      m.normals.push(0, cap.ny, 0);
    }
    for (let i = 0; i < segs; i++) {
      if (cap.flip) m.indices.push(cIdx, cIdx + 1 + i + 1, cIdx + 1 + i);
      else m.indices.push(cIdx, cIdx + 1 + i, cIdx + 1 + i + 1);
    }
  }
  return m;
}

function makeSphere(radius = 0.5, wSegs = 12, hSegs = 10) {
  const m = createRawMesh();
  for (let y = 0; y <= hSegs; y++) {
    const phi = (y / hSegs) * Math.PI;
    for (let x = 0; x <= wSegs; x++) {
      const theta = (x / wSegs) * Math.PI * 2;
      const nx = -Math.cos(theta) * Math.sin(phi);
      const ny = Math.cos(phi);
      const nz = Math.sin(theta) * Math.sin(phi);
      m.positions.push(nx * radius, ny * radius, nz * radius);
      m.normals.push(nx, ny, nz);
    }
  }
  const stride = wSegs + 1;
  for (let y = 0; y < hSegs; y++) {
    for (let x = 0; x < wSegs; x++) {
      const a = y * stride + x, b = a + 1, c = (y + 1) * stride + x, d = c + 1;
      if (y !== 0) m.indices.push(a, c, b);
      if (y !== hSegs - 1) m.indices.push(b, c, d);
    }
  }
  return m;
}

function rgb(hex, a = 1) {
  const n = parseInt(hex.replace('#', ''), 16);
  const toLin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return [toLin((n >> 16) & 255), toLin((n >> 8) & 255), toLin(n & 255), a];
}

function buildGlb(name, parts) {
  const materials = [];
  const primitives = [];
  const accessors = [];
  const bufferViews = [];
  const chunks = [];
  let byteOffset = 0;

  const pushBuf = (arr, target) => {
    const raw = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    const pad = (4 - (raw.length % 4)) % 4;
    const chunk = pad ? Buffer.concat([raw, Buffer.alloc(pad)]) : raw;
    const viewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: raw.length, target });
    byteOffset += chunk.length;
    chunks.push(chunk);
    return viewIdx;
  };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const posArr = new Float32Array(part.mesh.positions);
    const normArr = new Float32Array(part.mesh.normals);
    const idxArr = new Uint16Array(part.mesh.indices);

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let p = 0; p < posArr.length; p += 3) {
      if (posArr[p] < minX) minX = posArr[p];
      if (posArr[p + 1] < minY) minY = posArr[p + 1];
      if (posArr[p + 2] < minZ) minZ = posArr[p + 2];
      if (posArr[p] > maxX) maxX = posArr[p];
      if (posArr[p + 1] > maxY) maxY = posArr[p + 1];
      if (posArr[p + 2] > maxZ) maxZ = posArr[p + 2];
    }

    const posView = pushBuf(posArr, 34962);
    const normView = pushBuf(normArr, 34962);
    const idxView = pushBuf(idxArr, 34963);

    const posAcc = accessors.length;
    accessors.push({ bufferView: posView, componentType: 5126, count: posArr.length / 3, type: 'VEC3', min: [minX, minY, minZ], max: [maxX, maxY, maxZ] });
    const normAcc = accessors.length;
    accessors.push({ bufferView: normView, componentType: 5126, count: normArr.length / 3, type: 'VEC3' });
    const idxAcc = accessors.length;
    accessors.push({ bufferView: idxView, componentType: 5123, count: idxArr.length, type: 'SCALAR' });

    materials.push({
      name: `${name}_mat_${i}`,
      pbrMetallicRoughness: {
        baseColorFactor: part.color,
        metallicFactor: part.metallic ?? 0.08,
        roughnessFactor: part.roughness ?? 0.5,
      },
      ...(part.emissive ? { emissiveFactor: part.emissive } : {}),
    });

    primitives.push({
      attributes: { POSITION: posAcc, NORMAL: normAcc },
      indices: idxAcc,
      material: i,
    });
  }

  const binBuf = Buffer.concat(chunks);
  const gltf = {
    asset: { version: '2.0', generator: 'MurirTin-GLB-Generator' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [{ name, primitives }],
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuf.length }],
  };

  let jsonStr = JSON.stringify(gltf);
  const jPad = (4 - (Buffer.byteLength(jsonStr, 'utf8') % 4)) % 4;
  if (jPad > 0) jsonStr += ' '.repeat(jPad);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');

  const totalLen = 12 + 8 + jsonBuf.length + 8 + binBuf.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546C67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLen, 8);

  const jsonHdr = Buffer.alloc(8);
  jsonHdr.writeUInt32LE(jsonBuf.length, 0);
  jsonHdr.writeUInt32LE(0x4E4F534A, 4);

  const binHdr = Buffer.alloc(8);
  binHdr.writeUInt32LE(binBuf.length, 0);
  binHdr.writeUInt32LE(0x004E4942, 4);

  return Buffer.concat([header, jsonHdr, jsonBuf, binHdr, binBuf]);
}

function addWheelPair(wheelsMesh, hubsMesh, xOffset, yPos, zPos, radius = 0.44, width = 0.28) {
  const tire = makeCylinder(radius, radius, width, 16);
  const hub = makeCylinder(radius * 0.52, radius * 0.52, width + 0.03, 12);
  appendTransformed(wheelsMesh, tire, -xOffset, yPos, zPos, 0, 0, Math.PI / 2);
  appendTransformed(wheelsMesh, tire, xOffset, yPos, zPos, 0, 0, Math.PI / 2);
  appendTransformed(hubsMesh, hub, -xOffset, yPos, zPos, 0, 0, Math.PI / 2);
  appendTransformed(hubsMesh, hub, xOffset, yPos, zPos, 0, 0, Math.PI / 2);
}

// 1. Murir Tin Local Bus (facing -Z forward)
function makeMurirTinBus() {
  const body = createRawMesh();
  appendTransformed(body, makeBox(2.25, 1.85, 5.4), 0, 1.38, 0);
  // Roof luggage rack rails
  appendTransformed(body, makeBox(2.05, 0.14, 4.6), 0, 2.38, 0.15);

  const stripe = createRawMesh();
  appendTransformed(stripe, makeBox(2.30, 0.34, 5.44), 0, 1.05, 0);
  // Front & rear metal bumpers ("ধোলাইখাল লোহার বাম্পার")
  const bumper = createRawMesh();
  appendTransformed(bumper, makeBox(2.38, 0.28, 0.30), 0, 0.56, -2.78);
  appendTransformed(bumper, makeBox(2.38, 0.28, 0.28), 0, 0.56, 2.75);
  // Left footboard step for helper!
  appendTransformed(bumper, makeBox(0.32, 0.14, 1.25), -1.24, 0.45, -1.35);

  const glass = createRawMesh();
  // Front split windshield & side windows
  appendTransformed(glass, makeBox(2.0, 0.72, 0.12), 0, 1.78, -2.68);
  appendTransformed(glass, makeBox(2.30, 0.62, 4.4), 0, 1.76, 0.15);

  const lights = createRawMesh();
  appendTransformed(lights, makeBox(0.34, 0.22, 0.12), -0.76, 0.82, -2.72);
  appendTransformed(lights, makeBox(0.34, 0.22, 0.12), 0.76, 0.82, -2.72);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  addWheelPair(wheels, hubs, 1.05, 0.44, -1.68, 0.44, 0.30);
  addWheelPair(wheels, hubs, 1.05, 0.44, 1.65, 0.44, 0.30);

  return [
    { mesh: body, color: rgb('#06b888'), roughness: 0.55 },        // Primary bus paint (recolorable!)
    { mesh: stripe, color: rgb('#ef476f'), roughness: 0.45 },      // Accent stripe
    { mesh: bumper, color: rgb('#ffbe0b'), roughness: 0.35, metallic: 0.4 }, // Yellow iron bumper
    { mesh: glass, color: rgb('#2b3a4a'), roughness: 0.15 },       // Windows
    { mesh: lights, color: rgb('#fff3b0'), emissive: [0.9, 0.8, 0.3] },
    { mesh: wheels, color: rgb('#1d1e24'), roughness: 0.85 },
    { mesh: hubs, color: rgb('#d9d9d9'), metallic: 0.6, roughness: 0.3 },
  ];
}

// 2. Plastic Sedan (Private Car)
function makePlasticSedan() {
  const body = createRawMesh();
  appendTransformed(body, makeBox(1.85, 0.68, 4.1), 0, 0.66, 0);
  appendTransformed(body, makeBox(1.65, 0.58, 2.1), 0, 1.24, 0.15);

  const glass = createRawMesh();
  appendTransformed(glass, makeBox(1.70, 0.46, 1.85), 0, 1.24, 0.15);

  const tailLights = createRawMesh();
  appendTransformed(tailLights, makeBox(0.36, 0.16, 0.10), -0.65, 0.72, 2.05);
  appendTransformed(tailLights, makeBox(0.36, 0.16, 0.10), 0.65, 0.72, 2.05);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  addWheelPair(wheels, hubs, 0.88, 0.34, -1.25, 0.34, 0.24);
  addWheelPair(wheels, hubs, 0.88, 0.34, 1.25, 0.34, 0.24);

  return [
    { mesh: body, color: rgb('#f8f9fa'), roughness: 0.22, metallic: 0.2 },
    { mesh: glass, color: rgb('#1f2937'), roughness: 0.12 },
    { mesh: tailLights, color: rgb('#ef233c'), emissive: [0.7, 0.1, 0.1] },
    { mesh: wheels, color: rgb('#1b1d22'), roughness: 0.85 },
    { mesh: hubs, color: rgb('#ced4da'), metallic: 0.6 },
  ];
}

// 3. Deshi Tesla (Battery Auto-Rickshaw)
function makeDeshiTeslaAuto() {
  const frame = createRawMesh();
  appendTransformed(frame, makeBox(1.25, 0.45, 2.2), 0, 0.50, 0.15);
  appendTransformed(frame, makeBox(1.22, 0.90, 1.25), 0, 1.15, 0.55);

  const canopy = createRawMesh();
  appendTransformed(canopy, makeBox(1.32, 0.14, 1.95), 0, 1.72, 0.22);
  appendTransformed(canopy, makeBox(0.14, 0.75, 0.14), 0, 0.95, -0.82);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  // 1 front wheel + 2 rear wheels
  appendTransformed(wheels, makeCylinder(0.28, 0.28, 0.16, 14), 0, 0.28, -0.95, 0, 0, Math.PI / 2);
  addWheelPair(wheels, hubs, 0.66, 0.30, 0.80, 0.30, 0.18);

  const headlight = createRawMesh();
  appendTransformed(headlight, makeSphere(0.12, 10, 8), 0, 0.85, -0.96);

  return [
    { mesh: frame, color: rgb('#0096c7'), roughness: 0.45 },
    { mesh: canopy, color: rgb('#ffbe0b'), roughness: 0.5 },
    { mesh: headlight, color: rgb('#fff3b0'), emissive: [0.95, 0.85, 0.3] },
    { mesh: wheels, color: rgb('#1d1e24'), roughness: 0.85 },
    { mesh: hubs, color: rgb('#adb5bd'), metallic: 0.5 },
  ];
}

// 4. Green Dhaka CNG
function makeCngRickshaw() {
  const body = createRawMesh();
  appendTransformed(body, makeBox(1.32, 0.55, 2.25), 0, 0.56, 0.1);
  appendTransformed(body, makeBox(1.26, 0.78, 1.35), 0, 1.15, 0.45);

  const roof = createRawMesh();
  appendTransformed(roof, makeBox(1.34, 0.24, 2.15), 0, 1.64, 0.15);

  const cage = createRawMesh();
  appendTransformed(cage, makeBox(1.36, 0.12, 1.15), 0, 0.98, 0.45);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  appendTransformed(wheels, makeCylinder(0.28, 0.28, 0.18, 14), 0, 0.28, -0.96, 0, 0, Math.PI / 2);
  addWheelPair(wheels, hubs, 0.68, 0.30, 0.80, 0.30, 0.20);

  return [
    { mesh: body, color: rgb('#2b9348'), roughness: 0.45 },
    { mesh: roof, color: rgb('#212529'), roughness: 0.7 },
    { mesh: cage, color: rgb('#dee2e6'), metallic: 0.65, roughness: 0.3 },
    { mesh: wheels, color: rgb('#1d1e24'), roughness: 0.85 },
    { mesh: hubs, color: rgb('#ced4da'), metallic: 0.5 },
  ];
}

// 5. Deshi Cargo Truck
function makeCargoTruck() {
  const cab = createRawMesh();
  appendTransformed(cab, makeBox(2.25, 1.70, 1.85), 0, 1.35, -1.85);
  const bed = createRawMesh();
  appendTransformed(bed, makeBox(2.38, 1.95, 4.10), 0, 1.52, 1.15);
  const bumper = createRawMesh();
  appendTransformed(bumper, makeBox(2.36, 0.34, 0.24), 0, 0.54, -2.84);
  const glass = createRawMesh();
  appendTransformed(glass, makeBox(2.05, 0.62, 0.12), 0, 1.75, -2.76);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  addWheelPair(wheels, hubs, 1.06, 0.48, -1.80, 0.48, 0.32);
  addWheelPair(wheels, hubs, 1.06, 0.48, 1.10, 0.48, 0.32);
  addWheelPair(wheels, hubs, 1.06, 0.48, 2.35, 0.48, 0.32);

  return [
    { mesh: cab, color: rgb('#e63946'), roughness: 0.45 },
    { mesh: bed, color: rgb('#3a86ff'), roughness: 0.6 },
    { mesh: bumper, color: rgb('#ffbe0b'), roughness: 0.35 },
    { mesh: glass, color: rgb('#1f2937'), roughness: 0.15 },
    { mesh: wheels, color: rgb('#1b1d22'), roughness: 0.85 },
    { mesh: hubs, color: rgb('#adb5bd'), metallic: 0.5 },
  ];
}

// 6. Traffic Sergeant NPC
function makeSergeantNpc() {
  const shirt = createRawMesh();
  appendTransformed(shirt, makeBox(0.54, 0.66, 0.32), 0, 1.06, 0);
  appendTransformed(shirt, makeBox(0.16, 0.52, 0.16), -0.38, 1.12, 0, 0, 0, 0.25);
  appendTransformed(shirt, makeBox(0.16, 0.56, 0.16), 0.38, 1.34, -0.1, -0.7, 0, -0.3); // raised stop hand!

  const vest = createRawMesh();
  appendTransformed(vest, makeBox(0.58, 0.48, 0.36), 0, 1.08, 0);

  const pants = createRawMesh();
  appendTransformed(pants, makeBox(0.22, 0.72, 0.22), -0.14, 0.36, 0);
  appendTransformed(pants, makeBox(0.22, 0.72, 0.22), 0.14, 0.36, 0);

  const head = createRawMesh();
  appendTransformed(head, makeSphere(0.22, 12, 10), 0, 1.62, 0);

  const cap = createRawMesh();
  appendTransformed(cap, makeCylinder(0.24, 0.20, 0.16, 12), 0, 1.80, 0);

  return [
    { mesh: shirt, color: rgb('#f8f9fa'), roughness: 0.7 },
    { mesh: vest, color: rgb('#80ed99'), emissive: [0.1, 0.35, 0.1], roughness: 0.45 },
    { mesh: pants, color: rgb('#1d3557'), roughness: 0.75 },
    { mesh: head, color: rgb('#d49a6a'), roughness: 0.65 },
    { mesh: cap, color: rgb('#ffffff'), roughness: 0.5 },
  ];
}

// 7. Passenger NPC
function makePassengerNpc() {
  const torso = createRawMesh();
  appendTransformed(torso, makeBox(0.48, 0.62, 0.28), 0, 1.02, 0);
  const pants = createRawMesh();
  appendTransformed(pants, makeBox(0.20, 0.68, 0.20), -0.12, 0.34, 0);
  appendTransformed(pants, makeBox(0.20, 0.68, 0.20), 0.12, 0.34, 0);
  const head = createRawMesh();
  appendTransformed(head, makeSphere(0.20, 10, 8), 0, 1.54, 0);

  return [
    { mesh: torso, color: rgb('#ff6b8b'), roughness: 0.65 },
    { mesh: pants, color: rgb('#2b2d42'), roughness: 0.75 },
    { mesh: head, color: rgb('#d49a6a'), roughness: 0.65 },
  ];
}

// 8. Rajdhani Super Service Ltd. (High-craft iconic Bangladeshi local/highway express bus, facing -Z)
function makeRajdhaniBus() {
  const crimsonBody = createRawMesh();
  // Main lower + mid fuselage
  appendTransformed(crimsonBody, makeBox(2.30, 1.98, 5.76), 0, 1.38, 0);
  // Sloped upper front header brow
  appendTransformed(crimsonBody, makeBox(2.22, 0.42, 0.36), 0, 2.20, -2.76, -0.18, 0, 0);
  // Side wheel-well flares
  for (const sx of [-1.14, 1.14]) {
    appendTransformed(crimsonBody, makeBox(0.10, 0.24, 1.12), sx, 0.72, -1.75);
    appendTransformed(crimsonBody, makeBox(0.10, 0.24, 1.12), sx, 0.72, 1.65);
  }

  const whiteRoof = createRawMesh();
  // Sculpted white roof cap + rear spoiler lip
  appendTransformed(whiteRoof, makeBox(2.14, 0.20, 5.52), 0, 2.46, 0.04);
  appendTransformed(whiteRoof, makeBox(1.94, 0.14, 0.55), 0, 2.52, -2.52, 0.14, 0, 0);
  appendTransformed(whiteRoof, makeBox(1.98, 0.12, 0.42), 0, 2.54, 2.68);

  const silverChrome = createRawMesh();
  // Metallic front & rear bumpers + side skirts
  appendTransformed(silverChrome, makeBox(2.34, 0.28, 0.22), 0, 0.50, -2.86);
  appendTransformed(silverChrome, makeBox(2.34, 0.28, 0.20), 0, 0.50, 2.86);
  // Silver aluminum window pillars (7 mullions per side) + horizontal sash bar
  for (const sx of [-1.155, 1.155]) {
    appendTransformed(silverChrome, makeBox(0.04, 0.06, 5.10), sx, 1.48, 0.12);
    appendTransformed(silverChrome, makeBox(0.04, 0.05, 5.10), sx, 2.16, 0.12);
    for (let w = 0; w < 8; w++) {
      appendTransformed(silverChrome, makeBox(0.05, 0.72, 0.07), sx, 1.82, -2.40 + w * 0.72);
    }
  }
  // Hino-style chrome wing badge, grille bars & H emblem
  appendTransformed(silverChrome, makeBox(0.92, 0.08, 0.06), 0, 1.28, -2.90);
  appendTransformed(silverChrome, makeCylinder(0.16, 0.16, 0.06, 14), 0, 1.08, -2.90, Math.PI / 2, 0, 0);
  appendTransformed(silverChrome, makeBox(0.84, 0.06, 0.05), 0, 0.80, -2.90);
  // Left passenger door chrome grab pole & step
  appendTransformed(silverChrome, makeCylinder(0.025, 0.025, 1.55, 8), -1.16, 1.15, -1.05);
  appendTransformed(silverChrome, makeBox(0.24, 0.08, 0.78), -1.12, 0.42, -1.05);
  // Twin chrome rear exhaust pipes
  appendTransformed(silverChrome, makeCylinder(0.055, 0.055, 0.42, 10), -0.68, 0.36, 2.94, Math.PI / 2, 0, 0);
  appendTransformed(silverChrome, makeCylinder(0.055, 0.055, 0.42, 10), -0.50, 0.36, 2.94, Math.PI / 2, 0, 0);

  const glassAndDark = createRawMesh();
  // Panoramic front windshield, side windows, rear glass + dark front grille + wipers
  appendTransformed(glassAndDark, makeBox(2.08, 0.88, 0.10), 0, 1.76, -2.84, -0.06, 0, 0);
  appendTransformed(glassAndDark, makeBox(2.32, 0.64, 5.02), 0, 1.82, 0.12);
  appendTransformed(glassAndDark, makeBox(2.02, 0.66, 0.10), 0, 1.82, 2.86);
  // Left passenger open doorway recess
  appendTransformed(glassAndDark, makeBox(0.14, 1.62, 0.72), -1.11, 1.22, -1.05);
  // Front dark radiator grille & lower intake
  appendTransformed(glassAndDark, makeBox(0.86, 0.32, 0.08), 0, 1.06, -2.88);
  appendTransformed(glassAndDark, makeBox(0.76, 0.22, 0.08), 0, 0.68, -2.88);
  // Twin windshield wipers
  appendTransformed(glassAndDark, makeBox(0.035, 0.58, 0.04), -0.34, 1.62, -2.90, 0, 0, -0.34);
  appendTransformed(glassAndDark, makeBox(0.035, 0.58, 0.04), 0.26, 1.62, -2.90, 0, 0, -0.34);

  const royalBlueAccent = createRawMesh();
  // Royal blue recessed headlight housings & roof rainbow stripe
  appendTransformed(royalBlueAccent, makeBox(0.56, 0.22, 0.10), -0.82, 0.92, -2.87, 0, 0, -0.10);
  appendTransformed(royalBlueAccent, makeBox(0.56, 0.22, 0.10), 0.82, 0.92, -2.87, 0, 0, 0.10);
  appendTransformed(royalBlueAccent, makeBox(2.20, 0.10, 4.80), 0, 2.38, 0.10);

  const mirrorGreen = createRawMesh();
  // Iconic Rajdhani green curved upper mirror stalks + front green smile stripe
  appendTransformed(mirrorGreen, makeBox(0.28, 0.10, 0.10), -1.28, 2.22, -2.86, 0, 0, 0.25);
  appendTransformed(mirrorGreen, makeBox(0.28, 0.10, 0.10), 1.28, 2.22, -2.86, 0, 0, -0.25);
  appendTransformed(mirrorGreen, makeBox(0.94, 0.06, 0.06), 0, 0.86, -2.89);

  const mirrorAmber = createRawMesh();
  // Iconic twin orange-yellow antler mirror pods + yellow lower fog bezels
  appendTransformed(mirrorAmber, makeCylinder(0.11, 0.10, 0.44, 12), -1.42, 1.96, -2.96);
  appendTransformed(mirrorAmber, makeCylinder(0.11, 0.10, 0.44, 12), 1.42, 1.96, -2.96);
  appendTransformed(mirrorAmber, makeBox(0.46, 0.16, 0.10), -0.82, 0.56, -2.88);
  appendTransformed(mirrorAmber, makeBox(0.46, 0.16, 0.10), 0.82, 0.56, -2.88);

  const brightLights = createRawMesh();
  // Front LED headlights
  appendTransformed(brightLights, makeBox(0.18, 0.12, 0.06), -0.74, 0.92, -2.91);
  appendTransformed(brightLights, makeBox(0.18, 0.12, 0.06), -0.94, 0.94, -2.91);
  appendTransformed(brightLights, makeBox(0.18, 0.12, 0.06), 0.74, 0.92, -2.91);
  appendTransformed(brightLights, makeBox(0.18, 0.12, 0.06), 0.94, 0.94, -2.91);
  // Front fog lamps
  appendTransformed(brightLights, makeBox(0.22, 0.10, 0.06), -0.82, 0.56, -2.92);
  appendTransformed(brightLights, makeBox(0.22, 0.10, 0.06), 0.82, 0.56, -2.92);

  const tailLights = createRawMesh();
  appendTransformed(tailLights, makeBox(0.38, 0.16, 0.08), -0.82, 0.88, 2.89);
  appendTransformed(tailLights, makeBox(0.38, 0.16, 0.08), 0.82, 0.88, 2.89);

  const wheels = createRawMesh();
  const hubs = createRawMesh();
  addWheelPair(wheels, hubs, 1.07, 0.46, -1.75, 0.46, 0.30);
  addWheelPair(wheels, hubs, 1.07, 0.46, 1.65, 0.46, 0.32);

  return [
    { mesh: crimsonBody, color: rgb('#b81d38'), roughness: 0.34, metallic: 0.14 },
    { mesh: whiteRoof, color: rgb('#f8f9fa'), roughness: 0.42 },
    { mesh: silverChrome, color: rgb('#d8dee9'), roughness: 0.24, metallic: 0.72 },
    { mesh: glassAndDark, color: rgb('#182534'), roughness: 0.10, metallic: 0.30 },
    { mesh: royalBlueAccent, color: rgb('#1d4ed8'), roughness: 0.35 },
    { mesh: mirrorGreen, color: rgb('#16a34a'), roughness: 0.36 },
    { mesh: mirrorAmber, color: rgb('#f59e0b'), roughness: 0.34 },
    { mesh: brightLights, color: rgb('#e0f2fe'), emissive: [0.85, 0.92, 1.0] },
    { mesh: tailLights, color: rgb('#ff1e42'), emissive: [0.95, 0.12, 0.22] },
    { mesh: wheels, color: rgb('#181a20'), roughness: 0.86 },
    { mesh: hubs, color: rgb('#cbd5e1'), roughness: 0.26, metallic: 0.76 },
  ];
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const models = {
    murir_tin_bus: makeMurirTinBus(),
    rajdhani_bus: makeRajdhaniBus(),
    plastic_sedan: makePlasticSedan(),
    deshi_tesla_auto: makeDeshiTeslaAuto(),
    cng_rickshaw: makeCngRickshaw(),
    cargo_truck: makeCargoTruck(),
    sergeant_npc: makeSergeantNpc(),
    passenger_npc: makePassengerNpc(),
  };

  for (const [name, parts] of Object.entries(models)) {
    fs.writeFileSync(path.join(OUT_DIR, `${name}.glb`), buildGlb(name, parts));
  }
  console.log(`Generated ${Object.keys(models).length} Dhaka 3D .glb models.`);
}

main();
