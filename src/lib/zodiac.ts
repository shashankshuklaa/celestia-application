export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type Element = "Fire" | "Earth" | "Air" | "Water";

export interface SignInfo {
  name: ZodiacSign;
  symbol: string;        // unicode glyph
  element: Element;
  modality: "Cardinal" | "Fixed" | "Mutable";
  ruler: string;
  dates: string;
  color: string;         // hex for accents
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  tagline: string;
}

export const ZODIAC: SignInfo[] = [
  { name: "Aries",       symbol: "♈", element: "Fire",  modality: "Cardinal", ruler: "Mars",    dates: "Mar 21 – Apr 19", color: "#ff5b6e", traits: ["Bold", "Driven", "Pioneering"], strengths: ["Courageous", "Confident", "Honest"], weaknesses: ["Impulsive", "Short-tempered"], tagline: "The Spark that lights the sky." },
  { name: "Taurus",      symbol: "♉", element: "Earth", modality: "Fixed",    ruler: "Venus",   dates: "Apr 20 – May 20", color: "#7bc47f", traits: ["Grounded", "Sensual", "Loyal"],     strengths: ["Reliable", "Patient", "Devoted"], weaknesses: ["Stubborn", "Possessive"], tagline: "Built of stardust and stillness." },
  { name: "Gemini",      symbol: "♊", element: "Air",   modality: "Mutable",  ruler: "Mercury", dates: "May 21 – Jun 20", color: "#ffd166", traits: ["Curious", "Witty", "Adaptable"],   strengths: ["Versatile", "Quick", "Affectionate"], weaknesses: ["Indecisive", "Restless"], tagline: "Two minds dancing in starlight." },
  { name: "Cancer",      symbol: "♋", element: "Water", modality: "Cardinal", ruler: "Moon",    dates: "Jun 21 – Jul 22", color: "#a0d8f1", traits: ["Intuitive", "Nurturing", "Deep"], strengths: ["Empathetic", "Loyal", "Imaginative"], weaknesses: ["Moody", "Clinging"], tagline: "A tide moved by the Moon." },
  { name: "Leo",         symbol: "♌", element: "Fire",  modality: "Fixed",    ruler: "Sun",     dates: "Jul 23 – Aug 22", color: "#ffb347", traits: ["Radiant", "Generous", "Regal"],   strengths: ["Charismatic", "Brave", "Warm"], weaknesses: ["Proud", "Dramatic"], tagline: "Born to burn brightly." },
  { name: "Virgo",       symbol: "♍", element: "Earth", modality: "Mutable",  ruler: "Mercury", dates: "Aug 23 – Sep 22", color: "#9ac79a", traits: ["Precise", "Caring", "Analytical"],strengths: ["Practical", "Loyal", "Hardworking"], weaknesses: ["Critical", "Worrier"], tagline: "Order woven from chaos." },
  { name: "Libra",       symbol: "♎", element: "Air",   modality: "Cardinal", ruler: "Venus",   dates: "Sep 23 – Oct 22", color: "#f4a8c1", traits: ["Charming", "Fair", "Romantic"],   strengths: ["Diplomatic", "Social", "Gracious"], weaknesses: ["Indecisive", "Avoidant"], tagline: "Balance held on a silver thread." },
  { name: "Scorpio",     symbol: "♏", element: "Water", modality: "Fixed",    ruler: "Pluto",   dates: "Oct 23 – Nov 21", color: "#a06cd5", traits: ["Magnetic", "Intense", "Loyal"],   strengths: ["Brave", "Passionate", "Resourceful"], weaknesses: ["Jealous", "Secretive"], tagline: "Depths the light forgot." },
  { name: "Sagittarius", symbol: "♐", element: "Fire",  modality: "Mutable",  ruler: "Jupiter", dates: "Nov 22 – Dec 21", color: "#ff8c61", traits: ["Free", "Honest", "Adventurous"],  strengths: ["Optimistic", "Generous", "Brave"], weaknesses: ["Impatient", "Tactless"], tagline: "An arrow shot at infinity." },
  { name: "Capricorn",   symbol: "♑", element: "Earth", modality: "Cardinal", ruler: "Saturn",  dates: "Dec 22 – Jan 19", color: "#6db1bf", traits: ["Ambitious", "Wise", "Disciplined"],strengths: ["Responsible", "Patient", "Strategic"], weaknesses: ["Pessimistic", "Cold"], tagline: "Mountains carved by time." },
  { name: "Aquarius",    symbol: "♒", element: "Air",   modality: "Fixed",    ruler: "Uranus",  dates: "Jan 20 – Feb 18", color: "#76d6ff", traits: ["Visionary", "Original", "Kind"],  strengths: ["Inventive", "Humanitarian", "Independent"], weaknesses: ["Aloof", "Unpredictable"], tagline: "Future-light in a present body." },
  { name: "Pisces",      symbol: "♓", element: "Water", modality: "Mutable",  ruler: "Neptune", dates: "Feb 19 – Mar 20", color: "#b8a4ff", traits: ["Dreamy", "Empathic", "Artistic"], strengths: ["Compassionate", "Intuitive", "Gentle"], weaknesses: ["Escapist", "Fragile"], tagline: "An ocean wearing a skin." },
];

export const SIGN_MAP: Record<ZodiacSign, SignInfo> = Object.fromEntries(
  ZODIAC.map((s) => [s.name, s]),
) as Record<ZodiacSign, SignInfo>;

