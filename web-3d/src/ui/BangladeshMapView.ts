import {
  BD_ROUTE_SEGMENTS,
  FULL_ROUTE_M,
  toHighwayKm,
  type RouteSegment,
} from '../core/BangladeshRoute';
import { type RoadSimulation } from '../core/RoadSimulation';

// Stylized Bangladesh landmass outline in 1000x1000 viewBox
const BD_OUTLINE =
  'M 132 82 L 195 68 L 245 120 L 325 130 L 405 162 L 495 215 L 620 228 L 745 245 L 775 292 L 732 342 L 668 380 L 665 450 L 698 525 L 725 602 L 758 672 L 802 742 L 845 835 L 862 918 L 818 938 L 780 865 L 732 785 L 685 712 L 638 692 L 598 730 L 542 752 L 478 785 L 398 788 L 315 765 L 258 712 L 240 618 L 195 548 L 168 460 L 185 375 L 210 290 L 152 208 L 122 142 Z';

const RIVERS = [
  // Jamuna / Brahmaputra
  'M 342 155 Q 395 270 412 390 Q 438 465 462 528',
  // Padma
  'M 218 455 Q 355 505 492 566 Q 550 615 582 708',
  // Meghna
  'M 642 308 Q 595 435 562 536 Q 555 628 575 725',
  // Karnaphuli
  'M 835 718 Q 785 745 735 775',
];

export class BangladeshMapView {
  private zoom = 1;
  private panX = 0;
  private panY = 0;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private selectedSegId: string | null = null;

  private svgViewport!: SVGGElement;
  private progressPath!: SVGPolylineElement;
  private busMarker!: SVGGElement;
  private infoCard!: HTMLElement;
  private pinEls = new Map<string, SVGGElement>();

  constructor(
    private readonly container: HTMLElement,
    private readonly onFastTravel: (segment: RouteSegment) => void
  ) {
    this.renderBaseMap();
  }

  private renderBaseMap(): void {
    this.container.innerHTML = `
      <div class="bd-map-shell">
        <div class="bd-map-stage">
          <svg class="bd-map-svg" viewBox="0 0 1000 1000" role="img" aria-label="বাংলাদেশ রোড ও সেতু মানচিত্র">
            <rect width="1000" height="1000" fill="#0d1b2a" />
            <text x="480" y="905" fill="#48cae4" font-size="28" font-weight="700" opacity="0.6" text-anchor="middle">বঙ্গোপসাগর (Bay of Bengal)</text>
            <g class="bd-viewport">
              <path d="${BD_OUTLINE}" fill="#2b593f" stroke="#74c69d" stroke-width="4" />
              <text x="372" y="742" fill="#95d5b2" font-size="20" font-weight="700" opacity="0.7" text-anchor="middle">সুন্দরবন</text>
              ${RIVERS.map((d) => `<path d="${d}" fill="none" stroke="#00b4d8" stroke-width="11" stroke-linecap="round" opacity="0.72" />`).join('')}
              <polyline
                class="bd-route-remaining"
                points="${BD_ROUTE_SEGMENTS.map((s) => `${s.mapX},${s.mapY}`).join(' ')}"
                fill="none"
                stroke="#9d4edd"
                stroke-width="8"
                stroke-dasharray="14 10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                class="bd-route-done"
                points=""
                fill="none"
                stroke="#06d6a0"
                stroke-width="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g class="bd-pins"></g>
              <g class="bd-bus-pin">
                <circle r="18" fill="#ffbe0b" stroke="#1b1f2a" stroke-width="4"></circle>
                <text y="6" text-anchor="middle" font-size="18">🚌</text>
              </g>
            </g>
          </svg>

          <div class="bd-map-zoom">
            <button type="button" class="btn-outline" data-zoom="in" aria-label="জুম ইন">+</button>
            <button type="button" class="btn-outline" data-zoom="out" aria-label="জুম আউট">−</button>
            <button type="button" class="btn-outline" data-zoom="reset" aria-label="রিসেট ভিউ">⌖</button>
          </div>
        </div>

        <aside class="bd-map-info" aria-live="polite"></aside>
      </div>
    `;

    const svg = this.container.querySelector('.bd-map-svg') as SVGSVGElement;
    this.svgViewport = this.container.querySelector('.bd-viewport') as SVGGElement;
    this.progressPath = this.container.querySelector('.bd-route-done') as SVGPolylineElement;
    this.busMarker = this.container.querySelector('.bd-bus-pin') as SVGGElement;
    this.infoCard = this.container.querySelector('.bd-map-info') as HTMLElement;

    const pinsGroup = this.container.querySelector('.bd-pins') as SVGGElement;
    for (const seg of BD_ROUTE_SEGMENTS) {
      if (!seg.isHub && seg.biome !== 'river_bridge') continue;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'bd-pin');
      g.setAttribute('transform', `translate(${seg.mapX}, ${seg.mapY})`);
      g.style.cursor = 'pointer';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', seg.biome === 'river_bridge' ? '11' : '9');
      circle.setAttribute('fill', seg.biome === 'river_bridge' ? '#38bdf8' : '#ffd166');
      circle.setAttribute('stroke', '#1b1f2a');
      circle.setAttribute('stroke-width', '3');

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '14');
      label.setAttribute('y', '5');
      label.setAttribute('fill', '#fffdf7');
      label.setAttribute('font-size', '18');
      label.setAttribute('font-weight', '700');
      label.textContent = seg.biome === 'river_bridge' ? `🌉 ${seg.enName.replace(' Bridge', '')}` : seg.name.split(' ')[0];

