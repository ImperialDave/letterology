import { alliesOf, enemiesOf } from "./circle";
import { letterOfDigit } from "./count";
import { houseOf } from "./houses";
import { themeOf } from "./lexicon";
import type {
  CountMark,
  Letter,
  LetterInventory,
  NameToken,
  Office,
  Polarity,
  Triad,
} from "./types";
import { ALPHABET, VOWEL_LETTERS } from "./types";

const FOLDS: Record<string, string> = {
  Æ: "AE",
  æ: "AE",
  Œ: "OE",
  œ: "OE",
  Ø: "O",
  ø: "O",
  Ð: "D",
  ð: "D",
  Þ: "TH",
  þ: "TH",
  ß: "SS",
  Ł: "L",
  ł: "L",
  Đ: "D",
  đ: "D",
};

export function foldCharacters(raw: string): string {
  let out = "";
  for (const ch of raw) {
    out += FOLDS[ch] ?? ch;
  }
  return out.normalize("NFD").replace(/\p{M}/gu, "");
}

export function stripFurniture(raw: string): string {
  return raw.trim().replace(/^@+/, "").replace(/\s+/g, " ");
}

export function tokenizeHandle(raw: string): { display: string; tokens: NameToken[] } {
  const display = stripFurniture(raw);
  const folded = foldCharacters(display);
  const chunks = folded.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const tokens: NameToken[] = chunks.map((chunk) => ({
    original: chunk,
    letters: chunk.toUpperCase().replace(/[^A-Z]/g, ""),
    digits: chunk.replace(/\D/g, ""),
  }));
  return { display, tokens };
}

function isVowelInToken(letter: Letter, indexInToken: number): boolean {
  if (VOWEL_LETTERS.has(letter)) return true;
  if (letter === "Y") return indexInToken > 0;
  return false;
}

function scoreLetters(tokens: NameToken[]): LetterInventory[] {
  const byLetter = new Map<Letter, LetterInventory>();
  let globalIndex = 0;

  tokens.forEach((token, tokenIndex) => {
    const chars = [...token.letters];
    chars.forEach((letter, i) => {
      const isSignature = tokenIndex === 0 && i === 0;
      const isInitial = i === 0;
      const isFinal = i === chars.length - 1 && chars.length > 1;
      let weight = 1;
      if (isSignature) weight += 1.6;
      else if (isInitial) weight += 0.8;
      if (isFinal) weight += 0.25;

      const existing = byLetter.get(letter);
      if (existing) {
        existing.count += 1;
        existing.weight += weight;
        existing.isSignature = existing.isSignature || isSignature;
        existing.isInitial = existing.isInitial || isInitial;
        existing.isVowel = existing.isVowel || isVowelInToken(letter, i);
      } else {
        byLetter.set(letter, {
          letter,
          count: 1,
          weight: Math.round(weight * 100) / 100,
          firstIndex: globalIndex,
          isVowel: isVowelInToken(letter, i),
          isSignature,
          isInitial,
          office: "gentle",
        });
      }
      globalIndex += 1;
    });
  });

  return [...byLetter.values()].sort(compareInventory);
}

function scoreCountLetters(counts: CountMark[]): LetterInventory[] {
  const byLetter = new Map<Letter, LetterInventory>();
  counts.forEach((mark, index) => {
    const existing = byLetter.get(mark.letter);
    if (existing) {
      existing.count += 1;
      existing.weight += 1;
    } else {
      byLetter.set(mark.letter, {
        letter: mark.letter,
        count: 1,
        weight: index === 0 ? 2.6 : 1,
        firstIndex: index,
        isVowel: VOWEL_LETTERS.has(mark.letter),
        isSignature: index === 0,
        isInitial: index === 0,
        office: "gentle",
      });
    }
  });
  return [...byLetter.values()].sort(compareInventory);
}

function compareInventory(a: LetterInventory, b: LetterInventory): number {
  if (b.weight !== a.weight) return b.weight - a.weight;
  if (a.isSignature !== b.isSignature) return a.isSignature ? -1 : 1;
  return a.firstIndex - b.firstIndex;
}