export function signFromDate(input: string | Date): ZodiacSign {
  const d = typeof input === "string" ? new Date(input) : input;
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const table: [ZodiacSign, number, number][] = [
    ["Capricorn",   1, 19], ["Aquarius",   2, 18], ["Pisces",     3, 20],
    ["Aries",       4, 19], ["Taurus",     5, 20], ["Gemini",     6, 20],
    ["Cancer",      7, 22], ["Leo",        8, 22], ["Virgo",      9, 22],
    ["Libra",      10, 22], ["Scorpio",   11, 21], ["Sagittarius",12, 21],
    ["Capricorn", 12, 31],
  ];
  for (const [sign, em, ed] of table) {
    if (m < em || (m === em && day <= ed)) return sign;
  }
  return "Capricorn";
}

export const PLANETS = [
  { name: "Sun",     symbol: "☉" },
  { name: "Moon",    symbol: "☽" },
  { name: "Mercury", symbol: "☿" },
  { name: "Venus",   symbol: "♀" },
  { name: "Mars",    symbol: "♂" },
  { name: "Jupiter", symbol: "♃" },
  { name: "Saturn",  symbol: "♄" },
  { name: "Uranus",  symbol: "♅" },
  { name: "Neptune", symbol: "♆" },
] as const;

// Deterministic pseudo-random per (sign, date) for stable daily content
function seedHash(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
function pick<T>(arr: readonly T[], seed: number, salt = 0): T {
  return arr[(seed + salt) % arr.length];
}

const HOROSCOPES = [
  "A door you almost stopped knocking on opens today — walk through with your shoulders soft.",
  "Mercury is gathering your scattered thoughts into a single, luminous sentence. Listen for it.",
  "Someone is rehearsing a conversation about you in their head. Make it easy on them.",
  "The moon asks you to choose comfort over performance. Even the stars rest.",
  "A tiny yes today plants a forest later. Notice which yes feels like sunlight.",
  "Venus polishes an old wound until it becomes a mirror. Look gently.",
  "Energy returns to wherever you give it the most permission. Spend wisely.",
  "An idea you dismissed three weeks ago is circling back, dressed in better clothes.",
];
const MOODS = ["Luminous", "Tender", "Magnetic", "Reflective", "Electric", "Soft", "Bold"];
const COLORS = [
  { name: "Indigo",      hex: "#5b4fff" },
  { name: "Champagne",   hex: "#ffe0a3" },
  { name: "Rose Quartz", hex: "#f4a8c1" },
  { name: "Emerald",     hex: "#3ecf8e" },
  { name: "Obsidian",    hex: "#1a1a2e" },
  { name: "Celestial",   hex: "#7dd3fc" },
];
const QUOTES = [
  "We are stardust brought to life, then empowered by the universe to figure itself out.",
  "Look up. The same sky watched every version of you fall in love.",
  "You are not behind. The cosmos has no clock.",
  "Some doors only open from the inside. Be brave with your own.",
  "The moon does not have to be full to be beautiful.",
];
const MOON_PHASES = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"] as const;
const PLANET_ENERGIES = [
  "Venus retrograde — soften, don't strive.",
  "Mercury direct — say the brave thing.",
  "Mars in trine — momentum favours the bold.",
  "Jupiter ascending — say yes to the bigger room.",
  "Saturn squared — honour the limit, then transcend it.",
];

export function dailyReading(sign: ZodiacSign, date = new Date()) {
  const key = `${sign}-${date.toISOString().slice(0, 10)}`;
  const seed = seedHash(key);
  return {
    horoscope: pick(HOROSCOPES, seed),
    mood: pick(MOODS, seed, 1),
    luckyColor: pick(COLORS, seed, 2),
    luckyNumber: ((seed % 88) + 7),
    compatibility: ((seed % 41) + 58),
    moonPhase: pick(MOON_PHASES, seed, 3),
    planetary: pick(PLANET_ENERGIES, seed, 4),
    quote: pick(QUOTES, seed, 5),
  };
}

const COMPAT_MATRIX: Partial<Record<ZodiacSign, Partial<Record<ZodiacSign, number>>>> = {};
const ELEMENT_BONUS: Record<Element, Record<Element, number>> = {
  Fire:  { Fire: 85, Air: 92, Earth: 55, Water: 60 },
  Air:   { Air: 80, Fire: 90, Water: 60, Earth: 50 },
  Earth: { Earth: 88, Water: 93, Fire: 55, Air: 50 },
  Water: { Water: 86, Earth: 94, Fire: 62, Air: 58 },
};

export function compatibility(a: ZodiacSign, b: ZodiacSign) {
  const A = SIGN_MAP[a], B = SIGN_MAP[b];
  const base = ELEMENT_BONUS[A.element][B.element];
  const flair = (seedHash(a + b) % 9) - 4;
  const score = Math.max(45, Math.min(99, base + flair));
  const love     = Math.max(40, Math.min(99, score + ((seedHash(a + b + "L") % 11) - 5)));
  const friend   = Math.max(40, Math.min(99, score + ((seedHash(a + b + "F") % 11) - 5)));
  const career   = Math.max(40, Math.min(99, score + ((seedHash(a + b + "C") % 11) - 5)));
  return { score, love, friend, career };
}

export const HOUSES = [
  "Self",        "Value",        "Mind",      "Home",
  "Joy",         "Health",       "Partners",  "Depths",
  "Vision",      "Career",       "Community", "Spirit",
];