import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DHAKA_BILLBOARDS, type BillboardAd } from '../config/billboards';
import { type BridgeStyle } from '../core/BangladeshRoute';
import { BUS_SKINS } from '../core/GarageCatalog';
import { type RoadEntity, type RoadSimulation } from '../core/RoadSimulation';
import { type CameraMode, type GraphicsPreset } from '../core/SaveStore';

interface BurstParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

const BRIDGE_PALETTES: Record<BridgeStyle, { main: string; accent: string; water: string }> = {
  jamuna: { main: '#e9c46a', accent: '#f4a261', water: '#0077b6' },
  padma: { main: '#1d6fa5', accent: '#48cae4', water: '#0077b6' },
  meghna: { main: '#2a9d8f', accent: '#e9ecef', water: '#0096c7' },
  gumti: { main: '#c1121f', accent: '#ffb703', water: '#0077b6' },
  karnaphuli: { main: '#f8f9fa', accent: '#ffbe0b', water: '#023e8a' },
};

export class DhakaWorld3D {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly hemiLight: THREE.HemisphereLight;
  private readonly sunLight: THREE.DirectionalLight;
  private readonly loader = new GLTFLoader();

  private readonly templates = new Map<string, THREE.Group>();
  private readonly entityMeshes = new Map<number, THREE.Group>();
  private readonly particles: BurstParticle[] = [];
  private readonly particleGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);

  private playerGroup = new THREE.Group();
  private playerBusBody: THREE.Group | null = null;
  private roofRidersGroup = new THREE.Group();
  private nitroFlames = new THREE.Group();
  private headlightBeams = new THREE.Group();

  private readonly roadGroup = new THREE.Group();
  private readonly underTerrainGroup = new THREE.Group();
  private readonly northBengalGroup = new THREE.Group();
  private readonly dhakaCityGroup = new THREE.Group();
  private readonly hillsGroup = new THREE.Group();
  private readonly marineDriveGroup = new THREE.Group();
  private readonly bridgeGroup = new THREE.Group();
  private readonly flyoverGroup = new THREE.Group();
  private readonly railTrackGroup = new THREE.Group();
  private readonly trainGroup = new THREE.Group();
  private readonly rainGroup = new THREE.Group();
  private readonly trafficGroup = new THREE.Group();
  private readonly particlesGroup = new THREE.Group();

  private readonly laneDashes: THREE.Mesh[] = [];
  private readonly railSleepers: THREE.Mesh[] = [];
  private readonly metroPillars: THREE.Group[] = [];
  private readonly billboards: THREE.Group[] = [];
  private readonly trees: THREE.Group[] = [];
  private readonly buildings: THREE.Group[] = [];
  private readonly paddyPatches: THREE.Mesh[] = [];
  private readonly hillMeshes: THREE.Mesh[] = [];
  private readonly coconutPalms: THREE.Group[] = [];
  private readonly bridgeSpans: THREE.Group[] = [];
  private readonly flyoverPosts: THREE.Group[] = [];
  private readonly rainDrops: THREE.Mesh[] = [];

  private championBillboardMat: THREE.MeshStandardMaterial | null = null;
  private bridgeMainMat!: THREE.MeshStandardMaterial;
  private bridgeAccentMat!: THREE.MeshStandardMaterial;
  private bridgeWaterMat!: THREE.MeshStandardMaterial;
  private cableTowerParts: THREE.Object3D[] = [];

  private readonly skyScratch = new THREE.Color();
  private readonly cMorning = new THREE.Color('#ffe5b4');
  private readonly cNoon = new THREE.Color('#bde0fe');
  private readonly cDhaka = new THREE.Color('#ffd9a0');
  private readonly cStorm = new THREE.Color('#64748b');
  private readonly cSunset = new THREE.Color('#f4845f');
  private readonly cNight = new THREE.Color('#132238');

  private cameraShake = 0;
  private currentSkinId = 'classic_mirpur';
  private renderedRiderCount = 0;
  private cameraMode: CameraMode = 'chase';
  private activeRainLimit = 90;

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
    this.scene.background = this.cMorning.clone();
    this.scene.fog = new THREE.Fog('#ffe5b4', 48, 165);

    this.camera = new THREE.PerspectiveCamera(56, 1, 0.2, 240);

    this.hemiLight = new THREE.HemisphereLight('#fff4df', '#5a4e43', 1.28);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#fff2d6', 1.85);
    this.sunLight.position.set(16, 28, 18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 90;
    this.sunLight.shadow.camera.left = -22;
    this.sunLight.shadow.camera.right = 22;
    this.sunLight.shadow.camera.top = 25;
    this.sunLight.shadow.camera.bottom = -25;
    this.scene.add(this.sunLight);

    this.underTerrainGroup.add(
      this.northBengalGroup,
      this.dhakaCityGroup,
      this.hillsGroup,
      this.marineDriveGroup
    );
    this.scene.add(
      this.underTerrainGroup,
      this.roadGroup,
      this.bridgeGroup,
      this.flyoverGroup,
      this.railTrackGroup,
      this.trainGroup,
      this.trafficGroup,
      this.particlesGroup,
      this.playerGroup,
      this.rainGroup
    );

    this.buildRoadDeck();
    this.buildNorthBengalBiome();
    this.buildDhakaCityBiome();
    this.buildHillsBiome();
    this.buildMarineDriveBiome();
    this.buildBridges();
    this.buildFlyover();
    this.buildRailwayAndTrain();
    this.buildRainPool();

    this.bridgeGroup.visible = false;
    this.flyoverGroup.visible = false;
    this.trainGroup.visible = false;
    this.rainGroup.visible = false;

    this.resize();
  }

  public applyGraphicsPreset(preset: GraphicsPreset): void {
    const dpr = window.devicePixelRatio || 1;
    if (preset === 'low') {
      this.renderer.setPixelRatio(0.75);
      this.renderer.shadowMap.enabled = false;
      this.activeRainLimit = 30;
    } else if (preset === 'medium') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = true;
      this.activeRainLimit = 60;
    } else if (preset === 'high') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.activeRainLimit = 100;
    } else {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
      this.activeRainLimit = 140;
    }
    this.resize();
  }

  public setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
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

    if (this.headlightBeams.children.length === 0) {
      const beamMat = new THREE.MeshBasicMaterial({
        color: '#fff3b0',
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      });
      for (const hx of [-0.68, 0.68]) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.75, 16, 12, 1, true), beamMat);
        cone.rotation.x = -Math.PI / 2;
        cone.position.set(hx, 0.72, -10.8);
        this.headlightBeams.add(cone);
      }
      this.headlightBeams.visible = false;
      this.playerGroup.add(this.headlightBeams);
    }

    if (!this.roofRidersGroup.parent) {
      this.playerGroup.add(this.roofRidersGroup);
    }
  }

  private buildRoadDeck(): void {
    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(13.8, 290),
      new THREE.MeshStandardMaterial({ color: '#2b303a', roughness: 0.9 })
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(0, 0, -90);
    asphalt.receiveShadow = true;
    this.roadGroup.add(asphalt);

    const curbMat = new THREE.MeshStandardMaterial({ color: '#e9ecef', roughness: 0.7 });
    for (const sx of [-1, 1]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 290), curbMat);
      curb.position.set(sx * 7.25, 0.11, -90);
      curb.receiveShadow = true;
      this.roadGroup.add(curb);
    }

    const yellowMat = new THREE.MeshBasicMaterial({ color: '#ffbe0b' });
    const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 290), yellowMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.015, -90);
    this.roadGroup.add(centerLine);

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
  }

  private buildNorthBengalBiome(): void {
    const groundMat = new THREE.MeshStandardMaterial({ color: '#588157', roughness: 0.95 });
    for (const sx of [-1, 1]) {
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(90, 290), groundMat);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(sx * 52, -0.05, -90);
      this.northBengalGroup.add(grass);
    }

    // Golden mustard & green paddy fields
    const paddyMat = new THREE.MeshStandardMaterial({ color: '#9ef01a', roughness: 0.9 });
    const mustardMat = new THREE.MeshStandardMaterial({ color: '#ffbe0b', roughness: 0.85 });
    for (let i = 0; i < 10; i++) {
      const patch = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 18),
        i % 3 === 0 ? mustardMat : paddyMat
      );
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(i % 2 === 0 ? -18 : 20, -0.02, 8 - i * 20);
      this.northBengalGroup.add(patch);
      this.paddyPatches.push(patch);
    }

    const trunkMat = new THREE.MeshStandardMaterial({ color: '#7f4f24', roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#38b000', roughness: 0.7 });
    for (let i = 0; i < 12; i++) {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.5, 8), trunkMat);
      trunk.position.y = 1.25;
      const crown = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), leafMat);
      crown.position.y = 3.1;
      t.add(trunk, crown);
      t.position.set(i % 2 === 0 ? -11.5 : 14.5, 0, 8 - i * 16);
      this.northBengalGroup.add(t);
      this.trees.push(t);
    }

    // Sponsor & Live Champion Billboards shared along highways
    for (let i = 0; i < 4; i++) {
      const ad = DHAKA_BILLBOARDS[i % DHAKA_BILLBOARDS.length];
      const board = this.createBillboardMesh(ad, i === 0);
      board.position.set(-9.6, 0, -20 - i * 44);
      this.roadGroup.add(board);
      this.billboards.push(board);
    }
  }

  private buildDhakaCityBiome(): void {
    const groundMat = new THREE.MeshStandardMaterial({ color: '#6b9080', roughness: 0.95 });
    for (const sx of [-1, 1]) {
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(90, 290), groundMat);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(sx * 52, -0.04, -90);
      this.dhakaCityGroup.add(grass);
    }

    const concreteMat = new THREE.MeshStandardMaterial({ color: '#adb5bd', roughness: 0.75 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 290), concreteMat);
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

  private buildHillsBiome(): void {
    const hillGround = new THREE.MeshStandardMaterial({ color: '#4a7c59', roughness: 0.95 });
    for (const sx of [-1, 1]) {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(90, 290), hillGround);
      g.rotation.x = -Math.PI / 2;
      g.position.set(sx * 52, -0.05, -90);
      this.hillsGroup.add(g);
    }

    const hillMat = new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.9 });
    for (let i = 0; i < 10; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(8 + (i % 3) * 3, 14 + (i % 4) * 4, 7), hillMat);
      cone.position.set(i % 2 === 0 ? -22 : 24, 6, 10 - i * 20);
      this.hillsGroup.add(cone);
      this.hillMeshes.push(cone);
    }
  }

  private buildMarineDriveBiome(): void {
    // Left side green hills + beach shoulder, right side deep Bay of Bengal ocean!
    const beachMat = new THREE.MeshStandardMaterial({ color: '#f4d35e', roughness: 0.9 });
    const leftHillGround = new THREE.Mesh(new THREE.PlaneGeometry(80, 290), new THREE.MeshStandardMaterial({ color: '#2d6a4f' }));
    leftHillGround.rotation.x = -Math.PI / 2;
    leftHillGround.position.set(-47, -0.05, -90);
    const sandStrip = new THREE.Mesh(new THREE.PlaneGeometry(6, 290), beachMat);
    sandStrip.rotation.x = -Math.PI / 2;
    sandStrip.position.set(10.5, -0.04, -90);
    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 290),
      new THREE.MeshStandardMaterial({ color: '#0077b6', roughness: 0.2, metalness: 0.3 })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(82, -0.15, -90);
    this.marineDriveGroup.add(leftHillGround, sandStrip, ocean);

    const trunkMat = new THREE.MeshStandardMaterial({ color: '#8d5524', roughness: 0.85 });
    const palmMat = new THREE.MeshStandardMaterial({ color: '#38b000', roughness: 0.7 });
    for (let i = 0; i < 10; i++) {
      const palm = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 4.8, 7), trunkMat);
      trunk.position.y = 2.4;
      trunk.rotation.z = -0.12;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.4, 7), palmMat);
      crown.position.set(0.3, 4.9, 0);
      palm.add(trunk, crown);
      palm.position.set(9.2, 0, 8 - i * 19);
      this.marineDriveGroup.add(palm);
      this.coconutPalms.push(palm);
    }
  }

  private buildBridges(): void {
    this.bridgeMainMat = new THREE.MeshStandardMaterial({ color: '#1d6fa5', metalness: 0.55, roughness: 0.38 });
    this.bridgeAccentMat = new THREE.MeshStandardMaterial({ color: '#48cae4', metalness: 0.4, roughness: 0.45 });
    this.bridgeWaterMat = new THREE.MeshStandardMaterial({ color: '#0077b6', roughness: 0.22, metalness: 0.28 });

    const river = new THREE.Mesh(new THREE.PlaneGeometry(260, 290), this.bridgeWaterMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -4.6, -90);
    this.bridgeGroup.add(river);

    const parapetMat = new THREE.MeshStandardMaterial({ color: '#dee2e6', roughness: 0.65 });
    for (const sx of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.95, 290), parapetMat);
      rail.position.set(sx * 7.65, 0.5, -90);
      this.bridgeGroup.add(rail);
    }

    const lampMat = new THREE.MeshBasicMaterial({ color: '#ffd166' });
    for (let i = 0; i < 8; i++) {
      const span = new THREE.Group();
      for (const sx of [-7.8, 7.8]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 7.6, 0.65), this.bridgeMainMat);
        post.position.set(sx, 3.8, 0);
        span.add(post);

        const diagA = new THREE.Mesh(new THREE.BoxGeometry(0.32, 9.2, 0.35), this.bridgeMainMat);
        diagA.position.set(sx, 3.8, -6);
        diagA.rotation.x = 0.62;
        const diagB = new THREE.Mesh(new THREE.BoxGeometry(0.32, 9.2, 0.35), this.bridgeMainMat);
        diagB.position.set(sx, 3.8, -6);
        diagB.rotation.x = -0.62;
        span.add(diagA, diagB);

        const topChord = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 24), this.bridgeAccentMat);
        topChord.position.set(sx, 7.4, -12);
        span.add(topChord);

        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.5), lampMat);
        lampHead.position.set(sx * 0.88, 5.4, -12);
        span.add(lampHead);
      }

      const overhead = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.6, 0.7), this.bridgeAccentMat);
      overhead.position.set(0, 7.4, 0);
      span.add(overhead);

      // Tall Cable-Stayed Pylon Tower for Shah Amanat (Karnaphuli) Bridge!
      const tower = new THREE.Group();
      for (const sx of [-7.8, 7.8]) {
        const spire = new THREE.Mesh(new THREE.BoxGeometry(0.8, 14, 0.9), this.bridgeMainMat);
        spire.position.set(sx, 11, 0);
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 15, 5), this.bridgeAccentMat);
        cable.position.set(sx, 8.2, -5.2);
        cable.rotation.x = 0.72;
        tower.add(spire, cable);
      }
      tower.visible = false;
      span.add(tower);
      this.cableTowerParts.push(tower);

      span.position.set(0, 0, 12 - i * 24);
      this.bridgeGroup.add(span);
      this.bridgeSpans.push(span);
    }
  }

  private buildFlyover(): void {
    const barrierMat = new THREE.MeshStandardMaterial({ color: '#e9ecef', roughness: 0.6 });
    const chevronMat = new THREE.MeshStandardMaterial({ color: '#ef233c' });
    const poleMat = new THREE.MeshStandardMaterial({ color: '#495057', metalness: 0.5 });
    const lampMat = new THREE.MeshBasicMaterial({ color: '#ffbe0b' });

    for (const sx of [-1, 1]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.15, 290), barrierMat);
      wall.position.set(sx * 7.6, 0.58, -90);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, 290), chevronMat);
      stripe.position.set(sx * 7.6, 0.95, -90);
      this.flyoverGroup.add(wall, stripe);
    }

    for (let i = 0; i < 8; i++) {
      const post = new THREE.Group();
      for (const sx of [-7.7, 7.7]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.8, 6), poleMat);
        p.position.set(sx, 2.4, 0);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.25), lampMat);
        arm.position.set(sx > 0 ? sx - 0.5 : sx + 0.5, 4.75, 0);
        post.add(p, arm);
      }
      post.position.set(0, 0, 10 - i * 24);
      this.flyoverGroup.add(post);
      this.flyoverPosts.push(post);
    }
  }

  private buildRailwayAndTrain(): void {
    // Parallel Bangladesh Railway Track at x = 10.6
    const railMat = new THREE.MeshStandardMaterial({ color: '#6c757d', metalness: 0.7, roughness: 0.3 });
    const tieMat = new THREE.MeshStandardMaterial({ color: '#5c4033', roughness: 0.9 });
    for (const rx of [9.95, 11.25]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 290), railMat);
      rail.position.set(rx, 0.12, -90);
      this.railTrackGroup.add(rail);
    }
    const tieGeo = new THREE.BoxGeometry(2.1, 0.1, 0.36);
    for (let i = 0; i < 36; i++) {
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.set(10.6, 0.05, 16 - i * 5.2);
      this.railTrackGroup.add(tie);
      this.railSleepers.push(tie);
    }

    // Bangladesh Railway Red-Green Express Train (Engine + 5 Coaches)
    const locoMat = new THREE.MeshStandardMaterial({ color: '#d90429', roughness: 0.45 });
    const greenMat = new THREE.MeshStandardMaterial({ color: '#007f5f', roughness: 0.5 });
    const roofMat = new THREE.MeshStandardMaterial({ color: '#dee2e6', roughness: 0.5 });

    const loco = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.1, 10.5), locoMat);
    loco.position.set(10.6, 1.65, 0);
    const locoStripe = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.55, 10.55), greenMat);
    locoStripe.position.set(10.6, 1.4, 0);
    const trainHeadlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#fff3b0' })
    );
    trainHeadlight.position.set(10.6, 2.1, 5.3);
    this.trainGroup.add(loco, locoStripe, trainHeadlight);

    for (let c = 1; c <= 5; c++) {
      const zOff = -c * 11.4;
      const coach = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.9, 10.2), greenMat);
      coach.position.set(10.6, 1.55, zOff);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.45, 10.24), locoMat);
      stripe.position.set(10.6, 1.55, zOff);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.25, 10.1), roofMat);
      roof.position.set(10.6, 3.05, zOff);
      this.trainGroup.add(coach, stripe, roof);
    }
  }

  private buildRainPool(): void {
    const dropGeo = new THREE.BoxGeometry(0.04, 1.6, 0.04);
    const dropMat = new THREE.MeshBasicMaterial({ color: '#caf0f8', transparent: true, opacity: 0.45 });
    for (let i = 0; i < 140; i++) {
      const drop = new THREE.Mesh(dropGeo, dropMat);
      drop.position.set((Math.random() - 0.5) * 26, 1 + Math.random() * 14, 12 - Math.random() * 65);
      drop.rotation.z = 0.14;
      this.rainGroup.add(drop);
      this.rainDrops.push(drop);
    }
  }

  private paintBillboardCanvas(ad: BillboardAd): THREE.CanvasTexture {
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
    return tex;
  }

  private createBillboardMesh(ad: BillboardAd, isChampionSlot: boolean): THREE.Group {
    const grp = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: '#495057', metalness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.4, 8), poleMat);
    pole.position.y = 2.2;

    const tex = this.paintBillboardCanvas(ad);
    const signMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
    if (isChampionSlot) {
      this.championBillboardMat = signMat;
    }
    const sign = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.8, 0.25), signMat);
    sign.position.set(0, 5.2, 0);
    sign.rotation.y = 0.35;
    sign.castShadow = true;

    grp.add(pole, sign);
    return grp;
  }

  public updateChampionBillboard(playerName: string, score: number): void {
    if (!this.championBillboardMat) return;
    const oldMap = this.championBillboardMat.map;
    this.championBillboardMat.map = this.paintBillboardCanvas({
      id: 'champion_live',
      headline: `👑 #1 ওস্তাদ: ${playerName}`,
      subline: `লাইভ বিশ্ব রেকর্ড: ${score.toLocaleString()} pts!`,
      bgHex: '#1b1f2a',
      accentHex: '#ffbe0b',
      textHex: '#ffbe0b',
    });
    this.championBillboardMat.needsUpdate = true;
    oldMap?.dispose();
  }

  private createTollGateMesh(ent: RoadEntity): THREE.Group {
    const grp = new THREE.Group();

    const pillarMat = new THREE.MeshStandardMaterial({ color: '#f8f9fa', roughness: 0.5 });
    const boothMat = new THREE.MeshStandardMaterial({ color: '#0077b6', roughness: 0.4 });

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
    ctx.font = 'bold 50px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText(`🌉 ${ent.tollLabel ?? 'সেতু'} টোল প্লাজা • ৳${ent.tollFee ?? 250}`, 512, 86, 960);
    ctx.fillStyle = '#06d6a0';
    ctx.font = 'bold 32px "Hind Siliguri", "Segoe UI", sans-serif';
    ctx.fillText('ক্যাশ দিয়ে পাস করুন অথবা 🔥 নাইট্রো দিয়ে ব্যারিকেড উড়ান!', 512, 148, 960);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(14.8, 2.3, 1.2),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35 })
    );
    canopy.position.set(0, 5.2, 0);
    grp.add(canopy);

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

  private createBlueGearWrenchMesh(): THREE.Group {
    const g = new THREE.Group();
    const gearBlue = new THREE.MeshStandardMaterial({
      color: '#2196f3',
      emissive: '#0d47a1',
      emissiveIntensity: 0.35,
      metalness: 0.35,
      roughness: 0.3,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      emissive: '#94a3b8',
      emissiveIntensity: 0.2,
      metalness: 0.7,
      roughness: 0.25,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.14, 8, 18), gearBlue);
    g.add(ring);

    // 8 gear teeth
    const toothGeo = new THREE.BoxGeometry(0.18, 0.24, 0.22);
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, gearBlue);
      tooth.position.set(Math.cos(ang) * 0.62, Math.sin(ang) * 0.62, 0);
      tooth.rotation.z = ang + Math.PI / 2;
      g.add(tooth);
    }

    // Diagonal silver wrench across the blue gear (matching user's icon!)
    const wrenchHandle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.18, 0.14), silverMat);
    wrenchHandle.position.set(-0.08, -0.06, 0.16);
    wrenchHandle.rotation.z = -0.68;
    const wrenchHead = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 6, 12, Math.PI * 1.4), silverMat);
    wrenchHead.position.set(0.26, 0.3, 0.16);
    wrenchHead.rotation.z = -0.4;
    g.add(wrenchHandle, wrenchHead);

    g.position.y = 1.05;
    return g;
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
    if (ent.kind === 'toll_gate') return this.createTollGateMesh(ent);
    if (ent.kind === 'wrench_pickup') return this.createBlueGearWrenchMesh();

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

  private updateSkyAndLighting(sim: RoadSimulation): void {
    const t = sim.timeOfDay;
    if (t < 0.28) {
      this.skyScratch.copy(this.cMorning).lerp(this.cNoon, t / 0.28);
    } else if (t < 0.58) {
      this.skyScratch.copy(this.cNoon).lerp(this.cDhaka, (t - 0.28) / 0.3);
    } else if (t < 0.85) {
      this.skyScratch.copy(this.cDhaka).lerp(this.cSunset, (t - 0.58) / 0.27);
    } else {
      this.skyScratch.copy(this.cSunset).lerp(this.cNight, (t - 0.85) / 0.15);
    }

    if (sim.rainIntensity > 0.05) {
      this.skyScratch.lerp(this.cStorm, sim.rainIntensity * 0.72);
    }

    const nightFactor = Math.max(0, (t - 0.82) / 0.18);
    this.hemiLight.intensity = THREE.MathUtils.lerp(1.28, 0.65, nightFactor);
    this.sunLight.intensity = THREE.MathUtils.lerp(1.85, 0.55, nightFactor);

    this.scene.background = this.skyScratch;
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(this.skyScratch);
    }
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
    for (const s of this.railSleepers) wrap(s, 187.2, -171);
    for (const p of this.metroPillars) wrap(p, 192, -180);
    for (const b of this.billboards) wrap(b, 176, -160);
    for (const t of this.trees) wrap(t, 192, -180);
    for (const bldg of this.buildings) wrap(bldg, 190, -176);
    for (const patch of this.paddyPatches) wrap(patch, 200, -180);
    for (const hill of this.hillMeshes) wrap(hill, 200, -180);
    for (const palm of this.coconutPalms) wrap(palm, 190, -175);
    for (const span of this.bridgeSpans) wrap(span, 192, -180);
    for (const post of this.flyoverPosts) wrap(post, 192, -180);

    // Biome Group Visibility + 5 Bridge Palettes
    const onBridge = sim.bridgeBlend > 0.18;
    const onFlyover = !onBridge && sim.flyoverBlend > 0.2;
    this.bridgeGroup.visible = onBridge;
    this.flyoverGroup.visible = onFlyover;

    if (onBridge && sim.activeBridgeStyle) {
      const pal = BRIDGE_PALETTES[sim.activeBridgeStyle];
      this.bridgeMainMat.color.set(pal.main);
      this.bridgeAccentMat.color.set(pal.accent);
      this.bridgeWaterMat.color.set(pal.water);
      const isCable = sim.activeBridgeStyle === 'karnaphuli';
      for (const tw of this.cableTowerParts) tw.visible = isCable;
    }

    const showGroundBiomes = sim.bridgeBlend < 0.78;
    this.northBengalGroup.visible =
      showGroundBiomes && (sim.currentBiome === 'north_bengal' || sim.currentBiome === 'rain_highway' || sim.currentBiome === 'flyover');
    this.dhakaCityGroup.visible = showGroundBiomes && sim.currentBiome === 'dhaka_city';
    this.hillsGroup.visible = showGroundBiomes && sim.currentBiome === 'hills';
    this.marineDriveGroup.visible = showGroundBiomes && sim.currentBiome === 'marine_drive';

    // Show parallel Bangladesh Railway tracks on rail corridors & Jamuna/Padma bridges
    this.railTrackGroup.visible = Boolean(sim.currentSegment.hasParallelRail || sim.trainActive);
    this.trainGroup.visible = sim.trainActive;
    if (sim.trainActive) {
      this.trainGroup.position.set(0, 0, sim.trainZ);
    }

    // Physical Slope & Elevation Feel (under-terrain drops smoothly when bus climbs bridges/flyovers!)
    this.underTerrainGroup.position.y = -sim.elevationY;
    this.updateSkyAndLighting(sim);

    // Monsoon Rain Streaks
    this.rainGroup.visible = sim.rainIntensity > 0.12;
    if (this.rainGroup.visible) {
      for (let i = 0; i < this.rainDrops.length; i++) {
        const drop = this.rainDrops[i];
        drop.visible = i < this.activeRainLimit;
        if (!drop.visible) continue;
        drop.position.y -= 28 * dt;
        drop.position.z += scrollDz * 0.55;
        if (drop.position.y < 0 || drop.position.z > 14) {
          drop.position.set((Math.random() - 0.5) * 26, 12 + Math.random() * 5, 10 - Math.random() * 65);
        }
      }
    }

    // Player Bus Pose + Slope Pitch + Overload Tilt + Headlights
    this.playerGroup.position.set(sim.playerX, 0, 0);
    this.playerGroup.rotation.z = sim.tiltAngle;
    this.playerGroup.rotation.y = -sim.playerVx * 0.025;
    this.playerGroup.rotation.x = THREE.MathUtils.lerp(this.playerGroup.rotation.x, sim.slopePitch, Math.min(1, dt * 8));
    this.playerGroup.visible = sim.invulnTimer <= 0 || Math.floor(sim.invulnTimer * 16) % 2 === 0;

    this.nitroFlames.visible = sim.nitroActive && !sim.crashed;
    if (this.nitroFlames.visible) {
      const flicker = 0.85 + Math.random() * 0.45;
      this.nitroFlames.scale.set(1, 1, flicker);
    }
    this.headlightBeams.visible = sim.headlightsOn && !sim.crashed;

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

    // Dynamic Chase Camera + Camera Mode + Slope LookAt + Shake
    const baseFov = this.cameraMode === 'wide' ? 64 : this.cameraMode === 'close' ? 50 : 56;
    const targetFov = sim.nitroActive ? baseFov + 10 : sim.feverActive ? baseFov + 4 : baseFov;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, Math.min(1, dt * 6));
    this.camera.updateProjectionMatrix();

    this.cameraShake = Math.max(0, this.cameraShake - dt * 2.5);
    const sx = (Math.random() - 0.5) * this.cameraShake * 0.45;
    const sy = (Math.random() - 0.5) * this.cameraShake * 0.35;

    const aspect = this.camera.aspect;
    const modeH = this.cameraMode === 'close' ? 4.4 : this.cameraMode === 'wide' ? 6.8 : 5.6;
    const modeB = this.cameraMode === 'close' ? 7.6 : this.cameraMode === 'wide' ? 11.8 : 9.8;
    const camHeight = (aspect < 0.85 ? modeH + 1.5 : modeH) - sim.slopePitch * 7;
    const camBack = aspect < 0.85 ? modeB + 2.8 : modeB;
    const camX = THREE.MathUtils.lerp(this.camera.position.x, sim.playerX * 0.52, Math.min(1, dt * 7));

    this.camera.position.set(camX + sx, camHeight + sy, camBack);
    this.camera.lookAt(sim.playerX * 0.45, 1.35 + sim.slopePitch * 12, -14);

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
