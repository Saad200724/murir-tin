export interface BusSkinDef {
  id: string;
  modelName: 'murir_tin_bus' | 'rajdhani_bus';
  name: string;
  routeBadge: string;
  tagline: string;
  bodyHex: string;
  stripeHex: string;
  cost: number;
  bonusSpeed: number;
  bonusArmor: number;
  stats: {
    speed: number;
    armor: number;
    nitro: number;
    capacity: number;
  };
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
    modelName: 'murir_tin_bus',
    name: 'মুড়ির টিন ক্লাসিক',
    routeBadge: 'ঠাকুরগাঁও ➔ ঢাকা ➔ কক্সবাজার',
    tagline: 'চ্যাপ্টা ফ্রন্ট ও ছাদের র‍্যাক — খাঁটি দেশি লিজেন্ড!',
    bodyHex: '#06b888',
    stripeHex: '#ef476f',
    cost: 0,
    bonusSpeed: 0,
    bonusArmor: 0,
    stats: { speed: 68, armor: 65, nitro: 65, capacity: 72 },
  },
  {
    id: 'rajdhani_express',
    modelName: 'rajdhani_bus',
    name: 'রাজধানী সুপার সার্ভিস লিঃ',
    routeBadge: 'মিরপুর ১৪ ➔ সাভার ➔ কক্সবাজার',
    tagline: 'হিনো ফেসিয়া, টুইন মিরর, VIP লিভারি ও +১ এক্সট্রা লাইফ!',
    bodyHex: '#b81d38',
    stripeHex: '#ffbe0b',
    cost: 900,
    bonusSpeed: 2.2,
    bonusArmor: 1,
    stats: { speed: 88, armor: 85, nitro: 86, capacity: 92 },
  },
  {
    id: 'balaka_rocket',
    modelName: 'murir_tin_bus',
    name: 'বলাকা তুফান মেইল',
    routeBadge: 'গাজীপুর ➔ সায়েদাবাদ ➔ চট্টগ্রাম',
    tagline: 'হাই-রেভ ডিজেল টার্বো আর ফায়ারি অরেঞ্জ বডি!',
    bodyHex: '#fb5607',
    stripeHex: '#ffbe0b',
    cost: 1400,
    bonusSpeed: 2.8,
    bonusArmor: 0,
    stats: { speed: 86, armor: 72, nitro: 84, capacity: 78 },
  },
  {
    id: 'chiriakhana_vip',
    modelName: 'murir_tin_bus',
    name: 'ডিস্কো চিড়িয়াখানা',
    routeBadge: 'মিরপুর ১ ➔ মতিঝিল ➔ পদ্মা সেতু',
    tagline: 'নিয়ন পার্পল বডি ও হাই-স্পিড নাইট্রো বোনাস!',
    bodyHex: '#8338ec',
    stripeHex: '#06d6a0',
    cost: 2200,
    bonusSpeed: 3.4,
    bonusArmor: 1,
    stats: { speed: 92, armor: 82, nitro: 95, capacity: 84 },
  },
  {
    id: 'dholaikhal_boss',
    modelName: 'murir_tin_bus',
    name: 'ধোলাইখাল সম্রাট',
    routeBadge: 'অল বাংলাদেশ রকেট 👑',
    tagline: 'সর্বোচ্চ স্পিড ও +২ বাম্পার লাইফ — রাজপথের সম্রাট!',
    bodyHex: '#d90429',
    stripeHex: '#ffd166',
    cost: 3500,
    bonusSpeed: 4.5,
    bonusArmor: 2,
    stats: { speed: 98, armor: 98, nitro: 96, capacity: 95 },
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
    description: 'বাসের লাইফ +১ করে বাড়াবে!',
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
