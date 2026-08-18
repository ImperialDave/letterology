import { ALPHABET, type Letter, type Triad } from "./types";

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export interface Pigment {
  letter: Letter;
  name: string;
  oklch: Oklch;
  css: string;
  hex: string;
  ink: string;
}

const NAMES: Record<Letter, string> = {
  A: "Amber",
  B: "Olive",
  C: "Lichen",
  D: "Verdant",
  E: "Jade",
  F: "Malachite",
  G: "Viridian",
  H: "Teal",
  I: "Celadon",
  J: "Azure",
  K: "Cerulean",
  L: "Cobalt",
  M: "Lapis",
  N: "Indigo",
  O: "Woad",
  P: "Violet",
  Q: "Amethyst",
  R: "Orchid",
  S: "Madder",
  T: "Rose",
  U: "Carmine",
  V: "Vermilion",
  W: "Cinnabar",
  X: "Coral",
  Y: "Saffron",
  Z: "Ochre",
};

const VOWELS = new Set<Letter>(["A", "E", "I", "O", "U"]);
const STEP = 360 / 26;
const HUE0 = 52;

function chromaFor(hue: number, vowel: boolean): number {
  let c = vowel ? 0.118 : 0.142;
  if (hue >= 72 && hue <= 128) c *= 0.7;
  if (hue >= 155 && hue <= 205) c *= 0.78;
  if (hue >= 18 && hue <= 62) c *= 1.08;
  if (hue >= 328 || hue <= 16) c *= 1.06;
  return Math.round(c * 1000) / 1000;
}

function lightFor(index: number, letter: Letter): number {
  if (letter === "Y") return 0.64;
  if (VOWELS.has(letter)) return 0.695;
  return 0.5 + (index % 3) * 0.018;
}

function oklchCss({ l, c, h }: Oklch): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`;
}

function toLab({ l, c, h }: Oklch): { L: number; a: number; b: number } {
  const rad = (h * Math.PI) / 180;
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) };
}

function fromLab(L: number, a: number, b: number): Oklch {
  const c = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

function linearToSrgb(x: number): number {
  const y = Math.max(0, Math.min(1, x));
  return y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055;
}

function hexByte(x: number): string {
  return Math.round(linearToSrgb(x) * 255)
    .toString(16)
    .padStart(2, "0");
}

export function oklchToHex(oklch: Oklch): string {
  const { L, a, b } = toLab(oklch);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return `#${hexByte(r)}${hexByte(g)}${hexByte(bl)}`;
}

function buildPigment(letter: Letter, index: number): Pigment {
  const h = (HUE0 + index * STEP) % 360;
  const vowel = VOWELS.has(letter);
  const oklch: Oklch = {
    l: lightFor(index, letter),
    c: chromaFor(h, vowel),
    h,
  };
  return {
    letter,
    name: NAMES[letter],
    oklch,
    css: oklchCss(oklch),
    hex: oklchToHex(oklch),
    ink: oklch.l >= 0.62 ? "var(--color-ink)" : "var(--color-raised)",
  };
}

const TABLE: Record<Letter, Pigment> = Object.fromEntries(
  ALPHABET.map((letter, index) => [letter, buildPigment(letter, index)]),
) as Record<Letter, Pigment>;

export function pigmentOf(letter: Letter): Pigment {
  return TABLE[letter] ?? TABLE.X;
}

export function allPigments(): Pigment[] {
  return ALPHABET.map((letter) => TABLE[letter]);
}

export const TRIAD_WEIGHTS = [0.5, 0.3, 0.2] as const;

export interface MixedPigment {
  oklch: Oklch;
  css: string;
  hex: string;
  ink: string;
}

export function mixLetters(letters: Letter[], weights: number[]): MixedPigment {
  const total = weights.reduce((sum, w) => sum + w, 0) || 1;
  let L = 0;
  let a = 0;
  let b = 0;
  letters.forEach((letter, index) => {
    const w = (weights[index] ?? 0) / total;
    const lab = toLab(pigmentOf(letter).oklch);
    L += lab.L * w;
    a += lab.a * w;
    b += lab.b * w;
  });
  const oklch = fromLab(L, a, b);
  return {
    oklch,
    css: oklchCss(oklch),
    hex: oklchToHex(oklch),
    ink: oklch.l >= 0.62 ? "var(--color-ink)" : "var(--color-raised)",
  };
}

export function mixTriad(triad: Triad): MixedPigment & { sources: Pigment[] } {
  return {
    ...mixLetters(triad, [...TRIAD_WEIGHTS]),
    sources: triad.map((letter) => pigmentOf(letter)),
  };
}

export function mixLabel(triad: Triad): string {
  const sources = triad.map((letter) => pigmentOf(letter));
  return `${sources[0].name} with ${sources[1].name.toLowerCase()} and ${sources[2].name.toLowerCase()}`;
}

export function pigmentStyle(letter: Letter): { backgroundColor: string; color: string } {
  const pigment = pigmentOf(letter);
  return { backgroundColor: pigment.css, color: pigment.ink };
}
