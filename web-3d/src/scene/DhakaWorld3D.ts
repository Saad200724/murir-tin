import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DHAKA_BILLBOARDS, type BillboardAd } from '../config/billboards';
import { BUS_SKINS } from '../core/GarageCatalog';
import { type RoadEntity, type RoadSimulation } from '../core/RoadSimulation';

interface BurstParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class DhakaWorld3D {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly loader = new GLTFLoader();

  private readonly templates = new Map<string, THREE.Group>();
  private readonly entityMeshes = new Map<number, THREE.Group>();
  private readonly particles: BurstParticle[] = [];
  private readonly particleGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);

  private playerGroup = new THREE.Group();
  private playerBusBody: THREE.Group | null = null;
  private roofRidersGroup = new THREE.Group();
  private nitroFlames = new THREE.Group();

  private readonly roadGroup = new THREE.Group();
  private readonly dhakaCityGroup = new THREE.Group();
  private readonly padmaBridgeGroup = new THREE.Group();
  private readonly trafficGroup = new THREE.Group();
  private readonly particlesGroup = new THREE.Group();

  private readonly laneDashes: THREE.Mesh[] = [];
  private readonly metroPillars: THREE.Group[] = [];
  private readonly billboards: THREE.Group[] = [];
  private readonly trees: THREE.Group[] = [];
  private readonly buildings: THREE.Group[] = [];
  private readonly bridgeSpans: THREE.Group[] = [];

  private readonly dhakaSky = new THREE.Color('#ffd9a0');
  private readonly padmaSky = new THREE.Color('#8ecae6');
  private readonly skyScratch = new THREE.Color();

  private cameraShake = 0;
  private currentSkinId = 'classic_mirpur';
  private renderedRiderCount = 0;

  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = this.dhakaSky.clone();
    this.scene.fog = new THREE.Fog('#ffd9a0', 48, 155);

    this.camera = new THREE.PerspectiveCamera(56, 1, 0.2, 230);

    // Golden Dhaka afternoon sunlight
    const hemi = new THREE.HemisphereLight('#fff4df', '#5a4e43', 1.28);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff2d6', 1.85);
    sun.position.set(16, 28, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 90;
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    this.scene.add(sun);

    this.scene.add(
      this.roadGroup,
      this.dhakaCityGroup,
      this.padmaBridgeGroup,
      this.trafficGroup,
      this.particlesGroup,
      this.playerGroup
    );
    this.buildDhakaEnvironment();
    this.buildPadmaSetuEnvironment();
    this.padmaBridgeGroup.visible = false;
    this.resize();
  }

  public async preloadModels(): Promise<void> {
    const names = [
      'murir_tin_bus',
      'plastic_sedan',
      'deshi_tesla_auto',
      'cng_rickshaw',
      'cargo_truck',
      'sergeant_npc',
      'passenger_npc',
    ];
    await Promise.all(
      names.map(async (name) => {
        try {
          const gltf = await this.loader.loadAsync(`./models/${name}.glb`);
          gltf.scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });
          this.templates.set(name, gltf.scene);
        } catch {
          this.templates.set(name, this.createFallbackBox(name));
        }
      })
    );
    this.rebuildPlayerBus(this.currentSkinId);
  }

  private createFallbackBox(name: string): THREE.Group {
    const g = new THREE.Group();
    const color = name.includes('bus') ? '#06b888' : name.includes('tesla') ? '#ffbe0b' : '#ffffff';
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 3.2),
      new THREE.MeshStandardMaterial({ color })
    );
    mesh.position.y = 0.8;
    g.add(mesh);
    return g;
  }

  public setBusSkin(skinId: string): void {
    this.currentSkinId = skinId;
    if (this.templates.has('murir_tin_bus')) {
      this.rebuildPlayerBus(skinId);
    }
  }

  private rebuildPlayerBus(skinId: string): void {
    if (this.playerBusBody) {
      this.playerGroup.remove(this.playerBusBody);
    }
    const tpl = this.templates.get('murir_tin_bus') ?? this.createFallbackBox('murir_tin_bus');
    const bus = tpl.clone(true);
    const skin = BUS_SKINS.find((s) => s.id === skinId) ?? BUS_SKINS[0];

    let matIdx = 0;
    bus.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const m = (mesh.material as THREE.MeshStandardMaterial).clone();
        if (matIdx === 0) m.color.set(skin.bodyHex);
        if (matIdx === 1) m.color.set(skin.stripeHex);
        mesh.material = m;
        matIdx++;
      }
    });

    this.playerBusBody = bus;
    this.playerGroup.add(bus);

    if (this.nitroFlames.children.length === 0) {
      const flameMat = new THREE.MeshBasicMaterial({ color: '#00f5d4', transparent: true, opacity: 0.9 });
      const innerMat = new THREE.MeshBasicMaterial({ color: '#ffbe0b' });
      for (const fx of [-0.65, 0.65]) {
        const outer = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.4, 10), flameMat);
        outer.rotation.x = Math.PI / 2;
        outer.position.set(fx, 0.58, 3.35);
        const core = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.9, 8), innerMat);
        core.rotation.x = Math.PI / 2;
        core.position.set(fx, 0.58, 3.15);
        this.nitroFlames.add(outer, core);
      }
      this.nitroFlames.visible = false;
      this.playerGroup.add(this.nitroFlames);
    }

    if (!this.roofRidersGroup.parent) {
      this.playerGroup.add(this.roofRidersGroup);
    }
  }

  private buildDhakaEnvironment(): void {
    // Shared 4-lane highway asphalt deck
    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(13.8, 280),
      new THREE.MeshStandardMaterial({ color: '#2b303a', roughness: 0.9 })
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(0, 0, -90);
    asphalt.receiveShadow = true;
    this.roadGroup.add(asphalt);

    const curbMat = new THREE.MeshStandardMaterial({ color: '#e9ecef', roughness: 0.7 });
    for (const sx of [-1, 1]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 280), curbMat);
      curb.position.set(sx * 7.25, 0.11, -90);
      curb.receiveShadow = true;
      this.roadGroup.add(curb);
    }

    // Center yellow double line
    const yellowMat = new THREE.MeshBasicMaterial({ color: '#ffbe0b' });
    const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 280), yellowMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.015, -90);
    this.roadGroup.add(centerLine);

    // Scrolling white dashed lane lines
    const dashGeo = new THREE.PlaneGeometry(0.18, 3.8);
    const dashMat = new THREE.MeshBasicMaterial({ color: '#f8f9fa' });
    for (const lx of [-3.0, 3.0]) {
      for (let i = 0; i < 16; i++) {
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(lx, 0.015, 16 - i * 11);
        this.roadGroup.add(dash);
        this.laneDashes.push(dash);
      }
    }

    // Dhaka green shoulders (hidden when crossing Padma River!)
    const groundMat = new THREE.MeshStandardMaterial({ color: '#6b9080', roughness: 0.95 });
    for (const sx of [-1, 1]) {
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(75, 280), groundMat);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(sx * 45, -0.04, -90);
      this.dhakaCityGroup.add(grass);
    }

    // Dhaka Metro Rail Concrete Viaduct + Pillars on the right edge
    const concreteMat = new THREE.MeshStandardMaterial({ color: '#adb5bd', roughness: 0.75 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 280), concreteMat);
    beam.position.set(9.2, 8.6, -90);
    this.dhakaCityGroup.add(beam);

    for (let i = 0; i < 8; i++) {
      const grp = new THREE.Group();
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.78, 8.2, 12), concreteMat);
      col.position.y = 4.1;
      col.castShadow = true;
      const cap = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 1.6), concreteMat);
      cap.position.y = 7.8;
      grp.add(col, cap);
      grp.position.set(9.2, 0, 12 - i * 24);
      this.dhakaCityGroup.add(grp);
      this.metroPillars.push(grp);
    }

    // Roadside Dhaka Sponsor Billboards
    for (let i = 0; i < 4; i++) {
      const ad = DHAKA_BILLBOARDS[i % DHAKA_BILLBOARDS.length];
      const board = this.createBillboardMesh(ad);
      board.position.set(-9.6, 0, -20 - i * 44);
      this.dhakaCityGroup.add(board);
      this.billboards.push(board);
    }

    // Roadside trees + colorful Dhaka buildings
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#7f4f24', roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#38b000', roughness: 0.7 });
    for (let i = 0; i < 12; i++) {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.2, 8), trunkMat);
      trunk.position.y = 1.1;
      const crown = new THREE.Mesh(new THREE.SphereGeometry(1.35, 10, 8), leafMat);
      crown.position.y = 2.8;
      t.add(trunk, crown);
      t.position.set(i % 2 === 0 ? -11.5 : 13.0, 0, 8 - i * 16);
      this.dhakaCityGroup.add(t);
      this.trees.push(t);
    }

    const bldgColors = ['#e07a5f', '#f2cc8f', '#81b29a', '#a8dadc', '#f4a261'];
    for (let i = 0; i < 10; i++) {
      const b = new THREE.Group();
      const h = 8 + (i % 4) * 4.5;
      const w = 6 + (i % 3) * 1.8;
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 8.5),
        new THREE.MeshStandardMaterial({ color: bldgColors[i % bldgColors.length], roughness: 0.8 })
      );
      body.position.y = h / 2;
      b.add(body);
      b.position.set(i % 2 === 0 ? -20 : 21, 0, 10 - i * 19);
      this.dhakaCityGroup.add(b);
      this.buildings.push(b);
    }
  }

  private buildPadmaSetuEnvironment(): void {
    // Padma River water plane stretching wide on both sides below bridge deck
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#0077b6',
      roughness: 0.25,
      metalness: 0.25,
    });
    const river = new THREE.Mesh(new THREE.PlaneGeometry(260, 290), waterMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -3.2, -90);
    this.padmaBridgeGroup.add(river);

    // Bridge concrete safety parapets on both outer edges
    const parapetMat = new THREE.MeshStandardMaterial({ color: '#dee2e6', roughness: 0.65 });
    for (const sx of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.95, 280), parapetMat);
      rail.position.set(sx * 7.65, 0.5, -90);
      this.padmaBridgeGroup.add(rail);
    }

    // Iconic Padma Setu Steel Truss Spans (scroll seamlessly!)
    const steelMat = new THREE.MeshStandardMaterial({
      color: '#2b5876',
      metalness: 0.55,
      roughness: 0.38,
    });
    const lampMat = new THREE.MeshBasicMaterial({ color: '#ffd166' });

    for (let i = 0; i < 8; i++) {
      const span = new THREE.Group();

      // Left and right main vertical truss columns
      for (const sx of [-7.8, 7.8]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 7.6, 0.65), steelMat);
        post.position.set(sx, 3.8, 0);
        span.add(post);

        // Diagonal steel truss struts along bridge sides
        const diagA = new THREE.Mesh(new THREE.BoxGeometry(0.32, 9.2, 0.35), steelMat);
        diagA.position.set(sx, 3.8, -6);
        diagA.rotation.x = 0.62;
        const diagB = new THREE.Mesh(new THREE.BoxGeometry(0.32, 9.2, 0.35), steelMat);
        diagB.position.set(sx, 3.8, -6);
        diagB.rotation.x = -0.62;
        span.add(diagA, diagB);

        // Longitudinal top & mid steel chords
        const topChord = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 24), steelMat);
        topChord.position.set(sx, 7.4, -12);
        span.add(topChord);

        // Bridge street lamp
        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.5), lampMat);
        lampHead.position.set(sx * 0.88, 5.4, -12);
        span.add(lampHead);
      }

      // Overhead portal cross-beam connecting both trusses
      const overhead = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.6, 0.7), steelMat);
      overhead.position.set(0, 7.4, 0);
      span.add(overhead);

      span.position.set(0, 0, 12 - i * 24);
      this.padmaBridgeGroup.add(span);
      this.bridgeSpans.push(span);
    }
  }

  private createBillboardMesh(ad: BillboardAd): THREE.Group {
    const grp = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: '#495057', metalness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.4, 8), poleMat);
    pole.position.y = 2.2;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = ad.bgHex;
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = ad.accentHex;
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = ad.textHex;
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(ad.headline, 256, 112, 460);
    ctx.font = '600 21px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(ad.subline, 256, 168, 460);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 2.8, 0.25),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 })
    );
    sign.position.set(0, 5.2, 0);
    sign.rotation.y = 0.35;
    sign.castShadow = true;

    grp.add(pole, sign);
    return grp;
  }

  private createTollGateMesh(): THREE.Group {
    const grp = new THREE.Group();

    const pillarMat = new THREE.MeshStandardMaterial({ color: '#f8f9fa', roughness: 0.5 });
    const boothMat = new THREE.MeshStandardMaterial({ color: '#0077b6', roughness: 0.4 });

    // Outer gantry columns + middle toll islands
    for (const bx of [-6.9, -3.0, 0, 3.0, 6.9]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.55, 4.8, 1.4), pillarMat);
      col.position.set(bx, 2.4, 0);
      grp.add(col);
      if (Math.abs(bx) < 4) {
        const booth = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.3, 2.2), boothMat);
        booth.position.set(bx, 1.15, 0);
        grp.add(booth);
      }
    }

    // Overhead Toll Sign Board
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 192;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#023e8a';
    ctx.fillRect(0, 0, 1024, 192);
    ctx.strokeStyle = '#ffbe0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 1008, 176);
    ctx.fillStyle = '#ffbe0b';
    ctx.textAlign = 'center';
    ctx.font = 'bold 54px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('🌉 পদ্মা সেতু টোল প্লাজা • বাস টোল ৳২৫০', 512, 86, 960);
    ctx.fillStyle = '#06d6a0';
    ctx.font = 'bold 34px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('ক্যাশ দিয়ে পাস করুন অথবা 🔥 নাইট্রো দিয়ে ব্যারিকেড উড়ান!', 512, 148, 960);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(14.8, 2.3, 1.2),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35 })
    );
    canopy.position.set(0, 5.2, 0);
    grp.add(canopy);

    // Striped Toll Barrier Arm across road that lifts when cleared
    const armPivot = new THREE.Group();
    armPivot.position.set(-6.4, 1.15, 0.85);
    const armBar = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 0.22, 0.18),
      new THREE.MeshStandardMaterial({ color: '#ef233c', emissive: '#6a040f', emissiveIntensity: 0.3 })
    );
    armBar.position.x = 6.4;
    armPivot.add(armBar);
    grp.add(armPivot);
    grp.userData.barrierArm = armPivot;

    return grp;
  }

  public triggerCrashBurst(): void {
    this.cameraShake = 1.0;
    this.spawnBurst(this.playerGroup.position, 22, '#ffbe0b', 1.3);
    this.spawnBurst(this.playerGroup.position, 14, '#ef476f', 1.1);
  }

  public triggerSparkBurst(x: number, z: number, color = '#ffbe0b'): void {
    this.spawnBurst(new THREE.Vector3(x, 0.85, z), 10, color, 0.75);
  }

  public triggerMinorShake(): void {
    this.cameraShake = Math.max(this.cameraShake, 0.6);
  }

  public resetEffects(): void {
    this.cameraShake = 0;
    for (const p of this.particles) {
      this.particlesGroup.remove(p.mesh);
      (p.mesh.material as THREE.Material).dispose();
    }
    this.particles.length = 0;
  }

  private spawnBurst(origin: THREE.Vector3, count: number, hex: string, scale = 1): void {
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(this.particleGeo, mat);
      mesh.scale.setScalar(scale);
      mesh.position
        .copy(origin)
        .add(new THREE.Vector3((Math.random() - 0.5) * 1.2, 0.8, (Math.random() - 0.5) * 1.5));
      this.particlesGroup.add(mesh);
      this.particles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 9, 4 + Math.random() * 6, (Math.random() - 0.5) * 8),
        life: 0,
        maxLife: 0.7 + Math.random() * 0.35,
      });
    }
  }

  private syncRoofRiders(passengerCount: number): void {
    const targetVisualRiders = Math.min(10, Math.max(0, Math.floor((passengerCount - 4) / 2)));
    if (targetVisualRiders === this.renderedRiderCount) return;
    this.renderedRiderCount = targetVisualRiders;

    while (this.roofRidersGroup.children.length > 0) {
      this.roofRidersGroup.remove(this.roofRidersGroup.children[0]);
    }
    const tpl = this.templates.get('passenger_npc');
    if (!tpl) return;

    for (let i = 0; i < targetVisualRiders; i++) {
      const npc = tpl.clone(true);
      npc.scale.setScalar(0.65);
      if (i % 3 === 0) {
        npc.position.set(-1.32, 0.45, -1.35 + (i % 2) * 0.5);
        npc.rotation.z = 0.22;
      } else {
        const row = Math.floor(i / 2);
        const col = i % 2 === 0 ? -0.48 : 0.48;
        npc.position.set(col, 2.38, -1.4 + row * 0.75);
      }
      this.roofRidersGroup.add(npc);
    }
  }

  private createEntityVisual(ent: RoadEntity): THREE.Group {
    if (ent.kind === 'toll_gate') {
      return this.createTollGateMesh();
    }

    const modelMap: Record<RoadEntity['kind'], string> = {
      plastic_sedan: 'plastic_sedan',
      deshi_tesla: 'deshi_tesla_auto',
      cng: 'cng_rickshaw',
      cargo_truck: 'cargo_truck',
      rival_bus: 'murir_tin_bus',
      sergeant: 'sergeant_npc',
      bus_stop: 'passenger_npc',
      wasa_pit: '',
      wrench_pickup: '',
      nitro_pickup: '',
      toll_gate: '',
    };

    const g = new THREE.Group();
    const modelName = modelMap[ent.kind];
    if (modelName && this.templates.has(modelName)) {
      const m = this.templates.get(modelName)!.clone(true);
      if (ent.kind === 'deshi_tesla') {
        m.rotation.y = Math.PI;
        const beacon = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 8, 8),
          new THREE.MeshBasicMaterial({ color: '#ff0054' })
        );
        beacon.position.y = 2.15;
        g.add(beacon);
      } else if (ent.kind === 'rival_bus') {
        let idx = 0;
        m.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mat = ((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).clone();
            if (idx === 0) mat.color.set('#3a86ff');
            if (idx === 1) mat.color.set('#ffbe0b');
            (obj as THREE.Mesh).material = mat;
            idx++;
          }
        });
      } else if (ent.kind === 'bus_stop') {
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.6, 0.08, 20),
          new THREE.MeshBasicMaterial({ color: '#06d6a0', transparent: true, opacity: 0.6 })
        );
        ring.position.y = 0.05;
        g.add(ring);
        const m2 = m.clone(true);
        m2.position.x = -0.55;
        m.position.x = 0.45;
        g.add(m2);
      }
      g.add(m);
    } else if (ent.kind === 'wasa_pit') {
      const pit = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.14, 2.0),
        new THREE.MeshStandardMaterial({ color: '#4a3219', roughness: 0.95 })
      );
      pit.position.y = 0.07;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.95, 0.25),
        new THREE.MeshStandardMaterial({ color: '#ef233c', roughness: 0.4 })
      );
      bar.position.y = 0.65;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(2.44, 0.26, 0.28),
        new THREE.MeshStandardMaterial({ color: '#ffbe0b' })
      );
      stripe.position.y = 0.72;
      g.add(pit, bar, stripe);
    } else if (ent.kind === 'wrench_pickup') {
      const box = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.62, 0),
        new THREE.MeshStandardMaterial({ color: '#06d6a0', emissive: '#06d6a0', emissiveIntensity: 0.45 })
      );
      box.position.y = 0.95;
      g.add(box);
    } else if (ent.kind === 'nitro_pickup') {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 1.1, 12),
        new THREE.MeshStandardMaterial({ color: '#ffbe0b', emissive: '#fb5607', emissiveIntensity: 0.55 })
      );
      cyl.position.y = 0.95;
      g.add(cyl);
    }

    return g;
  }

  public sync(sim: RoadSimulation, dt: number): void {
    const scrollDz = sim.crashed ? 0 : sim.speed * dt;
    const wrap = (obj: THREE.Object3D, span: number, minZ: number) => {
      obj.position.z += scrollDz;
      if (obj.position.z > 24) {
        obj.position.z -= span;
      } else if (obj.position.z < minZ) {
        obj.position.z += span;
      }
    };

    for (const d of this.laneDashes) wrap(d, 176, -160);
    for (const p of this.metroPillars) wrap(p, 192, -180);
    for (const b of this.billboards) wrap(b, 176, -160);
    for (const t of this.trees) wrap(t, 192, -180);
    for (const bldg of this.buildings) wrap(bldg, 190, -176);
    for (const span of this.bridgeSpans) wrap(span, 192, -180);

    // Smoothly blend Dhaka City <-> Padma Setu over the river
    const blend = sim.bridgeBlend;
    this.dhakaCityGroup.visible = blend < 0.72;
    this.padmaBridgeGroup.visible = blend > 0.15;
    this.skyScratch.copy(this.dhakaSky).lerp(this.padmaSky, blend);
    this.scene.background = this.skyScratch;
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(this.skyScratch);
    }

    // Player Bus Pose + Overload Tilt + Invulnerability Flash
    this.playerGroup.position.set(sim.playerX, 0, 0);
    this.playerGroup.rotation.z = sim.tiltAngle;
    this.playerGroup.rotation.y = -sim.playerVx * 0.025;
    this.playerGroup.visible = sim.invulnTimer <= 0 || Math.floor(sim.invulnTimer * 16) % 2 === 0;

    this.nitroFlames.visible = sim.nitroActive && !sim.crashed;
    if (this.nitroFlames.visible) {
      const flicker = 0.85 + Math.random() * 0.45;
      this.nitroFlames.scale.set(1, 1, flicker);
    }

    this.syncRoofRiders(sim.passengers);

    // Sync Traffic Entities
    const activeIds = new Set<number>();
    for (const ent of sim.entities) {
      activeIds.add(ent.id);
      let mesh = this.entityMeshes.get(ent.id);
      if (!mesh) {
        mesh = this.createEntityVisual(ent);
        this.trafficGroup.add(mesh);
        this.entityMeshes.set(ent.id, mesh);
      }
      mesh.position.set(ent.x, 0, ent.z);
      if (ent.kind === 'wrench_pickup' || ent.kind === 'nitro_pickup') {
        mesh.rotation.y += dt * 3.2;
      }
      if (ent.kind === 'toll_gate' && mesh.userData.barrierArm) {
        const arm = mesh.userData.barrierArm as THREE.Object3D;
        const targetRot = ent.hitResolved ? 0.52 : 0;
        arm.rotation.z = THREE.MathUtils.lerp(arm.rotation.z, targetRot, Math.min(1, dt * 12));
      }
    }

    for (const [id, mesh] of this.entityMeshes.entries()) {
      if (!activeIds.has(id)) {
        this.trafficGroup.remove(mesh);
        this.entityMeshes.delete(id);
      }
    }

    // Update particles & dispose finished materials
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particlesGroup.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
        continue;
      }
      p.vel.y -= 14 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += 8 * dt;
      p.mesh.rotation.y += 8 * dt;
      const alpha = 1 - p.life / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = alpha;
    }

    // Dynamic Chase Camera + FOV Nitro Kick + Shake
    const targetFov = sim.nitroActive ? 67 : sim.feverActive ? 61 : 56;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, Math.min(1, dt * 6));
    this.camera.updateProjectionMatrix();

    this.cameraShake = Math.max(0, this.cameraShake - dt * 2.5);
    const sx = (Math.random() - 0.5) * this.cameraShake * 0.45;
    const sy = (Math.random() - 0.5) * this.cameraShake * 0.35;

    const aspect = this.camera.aspect;
    const camHeight = aspect < 0.85 ? 7.2 : 5.6;
    const camBack = aspect < 0.85 ? 12.8 : 9.8;
    const camX = THREE.MathUtils.lerp(this.camera.position.x, sim.playerX * 0.52, Math.min(1, dt * 7));

    this.camera.position.set(camX + sx, camHeight + sy, camBack);
    this.camera.lookAt(sim.playerX * 0.45, 1.35, -14);

    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