function collectCounts(tokens: NameToken[]): CountMark[] {
  const marks: CountMark[] = [];
  for (const token of tokens) {
    for (const digit of token.digits) {
      marks.push({
        digit,
        letter: letterOfDigit(digit),
        source: "spelling-gap",
      });
    }
  }
  return marks;
}

function pickTriad(inventory: LetterInventory[], signature: Letter): Triad {
  const rest = inventory.filter((item) => item.letter !== signature);
  const manner = rest[0]?.letter ?? signature;
  const field = rest[1]?.letter ?? rest[0]?.letter ?? signature;
  return [signature, manner, field];
}

function assignOffices(
  inventory: LetterInventory[],
  triad: Triad,
): LetterInventory[] {
  return inventory.map((item) => {
    let office: Office = "gentle";
    if (item.letter === triad[0]) office = "supreme";
    else if (item.letter === triad[1]) office = "strong";
    else if (item.letter === triad[2]) office = "ordinary";
    return { ...item, office };
  });
}

export interface Portrait {
  handle: string;
  display: string;
  polarity: Polarity;
  tokens: NameToken[];
  spelling: string;
  usedCountsAsSpelling: boolean;
  signature: Letter;
  manner: Letter;
  field: Letter;
  triad: Triad;
  inventory: LetterInventory[];
  counts: CountMark[];
  vowels: LetterInventory[];
  consonants: LetterInventory[];
  allies: Letter[];
  enemies: Letter[];
  kinPresent: Letter[];
  kinAbsent: Letter[];
  crossPresent: Letter[];
  crossAbsent: Letter[];
  title: string;
  house: string;
  statements: {
    entrance: string;
    path: string;
    method: string;
    court: string;
    polarity: string;
    count: string;
    invitation: string;
  };
}

function possessive(name: string): string {
  if (!name) return "This handle's";
  return name.endsWith("s") || name.endsWith("S") ? `${name}'` : `${name}'s`;
}

