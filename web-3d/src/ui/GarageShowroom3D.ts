import * as THREE from 'three';
import { disposeLivery } from '../scene/BusLiveryBuilder';

/**
 * Dedicated 360-degree interactive 3D Turntable Showroom for previewing & purchasing buses!
 */
export class GarageShowroom3D {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly turntable = new THREE.Group();

  private currentBus: THREE.Group | null = null;
  private rafId = 0;
  private isRunning = false;
  private lastTime = 0;
  private yaw = -0.58;
  private dragging = false;
  private lastX = 0;

  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.domElement.style.cursor = 'grab';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.2, 60);
    this.camera.position.set(0, 2.35, 7.2);
    this.camera.lookAt(0, 1.15, 0);

    // Studio 3-point lighting
    const hemi = new THREE.HemisphereLight('#ffffff', '#1e293b', 1.35);
    const keyLight = new THREE.DirectionalLight('#fff5db', 2.1);
    keyLight.position.set(5, 8, 6);
    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.15);
    rimLight.position.set(-6, 4, -5);
    this.scene.add(hemi, keyLight, rimLight);

    // Luxury showroom turntable disc + glowing yellow ring
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(3.35, 3.6, 0.22, 48),
      new THREE.MeshStandardMaterial({ color: '#141926', metalness: 0.45, roughness: 0.32 })
    );
    disc.position.y = -0.11;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.36, 0.05, 10, 48),
      new THREE.MeshBasicMaterial({ color: '#ffbe0b' })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    this.turntable.add(disc, ring);
    this.scene.add(this.turntable);

    this.bindDrag();
    this.resize();
  }

  private bindDrag(): void {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
      el.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.dragging || !this.isRunning) return;
      const dx = e.clientX - this.lastX;
      this.lastX = e.clientX;
      this.yaw += dx * 0.012;
    });
    window.addEventListener('pointerup', () => {
      this.dragging = false;
      el.style.cursor = 'grab';
    });
  }

  public showBus(busMesh: THREE.Group): void {
    if (this.currentBus) {
      disposeLivery(this.currentBus);
      this.turntable.remove(this.currentBus);
    }
    this.currentBus = busMesh;
    this.turntable.add(busMesh);
    this.yaw = -0.58;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();
    this.lastTime = performance.now();

    const tick = (now: number) => {
      if (!this.isRunning) return;
      this.rafId = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - this.lastTime) / 1000);
      this.lastTime = now;
      if (!this.dragging) {
        this.yaw += dt * 0.46;
      }
      this.turntable.rotation.y = this.yaw;
      this.renderer.render(this.scene, this.camera);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  public resize(): void {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
