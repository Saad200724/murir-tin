export type BiomeKind =
  | 'north_bengal'
  | 'dhaka_city'
  | 'river_bridge'
  | 'flyover'
  | 'rain_highway'
  | 'hills'
  | 'marine_drive';

export type BridgeStyle = 'jamuna' | 'padma' | 'meghna' | 'gumti' | 'karnaphuli';

export interface RouteSegment {
  id: string;
  name: string;
  enName: string;
  startM: number;
  endM: number;
  biome: BiomeKind;
  bridgeStyle?: BridgeStyle;
  tollFee?: number;
  hasParallelRail?: boolean;
  isHub?: boolean;
  mapX: number; // 0..1000 SVG viewBox X
  mapY: number; // 0..1000 SVG viewBox Y
  tagline: string;
}

export const FULL_ROUTE_M = 84000; // 840.0 km scaled (~45 min full BD drive)
export const MAX_ELEVATION_Y = 4.6;
const RAMP_LEN_M = 260;

export const BD_ROUTE_SEGMENTS: readonly RouteSegment[] = [
  {
    id: 'thakurgaon',
    name: 'ঠাকুরগাঁও',
    enName: 'Thakurgaon',
    startM: 0,
    endM: 3800,
    biome: 'north_bengal',
    hasParallelRail: true,
    isHub: true,
    mapX: 162,
    mapY: 112,
    tagline: 'ভোরের কুয়াশা আর সবুজ ধানক্ষেত থেকে যাত্রা শুরু!',
  },
  {
    id: 'dinajpur_flyover',
    name: 'দিনাজপুর ফ্লাইওভার',
    enName: 'Dinajpur Flyover',
    startM: 3800,
    endM: 5200,
    biome: 'flyover',
    mapX: 215,
    mapY: 162,
    tagline: 'ফ্লাইওভারের ঢাল বেয়ে স্পিড তোলেন ওস্তাদ!',
  },
  {
    id: 'rangpur',
    name: 'রংপুর',
    enName: 'Rangpur',
    startM: 5200,
    endM: 11500,
    biome: 'north_bengal',
    isHub: true,
    mapX: 295,
    mapY: 184,
    tagline: 'তাজহাট ও রংপুর হাইওয়ে — সরিষা খেতের পাশ দিয়ে!',
  },
  {
    id: 'bogura',
    name: 'বগুড়া',
    enName: 'Bogura',
    startM: 11500,
    endM: 17500,
    biome: 'north_bengal',
    hasParallelRail: true,
    isHub: true,
    mapX: 326,
    mapY: 286,
    tagline: 'বগুড়ার দই আর উত্তরাঞ্চলের হাই-স্পিড রুট!',
  },
  {
    id: 'bogura_flyover',
    name: 'বগুড়া বাইপাস ফ্লাইওভার',
    enName: 'Bogura Flyover',
    startM: 17500,
    endM: 19000,
    biome: 'flyover',
    mapX: 342,
    mapY: 325,
    tagline: 'বাইপাস ফ্লাইওভার — জ্যাম ছাড়াই উড়াল!',
  },
  {
    id: 'sirajganj',
    name: 'সিরাজগঞ্জ',
    enName: 'Sirajganj',
    startM: 19000,
    endM: 24500,
    biome: 'north_bengal',
    hasParallelRail: true,
    mapX: 368,
    mapY: 365,
    tagline: 'যমুনা নদীর পাড়ে পৌঁছে গেছি — সামনেই মহাসেতু!',
  },
  {
    id: 'jamuna_bridge',
    name: 'যমুনা সেতু (বঙ্গবন্ধু সেতু) 🌉',
    enName: 'Jamuna Bridge',
    startM: 24500,
    endM: 27500,
    biome: 'river_bridge',
    bridgeStyle: 'jamuna',
    tollFee: 300,
    hasParallelRail: true,
    isHub: true,
    mapX: 408,
    mapY: 378,
    tagline: '৪.৮ কিমি যমুনা সেতু — পাশে ছুটে চলেছে আন্তঃনগর ট্রেন!',
  },
  {
    id: 'tangail',
    name: 'টাঙ্গাইল',
    enName: 'Tangail',
    startM: 27500,
    endM: 34000,
    biome: 'north_bengal',
    mapX: 446,
    mapY: 405,
    tagline: 'টাঙ্গাইল চমচম আর এলেঙ্গা-চন্দ্রা এক্সপ্রেস!',
  },
  {
    id: 'gazipur_flyover',
    name: 'গাজীপুর ফ্লাইওভার',
    enName: 'Gazipur Flyover',
    startM: 34000,
    endM: 35800,
    biome: 'flyover',
    mapX: 492,
    mapY: 444,
    tagline: 'ঢাকায় প্রবেশের উড়ালসড়ক!',
  },
  {
    id: 'dhaka',
    name: 'ঢাকা (মিরপুর ➔ গুলিস্তান)',
    enName: 'Dhaka City',
    startM: 35800,
    endM: 42500,
    biome: 'dhaka_city',
    hasParallelRail: true,
    isHub: true,
    mapX: 506,
    mapY: 492,
    tagline: 'মেট্রোরেলের নিচে আসল বাম প্লাস্টিক চাপানি!',
  },
  {
    id: 'hanif_flyover',
    name: 'মেয়র হানিফ ফ্লাইওভার',
    enName: 'Mayor Hanif Flyover',
    startM: 42500,
    endM: 44200,
    biome: 'flyover',
    mapX: 515,
    mapY: 515,
    tagline: 'মাওয়া এক্সপ্রেসওয়ে ধরে পদ্মার পথে!',
  },
  {
    id: 'padma_bridge',
    name: 'পদ্মা সেতু 🌉',
    enName: 'Padma Setu',
    startM: 44200,
    endM: 47400,
    biome: 'river_bridge',
    bridgeStyle: 'padma',
    tollFee: 250,
    hasParallelRail: true,
    isHub: true,
    mapX: 492,
    mapY: 566,
    tagline: 'স্বপ্নের পদ্মা সেতু — নীল স্টিলের ট্রাস আর উত্তাল নদী!',
  },
  {
    id: 'meghna_bridge',
    name: 'মেঘনা সেতু 🌉',
    enName: 'Meghna Bridge',
    startM: 47400,
    endM: 50200,
    biome: 'river_bridge',
    bridgeStyle: 'meghna',
    tollFee: 200,
    mapX: 562,
    mapY: 536,
    tagline: 'চট্টগ্রাম মহাসড়কের মেঘনা সেতু!',
  },
  {
    id: 'daudkandi',
    name: 'দাউদকান্দি',
    enName: 'Daudkandi',
    startM: 50200,
    endM: 54500,
    biome: 'rain_highway',
    mapX: 590,
    mapY: 556,
    tagline: 'হঠাৎ কালবৈশাখী বৃষ্টি — পিচ্ছিল রাস্তায় বোনাস ড্রাইভ!',
  },
  {
    id: 'gumti_bridge',
    name: 'গোমতী সেতু 🌉',
    enName: 'Gumti Bridge',
    startM: 54500,
    endM: 57000,
    biome: 'river_bridge',
    bridgeStyle: 'gumti',
    tollFee: 180,
    mapX: 616,
    mapY: 572,
    tagline: 'বৃষ্টির মাঝে লাল-সোনালী গোমতী সেতু!',
  },
  {
    id: 'comilla',
    name: 'কুমিল্লা',
    enName: 'Comilla',
    startM: 57000,
    endM: 63500,
    biome: 'rain_highway',
    hasParallelRail: true,
    isHub: true,
    mapX: 648,
    mapY: 590,
    tagline: 'কুমিল্লার রসমালাই আর বৃষ্টিস্নাত হাইওয়ে!',
  },
  {
    id: 'feni_flyover',
    name: 'ফেনী ফ্লাইওভার',
    enName: 'Feni Flyover',
    startM: 63500,
    endM: 65200,
    biome: 'flyover',
    mapX: 678,
    mapY: 634,
    tagline: 'ফেনী মহিপাল ফ্লাইওভার — পাহাড়ি সূর্যাস্ত শুরু!',
  },
  {
    id: 'chittagong_hills',
    name: 'সীতাকুণ্ড ও চট্টগ্রাম',
    enName: 'Chattogram',
    startM: 65200,
    endM: 73500,
    biome: 'hills',
    hasParallelRail: true,
    isHub: true,
    mapX: 735,
    mapY: 716,
    tagline: 'সবুজ পাহাড় আর সোনালী সূর্যাস্তের চট্টগ্রাম!',
  },
  {
    id: 'karnaphuli_bridge',
    name: 'শাহ আমানত (কর্ণফুলী) সেতু 🌉',
    enName: 'Shah Amanat Bridge',
    startM: 73500,
    endM: 76200,
    biome: 'river_bridge',
    bridgeStyle: 'karnaphuli',
    tollFee: 200,
    isHub: true,
    mapX: 764,
    mapY: 762,
    tagline: 'ঝুলন্ত তারের শাহ আমানত সেতু — হেডলাইট অন!',
  },
  {
    id: 'coxs_bazar',
    name: 'কক্সবাজার মেরিন ড্রাইভ 🏖️',
    enName: "Cox's Bazar",
    startM: 76200,
    endM: 84000,
    biome: 'marine_drive',
    isHub: true,
    mapX: 822,
    mapY: 882,
    tagline: 'বামে পাহাড়, ডানে বঙ্গোপসাগর — কক্সবাজার পৌঁছে গেছি!',
  },
] as const;

