import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUS_SKINS, UPGRADES, getUpgradeCost } from '../src/core/GarageCatalog';
import {
  BRIDGE_END_M,
  BRIDGE_START_M,
  PADMA_TOLL_FEE,
  RoadSimulation,
  getViralTitle,
} from '../src/core/RoadSimulation';
import { SaveStore } from '../src/core/SaveStore';

describe('Murir Tin 3D — Core Mechanics, Padma Setu & Models', () => {
  it('generates valid glTF 2.0 binary .glb files for all 7 Dhaka models', () => {
    const modelsDir = path.resolve(__dirname, '../public/models');
    const expected = [
      'murir_tin_bus.glb',
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
      expect(buf.toString('ascii', 0, 4)).toBe('glTF');
      expect(buf.readUInt32LE(4)).toBe(2);
    }
  });

  it('triggers বাম প্লাস্টিক near-miss reward and charges Nitro without crashing', () => {
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
    // Second revive in the same run is blocked
    expect(sim.revive()).toBe(false);
    expect(getViralTitle(3600)).toContain('সম্রাট');
  });

  it('handles Padma Setu toll payment, nitro smash, insufficient-cash fine, and bridge crossing bonus', () => {
    // 1. Pay toll cleanly
    const simPay = new RoadSimulation(1, 1, 1);
    simPay.entities = [];
    simPay.takaEarned = 400;
    simPay.distanceM = BRIDGE_START_M - 30;
    simPay.spawnEntity('toll_gate', 0, -2, 6.2, 1.5, 0, 0);
    const payEvents = simPay.step(0.05, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
    expect(payEvents.some((e) => e.type === 'toll_paid')).toBe(true);
    expect(simPay.takaEarned).toBe(400 - PADMA_TOLL_FEE);
    expect(simPay.totalTollPaid).toBe(PADMA_TOLL_FEE);

    // 2. Nitro smash toll barrier
    const simSmash = new RoadSimulation(1, 1, 1);
    simSmash.entities = [];
    simSmash.takaEarned = 0;
    simSmash.nitroCharge = 80;
    simSmash.spawnEntity('toll_gate', 0, -1, 6.2, 1.5, 0, 0);
    const smashEvents = simSmash.step(0.04, { steer: 0, accelerate: false, brake: false, nitro: true }, () => 0.5);
    expect(smashEvents.some((e) => e.type === 'toll_smash')).toBe(true);
    expect(simSmash.health).toBe(3);

    // 3. Insufficient taka -> fine & bumper hit
    const simFine = new RoadSimulation(1, 1, 1);
    simFine.entities = [];
    simFine.takaEarned = 50;
    simFine.spawnEntity('toll_gate', 0, -1, 6.2, 1.5, 0, 0);
    const fineEvents = simFine.step(0.04, { steer: 0, accelerate: false, brake: false, nitro: false }, () => 0.5);
    expect(fineEvents.some((e) => e.type === 'toll_fine')).toBe(true);
    expect(simFine.takaEarned).toBe(0);
    expect(simFine.health).toBe(2);

    // 4. Bridge state & crossing completion
    const simBridge = new RoadSimulation(1, 1, 1);
    simBridge.entities = [];
    simBridge.distanceM = BRIDGE_END_M - 0.5;
    const compEvents = simBridge.step(0.05, { steer: 0, accelerate: true, brake: false, nitro: false }, () => 0.5);
    expect(compEvents.some((e) => e.type === 'bridge_complete')).toBe(true);
    expect(simBridge.padmaCrossings).toBe(1);
  });

  it('never blocks all 4 lanes simultaneously when spawning traffic', () => {
    const sim = new RoadSimulation(1, 1, 1);
    for (let step = 0; step < 300; step++) {
      sim.step(0.05, { steer: 0, accelerate: false, brake: false, nitro: false }, () => (step * 0.37) % 1);
      // Check no Z-band has hazards across all 4 lanes (excluding full-road toll_gate)
      const hazards = sim.entities.filter((e) => e.kind !== 'toll_gate' && e.kind !== 'bus_stop');
      for (const h of hazards) {
        const lanesBlocked = new Set(
          hazards.filter((o) => Math.abs(o.z - h.z) < 6).map((o) => o.laneIndex)
        );
        expect(lanesBlocked.size).toBeLessThan(4);
      }
    }
  });

  it('persists playerName, garage skins and upgrades in SaveStore', () => {
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
    expect(reloaded.get().engineLevel).toBe(2);
    expect(reloaded.get().unlockedSkins).toContain(BUS_SKINS[1].id);
    expect(getUpgradeCost(UPGRADES[0], 1)).toBe(300);
  });
});
