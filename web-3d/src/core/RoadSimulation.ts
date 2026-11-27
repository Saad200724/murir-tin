import {
  BD_ROUTE_SEGMENTS,
  FULL_ROUTE_M,
  sampleRouteState,
  type BiomeKind,
  type BridgeStyle,
  type RouteSegment,
} from './BangladeshRoute';

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
  tollFee?: number;
  tollLabel?: string;
}

export interface MiniMission {
  id: string;
  kind: 'chapani' | 'horn' | 'passenger' | 'tesla' | 'bridge';
  title: string;
  progress: number;
  target: number;
  rewardTaka: number;
  rewardPts: number;
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
    | 'wanted_up'
    | 'wanted_cleared'
    | 'mission_complete'
    | 'train_passing'
    | 'hub_unlocked'
    | 'route_complete'
    | 'gameover';
  callout: string;
  takaDelta: number;
  x?: number;
  z?: number;
  hubId?: string;
}

export interface InputState {
  steer: number; // -1 (left) to +1 (right)
  accelerate: boolean;
  brake: boolean;
  nitro: boolean;
}

export const ROAD_HALF_WIDTH = 6.2;
export const LANE_CENTERS = [-4.5, -1.5, 1.5, 4.5] as const;

// Backwards-compatible Padma constants
export const BRIDGE_START_M = 44200;
export const BRIDGE_END_M = 47400;
export const PADMA_TOLL_FEE = 250;
export const DHAKA_STOPS = BD_ROUTE_SEGMENTS.map((s) => s.name);

const MISSION_TEMPLATES: Omit<MiniMission, 'progress'>[] = [
  { id: 'm_chapani', kind: 'chapani', title: '৩টি গাড়িতে চাপানি মারুন', target: 3, rewardTaka: 280, rewardPts: 350 },
  { id: 'm_horn', kind: 'horn', title: 'হর্ন দিয়ে ২টি গাড়ি সরান', target: 2, rewardTaka: 240, rewardPts: 300 },
  { id: 'm_pax', kind: 'passenger', title: '৬ জন যাত্রী তুলুন', target: 6, rewardTaka: 300, rewardPts: 320 },
  { id: 'm_tesla', kind: 'tesla', title: '২টি দেশি টেসলা ডজ দিন', target: 2, rewardTaka: 350, rewardPts: 420 },
  { id: 'm_bridge', kind: 'bridge', title: '১টি সেতু পার হন', target: 1, rewardTaka: 400, rewardPts: 500 },
];