export const FAST_TRAVEL_HUBS = BD_ROUTE_SEGMENTS.filter((s) => s.isHub);

export function toHighwayKm(distanceM: number): string {
  return (Math.max(0, distanceM) / 100).toFixed(1);
}

export interface RouteSample {
  lapIndex: number;
  lapDist: number;
  segmentIndex: number;
  segment: RouteSegment;
  nextSegment: RouteSegment;
  elevationY: number;
  slopePitch: number;
  timeOfDay: number; // 0 (morning) .. 1 (night)
  rainIntensity: number; // 0..1
  headlightsOn: boolean;
  mapX: number;
  mapY: number;
}

export function sampleRouteState(distanceM: number): RouteSample {
  const safeDist = Math.max(0, distanceM);
  const lapIndex = Math.floor(safeDist / FULL_ROUTE_M);
  const lapDist = safeDist % FULL_ROUTE_M;

  let segmentIndex = BD_ROUTE_SEGMENTS.findIndex(
    (s) => lapDist >= s.startM && lapDist < s.endM
  );
  if (segmentIndex < 0) segmentIndex = 0;

  const segment = BD_ROUTE_SEGMENTS[segmentIndex];
  const nextSegment = BD_ROUTE_SEGMENTS[(segmentIndex + 1) % BD_ROUTE_SEGMENTS.length];

  // Smooth cosine elevation ramps on bridges & flyovers
  let elevationY = 0;
  let slopePitch = 0;
  if (segment.biome === 'river_bridge' || segment.biome === 'flyover') {
    const segLen = segment.endM - segment.startM;
    const local = lapDist - segment.startM;
    const ramp = Math.min(RAMP_LEN_M, segLen * 0.3);
    if (local < ramp) {
      const t = local / ramp;
      elevationY = MAX_ELEVATION_Y * 0.5 * (1 - Math.cos(Math.PI * t));
      slopePitch = 0.085 * Math.sin(Math.PI * t); // Nose up
    } else if (local > segLen - ramp) {
      const t = (segLen - local) / ramp;
      elevationY = MAX_ELEVATION_Y * 0.5 * (1 - Math.cos(Math.PI * t));
      slopePitch = -0.085 * Math.sin(Math.PI * t); // Nose down
    } else {
      elevationY = MAX_ELEVATION_Y;
      slopePitch = 0;
    }
  }

  // Smoothly interpolate time of day (0..1 across full 84 km lap)
  const timeOfDay = lapDist / FULL_ROUTE_M;

  // Monsoon rain wave around Daudkandi -> Gumti -> Comilla (50,200m - 63,500m)
  let rainIntensity = 0;
  if (lapDist >= 50000 && lapDist <= 63800) {
    const t = (lapDist - 50000) / (63800 - 50000);
    rainIntensity = Math.sin(Math.PI * t) * 0.95;
  }

  // Headlights turn on automatically from dusk/sunset through Marine Drive night & heavy rain
  const headlightsOn = lapDist >= 71500 || rainIntensity >= 0.55;

  // Interpolate bus marker position along map polyline
  const segSpan = Math.max(1, segment.endM - segment.startM);
  const segProgress = Math.max(0, Math.min(1, (lapDist - segment.startM) / segSpan));
  const mapX = segment.mapX + (nextSegment.mapX - segment.mapX) * segProgress;
  const mapY = segment.mapY + (nextSegment.mapY - segment.mapY) * segProgress;

  return {
    lapIndex,
    lapDist,
    segmentIndex,
    segment,
    nextSegment,
    elevationY,
    slopePitch,
    timeOfDay,
    rainIntensity,
    headlightsOn,
    mapX,
    mapY,
  };
}
