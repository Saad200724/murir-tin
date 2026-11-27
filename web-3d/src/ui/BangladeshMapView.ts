import {
  BD_ROUTE_SEGMENTS,
  FULL_ROUTE_M,
  toHighwayKm,
  type RouteSegment,
} from '../core/BangladeshRoute';
import { type RoadSimulation } from '../core/RoadSimulation';

const MAP_W = 738;
const MAP_H = 1024;

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

  private lastSim: RoadSimulation | null = null;
  private lastUnlocked: readonly string[] = ['thakurgaon'];

  constructor(
    private readonly container: HTMLElement,
    private readonly onFastTravel: (segment: RouteSegment) => void
  ) {
    this.renderBaseMap();
  }

  private renderBaseMap(): void {
    const routePoints = BD_ROUTE_SEGMENTS.map((s) => `${s.mapX},${s.mapY}`).join(' ');

    this.container.innerHTML = `
      <div class="bd-map-shell">
        <div class="bd-map-stage">
          <svg class="bd-map-svg" viewBox="0 0 ${MAP_W} ${MAP_H}" role="img" aria-label="বাংলাদেশের আসল মানচিত্র — ঠাকুরগাঁও থেকে কক্সবাজার">
            <rect width="${MAP_W}" height="${MAP_H}" fill="#0b1d33" />
            <text x="275" y="965" fill="#48cae4" font-size="24" font-weight="700" opacity="0.72" text-anchor="middle">বঙ্গোপসাগর (Bay of Bengal)</text>

            <g class="bd-viewport">
              <image href="./bd-map.png" x="0" y="0" width="${MAP_W}" height="${MAP_H}" preserveAspectRatio="xMidYMid meet" />

              <!-- High-contrast halo behind route line -->
              <polyline
                points="${routePoints}"
                fill="none"
                stroke="#0b1d33"
                stroke-width="11"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.75"
              />
              <polyline
                class="bd-route-remaining"
                points="${routePoints}"
                fill="none"
                stroke="#7c3aed"
                stroke-width="6.5"
                stroke-dasharray="13 9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                class="bd-route-done"
                points=""
                fill="none"
                stroke="#10b981"
                stroke-width="8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g class="bd-pins"></g>
              <g class="bd-bus-pin">
                <circle r="16" fill="#ffbe0b" stroke="#0b1d33" stroke-width="4"></circle>
                <text y="6" text-anchor="middle" font-size="18">🚌</text>
              </g>
            </g>

            <!-- Crisp Compass Rose -->
            <g transform="translate(658, 72)" opacity="0.9">
              <circle r="34" fill="rgba(11, 29, 51, 0.78)" stroke="#ffbe0b" stroke-width="2" />
              <polygon points="0,-24 6,-4 0,-8 -6,-4" fill="#ef476f" />
              <polygon points="0,24 6,4 0,8 -6,4" fill="#cbd5e1" />
              <text y="-26" text-anchor="middle" fill="#ffbe0b" font-size="13" font-weight="800">N</text>
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
    const svgNs = 'http://www.w3.org/2000/svg';

    for (const seg of BD_ROUTE_SEGMENTS) {
      if (!seg.isHub && seg.biome !== 'river_bridge') continue;
      const g = document.createElementNS(svgNs, 'g');
      g.setAttribute('class', 'bd-pin');
      g.setAttribute('transform', `translate(${seg.mapX}, ${seg.mapY})`);
      g.style.cursor = 'pointer';

      const isBridge = seg.biome === 'river_bridge';
      const circle = document.createElementNS(svgNs, 'circle');
      circle.setAttribute('r', isBridge ? '10' : '8.5');
      circle.setAttribute('fill', isBridge ? '#0ea5e9' : '#ffbe0b');
      circle.setAttribute('stroke', '#0b1d33');
      circle.setAttribute('stroke-width', '3');

      const shortTitle = isBridge
        ? `🌉 ${seg.enName.replace(' Bridge', '').replace(' Setu', '')}`
        : seg.name.split(' ')[0];

      const anchor = seg.labelAnchor ?? 'right';
      const dy = seg.labelDy ?? 0;
      const textX = anchor === 'left' ? -14 : 14;
      const boxW = Math.max(58, shortTitle.length * 8.5 + 14);
      const boxX = anchor === 'left' ? textX - boxW + 4 : textX - 4;

      const pill = document.createElementNS(svgNs, 'rect');
      pill.setAttribute('x', String(boxX));
      pill.setAttribute('y', String(dy - 12));
      pill.setAttribute('width', String(boxW));
      pill.setAttribute('height', '22');
      pill.setAttribute('rx', '6');
      pill.setAttribute('fill', 'rgba(11, 29, 51, 0.88)');
      pill.setAttribute('stroke', isBridge ? '#38bdf8' : '#ffbe0b');
      pill.setAttribute('stroke-width', '1.4');

      const label = document.createElementNS(svgNs, 'text');
      label.setAttribute('x', String(textX));
      label.setAttribute('y', String(dy + 4));
      label.setAttribute('text-anchor', anchor === 'left' ? 'end' : 'start');
      label.setAttribute('fill', '#fffdf7');
      label.setAttribute('font-size', '14');
      label.setAttribute('font-weight', '700');
      label.textContent = shortTitle;

      g.append(circle, pill, label);
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

    this.container.querySelectorAll<HTMLButtonElement>('.bd-map-zoom button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.zoom;
        if (act === 'in') this.zoom = Math.min(3.5, this.zoom + 0.4);
        else if (act === 'out') this.zoom = Math.max(1, this.zoom - 0.4);
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
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      this.zoom = Math.max(1, Math.min(3.5, this.zoom + delta));
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
    const cx = MAP_W / 2;
    const cy = MAP_H / 2;
    this.svgViewport.setAttribute(
      'transform',
      `translate(${cx + this.panX}, ${cy + this.panY}) scale(${this.zoom}) translate(${-cx}, ${-cy})`
    );
  }

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
