export type RoadEntityKind =
  | 'plastic_sedan'
  | 'deshi_tesla'
  | 'cng'
  | 'cargo_truck'
  | 'rival_bus'
  | 'wasa_pit'
  | 'sergeant'
  | 'bus_stop'
  | 'wrench_pickup'
  | 'nitro_pickup'
  | 'toll_gate';

export interface RoadEntity {
  id: number;
  kind: RoadEntityKind;
  x: number;
  z: number; // relative to player at z=0 (negative = ahead, positive = behind)
  halfW: number;
  halfL: number;
  speed: number; // world forward speed (m/s). Negative = oncoming wrong-way!
  laneIndex: number;
  nearMissed: boolean;
  hitResolved: boolean;
  hornDodged: boolean;
  dodgeTargetX: number | null;
}

export interface SimEvent {
  type:
    | 'chapani'
    | 'tesla_dodge'
    | 'passenger_pickup'
    | 'rival_win'
    | 'crash'
    | 'pit_smash'
    | 'sergeant_fine'
    | 'sergeant_dodge'
    | 'wrench_heal'
    | 'nitro_pickup'
    | 'horn_panic'
    | 'toll_approaching'
    | 'toll_paid'
    | 'toll_smash'
    | 'toll_fine'
    | 'bridge_complete'
    | 'fever_mode'
    | 'gameover';
  callout: string;
  takaDelta: number;
  x?: number;
  z?: number;
}

export interface InputState {
  steer: number; // -1 (left) to +1 (right)
  accelerate: boolean;
  brake: boolean;
  nitro: boolean;
}

export const ROAD_HALF_WIDTH = 6.2;
export const LANE_CENTERS = [-4.5, -1.5, 1.5, 4.5] as const;

export const LAP_LENGTH = 1600;
export const BRIDGE_START_M = 800;
export const BRIDGE_END_M = 1300;
export const PADMA_TOLL_FEE = 250;

export const ROUTE_SEGMENTS = [
  { startM: 0, endM: 200, name: 'মিরপুর ১০' },
  { startM: 200, endM: 400, name: 'ফার্মগেট' },
  { startM: 400, endM: 600, name: 'গুলিস্তান' },
  { startM: 600, endM: 800, name: 'মাওয়া এক্সপ্রেসওয়ে' },
  { startM: 800, endM: 1300, name: 'পদ্মা সেতু 🌉' },
  { startM: 1300, endM: 1600, name: 'জাজিরা প্রান্ত' },
] as const;

export const DHAKA_STOPS = ROUTE_SEGMENTS.map((s) => s.name);

export function getViralTitle(score: number): string {
  if (score >= 6000) return 'পদ্মা সেতু ও রাজপথের কিংবদন্তি 👑';
  if (score >= 3500) return 'মিরপুর-মাওয়া মুড়ির টিন সম্রাট 🚌🔥';
  if (score >= 1600) return 'ফার্মগেটের ওস্তাদ ড্রাইভার 💪';
  if (score >= 700) return 'আগারগাঁওয়ের চাল্লু হেল্পার 📣';
  return 'গুলিস্তানের নুব হেল্পার 😅';
}

export class RoadSimulation {
  public playerX = -1.5;
  public playerVx = 0;
  public speed = 26;
  public tiltAngle = 0;
  public distanceM = 0;
  public score = 0;
  public takaEarned = 0;
  public passengers = 6;
  public plasticScrapes = 0;
  public teslaDodges = 0;
  public chapaniCombo = 0;
  public comboTimer = 0;
  public feverActive = false;
  public nitroCharge = 60; // 0..100
  public nitroActive = false;
  public health = 3;
  public maxHealth = 3;
  public invulnTimer = 0;
  public crashed = false;
  public hornCooldown = 0;
  public revivesUsed = 0;

  public isOnPadmaBridge = false;
  public bridgeBlend = 0; // 0 = Dhaka highway, 1 = Padma Setu over river
  public totalTollPaid = 0;
  public padmaCrossings = 0;

  public entities: RoadEntity[] = [];
  private nextEntityId = 1;
  private spawnTimer = 0.6;
  private stopTimer = 4.2;
  private pickupTimer = 6.5;
  private rivalActive = false;
  private rivalTimer = 14;

  private lastTollWarningLap = -1;
  private lastTollSpawnLap = -1;
  private lastBridgeCompleteLap = -1;