export function getViralTitle(score: number): string {
  if (score >= 12000) return 'অল বাংলাদেশ মুড়ির টিন সম্রাট 👑';
  if (score >= 6000) return 'পদ্মা-যমুনা এক্সপ্রেস কিংবদন্তি 🌉🔥';
  if (score >= 3000) return 'হাইওয়ে ওস্তাদ ড্রাইভার 💪';
  if (score >= 1200) return 'আগারগাঁওয়ের চাল্লু হেল্পার 📣';
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

  // Explore Bangladesh Route, Slope & Weather State
  public currentSegment: RouteSegment = BD_ROUTE_SEGMENTS[0];
  public nextSegment: RouteSegment = BD_ROUTE_SEGMENTS[1];
  public currentBiome: BiomeKind = 'north_bengal';
  public activeBridgeStyle: BridgeStyle | null = null;
  public isOnPadmaBridge = false;
  public isOnBridge = false;
  public bridgeBlend = 0;
  public flyoverBlend = 0;
  public elevationY = 0;
  public slopePitch = 0;
  public timeOfDay = 0;
  public rainIntensity = 0;
  public headlightsOn = false;
  public mapX = BD_ROUTE_SEGMENTS[0].mapX;
  public mapY = BD_ROUTE_SEGMENTS[0].mapY;
  public totalTollPaid = 0;
  public bridgesCrossed = 0;
  public padmaCrossings = 0;

  // Wanted Stars & Mini-Missions & Passing Train
  public wantedLevel = 0;
  public wantedClearDist = 0;
  public activeMission: MiniMission = { ...MISSION_TEMPLATES[0], progress: 0 };
  private missionCursor = 0;

  public trainActive = false;
  public trainZ = -180;
  public trainSpeed = 42;
  private trainTimer = 14;

  public entities: RoadEntity[] = [];
  private nextEntityId = 1;
  private spawnTimer = 0.6;
  private stopTimer = 4.2;
  private pickupTimer = 6.5;
  private rivalActive = false;
  private rivalTimer = 14;

  private warnedBridgeKeys = new Set<string>();
  private spawnedGateKeys = new Set<string>();
  private completedBridgeKeys = new Set<string>();
  private announcedHubs = new Set<string>();
  private completedLaps = 0;

  constructor(
    private readonly engineLevel = 1,
    private readonly armorLevel = 1,
    private readonly nitroLevel = 1,
    private readonly busBonusSpeed = 0,
    private readonly busBonusArmor = 0
  ) {
    this.reset(0);
  }

  public get speedKmh(): number {
    return Math.round(this.speed * 3.1);
  }

  public reset(startDistanceM = 0): void {
    this.playerX = -1.5;
    this.playerVx = 0;
    this.speed = 24 + (this.engineLevel - 1) * 2.2 + this.busBonusSpeed;
    this.tiltAngle = 0;
    this.distanceM = Math.max(0, startDistanceM);
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
    this.maxHealth = 2 + this.armorLevel + this.busBonusArmor;
    this.health = this.maxHealth;
    this.invulnTimer = 0;
    this.crashed = false;
    this.hornCooldown = 0;
    this.revivesUsed = 0;

    this.totalTollPaid = 0;
    this.bridgesCrossed = 0;
    this.padmaCrossings = 0;

    this.wantedLevel = 0;
    this.wantedClearDist = 0;
    this.missionCursor = 0;
    this.activeMission = { ...MISSION_TEMPLATES[0], progress: 0 };

    this.trainActive = false;
    this.trainZ = -180;
    this.trainSpeed = 42;
    this.trainTimer = 12;

    this.entities = [];
    this.spawnTimer = 0.45;
    this.stopTimer = 3.8;
    this.pickupTimer = 5.5;
    this.rivalActive = false;
    this.rivalTimer = 12;

    this.warnedBridgeKeys.clear();
    this.spawnedGateKeys.clear();
    this.completedBridgeKeys.clear();
    this.announcedHubs.clear();
    this.completedLaps = Math.floor(this.distanceM / FULL_ROUTE_M);

    // Pre-mark segments strictly before startDistanceM as already completed so Fast Travel doesn't immediately award past bridges
    const lapIdx = Math.floor(this.distanceM / FULL_ROUTE_M);
    const lapDist = this.distanceM % FULL_ROUTE_M;
    for (const seg of BD_ROUTE_SEGMENTS) {
      if (seg.biome === 'river_bridge' && seg.endM <= lapDist) {
        const key = `${lapIdx}:${seg.id}`;
        this.warnedBridgeKeys.add(key);
        this.spawnedGateKeys.add(key);
        this.completedBridgeKeys.add(key);
      }
    }

    this.syncRouteSample(true);

    // Seed initial readable traffic ahead
    this.spawnTrafficVehicle(-34, 2, 'plastic_sedan');
    this.spawnTrafficVehicle(-56, 1, 'cng');
    this.spawnTrafficVehicle(-78, 3, 'plastic_sedan');
  }

  private syncRouteSample(snapBlend = false): void {
    const sample = sampleRouteState(this.distanceM);
    this.currentSegment = sample.segment;
    this.nextSegment = sample.nextSegment;
    this.currentBiome = sample.segment.biome;
    this.activeBridgeStyle = sample.segment.bridgeStyle ?? null;
    this.isOnBridge = sample.segment.biome === 'river_bridge';
    this.isOnPadmaBridge = sample.segment.id === 'padma_bridge';
    this.elevationY = sample.elevationY;
    this.slopePitch = sample.slopePitch;
    this.timeOfDay = sample.timeOfDay;
    this.rainIntensity = sample.rainIntensity;
    this.headlightsOn = sample.headlightsOn;
    this.mapX = sample.mapX;
    this.mapY = sample.mapY;

    if (snapBlend) {
      this.bridgeBlend = this.isOnBridge ? 1 : 0;
      this.flyoverBlend = this.currentBiome === 'flyover' ? 1 : 0;
    }
  }

  public revive(): boolean {
    if (this.revivesUsed >= 1) return false;
    this.revivesUsed += 1;
    this.crashed = false;
    this.health = Math.max(2, Math.ceil(this.maxHealth / 2));
    this.invulnTimer = 2.6;
    this.entities = this.entities.filter((e) => e.z < -28 || e.z > 10);
    return true;
  }

  public getCurrentStopName(): string {
    return this.currentSegment.name;
  }

  public getNextStopName(): string {
    return this.nextSegment.name;
  }

  private advanceMission(kind: MiniMission['kind'], amount: number, events: SimEvent[]): void {
    if (this.activeMission.kind !== kind) return;
    this.activeMission.progress += amount;
    if (this.activeMission.progress >= this.activeMission.target) {
      const done = this.activeMission;
      this.score += done.rewardPts;
      this.takaEarned += done.rewardTaka;
      this.nitroCharge = Math.min(100, this.nitroCharge + 25);
      events.push({
        type: 'mission_complete',
        callout: `🎯 মিশন কমপ্লিট: ${done.title}! +${done.rewardTaka} ৳`,
        takaDelta: done.rewardTaka,
      });
      this.missionCursor = (this.missionCursor + 1) % MISSION_TEMPLATES.length;
      this.activeMission = { ...MISSION_TEMPLATES[this.missionCursor], progress: 0 };
    }
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
      this.advanceMission('horn', movedCount, events);
    }
    return events;
  }

  public step(
    dt: number,
    input: InputState,
    rand: () => number = Math.random,
    steerSensitivity = 1.0
  ): SimEvent[] {
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

    // Forward Speed Dynamics + Slope & Bridge Feel
    const progressBonus = Math.min(20, this.distanceM * 0.0012);
    const baseCruise =
      25 +
      (this.engineLevel - 1) * 2.5 +
      this.busBonusSpeed +
      progressBonus +
      (this.isOnBridge || this.currentBiome === 'flyover' ? 2.8 : 0);
    let targetSpeed = baseCruise;
    if (input.accelerate) targetSpeed += 8.5;
    if (input.brake) targetSpeed = Math.max(11, baseCruise - 12);
    if (this.nitroActive) targetSpeed += 19 + (this.nitroLevel - 1) * 2;
    // Climbing uphill slightly loads the engine, descending gives gravity boost
    targetSpeed -= this.slopePitch * 22;

    this.speed += (targetSpeed - this.speed) * Math.min(1, safeDt * 5.5);
    const dz = this.speed * safeDt;
    this.distanceM += dz;

    const feverMult = this.feverActive ? 1.5 : 1;
    const wantedMult = 1 + this.wantedLevel * 0.35;
    const rainMult = this.rainIntensity > 0.3 ? 1.35 : 1;
    this.score += Math.floor(dz * 1.6 * feverMult * wantedMult * rainMult);

    // Route & Elevation Sample
    const prevLap = this.completedLaps;
    const sample = sampleRouteState(this.distanceM);
    this.syncRouteSample(false);

    const targetBridgeBlend = sample.segment.biome === 'river_bridge' ? 1 : 0;
    this.bridgeBlend += (targetBridgeBlend - this.bridgeBlend) * Math.min(1, safeDt * 2.4);
    const targetFlyoverBlend = sample.segment.biome === 'flyover' ? 1 : 0;
    this.flyoverBlend += (targetFlyoverBlend - this.flyoverBlend) * Math.min(1, safeDt * 2.4);

    // Hub Unlock notification
    if (sample.segment.isHub && !this.announcedHubs.has(sample.segment.id)) {
      this.announcedHubs.add(sample.segment.id);
      if (sample.segment.id !== 'thakurgaon') {
        events.push({
          type: 'hub_unlocked',
          callout: `📍 ${sample.segment.name} পৌঁছালেন! (${sample.segment.tagline})`,
          takaDelta: 0,
          hubId: sample.segment.id,
        });
      }
    }

    // Grand Cox's Bazar Finish on lap rollover
    if (sample.lapIndex > prevLap) {
      this.completedLaps = sample.lapIndex;
      this.score += 2000;
      this.takaEarned += 1000;
      this.nitroCharge = 100;
      events.push({
        type: 'route_complete',
        callout: '🏖️ ঠাকুরগাঁও ➔ কক্সবাজার ফুল ট্রিপ কমপ্লিট! +১,০০০ ৳ ও +২,০০০ পয়েন্ট!',
        takaDelta: 1000,
      });
    }

    // 5-Bridge Toll Plaza & Completion Lifecycle
    for (const seg of BD_ROUTE_SEGMENTS) {
      if (seg.biome !== 'river_bridge') continue;
      const key = `${sample.lapIndex}:${seg.id}`;
      const tollFee = seg.tollFee ?? 250;

      if (
        sample.lapDist >= seg.startM - 175 &&
        sample.lapDist < seg.startM - 10 &&
        !this.warnedBridgeKeys.has(key)
      ) {
        this.warnedBridgeKeys.add(key);
        events.push({
          type: 'toll_approaching',
          callout: `🌉 সামনে ${seg.name} টোল প্লাজা! (টোল ৳${tollFee} অথবা 🔥 নাইট্রো!)`,
          takaDelta: 0,
        });
      }

      if (
        sample.lapDist >= seg.startM - 140 &&
        sample.lapDist < seg.startM - 15 &&
        !this.spawnedGateKeys.has(key)
      ) {
        this.spawnedGateKeys.add(key);
        const gateZ = -(seg.startM - sample.lapDist);
        this.entities = this.entities.filter((e) => Math.abs(e.z - gateZ) > 22);
        const gate = this.spawnEntity('toll_gate', 0, gateZ, ROAD_HALF_WIDTH, 1.5, 0, 0);
        gate.tollFee = tollFee;
        gate.tollLabel = seg.name;
      }

      if (
        sample.lapDist >= seg.endM &&
        sample.lapDist < seg.endM + 120 &&
        !this.completedBridgeKeys.has(key)
      ) {
        this.completedBridgeKeys.add(key);
        this.bridgesCrossed += 1;
        this.padmaCrossings += 1;
        const bonusPts = 600;
        const bonusTaka = 300;
        this.score += bonusPts;
        this.takaEarned += bonusTaka;
        this.nitroCharge = Math.min(100, this.nitroCharge + 30);
        events.push({
          type: 'bridge_complete',
          callout: `🌉 ${seg.name} পার! +${bonusTaka} ৳ ও +${bonusPts} পয়েন্ট!`,
          takaDelta: bonusTaka,
        });
        this.advanceMission('bridge', 1, events);
      }
    }

    // Wanted Star clear check
    if (this.wantedLevel > 0 && this.distanceM >= this.wantedClearDist) {
      this.wantedLevel = 0;
      this.score += 500;
      events.push({
        type: 'wanted_cleared',
        callout: '🚓 হাইওয়ে পুলিশকে ফাঁকি দিছেন! Wanted Cleared +500 pts!',
        takaDelta: 0,
      });
    }

    // Passing Bangladesh Railway Train beside bridges & highways
    if (this.trainActive) {
      this.trainZ += (dz + this.trainSpeed * safeDt);
      if (this.trainZ > 110) {
        this.trainActive = false;
        this.trainTimer = 16 + rand() * 12;
      }
    } else {
      this.trainTimer -= safeDt;
      if (this.trainTimer <= 0 && (sample.segment.hasParallelRail || this.isOnBridge)) {
        this.trainActive = true;
        this.trainZ = -190;
        this.trainSpeed = 32 + rand() * 16;
        this.trainTimer = 20 + rand() * 12;
        events.push({
          type: 'train_passing',
          callout: '🚆 পাশে বাংলাদেশ রেলওয়ে এক্সপ্রেস ছুটছে!',
          takaDelta: 0,
        });
      }
    }

    // Smooth lateral steering + Rain Slippery Grip + Overload Tilt + Crosswind
    const grip = this.rainIntensity > 0.35 ? 0.015 : 0.002;
    const steerAccel = 48 * Math.max(0.6, Math.min(1.6, steerSensitivity));
    if (Math.abs(input.steer) > 0.02) {
      this.playerVx += input.steer * steerAccel * safeDt;
    } else {
      this.playerVx *= Math.pow(grip, safeDt);
    }
    if (this.isOnBridge && Math.abs(input.steer) < 0.05) {
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

    const overloadFactor = 1 + Math.min(1.4, (this.passengers - 4) * 0.055);
    const targetTilt = (-this.playerVx / maxLatSpeed) * 0.16 * overloadFactor;
    this.tiltAngle += (targetTilt - this.tiltAngle) * Math.min(1, safeDt * 10);

    // Spawn traffic & Dhaka chaos events
    this.spawnTimer -= safeDt;
    if (this.spawnTimer <= 0) {
      const difficultyRate = Math.max(0.42, 0.90 - this.distanceM * 0.000018);
      this.spawnTimer = difficultyRate * (0.82 + rand() * 0.42);
      this.spawnRandomRoadHazard(rand);
    }

    if (!this.isOnBridge && this.currentBiome !== 'flyover') {
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
      this.pickupTimer = 7.5 + rand() * 4.0;
      const lane = Math.floor(rand() * 4);
      if (this.isZoneClear(-130, lane)) {
        const kind: RoadEntityKind = rand() < 0.48 ? 'wrench_pickup' : 'nitro_pickup';
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

  private raiseWanted(events: SimEvent[]): void {
    const prev = this.wantedLevel;
    this.wantedLevel = Math.min(3, this.wantedLevel + 1);
    this.wantedClearDist = this.distanceM + 360;
    if (this.wantedLevel > prev) {
      events.push({
        type: 'wanted_up',
        callout: `⭐ ওয়ান্টেড লেভেল ${this.wantedLevel}! (${(1 + this.wantedLevel * 0.35).toFixed(2)}x পয়েন্ট!)`,
        takaDelta: 0,
      });
    }
  }

  private handleOverlap(ent: RoadEntity, events: SimEvent[], rand: () => number): void {
    if (ent.kind === 'toll_gate') {
      const fee = ent.tollFee ?? PADMA_TOLL_FEE;
      const label = ent.tollLabel ?? 'পদ্মা সেতু';

      if (this.nitroActive) {
        const pts = 550;
        this.score += pts;
        this.chapaniCombo += 1;
        this.comboTimer = 4.5;
        const edgeLane = this.playerX < 0 ? 3 : 0;
        this.spawnEntity('sergeant', LANE_CENTERS[edgeLane], -70, 0.65, 0.65, 0, edgeLane);
        events.push({
          type: 'toll_smash',
          callout: `🔥 টোল ব্যারিকেড ভেঙে ${label}-তে উড়াল! (+${pts} pts)`,
          takaDelta: 0,
          x: this.playerX,
          z: ent.z,
        });
        this.raiseWanted(events);
        return;
      }

      if (this.takaEarned >= fee) {
        this.takaEarned -= fee;
        this.totalTollPaid += fee;
        const pts = this.feverActive ? 600 : 400;
        this.score += pts;
        this.nitroCharge = Math.min(100, this.nitroCharge + 35);
        this.speed += 3;
        events.push({
          type: 'toll_paid',
          callout: `🌉 ${label} টোল ৳${fee} পরিশোধ! +${pts} পয়েন্ট`,
          takaDelta: -fee,
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
          callout: `টোল (৳${fee}) না দিয়ে ব্যারিকেডে ধাক্কা! মুড়ির টিন শেষ 💥`,
          takaDelta: -seized,
          x: this.playerX,
          z: 0,
        });
      } else {
        events.push({
          type: 'toll_fine',
          callout: `🚧 ভাড়া কম (টোল ৳${fee})! ব্যারিকেডে ধাক্কা (-১ ❤️)`,
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
      this.advanceMission('passenger', boarded, events);
      return;
    }

    if (ent.kind === 'wrench_pickup') {
      if (this.health < this.maxHealth) {
        this.health = Math.min(this.maxHealth, this.health + 1);
        this.score += 100;
        events.push({
          type: 'wrench_heal',
          callout: 'ধোলাইখাল গিয়ার-রিপেয়ার! বাসের লাইফ +১ ⚙️',
          takaDelta: 0,
          x: ent.x,
          z: ent.z,
        });
      } else {
        this.score += 200;
        this.nitroCharge = Math.min(100, this.nitroCharge + 25);
        events.push({
          type: 'wrench_heal',
          callout: 'ফুল হেলথ সার্ভিস বোনাস! +২০০ pts ⚙️',
          takaDelta: 0,
          x: ent.x,
          z: ent.z,
        });
      }
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
        this.raiseWanted(events);
      } else {
        const fine = Math.min(this.takaEarned, 120 + this.wantedLevel * 40);
        this.takaEarned -= fine;
        this.wantedLevel = Math.max(0, this.wantedLevel - 1);
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
        callout: 'রাস্তা কি তোর বাপের?! (-১ লাইফ)',
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
    const wantedMult = 1 + this.wantedLevel * 0.35;
    const nitroMult = 1 + (this.nitroLevel - 1) * 0.15;

    if (ent.kind === 'deshi_tesla') {
      this.teslaDodges += 1;
      const reward = Math.round((200 + this.chapaniCombo * 40) * nitroMult * feverMult * wantedMult);
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
      this.advanceMission('tesla', 1, events);
    } else {
      this.plasticScrapes += 1;
      const isLeft = ent.x < this.playerX;
      const reward = Math.round((130 + this.chapaniCombo * 35) * nitroMult * feverMult * wantedMult);
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
      this.advanceMission('chapani', 1, events);
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

    const blockedLanes = new Set<number>();
    for (const e of this.entities) {
      if (e.kind !== 'bus_stop' && e.kind !== 'wrench_pickup' && e.kind !== 'nitro_pickup' && Math.abs(e.z - z) < 22) {
        blockedLanes.add(e.laneIndex);
      }
    }
    if (blockedLanes.size >= 2) return;

    const roll = rand();
    const sergeantThreshold = this.wantedLevel > 0 ? 0.86 : 0.94;
    if (roll < 0.34) {
      this.spawnTrafficVehicle(z, lane, 'plastic_sedan');
    } else if (roll < 0.56) {
      this.spawnTrafficVehicle(z, lane, 'cng');
    } else if (roll < 0.74) {
      this.spawnEntity('deshi_tesla', LANE_CENTERS[lane], z, 0.7, 1.15, -13 - rand() * 5, lane);
    } else if (roll < 0.88 && this.wantedLevel === 0) {
      this.spawnTrafficVehicle(z, lane, 'cargo_truck');
    } else if (!this.isOnBridge && this.currentBiome !== 'flyover' && roll < sergeantThreshold) {
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