export function letterize(
  raw: string,
  polarity: Polarity = "unmarked",
): Portrait | null {
  const { display, tokens } = tokenizeHandle(raw);
  const counts = collectCounts(tokens);
  const spellingInventory = scoreLetters(tokens);
  const usedCountsAsSpelling = spellingInventory.length === 0 && counts.length > 0;
  const inventoryBase = usedCountsAsSpelling
    ? scoreCountLetters(counts)
    : spellingInventory;

  if (inventoryBase.length === 0) return null;

  const signature =
    inventoryBase.find((item) => item.isSignature)?.letter ?? inventoryBase[0].letter;

  let working = inventoryBase;
  const distinctSpelling = spellingInventory.length;
  if (!usedCountsAsSpelling && distinctSpelling < 2 && counts.length > 0) {
    const countInv = scoreCountLetters(counts).filter(
      (item) => !inventoryBase.some((s) => s.letter === item.letter),
    );
    working = [...inventoryBase, ...countInv].sort(compareInventory);
  }

  const triad = pickTriad(working, signature);
  const inventory = assignOffices(working, triad);
  const present = new Set(inventory.map((item) => item.letter));
  const allies = [...alliesOf(signature)];
  const enemies = [...enemiesOf(signature)];
  const kinPresent = allies.filter((letter) => present.has(letter));
  const kinAbsent = allies.filter((letter) => !present.has(letter));
  const crossPresent = enemies.filter((letter) => present.has(letter));
  const crossAbsent = enemies.filter((letter) => !present.has(letter));
  const vowels = inventory.filter((item) => item.isVowel);
  const consonants = inventory.filter((item) => !item.isVowel);

  const house = houseOf(signature);
  const mannerTheme = themeOf(triad[1]);
  const fieldTheme = themeOf(triad[2]);
  const title = `${house.noun} of ${mannerTheme.name} in ${fieldTheme.name}`;

  const innerLead = vowels[0] ? themeOf(vowels[0].letter) : null;
  const outerLead = consonants[0] ? themeOf(consonants[0].letter) : null;

  const polarityNote =
    polarity === "solar"
      ? outerLead
        ? `Solar tilt. The public face leads: ${outerLead.outer}`
        : "Solar tilt. This handle is almost all breath — the outer life is thin on the page."
      : polarity === "lunar"
        ? innerLead
          ? `Lunar tilt. The private weather leads: ${innerLead.inner}`
          : "Lunar tilt. This handle has almost no vowels — the inner life is thin on the page."
        : innerLead && outerLead
          ? `Unmarked. Vowels lean toward ${innerLead.name.toLowerCase()}; consonants toward ${outerLead.name.toLowerCase()}. Both faces are read.`
          : "Unmarked. One face of the name is thin — read what is actually written.";

  const countNote =
    counts.length === 0
      ? "No digits. The Count is silent in this handle."
      : usedCountsAsSpelling
        ? `This handle is a Count. Digits sit as letters: ${counts.map((c) => `${c.digit}→${c.letter}`).join(", ")}. The first digit sits the house.`
        : distinctSpelling < 2
          ? `Digits fill the missing seats: ${counts.map((c) => `${c.digit}→${c.letter}`).join(", ")}. A number in a name is a visiting house, not furniture.`
          : `Digits visit and do not sit the Path: ${counts.map((c) => `${c.digit}→${c.letter}`).join(", ")}. They color the reading; they do not rename the role.`;

  const courtBits = [
    kinPresent.length
      ? `Allied houses already in the handle: ${kinPresent.map((l) => `${houseOf(l).noun} (${l})`).join(", ")}.`
      : `None of the ${house.noun}'s allies appear in the letters — those completions come from other people.`,
    crossPresent.length
      ? `Opposing houses in the handle: ${crossPresent.map((l) => `${houseOf(l).noun} (${l})`).join(", ")}.`
      : `The opposing houses are quiet in this handle.`,
    kinAbsent.length
      ? `Allies not written: ${kinAbsent.map((l) => `${houseOf(l).noun} (${l})`).join(", ")}.`
      : `Every allied house already appears.`,
  ].join(" ");

  return {
    handle: raw.trim(),
    display,
    polarity,
    tokens,
    spelling: tokens.map((t) => t.letters).filter(Boolean).join(" ") || counts.map((c) => c.letter).join(""),
    usedCountsAsSpelling,
    signature,
    manner: triad[1],
    field: triad[2],
    triad,
    inventory,
    counts,
    vowels,
    consonants,
    allies,
    enemies,
    kinPresent,
    kinAbsent,
    crossPresent,
    crossAbsent,
    title,
    house: house.house,
    statements: {
      entrance: `The first letter of ${possessive(display)} handle is ${signature}, so the name enters as the ${house.noun}. ${house.myth} That is an entrance, not a cage.`,
      path: `The Letter Path is ${triad.join("")}: ${house.noun} (role), ${mannerTheme.name.toLowerCase()} (how), ${fieldTheme.name.toLowerCase()} (where). ${themeOf(signature).essence}`,
      method: `We letterize a username. The first letter sits the house. After that, letters are weighed — repeats count more; first and last letters of a token count extra. ${triad[1]} is how the work is done. ${triad[2]} is the kind of place it wants.`,
      court: `${courtBits} Allies complete a job this role cannot finish alone. Enemies are the blind spot — the work this role will not look at, not a villain.`,
      polarity: polarityNote,
      count: countNote,
      invitation: `${themeOf(signature).invitation} This is a portrait, not a prediction. The letters you already carry are the material.`,
    },
  };
}

export function officeOfLetter(portrait: Portrait, letter: Letter): Office {
  const found = portrait.inventory.find((item) => item.letter === letter);
  return found?.office ?? "silent";
}

export function allOffices(portrait: Portrait): { letter: Letter; office: Office }[] {
  return ALPHABET.map((letter) => ({
    letter,
    office: officeOfLetter(portrait, letter),
  }));
}