  constructor(
    private readonly engineLevel = 1,
    private readonly armorLevel = 1,
    private readonly nitroLevel = 1
  ) {
    this.reset();
  }

  public get speedKmh(): number {
    return Math.round(this.speed * 3.1);
  }

  public reset(): void {
    this.playerX = -1.5;
    this.playerVx = 0;
    this.speed = 24 + (this.engineLevel - 1) * 2.2;
    this.tiltAngle = 0;
    this.distanceM = 0;
    this.score = 0;
    this.takaEarned = 0;
    this.passengers = 6;
    this.plasticScrapes = 0;
    this.teslaDodges = 0;
    this.chapaniCombo = 0;
    this.comboTimer = 0;
    this.feverActive = false;
    this.nitroCharge = 60;
    this.nitroActive = false;
    this.maxHealth = 2 + this.armorLevel; // Lv1 = 3, Lv4 = 6
    this.health = this.maxHealth;
    this.invulnTimer = 0;
    this.crashed = false;
    this.hornCooldown = 0;
    this.revivesUsed = 0;

    this.isOnPadmaBridge = false;
    this.bridgeBlend = 0;
    this.totalTollPaid = 0;
    this.padmaCrossings = 0;

    this.entities = [];
    this.spawnTimer = 0.45;
    this.stopTimer = 3.8;
    this.pickupTimer = 5.5;
    this.rivalActive = false;
    this.rivalTimer = 12;

    this.lastTollWarningLap = -1;
    this.lastTollSpawnLap = -1;
    this.lastBridgeCompleteLap = -1;

    // Seed initial readable Dhaka traffic ahead so road feels alive immediately
    this.spawnTrafficVehicle(-34, 2, 'plastic_sedan');
    this.spawnTrafficVehicle(-56, 1, 'cng');
    this.spawnTrafficVehicle(-78, 3, 'plastic_sedan');
  }

  public revive(): boolean {
    if (this.revivesUsed >= 1) return false;
    this.revivesUsed += 1;
    this.crashed = false;
    this.health = Math.max(2, Math.ceil(this.maxHealth / 2));
    this.invulnTimer = 2.6;
    // Clear immediate hazards right around player (keep toll gate ahead if distant)
    this.entities = this.entities.filter((e) => e.z < -28 || e.z > 10);
    return true;
  }

  private getSegmentIndex(): number {
    const lapDist = this.distanceM % LAP_LENGTH;
    const idx = ROUTE_SEGMENTS.findIndex((s) => lapDist >= s.startM && lapDist < s.endM);
    return idx >= 0 ? idx : 0;
  }

  public getCurrentStopName(): string {
    return ROUTE_SEGMENTS[this.getSegmentIndex()].name;
  }

  public getNextStopName(): string {
    const nextIdx = (this.getSegmentIndex() + 1) % ROUTE_SEGMENTS.length;
    return ROUTE_SEGMENTS[nextIdx].name;
  }

  public blastHorn(): SimEvent[] {
    if (this.crashed || this.hornCooldown > 0) return [];
    this.hornCooldown = 0.65;
    const events: SimEvent[] = [];
    let movedCount = 0;

    const isLaneFreeNear = (lane: number, z: number, excludeId: number): boolean => {
      const targetX = LANE_CENTERS[lane];
      return !this.entities.some(
        (other) =>
          other.id !== excludeId &&
          other.kind !== 'toll_gate' &&
          Math.abs(other.z - z) < 13 &&
          Math.abs((other.dodgeTargetX ?? other.x) - targetX) < 1.35
      );
    };

    for (const ent of this.entities) {
      if (
        (ent.kind === 'plastic_sedan' || ent.kind === 'cng') &&
        !ent.hornDodged &&
        ent.z < -2 &&
        ent.z > -40 &&
        Math.abs(ent.x - this.playerX) < 2.25
      ) {
        const primaryDir = ent.x >= this.playerX ? 1 : -1;
        const primaryLane = ent.laneIndex + primaryDir;
        const fallbackLane = ent.laneIndex - primaryDir;

        let chosenLane: number | null = null;
        if (primaryLane >= 0 && primaryLane <= 3 && isLaneFreeNear(primaryLane, ent.z, ent.id)) {
          chosenLane = primaryLane;
        } else if (fallbackLane >= 0 && fallbackLane <= 3 && isLaneFreeNear(fallbackLane, ent.z, ent.id)) {
          chosenLane = fallbackLane;
        }

        if (chosenLane !== null) {
          ent.hornDodged = true;
          ent.laneIndex = chosenLane;
          ent.dodgeTargetX = LANE_CENTERS[chosenLane];
          movedCount++;
        }
      }
    }

    if (movedCount > 0) {
      const bonusPts = 75 * movedCount;
      const bonusTaka = 35 * movedCount;
      this.score += bonusPts;
      this.takaEarned += bonusTaka;
      events.push({
        type: 'horn_panic',
        callout: `হর্ন শুনে সাইড দিছে! +${bonusTaka} ৳`,
        takaDelta: bonusTaka,
      });
    }
    return events;
  }

