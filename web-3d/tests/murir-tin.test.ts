import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BD_ROUTE_SEGMENTS,
  FULL_ROUTE_M,
  sampleRouteState,
  toHighwayKm,
} from '../src/core/BangladeshRoute';
import { BUS_SKINS, UPGRADES, getUpgradeCost } from '../src/core/GarageCatalog';
import { formatGamepadLabel, sampleGamepadSnapshot } from '../src/core/GamepadController';
import { OpponentInterpolator } from '../src/core/MultiplayerClient';
import {
  SPRINT_ROUTE_PRESETS,
  buildCustomSprintRoute,
  formatRaceTime,
  sortRaceStandings,
  type RaceRoomState,
} from '../src/core/MultiplayerTypes';
import {
  BRIDGE_END_M,
  BRIDGE_START_M,
  PADMA_TOLL_FEE,
  RoadSimulation,
  createSeededRandom,
  getViralTitle,
} from '../src/core/RoadSimulation';
import { SaveStore } from '../src/core/SaveStore';

describe('Murir Tin 3D — Explore Bangladesh, Bridges, Slopes & Mechanics', () => {
  it('generates valid glTF 2.0 binary .glb files for all 7 Dhaka models & OG banner', () => {
    const modelsDir = path.resolve(__dirname, '../public/models');
    const expected = [
      'murir_tin_bus.glb',
      'rajdhani_bus.glb',
      'plastic_sedan.glb',
      'deshi_tesla_auto.glb',
      'cng_rickshaw.glb',
      'cargo_truck.glb',
      'sergeant_npc.glb',
      'passenger_npc.glb',
    ];
    for (const file of expected) {
      const p = path.join(modelsDir, file);
      expect(fs.existsSync(p)).toBe(true);
      const buf = fs.readFileSync(p);
      expect(buf.length).toBeGreaterThan(200);
      expect(buf.length).toBeLessThan(80 * 1024);
      expect(buf.toString('ascii', 0, 4)).toBe('glTF');
      expect(buf.readUInt32LE(4)).toBe(2);
    }
    expect(fs.existsSync(path.resolve(__dirname, '../public/og-banner.jpg'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../public/bd-map.png'))).toBe(true);
  });

  it('covers contiguous 84,000m Thakurgaon->Coxs Bazar route with 5 bridges and elevation slopes', () => {
    expect(BD_ROUTE_SEGMENTS[0].startM).toBe(0);
    expect(BD_ROUTE_SEGMENTS[BD_ROUTE_SEGMENTS.length - 1].endM).toBe(FULL_ROUTE_M);
    expect(toHighwayKm(FULL_ROUTE_M)).toBe('840.0');

    const bridges = BD_ROUTE_SEGMENTS.filter((s) => s.biome === 'river_bridge');
    expect(bridges.map((b) => b.bridgeStyle)).toEqual([
      'jamuna',
      'padma',
      'meghna',
      'gumti',
      'karnaphuli',
    ]);

    // Verify smooth uphill & downhill slopePitch on Padma Bridge
    const entry = sampleRouteState(BRIDGE_START_M + 100);
    const mid = sampleRouteState(BRIDGE_START_M + 1500);
    const exit = sampleRouteState(BRIDGE_END_M - 100);
    expect(entry.elevationY).toBeGreaterThan(0);
    expect(entry.slopePitch).toBeGreaterThan(0);
    expect(mid.elevationY).toBeGreaterThan(4.0);
    expect(mid.slopePitch).toBe(0);
    expect(exit.slopePitch).toBeLessThan(0);

    // Rain in Comilla, headlights at Cox's Bazar Marine Drive
    expect(sampleRouteState(58000).rainIntensity).toBeGreaterThan(0.5);
    expect(sampleRouteState(78000).headlightsOn).toBe(true);
  });

  it('triggers বাম প্লাস্টিক near-miss reward, mini-missions, and charges Nitro without crashing', () => {
    const sim = new RoadSimulation(1, 1, 1);
    sim.entities = [];
    sim.playerX = -1.5;
    sim.spawnEntity('plastic_sedan', -3.9, -1.0, 0.92, 2.05, 10, 0);

    let gotChapani = false;
    for (let i = 0; i < 15; i++) {
      const evs = sim.step(0.03, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
      if (evs.some((e) => e.type === 'chapani')) gotChapani = true;
    }

    expect(gotChapani).toBe(true);
    expect(sim.plasticScrapes).toBeGreaterThanOrEqual(1);
    expect(sim.activeMission.progress).toBeGreaterThanOrEqual(1);
    expect(sim.takaEarned).toBeGreaterThan(0);
    expect(sim.health).toBe(3);
  });

  it('amplifies body roll with overloaded passengers and safely clears vehicles on Horn', () => {
    const sim = new RoadSimulation(1, 1, 1);
    sim.entities = [];
    sim.passengers = 20;
    sim.step(0.04, { steer: 1, accelerate: true, brake: false, nitro: false }, () => 0.5);
    expect(Math.abs(sim.tiltAngle)).toBeGreaterThan(0.005);

    sim.playerX = 1.5;
    sim.spawnEntity('cng', 1.5, -14, 0.68, 1.12, 10, 2);
    const hornEvents = sim.blastHorn();
    expect(hornEvents.some((e) => e.type === 'horn_panic')).toBe(true);
  });

  it('handles crash -> game over -> single Mistry Revive cleanly', () => {
    const sim = new RoadSimulation(1, 1, 1);
    expect(sim.health).toBe(3);
    sim.entities = [];

    for (let hit = 0; hit < 3; hit++) {
      sim.invulnTimer = 0;
      sim.spawnEntity('deshi_tesla', sim.playerX, -0.5, 0.7, 1.15, -15, 1);
      sim.step(0.03, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
    }

    expect(sim.crashed).toBe(true);
    expect(sim.health).toBe(0);

    expect(sim.revive()).toBe(true);
    expect(sim.crashed).toBe(false);
    expect(sim.health).toBeGreaterThanOrEqual(2);
    expect(sim.revive()).toBe(false);
    expect(getViralTitle(6500)).toContain('কিংবদন্তি');
  });

  it('handles bridge toll payment, nitro smash (+Wanted Star & clear), fine, and crossing bonus', () => {
    const simPay = new RoadSimulation(1, 1, 1);
    simPay.reset(BRIDGE_START_M - 30);
    simPay.entities = [];
    simPay.takaEarned = 400;
    const g1 = simPay.spawnEntity('toll_gate', 0, -2, 6.2, 1.5, 0, 0);
    g1.tollFee = PADMA_TOLL_FEE;
    g1.tollLabel = 'পদ্মা সেতু';
    const payEvents = simPay.step(0.05, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
    expect(payEvents.some((e) => e.type === 'toll_paid')).toBe(true);
    expect(simPay.takaEarned).toBe(400 - PADMA_TOLL_FEE);

    const simSmash = new RoadSimulation(1, 1, 1);
    simSmash.reset(BRIDGE_START_M - 30);
    simSmash.entities = [];
    simSmash.nitroCharge = 80;
    const g2 = simSmash.spawnEntity('toll_gate', 0, -1, 6.2, 1.5, 0, 0);
    g2.tollFee = PADMA_TOLL_FEE;
    const smashEvents = simSmash.step(0.04, { steer: 0, accelerate: false, brake: false, nitro: true }, () => 0.5);
    expect(smashEvents.some((e) => e.type === 'toll_smash')).toBe(true);
    expect(simSmash.wantedLevel).toBe(1);

    // Clear wanted after driving past wantedClearDist
    simSmash.distanceM = simSmash.wantedClearDist + 5;
    const clearEvents = simSmash.step(0.03, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
    expect(clearEvents.some((e) => e.type === 'wanted_cleared')).toBe(true);
    expect(simSmash.wantedLevel).toBe(0);

    const simBridge = new RoadSimulation(1, 1, 1);
    simBridge.reset(BRIDGE_END_M - 0.5);
    simBridge.entities = [];
    const compEvents = simBridge.step(0.05, { steer: 0, accelerate: true, brake: false, nitro: false }, () => 0.5);
    expect(compEvents.some((e) => e.type === 'bridge_complete')).toBe(true);
    expect(simBridge.bridgesCrossed).toBe(1);
  });

  it('never blocks all 4 lanes simultaneously when spawning traffic', () => {
    const sim = new RoadSimulation(1, 1, 1);
    for (let step = 0; step < 300; step++) {
      sim.step(0.05, { steer: 0, accelerate: false, brake: false, nitro: false }, () => (step * 0.37) % 1);
      const hazards = sim.entities.filter((e) => e.kind !== 'toll_gate' && e.kind !== 'bus_stop');
      for (const h of hazards) {
        const lanesBlocked = new Set(
          hazards.filter((o) => Math.abs(o.z - h.z) < 6).map((o) => o.laneIndex)
        );
        expect(lanesBlocked.size).toBeLessThan(4);
      }
    }
  });

  it('persists playerName, graphicsPreset, keymap, unlockedHubs, and upgrades in SaveStore', () => {
    const mem = new Map<string, string>();
    const store = new SaveStore({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    });
    store.update((d) => {
      d.playerName = 'ওস্তাদ সাআদ';
      d.taka += 1000;
      d.engineLevel = 2;
      d.graphicsPreset = 'ultra';
      d.keymap.horn = 'KeyH';
      d.unlockedHubs.push('dhaka');
      d.unlockedSkins.push(BUS_SKINS[1].id);
    });

    const reloaded = new SaveStore({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    });
    expect(reloaded.get().playerName).toBe('ওস্তাদ সাআদ');
    expect(reloaded.get().taka).toBe(1250);
    expect(reloaded.get().graphicsPreset).toBe('ultra');
    expect(reloaded.get().keymap.horn).toBe('KeyH');
    expect(reloaded.get().unlockedHubs).toContain('dhaka');
    expect(reloaded.get().unlockedSkins).toContain(BUS_SKINS[1].id);
    expect(getUpgradeCost(UPGRADES[0], 1)).toBe(300);

    const rajdhani = BUS_SKINS.find((b) => b.id === 'rajdhani_express');
    expect(rajdhani?.modelName).toBe('rajdhani_bus');
    const simRaj = new RoadSimulation(1, 1, 1, rajdhani!.bonusSpeed, rajdhani!.bonusArmor);
    expect(simRaj.maxHealth).toBe(4);
    expect(simRaj.speed).toBeGreaterThan(25);
  });

  it('supports multiplayer deterministic seed, sprint routes, crash slowdown, finish, and opponent interpolation', () => {
    const rngA = createSeededRandom(987654);
    const rngB = createSeededRandom(987654);
    expect([rngA(), rngA(), rngA()]).toEqual([rngB(), rngB(), rngB()]);

    for (const preset of SPRINT_ROUTE_PRESETS) {
      expect(preset.startM).toBeGreaterThanOrEqual(0);
      expect(preset.finishM).toBeGreaterThan(preset.startM);
      expect(preset.finishM).toBeLessThanOrEqual(FULL_ROUTE_M);
    }

    const custom = buildCustomSprintRoute('bogura', 'sirajganj');
    expect(custom).not.toBeNull();
    expect(custom!.startM).toBe(11500);
    expect(custom!.finishM).toBe(24500);
    expect(buildCustomSprintRoute('dhaka', 'bogura')).toBeNull();

    const sim = new RoadSimulation(1, 1, 1);
    sim.startRace(14500, 19500, 2);
    expect(sim.raceMode).toBe(true);
    sim.entities = [];

    for (let hit = 0; hit < 3; hit++) {
      sim.invulnTimer = 0;
      sim.spawnEntity('deshi_tesla', sim.playerX, -0.5, 0.7, 1.15, -15, 2);
      sim.step(0.03, { steer: 0, accelerate: false, brake: false, nitro: false }, rngA);
    }
    expect(sim.crashed).toBe(false);
    expect(sim.raceSlowdownTimer).toBeGreaterThan(0);

    sim.distanceM = 19499.7;
    const finishEvents = sim.step(0.05, { steer: 0, accelerate: true, brake: false, nitro: false }, rngA);
    expect(sim.raceFinished).toBe(true);
    expect(finishEvents.some((e) => e.type === 'race_finish')).toBe(true);

    const room: RaceRoomState = {
      code: 'ABC12',
      hostId: 'p1',
      route: SPRINT_ROUTE_PRESETS[0],
      seed: 42,
      status: 'racing',
      startAt: 1000,
      createdAt: 1000,
      updatedAt: 1200,
      players: [
        {
          id: 'p1',
          name: 'Me',
          busId: 'classic_mirpur',
          color: '#06d6a0',
          laneIndex: 0,
          ready: true,
          x: -4.5,
          distanceM: 15000,
          speed: 30,
          elevationY: 0,
          tiltAngle: 0,
          nitroActive: false,
          crashed: false,
          finishedAt: null,
          finishMs: null,
          score: 500,
          lastSeen: 1200,
        },
        {
          id: 'p2',
          name: 'Friend',
          busId: 'rajdhani_express',
          color: '#ffbe0b',
          laneIndex: 1,
          ready: true,
          x: 1.5,
          distanceM: 15020,
          speed: 32,
          elevationY: 0,
          tiltAngle: -0.05,
          nitroActive: true,
          crashed: false,
          finishedAt: null,
          finishMs: null,
          score: 620,
          lastSeen: 1200,
        },
      ],
    };
    const interp = new OpponentInterpolator();
    interp.updateFromRoom(room, 'p1', 1200, 240);
    const s1 = interp.sample(0.05, 1250);
    const s2 = interp.sample(0.05, 1650);
    const s3 = interp.sample(0.05, 1850);
    expect(s1).toHaveLength(1);
    expect(s1[0].busId).toBe('rajdhani_express');
    expect(Number.isFinite(s1[0].distanceM)).toBe(true);
    // Continues smoothly dead-reckoning past 350ms without freezing
    expect(s2[0].distanceM).toBeGreaterThan(s1[0].distanceM);
    expect(s3[0].distanceM).toBeGreaterThan(s2[0].distanceM);
    expect(formatRaceTime(64500)).toBe('01:04.5');
    expect(sortRaceStandings(room.players)[0].id).toBe('p2');
  });

  it('samples gamepad deadzones, analog triggers, D-pad steering, and rising-edge actions cleanly', () => {
    expect(formatGamepadLabel('Xbox 360 Controller (XInput STANDARD GAMEPAD)')).toBe('Xbox Controller');
    expect(formatGamepadLabel('DualSense Wireless Controller (STANDARD GAMEPAD)')).toBe('PS5 DualSense');

    const prev = Array(16).fill(false);
    const driftSnap = sampleGamepadSnapshot([0.08], Array(16).fill(0), prev);
    expect(driftSnap.state.steer).toBe(0);
    expect(driftSnap.state.accelerate).toBe(false);

    const buttons = Array(16).fill(0);
    buttons[7] = 0.8; // RT accelerate
    buttons[2] = 1; // X horn (rising)
    buttons[9] = 1; // Start pause (rising)
    const activeSnap = sampleGamepadSnapshot([-0.57], buttons, driftSnap.nextPressed);
    expect(activeSnap.state.steer).toBeLessThan(-0.45);
    expect(activeSnap.state.accelerate).toBe(true);
    expect(activeSnap.state.hornPressed).toBe(true);
    expect(activeSnap.state.pausePressed).toBe(true);

    // Holding Start/X on the next frame must NOT re-trigger edge actions
    const heldSnap = sampleGamepadSnapshot([-0.57], buttons, activeSnap.nextPressed);
    expect(heldSnap.state.hornPressed).toBe(false);
    expect(heldSnap.state.pausePressed).toBe(false);

    // D-pad left overrides right analog stick
    buttons[14] = 1;
    const dpadSnap = sampleGamepadSnapshot([0.9], buttons, heldSnap.nextPressed);
    expect(dpadSnap.state.steer).toBe(-1);

    const mem = new Map<string, string>();
    const store = new SaveStore({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, v);
      },
    });
    expect(store.get().gamepadVibration).toBe(true);
    store.update((d) => {
      d.gamepadVibration = false;
    });
    expect(new SaveStore({ getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) }).get().gamepadVibration).toBe(false);
  });
});
