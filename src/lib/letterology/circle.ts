import type { Letter } from "./types";
import { ALPHABET } from "./types";

export type RelationKind = "ally" | "enemy";

const ALLIES: Record<Letter, [Letter, Letter, Letter]> = {
  A: ["D", "E", "J"],
  B: ["K", "N", "S"],
  C: ["F", "T", "X"],
  D: ["A", "I", "Q"],
  E: ["A", "J", "Y"],
  F: ["C", "W", "Y"],
  G: ["L", "N", "O"],
  H: ["K", "R", "V"],
  I: ["D", "Q", "S"],
  J: ["A", "E", "M"],
  K: ["B", "H", "N"],
  L: ["G", "O", "U"],
  M: ["J", "P", "U"],
  N: ["B", "G", "K"],
  O: ["G", "L", "W"],
  P: ["M", "U", "Z"],
  Q: ["D", "I", "Z"],
  R: ["H", "S", "V"],
  S: ["B", "I", "R"],
  T: ["C", "X", "Z"],
  U: ["L", "M", "P"],
  V: ["H", "R", "X"],
  W: ["F", "O", "Y"],
  X: ["C", "T", "V"],
  Y: ["E", "F", "W"],
  Z: ["P", "Q", "T"],
};

const ENEMIES: Record<Letter, [Letter, Letter, Letter]> = {
  A: ["B", "N", "P"],
  B: ["A", "C", "O"],
  C: ["B", "P", "U"],
  D: ["F", "L", "M"],
  E: ["K", "M", "R"],
  F: ["D", "P", "S"],
  G: ["Q", "T", "X"],
  H: ["N", "U", "Y"],
  I: ["L", "V", "W"],
  J: ["K", "Q", "W"],
  K: ["E", "J", "X"],
  L: ["D", "I", "Y"],
  M: ["D", "E", "Z"],
  N: ["A", "H", "T"],
  O: ["B", "T", "X"],
  P: ["A", "C", "F"],
  Q: ["G", "J", "W"],
  R: ["E", "U", "Z"],
  S: ["F", "V", "Y"],
  T: ["G", "N", "O"],
  U: ["C", "H", "R"],
  V: ["I", "S", "Z"],
  W: ["I", "J", "Q"],
  X: ["G", "K", "O"],
  Y: ["H", "L", "S"],
  Z: ["M", "R", "V"],
};

export function alliesOf(letter: Letter): [Letter, Letter, Letter] {
  return ALLIES[letter] ?? ALLIES.X;
}

export function enemiesOf(letter: Letter): [Letter, Letter, Letter] {
  return ENEMIES[letter] ?? ENEMIES.X;
}

export function relationTo(from: Letter, to: Letter): RelationKind | null {
  if (alliesOf(from).includes(to)) return "ally";
  if (enemiesOf(from).includes(to)) return "enemy";
  return null;
}

export function houseIndex(letter: Letter): number {
  const index = ALPHABET.indexOf(letter);
  return index >= 0 ? index : 0;
}

export function isCircleLetter(value: string | undefined): value is Letter {
  return Boolean(value && ALPHABET.includes(value));
}