  public step(dt: number, input: InputState, rand: () => number = Math.random): SimEvent[] {
    if (this.crashed) return [];
    const safeDt = Math.min(0.05, Math.max(0.001, dt));
    const events: SimEvent[] = [];

    this.invulnTimer = Math.max(0, this.invulnTimer - safeDt);
    this.hornCooldown = Math.max(0, this.hornCooldown - safeDt);

    if (this.comboTimer > 0) {
      this.comboTimer = Math.max(0, this.comboTimer - safeDt);
      if (this.comboTimer === 0) {
        this.chapaniCombo = 0;
        this.feverActive = false;
      }
    }

    // Nitro logic
    if (input.nitro && this.nitroCharge > 8) {
      this.nitroActive = true;
    } else if (!input.nitro || this.nitroCharge <= 0) {
      this.nitroActive = false;
    }
    if (this.nitroActive) {
      const drainRate = Math.max(14, 24 - (this.nitroLevel - 1) * 2.2);
      this.nitroCharge = Math.max(0, this.nitroCharge - drainRate * safeDt);
      if (this.nitroCharge <= 0) this.nitroActive = false;
    } else {
      this.nitroCharge = Math.min(100, this.nitroCharge + 2.6 * safeDt);
    }

    // Forward Speed Dynamics
    const progressBonus = Math.min(20, this.distanceM * 0.0055);
    const baseCruise = 25 + (this.engineLevel - 1) * 2.5 + progressBonus + (this.isOnPadmaBridge ? 3.0 : 0);
    let targetSpeed = baseCruise;
    if (input.accelerate) targetSpeed += 8.5;
    if (input.brake) targetSpeed = Math.max(11, baseCruise - 12);
    if (this.nitroActive) targetSpeed += 19 + (this.nitroLevel - 1) * 2;

    this.speed += (targetSpeed - this.speed) * Math.min(1, safeDt * 5.5);
    const dz = this.speed * safeDt;
    this.distanceM += dz;
    const scoreMult = this.feverActive ? 1.5 : 1;
    this.score += Math.floor(dz * 1.6 * scoreMult);

    // Bridge State & Padma Toll Lifecycle
    const lapIndex = Math.floor(this.distanceM / LAP_LENGTH);
    const lapDist = this.distanceM % LAP_LENGTH;
    this.isOnPadmaBridge = lapDist >= BRIDGE_START_M && lapDist < BRIDGE_END_M;

    const targetBlend =
      lapDist >= BRIDGE_START_M - 35 && lapDist < BRIDGE_END_M - 15 ? 1 : 0;
    this.bridgeBlend += (targetBlend - this.bridgeBlend) * Math.min(1, safeDt * 2.2);

    if (lapDist >= 645 && lapDist < 720 && this.lastTollWarningLap < lapIndex) {
      this.lastTollWarningLap = lapIndex;
      events.push({
        type: 'toll_approaching',
        callout: `🌉 সামনে পদ্মা সেতু টোল প্লাজা! টোল ৳${PADMA_TOLL_FEE} (অথবা 🔥 নাইট্রো!)`,
        takaDelta: 0,
      });
    }

    if (lapDist >= 675 && lapDist < BRIDGE_START_M - 15 && this.lastTollSpawnLap < lapIndex) {
      this.lastTollSpawnLap = lapIndex;
      const gateZ = -(BRIDGE_START_M - lapDist);
      // Clear overlapping hazards right around the toll gate lane
      this.entities = this.entities.filter((e) => Math.abs(e.z - gateZ) > 22);
      this.spawnEntity('toll_gate', 0, gateZ, ROAD_HALF_WIDTH, 1.5, 0, 0);
    }

    if (lapDist >= BRIDGE_END_M && this.lastBridgeCompleteLap < lapIndex) {
      this.lastBridgeCompleteLap = lapIndex;
      this.padmaCrossings += 1;
      const bonusPts = 600;
      const bonusTaka = 300;
      this.score += bonusPts;
      this.takaEarned += bonusTaka;
      this.nitroCharge = Math.min(100, this.nitroCharge + 30);
      events.push({
        type: 'bridge_complete',
        callout: `🌉 পদ্মা সেতু পার! +${bonusTaka} ৳ ও +${bonusPts} পয়েন্ট!`,
        takaDelta: bonusTaka,
      });
    }

    // Smooth lateral steering + Overload Tilt + Padma Crosswind Physics!
    const steerAccel = 48;
    if (Math.abs(input.steer) > 0.02) {
      this.playerVx += input.steer * steerAccel * safeDt;
    } else {
      this.playerVx *= Math.pow(0.002, safeDt);
    }
    if (this.isOnPadmaBridge && Math.abs(input.steer) < 0.05) {
      // Gentle Padma river crosswind sway on the bridge
      this.playerVx += Math.sin(this.distanceM * 0.045) * 3.2 * safeDt;
    }

    const maxLatSpeed = 12.0 + (this.engineLevel - 1) * 0.4;
    this.playerVx = Math.max(-maxLatSpeed, Math.min(maxLatSpeed, this.playerVx));
    this.playerX += this.playerVx * safeDt;

    const bound = ROAD_HALF_WIDTH - 1.15;
    if (this.playerX < -bound) {
      this.playerX = -bound;
      this.playerVx = Math.max(0, this.playerVx);
    } else if (this.playerX > bound) {
      this.playerX = bound;
      this.playerVx = Math.min(0, this.playerVx);
    }

    // More passengers = heavier roof sway / Murir Tin body roll!
    const overloadFactor = 1 + Math.min(1.4, (this.passengers - 4) * 0.055);
    const targetTilt = (-this.playerVx / maxLatSpeed) * 0.16 * overloadFactor;
    this.tiltAngle += (targetTilt - this.tiltAngle) * Math.min(1, safeDt * 10);

    // Spawn traffic & Dhaka chaos events
    this.spawnTimer -= safeDt;
    if (this.spawnTimer <= 0) {
      const difficultyRate = Math.max(0.45, 0.90 - this.distanceM * 0.00016);
      this.spawnTimer = difficultyRate * (0.82 + rand() * 0.42);
      this.spawnRandomRoadHazard(rand);
    }

    if (!this.isOnPadmaBridge) {
      this.stopTimer -= safeDt;
      if (this.stopTimer <= 0) {
        this.stopTimer = 7.5 + rand() * 3.5;
        if (this.isZoneClear(-135, 0)) {
          this.spawnEntity('bus_stop', -5.1, -135, 1.4, 3.8, 0, 0);
        }
      }
    }

    this.pickupTimer -= safeDt;
    if (this.pickupTimer <= 0) {
      this.pickupTimer = 8.0 + rand() * 4.0;
      const lane = Math.floor(rand() * 4);
      if (this.isZoneClear(-130, lane)) {
        const kind: RoadEntityKind = rand() < 0.45 ? 'wrench_pickup' : 'nitro_pickup';
        this.spawnEntity(kind, LANE_CENTERS[lane], -130, 0.9, 0.9, 0, lane);
      }
    }

    this.rivalTimer -= safeDt;
    if (!this.rivalActive && this.rivalTimer <= 0 && !this.hasTollGateNear(-95)) {
      this.rivalActive = true;
      this.rivalTimer = 18;
      const rivalLane = this.playerX < 0 ? 2 : 1;
      if (this.isZoneClear(-95, rivalLane)) {
        this.spawnEntity('rival_bus', LANE_CENTERS[rivalLane], -95, 1.12, 2.75, this.speed - 3.5, rivalLane);
      } else {
        this.rivalActive = false;
        this.rivalTimer = 4;
      }
    }

    // Update entities & resolve collisions / near-misses
    const playerHalfW = 1.08;
    const playerHalfL = 2.65;

    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.z += dz - ent.speed * safeDt;

      if (ent.dodgeTargetX !== null) {
        ent.x += (ent.dodgeTargetX - ent.x) * Math.min(1, safeDt * 7);
        if (Math.abs(ent.x - ent.dodgeTargetX) < 0.05) {
          ent.x = ent.dodgeTargetX;
          ent.dodgeTargetX = null;
        }
      }

      if (ent.kind === 'rival_bus') {
        ent.speed = Math.max(16, this.speed - (this.nitroActive ? 14 : 2.2));
        if (!ent.hitResolved && ent.z > 12) {
          ent.hitResolved = true;
          this.rivalActive = false;
          const bonus = 500;
          this.score += bonus;
          this.takaEarned += bonus;
          events.push({
            type: 'rival_win',
            callout: 'রেষারেষি জিতছেন ওস্তাদ! +৫০০ ৳',
            takaDelta: bonus,
          });
        }
      }

      const dx = Math.abs(this.playerX - ent.x);
      const dzAbs = Math.abs(ent.z);
      const overlapX = dx < playerHalfW + ent.halfW - 0.16;
      const overlapZ = dzAbs < playerHalfL + ent.halfL - 0.25;

      if (!ent.hitResolved && overlapX && overlapZ) {
        ent.hitResolved = true;
        this.handleOverlap(ent, events, rand);
      } else if (
        !ent.nearMissed &&
        !ent.hitResolved &&
        ent.z > -0.5 &&
        ent.z < 5.5 &&
        (ent.kind === 'plastic_sedan' || ent.kind === 'cargo_truck' || ent.kind === 'deshi_tesla' || ent.kind === 'cng')
      ) {
        const edgeGap = dx - (playerHalfW + ent.halfW);
        if (edgeGap >= -0.15 && edgeGap <= 1.05) {
          ent.nearMissed = true;
          this.handleNearMiss(ent, events);
        }
      }

      if (ent.z > 24 || ent.z < -200) {
        if (ent.kind === 'rival_bus') this.rivalActive = false;
        this.entities.splice(i, 1);
      }
    }

