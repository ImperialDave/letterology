import { alliesOf, enemiesOf } from "./circle";
import { seatOfAmount } from "./count";
import type { Letter } from "./types";
import { ALPHABET } from "./types";

export const WALK_MONTH = 2;
export const WALK_DAY = 21;
export const FORTNIGHT_LENGTH = 14;
export const WALK_DAYS = FORTNIGHT_LENGTH * 26;
export const HINGE_LETTER: Letter = "F";

const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type WeekdayRole = "house" | "ally" | "enemy";
export type DayCharge = "solar" | "lunar";

export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export interface FortnightSeat {
  letter: Letter;
  index: number;
  walkYear: number;
  dayInSeat: number;
  hinge: boolean;
}

export interface AlmanacDay {
  civil: CivilDate;
  iso: string;
  weekday: number;
  weekdayName: string;
  yearLetter: Letter;
  fortnight: FortnightSeat;
  monthLetter: Letter;
  dateLetter: Letter;
  weekdayLetter: Letter;
  weekdayRole: WeekdayRole;
  charge: DayCharge;
  favorable: Letter[];
  contrary: Letter[];
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toCivil(date: Date): CivilDate {
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
}

export function fromCivil(civil: CivilDate): Date {
  return new Date(civil.year, civil.month, civil.day, 12, 0, 0, 0);
}

export function isoOf(civil: CivilDate): string {
  return `${civil.year}-${pad(civil.month + 1)}-${pad(civil.day)}`;
}

export function addDays(civil: CivilDate, days: number): CivilDate {
  const date = fromCivil(civil);
  date.setDate(date.getDate() + days);
  return toCivil(date);
}

export function daysBetween(a: CivilDate, b: CivilDate): number {
  const start = Date.UTC(a.year, a.month, a.day);
  const end = Date.UTC(b.year, b.month, b.day);
  return Math.round((end - start) / 86_400_000);
}

export function letterAt(index: number): Letter {
  const normalized = ((index % 26) + 26) % 26;
  return ALPHABET[normalized] ?? "A";
}

export function yearLetter(year: number): Letter {
  return letterAt(year - 1);
}

export function dateLetter(dayOfMonth: number): Letter {
  return seatOfAmount(dayOfMonth);
}

function walkStartOnOrBefore(civil: CivilDate): CivilDate {
  const candidate = { year: civil.year, month: WALK_MONTH, day: WALK_DAY };
  if (daysBetween(candidate, civil) >= 0) return candidate;
  return { year: civil.year - 1, month: WALK_MONTH, day: WALK_DAY };
}

export function fortnightOf(civil: CivilDate): FortnightSeat {
  const walkStart = walkStartOnOrBefore(civil);
  const elapsed = daysBetween(walkStart, civil);

  if (elapsed >= WALK_DAYS) {
    return {
      letter: HINGE_LETTER,
      index: 26,
      walkYear: walkStart.year,
      dayInSeat: elapsed - WALK_DAYS + 1,
      hinge: true,
    };
  }

  const index = Math.floor(elapsed / FORTNIGHT_LENGTH);
  return {
    letter: letterAt(index),
    index,
    walkYear: walkStart.year,
    dayInSeat: (elapsed % FORTNIGHT_LENGTH) + 1,
    hinge: false,
  };
}

export function weekdayIndex(civil: CivilDate): number {
  return (fromCivil(civil).getDay() + 6) % 7;
}

export function weekSeats(house: Letter): Letter[] {
  return [house, ...alliesOf(house), ...enemiesOf(house)];
}

export function almanacOf(date: Date | CivilDate = new Date()): AlmanacDay {
  const civil = date instanceof Date ? toCivil(date) : date;
  const fortnight = fortnightOf(civil);
  const seatLetter = fortnight.hinge ? HINGE_LETTER : fortnight.letter;
  const dateSeat = dateLetter(civil.day);
  const weekday = weekdayIndex(civil);
  const seats = weekSeats(seatLetter);
  const weekdayLetter = seats[weekday] ?? seatLetter;
  const weekdayRole: WeekdayRole = weekday === 0 ? "house" : weekday < 4 ? "ally" : "enemy";
  const charge: DayCharge = weekdayRole === "enemy" ? "lunar" : "solar";
  const favorable = [dateSeat, ...alliesOf(dateSeat)];
  const contrary = [...enemiesOf(dateSeat)];

  return {
    civil,
    iso: isoOf(civil),
    weekday,
    weekdayName: WEEKDAY_NAMES[weekday] ?? WEEKDAY_NAMES[0],
    yearLetter: yearLetter(civil.year),
    fortnight,
    monthLetter: fortnightOf({ year: civil.year, month: civil.month, day: 15 }).letter,
    dateLetter: dateSeat,
    weekdayLetter,
    weekdayRole,
    charge,
    favorable,
    contrary,
  };
}
