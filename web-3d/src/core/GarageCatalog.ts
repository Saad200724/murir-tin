export interface BusSkinDef {
  id: string;
  name: string;
  routeBadge: string;
  bodyHex: string;
  stripeHex: string;
  cost: number;
}

export interface UpgradeDef {
  id: 'engine' | 'armor' | 'nitro';
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  maxLevel: number;
}

export const BUS_SKINS: BusSkinDef[] = [
  {
    id: 'classic_mirpur',
    name: 'মুড়ির টিন ক্লাসিক',
    routeBadge: 'মিরপুর ১০ ➔ গুলিস্তান',
    bodyHex: '#06b888',
    stripeHex: '#ef476f',
    cost: 0,
  },
  {
    id: 'balaka_rocket',
    name: 'বলাকা তুফান মেইল',
    routeBadge: 'গাজীপুর ➔ সায়েদাবাদ',
    bodyHex: '#fb5607',
    stripeHex: '#ffbe0b',
    cost: 800,
  },
  {
    id: 'chiriakhana_vip',
    name: 'ডিস্কো চিড়িয়াখানা',
    routeBadge: 'মিরপুর ১ ➔ মতিঝিল',
    bodyHex: '#8338ec',
    stripeHex: '#06d6a0',
    cost: 1800,
  },
  {
    id: 'dholaikhal_boss',
    name: 'ধোলাইখাল সম্রাট',
    routeBadge: 'অল বাংলাদেশ রকেট',
    bodyHex: '#d90429',
    stripeHex: '#ffd166',
    cost: 3500,
  },
];

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'engine',
    name: 'ইঞ্জিন টিউনিং',
    description: 'টপ স্পিড ও পিক-আপ বাড়াবে!',
    emoji: '⚙️',
    baseCost: 300,
    maxLevel: 5,
  },
  {
    id: 'armor',
    name: 'ধোলাইখাল বাম্পার',
    description: 'বাসের হেলথ (🔧) +১ করে বাড়াবে!',
    emoji: '🛡️',
    baseCost: 350,
    maxLevel: 4,
  },
  {
    id: 'nitro',
    name: 'নাইট্রো সিলিন্ডার',
    description: 'নাইট্রো স্পিড ও চাপানি পয়েন্ট বাড়াবে!',
    emoji: '🔥',
    baseCost: 320,
    maxLevel: 5,
  },
];

export function getUpgradeCost(def: UpgradeDef, currentLevel: number): number {
  return def.baseCost * currentLevel;
}