    return events;
  }

  private handleOverlap(ent: RoadEntity, events: SimEvent[], rand: () => number): void {
    if (ent.kind === 'toll_gate') {
      if (this.nitroActive) {
        const pts = 550;
        this.score += pts;
        this.chapaniCombo += 1;
        this.comboTimer = 4.5;
        // Sergeant chases ahead on the bridge!
        const edgeLane = this.playerX < 0 ? 3 : 0;
        this.spawnEntity('sergeant', LANE_CENTERS[edgeLane], -70, 0.65, 0.65, 0, edgeLane);
        events.push({
          type: 'toll_smash',
          callout: `🔥 টোল ব্যারিকেড ভেঙে পদ্মা সেতুতে উড়াল! (+${pts} pts)`,
          takaDelta: 0,
          x: this.playerX,
          z: ent.z,
        });
        return;
      }

      if (this.takaEarned >= PADMA_TOLL_FEE) {
        this.takaEarned -= PADMA_TOLL_FEE;
        this.totalTollPaid += PADMA_TOLL_FEE;
        const pts = this.feverActive ? 600 : 400;
        this.score += pts;
        this.nitroCharge = Math.min(100, this.nitroCharge + 35);
        this.speed += 3;
        events.push({
          type: 'toll_paid',
          callout: `🌉 পদ্মা সেতু টোল ৳${PADMA_TOLL_FEE} পরিশোধ! +${pts} পয়েন্ট`,
          takaDelta: -PADMA_TOLL_FEE,
          x: this.playerX,
          z: ent.z,
        });
        return;
      }

      const seized = this.takaEarned;
      this.takaEarned = 0;
      this.totalTollPaid += seized;
      if (this.invulnTimer <= 0) {
        this.health -= 1;
        this.invulnTimer = 1.4;
        this.chapaniCombo = 0;
        this.feverActive = false;
        this.speed = Math.max(12, this.speed * 0.55);
      }
      if (this.health <= 0) {
        this.health = 0;
        this.crashed = true;
        events.push({
          type: 'gameover',
          callout: 'টোল না দিয়ে ব্যারিকেডে ধাক্কা! মুড়ির টিন শেষ 💥',
          takaDelta: -seized,
          x: this.playerX,
          z: 0,
        });
      } else {
        events.push({
          type: 'toll_fine',
          callout: `🚧 ভাড়া কম (টোল ৳${PADMA_TOLL_FEE})! ব্যারিকেডে ধাক্কা (-১ 🔧)`,
          takaDelta: -seized,
          x: this.playerX,
          z: ent.z,
        });
      }
      return;
    }

    if (ent.kind === 'bus_stop') {
      const boarded = 2 + Math.floor(rand() * 3);
      this.passengers += boarded;
      const fare = boarded * 45;
      this.takaEarned += fare;
      this.score += fare + 80;
      events.push({
        type: 'passenger_pickup',
        callout: `রানিংয়ে ${boarded} জন বাদুড়ঝোলা! +${fare} ৳`,
        takaDelta: fare,
        x: ent.x,
        z: ent.z,
      });
      return;
    }

    if (ent.kind === 'wrench_pickup') {
      this.health = Math.min(this.maxHealth, this.health + 1);
      this.score += 100;
      events.push({
        type: 'wrench_heal',
        callout: 'ধোলাইখাল মিস্ত্রি রিপেয়ার! +১ 🔧',
        takaDelta: 0,
        x: ent.x,
        z: ent.z,
      });
      ent.z = 999;
      return;
    }

    if (ent.kind === 'nitro_pickup') {
      this.nitroCharge = Math.min(100, this.nitroCharge + 45);
      this.score += 120;
      events.push({
        type: 'nitro_pickup',
        callout: 'সিলিন্ডার ফুল গ্যাস! 🔥',
        takaDelta: 0,
        x: ent.x,
        z: ent.z,
      });
      ent.z = 999;
      return;
    }

    if (ent.kind === 'sergeant') {
      if (this.nitroActive) {
        this.score += 300;
        this.takaEarned += 200;
        events.push({
          type: 'sergeant_dodge',
          callout: 'সার্জেন্টের সামনে দিয়ে উড়াল! +২০০ ৳',
          takaDelta: 200,
          x: ent.x,
          z: ent.z,
        });
      } else {
        const fine = Math.min(this.takaEarned, 120);
        this.takaEarned -= fine;
        events.push({
          type: 'sergeant_fine',
          callout: `মামলা খাইছি ওস্তাদ! -${fine} ৳`,
          takaDelta: -fine,
          x: ent.x,
          z: ent.z,
        });
      }
      return;
    }

    if (ent.kind === 'wasa_pit' && this.nitroActive) {
      this.score += 300;
      this.takaEarned += 220;
      ent.z = 999;
      events.push({
        type: 'pit_smash',
        callout: 'নাইট্রো দিয়ে ব্যারিকেড উড়াই দিছেন! +২২০ ৳',
        takaDelta: 220,
        x: ent.x,
        z: ent.z,
      });
      return;
    }

    // Real vehicle / pit collision!
    if (this.invulnTimer > 0) return;

    if (this.nitroActive) {
      ent.dodgeTargetX = ent.x >= this.playerX ? 6.5 : -6.5;
      this.score += 150;
      events.push({
        type: 'chapani',
        callout: 'নাইট্রো ধাক্কায় রাস্তা ক্লিয়ার! +১৫০',
        takaDelta: 0,
        x: ent.x,
        z: ent.z,
      });
      return;
    }

    this.health -= 1;
    this.invulnTimer = 1.35;
    this.chapaniCombo = 0;
    this.feverActive = false;
    this.speed = Math.max(12, this.speed * 0.55);

    if (this.health <= 0) {
      this.health = 0;
      this.crashed = true;
      events.push({
        type: 'gameover',
        callout: 'মুড়ির টিন উল্টায়ে গেছে ওস্তাদ!! 💥',
        takaDelta: 0,
        x: this.playerX,
        z: 0,
      });
    } else {
      events.push({
        type: 'crash',
        callout: 'রাস্তা কি তোর বাপের?! (-১ 🔧)',
        takaDelta: 0,
        x: ent.x,
        z: ent.z,
      });
    }
  }

  private handleNearMiss(ent: RoadEntity, events: SimEvent[]): void {
    this.chapaniCombo += 1;
    this.comboTimer = 4.5;
    const wasFever = this.feverActive;
    if (this.chapaniCombo >= 4) {
      this.feverActive = true;
    }
    const feverMult = this.feverActive ? 1.5 : 1;
    const nitroMult = 1 + (this.nitroLevel - 1) * 0.15;

    if (ent.kind === 'deshi_tesla') {
      this.teslaDodges += 1;
      const reward = Math.round((200 + this.chapaniCombo * 40) * nitroMult * feverMult);
      this.score += reward;
      this.takaEarned += reward;
      this.nitroCharge = Math.min(100, this.nitroCharge + 26);
      events.push({
        type: 'tesla_dodge',
        callout: `দেশি টেসলা ডজ x${this.chapaniCombo}! +${reward} ৳`,
        takaDelta: reward,
        x: ent.x,
        z: ent.z,
      });
    } else {
      this.plasticScrapes += 1;
      const isLeft = ent.x < this.playerX;
      const reward = Math.round((130 + this.chapaniCombo * 35) * nitroMult * feverMult);
      this.score += reward;
      this.takaEarned += reward;
      this.nitroCharge = Math.min(100, this.nitroCharge + 22);
      const sideWord = isLeft ? 'বাম প্লাস্টিক' : 'ডান চাপানি';
      events.push({
        type: 'chapani',
        callout: `${sideWord} ক্লিয়ার x${this.chapaniCombo}! +${reward} ৳`,
        takaDelta: reward,
        x: ent.x,
        z: ent.z,
      });
    }

    if (!wasFever && this.feverActive) {
      events.push({
        type: 'fever_mode',
        callout: '🔥 ফিভার মোড অন! ১.৫x পয়েন্ট বৃষ্টি!',
        takaDelta: 0,
      });
    }
  }

  private hasTollGateNear(z: number): boolean {
    return this.entities.some((e) => e.kind === 'toll_gate' && Math.abs(e.z - z) < 30);
  }

  private isZoneClear(z: number, lane: number): boolean {
    if (this.hasTollGateNear(z)) return false;
    return !this.entities.some((e) => Math.abs(e.z - z) < 18 && e.laneIndex === lane);
  }

  private spawnRandomRoadHazard(rand: () => number): void {
    const lane = Math.floor(rand() * 4);
    const z = -128 - rand() * 14;

    if (!this.isZoneClear(z, lane)) return;

    // Guarantee at least 2 escape lanes remain clear in every 22m Z-band
    const blockedLanes = new Set<number>();
    for (const e of this.entities) {
      if (e.kind !== 'bus_stop' && e.kind !== 'wrench_pickup' && e.kind !== 'nitro_pickup' && Math.abs(e.z - z) < 22) {
        blockedLanes.add(e.laneIndex);
      }
    }
    if (blockedLanes.size >= 2) return;

    const roll = rand();
    if (roll < 0.34) {
      this.spawnTrafficVehicle(z, lane, 'plastic_sedan');
    } else if (roll < 0.56) {
      this.spawnTrafficVehicle(z, lane, 'cng');
    } else if (roll < 0.74) {
      this.spawnEntity('deshi_tesla', LANE_CENTERS[lane], z, 0.7, 1.15, -13 - rand() * 5, lane);
    } else if (roll < 0.88) {
      this.spawnTrafficVehicle(z, lane, 'cargo_truck');
    } else if (!this.isOnPadmaBridge && roll < 0.94) {
      this.spawnEntity('wasa_pit', LANE_CENTERS[lane], z, 1.15, 1.0, 0, lane);
    } else {
      const edgeLane = rand() < 0.5 ? 0 : 3;
      if (this.isZoneClear(z, edgeLane)) {
        const edgeX = edgeLane === 0 ? -4.7 : 4.7;
        this.spawnEntity('sergeant', edgeX, z, 0.65, 0.65, 0, edgeLane);
      }
    }
  }

  public spawnTrafficVehicle(z: number, lane: number, kind: 'plastic_sedan' | 'cng' | 'cargo_truck'): void {
    const specs = {
      plastic_sedan: { hw: 0.92, hl: 2.05, spd: 13.5 },
      cng: { hw: 0.68, hl: 1.12, spd: 10.5 },
      cargo_truck: { hw: 1.15, hl: 2.95, spd: 11.5 },
    }[kind];
    this.spawnEntity(kind, LANE_CENTERS[lane], z, specs.hw, specs.hl, specs.spd, lane);
  }

  public spawnEntity(
    kind: RoadEntityKind,
    x: number,
    z: number,
    halfW: number,
    halfL: number,
    speed: number,
    laneIndex: number
  ): RoadEntity {
    const ent: RoadEntity = {
      id: this.nextEntityId++,
      kind,
      x,
      z,
      halfW,
      halfL,
      speed,
      laneIndex,
      nearMissed: false,
      hitResolved: false,
      hornDodged: false,
      dodgeTargetX: null,
    };
    this.entities.push(ent);
    return ent;
  }
}
