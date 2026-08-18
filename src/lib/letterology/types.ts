export type Letter = string;

export type Polarity = "solar" | "lunar" | "unmarked";

export type Office = "supreme" | "strong" | "ordinary" | "gentle" | "silent";

export type Triad = [Letter, Letter, Letter];

export type MeetKind = "same" | "ally" | "enemy" | "none";

export interface LetterTheme {
  letter: Letter;
  name: string;
  keywords: [string, string, string, string];
  essence: string;
  inner: string;
  outer: string;
  gift: string;
  challenge: string;
  invitation: string;
}

export interface House {
  letter: Letter;
  noun: string;
  house: string;
  tradition: string;
  myth: string;
  element: "air" | "fire" | "water" | "earth" | "aether";
}

export interface LetterInventory {
  letter: Letter;
  count: number;
  weight: number;
  firstIndex: number;
  isVowel: boolean;
  isSignature: boolean;
  isInitial: boolean;
  office: Office;
}

export interface CountMark {
  digit: string;
  letter: Letter;
  source: "spelling-gap";
}

export interface NameToken {
  original: string;
  letters: string;
  digits: string;
}

export const VOWEL_LETTERS = new Set<Letter>(["A", "E", "I", "O", "U"]);
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const OFFICE_RANK: Office[] = [
  "supreme",
  "strong",
  "ordinary",
  "gentle",
  "silent",
];