      g.append(circle, label);
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedSegId = seg.id;
        if (this.lastSim && this.lastUnlocked) {
          this.renderInfoCard(seg, this.lastSim, this.lastUnlocked);
        }
      });

      pinsGroup.appendChild(g);
      this.pinEls.set(seg.id, g);
    }

    // Zoom & Drag Pan interactions
    this.container.querySelectorAll<HTMLButtonElement>('.bd-map-zoom button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.zoom;
        if (act === 'in') this.zoom = Math.min(3, this.zoom + 0.35);
        else if (act === 'out') this.zoom = Math.max(1, this.zoom - 0.35);
        else {
          this.zoom = 1;
          this.panX = 0;
          this.panY = 0;
        }
        this.applyTransform();
      });
    });

    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      this.zoom = Math.max(1, Math.min(3, this.zoom + delta));
      this.applyTransform();
    });

    svg.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      this.panX += (e.clientX - this.lastX) * 1.4;
      this.panY += (e.clientY - this.lastY) * 1.4;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.applyTransform();
    });
    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });
  }

  private applyTransform(): void {
    const cx = 500;
    const cy = 500;
    this.svgViewport.setAttribute(
      'transform',
      `translate(${cx + this.panX}, ${cy + this.panY}) scale(${this.zoom}) translate(${-cx}, ${-cy})`
    );
  }

  private lastSim: RoadSimulation | null = null;
  private lastUnlocked: readonly string[] = ['thakurgaon'];

  public sync(sim: RoadSimulation, unlockedHubs: readonly string[]): void {
    this.lastSim = sim;
    this.lastUnlocked = unlockedHubs;

    const lapDist = sim.distanceM % FULL_ROUTE_M;
    const donePts: string[] = [];
    for (const seg of BD_ROUTE_SEGMENTS) {
      if (seg.startM <= lapDist) {
        donePts.push(`${seg.mapX},${seg.mapY}`);
      }
    }
    donePts.push(`${sim.mapX.toFixed(1)},${sim.mapY.toFixed(1)}`);
    this.progressPath.setAttribute('points', donePts.join(' '));
    this.busMarker.setAttribute('transform', `translate(${sim.mapX.toFixed(1)}, ${sim.mapY.toFixed(1)})`);

    const targetSeg =
      BD_ROUTE_SEGMENTS.find((s) => s.id === this.selectedSegId) ?? sim.currentSegment;
    this.renderInfoCard(targetSeg, sim, unlockedHubs);
  }

  private renderInfoCard(
    seg: RouteSegment,
    sim: RoadSimulation,
    unlockedHubs: readonly string[]
  ): void {
    const lapDist = sim.distanceM % FULL_ROUTE_M;
    const distKm = toHighwayKm(seg.startM);
    const remainingM = Math.max(0, Math.round(seg.startM - lapDist));
    const unlocked = seg.id === 'thakurgaon' || unlockedHubs.includes(seg.id);

    this.infoCard.innerHTML = `
      <div class="bd-info-head">
        <strong>${seg.name}</strong>
        <span class="bd-info-km">${distKm} / 840 km</span>
      </div>
      <p>${seg.tagline}</p>
      <div class="bd-info-stats">
        <span>অবস্থা: <strong>${lapDist >= seg.startM ? '✅ অতিক্রান্ত / চলমান' : `আর ${toHighwayKm(remainingM)} km বাকি`}</strong></span>
        ${seg.tollFee ? `<span>টোল: <strong>৳${seg.tollFee}</strong></span>` : ''}
      </div>
      <div class="bd-info-actions">
        ${
          seg.isHub
            ? `<button type="button" class="btn-secondary" id="btn-fast-travel-hub" ${unlocked ? '' : 'disabled'}>
                ${unlocked ? '🚌 এখান থেকে ট্রিপ শুরু করুন' : '🔒 লকড (আগে এখানে পৌঁছান)'}
              </button>`
            : ''
        }
      </div>
    `;

    const ftBtn = this.infoCard.querySelector<HTMLButtonElement>('#btn-fast-travel-hub');
    if (ftBtn && unlocked) {
      ftBtn.addEventListener('click', () => this.onFastTravel(seg));
    }
  }
}
