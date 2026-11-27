export interface BillboardAd {
  id: string;
  headline: string;
  subline: string;
  bgHex: string;
  accentHex: string;
  textHex: string;
}

/**
 * Editable Dhaka Roadside 3D Billboards!
 * Replace these slots directly with local Facebook-page / shop sponsors once viral.
 */
export const DHAKA_BILLBOARDS: BillboardAd[] = [
  {
    id: 'ad_sponsor_slot',
    headline: 'এখানে আপনার পেজের বিজ্ঞাপন দিন!',
    subline: 'মিরপুর-গুলিস্তান রুটে দৈনিক লাখো ভিউ • স্পনসর হোন',
    bgHex: '#ffbe0b',
    accentHex: '#ef476f',
    textHex: '#1b1f2a',
  },
  {
    id: 'ad_mama_cha',
    headline: 'মামা স্পেশাল মালাই চা ☕',
    subline: 'বাস থামায়ে ১ কাপ টানেন — ফার্মগেট ফুটওভারের নিচে',
    bgHex: '#06d6a0',
    accentHex: '#ffffff',
    textHex: '#102520',
  },
  {
    id: 'ad_dholaikhal',
    headline: 'ধোলাইখাল সুপার মিস্ত্রি 🔧',
    subline: 'ব্রেক ফেল? ইন্ডিকেটর নাই? ২ মিনিটে মুড়ির টিন রকেট!',
    bgHex: '#1b1f2a',
    accentHex: '#ffbe0b',
    textHex: '#fffdf7',
  },
  {
    id: 'ad_deshi_tesla',
    headline: 'নয়া দেশি টেসলা শোরুম ⚡',
    subline: 'কোনো হর্ন বা লুকিং গ্লাস ছাড়াই উল্টা পথে চালান!',
    bgHex: '#ef476f',
    accentHex: '#ffbe0b',
    textHex: '#ffffff',
  },
];
