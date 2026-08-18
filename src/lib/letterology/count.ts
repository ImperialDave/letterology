import type { Letter } from "./types";

/**
 * The Count — the inverse of numerology.
 * A number is written as a letter, or it is not read.
 * 1 is A. 26 is Z. 27 is AA. Zero is the Fool (F), because there is no 0th of the month.
 * Digit 6 is also F as the sixth house. Same figure, two doors.
 */
export const DIGIT_LETTER: Record<string, Letter> = {
  "0": "F",
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
  "5": "E",
  "6": "F",
  "7": "G",
  "8": "H",
  "9": "I",
};

export function letterOfDigit(digit: string): Letter {
  return DIGIT_LETTER[digit] ?? "F";
}

export function letterAtIndex(index: number): Letter {
  const n = ((index % 26) + 26) % 26;
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[n] ?? "A";
}

/** 1 is A, 13 is M, 26 is Z, 27 is A. Dates, years, and whole amounts use this seat. */
export function seatOfAmount(n: number): Letter {
  if (n === 0) return "F";
  return letterAtIndex(n - 1);
}
