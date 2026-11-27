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
  | 'nitro_pickup';

export interface RoadEntity {
  id: number;
  kind: RoadEntityKind;
  x: number;
  z: number;          // relative to player at z=0 (negative = ahead, positive = behind)
  halfW: number;
  halfL: number;
  speed: number;      // world forward speed (m/s). Negative = oncoming wrong-way!
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
    | 'gameover';
  callout: string;
  takaDelta: number;
  x?: number;
  z?: number;
}

export interface InputState {
  steer: number;      // -1 (left) to +1 (right)
  accelerate: boolean;
  brake: boolean;
  nitro: boolean;
}

export const ROAD_HALF_WIDTH = 6.2;
export const LANE_CENTERS = [-4.5, -1.5, 1.5, 4.5] as const;

export const DHAKA_STOPS = [
  'মিরপুর ১০',
  'কাজীপাড়া',
  'আগারগাঁও',
  'বিজয় সরণি',
  'ফার্মগেট',
  'কারওয়ান বাজার',
  'শাহবাগ',
  'পল্টন',
  'মতিঝিল',
  'গুলিস্তান',
] as const;

export function getViralTitle(score: number): string {
  if (score >= 5000) return 'জাতীয় রাজপথের আতঙ্ক! 👑';
  if (score >= 2800) return 'মিরপুর ১০-এর মুড়ির টিন সম্রাট 🚌🔥';
  if (score >= 1400) return 'ফার্মগেটের ওস্তাদ ড্রাইভার 💪';
  if (score >= 600) return 'আগারগাঁওয়ের চাল্লু হেল্পার 📣';
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
  public nitroCharge = 60; // 0..100
  public nitroActive = false;
  public health = 3;
  public maxHealth = 3;
  public invulnTimer = 0;
  public crashed = false;
  public hornCooldown = 0;

  public entities: RoadEntity[] = [];
  private nextEntityId = 1;
  private spawnTimer = 0.6;
  private stopTimer = 4.2;
  private pickupTimer = 6.5;
  private rivalActive = false;
  private rivalTimer = 14;

  constructor(
    private readonly engineLevel = 1,
    private readonly armorLevel = 1,
    private readonly nitroLevel = 1
  ) {
    this.reset();
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
    this.nitroCharge = 60;
    this.nitroActive = false;
    this.maxHealth = 2 + this.armorLevel; // Lv1 = 3, Lv4 = 6
    this.health = this.maxHealth;
    this.invulnTimer = 0;
    this.crashed = false;
    this.hornCooldown = 0;
    this.entities = [];
    this.spawnTimer = 0.45;
    this.stopTimer = 3.8;
    this.pickupTimer = 5.5;
    this.rivalActive = false;
    this.rivalTimer = 12;

    // Seed initial readable Dhaka traffic ahead so road feels alive immediately
    this.spawnTrafficVehicle(-34, 2, 'plastic_sedan');
    this.spawnTrafficVehicle(-56, 1, 'cng');
    this.spawnTrafficVehicle(-78, 3, 'plastic_sedan');
  }

  public revive(): void {
    this.crashed = false;
    this.health = Math.max(2, Math.ceil(this.maxHealth / 2));
    this.invulnTimer = 2.4;
    // Clear immediate hazards right around player
    this.entities = this.entities.filter((e) => e.z < -26 || e.z > 10);
  }

  public getCurrentStopName(): string {
    const idx = Math.floor(this.distanceM / 220) % DHAKA_STOPS.length;
    return DHAKA_STOPS[idx];
  }

  public getNextStopName(): string {
    const idx = (Math.floor(this.distanceM / 220) + 1) % DHAKA_STOPS.length;
    return DHAKA_STOPS[idx];
  }

  public blastHorn(): SimEvent[] {
    if (this.crashed || this.hornCooldown > 0) return [];
    this.hornCooldown = 0.65;
    const events: SimEvent[] = [];
    let movedCount = 0;

    for (const ent of this.entities) {
      if (
        (ent.kind === 'plastic_sedan' || ent.kind === 'cng') &&
        !ent.hornDodged &&
        ent.z < -2 &&
        ent.z > -38 &&
        Math.abs(ent.x - this.playerX) < 2.2
      ) {
        ent.hornDodged = true;
        const shiftDir = ent.x >= this.playerX ? 1 : -1;
        const nextLane = Math.max(0, Math.min(3, ent.laneIndex + shiftDir));
        ent.laneIndex = nextLane;
        ent.dodgeTargetX = LANE_CENTERS[nextLane];
        movedCount++;
      }
    }

    if (movedCount > 0) {
      this.score += 60 * movedCount;
      this.takaEarned += 30 * movedCount;
      events.push({
        type: 'horn_panic',
        callout: `হর্ন শুনে সাইড দিছে! +${30 * movedCount} ৳`,
        takaDelta: 30 * movedCount,
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
      if (this.comboTimer === 0) this.chapaniCombo = 0;
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
      this.nitroCharge = Math.min(100, this.nitroCharge + 2.5 * safeDt);
    }

    // Forward Speed Dynamics
    const progressBonus = Math.min(18, this.distanceM * 0.006);
    const baseCruise = 25 + (this.engineLevel - 1) * 2.5 + progressBonus;
    let targetSpeed = baseCruise;
    if (input.accelerate) targetSpeed += 8;
    if (input.brake) targetSpeed = Math.max(11, baseCruise - 12);
    if (this.nitroActive) targetSpeed += 19 + (this.nitroLevel - 1) * 2;

    this.speed += (targetSpeed - this.speed) * Math.min(1, safeDt * 5.5);
    const dz = this.speed * safeDt;
    this.distanceM += dz;
    this.score += Math.floor(dz * 1.6);

    // Smooth lateral steering + Overload Tilt Physics!
    const steerAccel = 46;
    if (Math.abs(input.steer) > 0.02) {
      this.playerVx += input.steer * steerAccel * safeDt;
    } else {
      this.playerVx *= Math.pow(0.002, safeDt);
    }
    const maxLatSpeed = 11.5 + (this.engineLevel - 1) * 0.4;
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
      const difficultyRate = Math.max(0.46, 0.92 - this.distanceM * 0.00018);
      this.spawnTimer = difficultyRate * (0.8 + rand() * 0.45);
      this.spawnRandomRoadHazard(rand);
    }

    this.stopTimer -= safeDt;
    if (this.stopTimer <= 0) {
      this.stopTimer = 7.5 + rand() * 3.5;
      this.spawnEntity('bus_stop', -5.1, -135, 1.4, 3.8, 0, 0);
    }

    this.pickupTimer -= safeDt;
    if (this.pickupTimer <= 0) {
      this.pickupTimer = 8.5 + rand() * 4;
      const lane = Math.floor(rand() * 4);
      const kind: RoadEntityKind = rand() < 0.45 ? 'wrench_pickup' : 'nitro_pickup';
      this.spawnEntity(kind, LANE_CENTERS[lane], -130, 0.9, 0.9, 0, lane);
    }

    this.rivalTimer -= safeDt;
    if (!this.rivalActive && this.rivalTimer <= 0) {
      this.rivalActive = true;
      this.rivalTimer = 18;
      const rivalLane = this.playerX < 0 ? 2 : 1;
      this.spawnEntity('rival_bus', LANE_CENTERS[rivalLane], -24, 1.12, 2.75, this.speed - 2.5, rivalLane);
    }

    // Update entities & resolve collisions / near-misses
    const playerHalfW = 1.08;
    const playerHalfL = 2.65;

    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      // Relative Z movement: player advances by +dz, entity advances by ent.speed * dt
      ent.z += dz - ent.speed * safeDt;

      if (ent.dodgeTargetX !== null) {
        ent.x += (ent.dodgeTargetX - ent.x) * Math.min(1, safeDt * 7);
        if (Math.abs(ent.x - ent.dodgeTargetX) < 0.05) {
          ent.x = ent.dodgeTargetX;
          ent.dodgeTargetX = null;
        }
      }

      // Rival bus speeds up slightly to make racing exciting!
      if (ent.kind === 'rival_bus') {
        ent.speed = Math.max(16, this.speed - (this.nitroActive ? 14 : 1.5));
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
        this.handleOverlap(ent, events);
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

      if (ent.z > 24 || ent.z < -190) {
        if (ent.kind === 'rival_bus') this.rivalActive = false;
        this.entities.splice(i, 1);
      }
    }

    return events;
  }

  private handleOverlap(ent: RoadEntity, events: SimEvent[]): void {
    if (ent.kind === 'bus_stop') {
      const boarded = 2 + Math.floor(Math.random() * 3);
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
      events.push({ type: 'wrench_heal', callout: 'ধোলাইখাল মিস্ত্রি রিপেয়ার! +১ 🔧', takaDelta: 0, x: ent.x, z: ent.z });
      ent.z = 999;
      return;
    }

    if (ent.kind === 'nitro_pickup') {
      this.nitroCharge = Math.min(100, this.nitroCharge + 45);
      this.score += 120;
      events.push({ type: 'nitro_pickup', callout: 'সিলিন্ডার ফুল গ্যাস! 🔥', takaDelta: 0, x: ent.x, z: ent.z });
      ent.z = 999;
      return;
    }

    if (ent.kind === 'sergeant') {
      if (this.nitroActive) {
        this.score += 300;
        this.takaEarned += 200;
        events.push({ type: 'sergeant_dodge', callout: 'সার্জেন্টের সামনে দিয়ে উড়াল! +২০০ ৳', takaDelta: 200, x: ent.x, z: ent.z });
      } else {
        const fine = Math.min(this.takaEarned, 120);
        this.takaEarned -= fine;
        events.push({ type: 'sergeant_fine', callout: `মামলা খাইছি ওস্তাদ! -${fine} ৳`, takaDelta: -fine, x: ent.x, z: ent.z });
      }
      return;
    }

    if (ent.kind === 'wasa_pit' && this.nitroActive) {
      this.score += 300;
      this.takaEarned += 220;
      ent.z = 999;
      events.push({ type: 'pit_smash', callout: 'নাইট্রো দিয়ে ব্যারিকেড উড়াই দিছেন! +২২০ ৳', takaDelta: 220, x: ent.x, z: ent.z });
      return;
    }

    // Real vehicle / pit collision!
    if (this.invulnTimer > 0) return;

    if (this.nitroActive) {
      // Nitro softens impact: knocks obstacle away instead of heavy crash
      ent.dodgeTargetX = ent.x >= this.playerX ? 6.5 : -6.5;
      this.score += 150;
      events.push({ type: 'chapani', callout: 'নাইট্রো ধাক্কায় রাস্তা ক্লিয়ার! +১৫০', takaDelta: 0, x: ent.x, z: ent.z });
      return;
    }

    this.health -= 1;
    this.invulnTimer = 1.35;
    this.chapaniCombo = 0;
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
    const nitroMult = 1 + (this.nitroLevel - 1) * 0.15;

    if (ent.kind === 'deshi_tesla') {
      this.teslaDodges += 1;
      const reward = Math.round((200 + this.chapaniCombo * 40) * nitroMult);
      this.score += reward;
      this.takaEarned += reward;
      this.nitroCharge = Math.min(100, this.nitroCharge + 26);
      events.push({
        type: 'tesla_dodge',
        callout: `দেশি টেসলা ডজ! +${reward} ৳`,
        takaDelta: reward,
        x: ent.x,
        z: ent.z,
      });
    } else {
      this.plasticScrapes += 1;
      const isLeft = ent.x < this.playerX;
      const reward = Math.round((130 + this.chapaniCombo * 35) * nitroMult);
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
  }

  private spawnRandomRoadHazard(rand: () => number): void {
    const lane = Math.floor(rand() * 4);
    const z = -128 - rand() * 14;
    // Prevent overlapping spawns in same lane
    if (this.entities.some((e) => Math.abs(e.z - z) < 16 && e.laneIndex === lane)) {
      return;
    }

    const roll = rand();
    if (roll < 0.34) {
      this.spawnTrafficVehicle(z, lane, 'plastic_sedan');
    } else if (roll < 0.56) {
      this.spawnTrafficVehicle(z, lane, 'cng');
    } else if (roll < 0.74) {
      // Wrong-way Deshi Tesla!
      this.spawnEntity('deshi_tesla', LANE_CENTERS[lane], z, 0.70, 1.15, -13 - rand() * 5, lane);
    } else if (roll < 0.87) {
      this.spawnTrafficVehicle(z, lane, 'cargo_truck');
    } else if (roll < 0.94) {
      this.spawnEntity('wasa_pit', LANE_CENTERS[lane], z, 1.15, 1.0, 0, lane);
    } else {
      const edgeX = rand() < 0.5 ? -4.7 : 4.7;
      this.spawnEntity('sergeant', edgeX, z, 0.65, 0.65, 0, lane);
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
