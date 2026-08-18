import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";

const ENTRIES = [
  ["Handle", "The username you chose. We read that, not your legal name."],
  ["Letterize", "The official operation: strip furniture, sit the first letter, weigh the rest, write digits as the Count."],
  ["House / Role", "The first letter. How you enter. Seeker, Lover, Trickster — a role, not a personality."],
  ["Manner / How", "The letter that weighs most after the first. How the work is done."],
  ["Field / Where", "The next letter by weight. The kind of place the work wants."],
  ["Letter Path", "Three letters: role, how, where. ALE is Seeker working by luminosity in expansion."],
  ["Office", "How loud a letter is in this handle: Supreme, Strong, Ordinary, Gentle, Silent. Tiers of the name, not of the alphabet."],
  ["Court", "A letter's three allies and three enemies. Allies complete. Enemies keep honest."],
  ["Favorable current", "Today's date-house plus its allies. These glyphs run warm. Doors ajar."],
  ["Contrary current", "Today's enemies. These glyphs withdraw. Proceed gently."],
  ["Luck", "The meeting of your Path with today's court. Willingness, not fate. A score you can use before noon."],
  ["Solar / Lunar", "A tilt. Solar leans public and warm. Lunar leans inner and withdrawn. Unmarked reads both."],
  ["Count", "A number written as a letter. 1 is A. 26 is Z. 0 is the Fool. We do not fold leftovers into one digit."],
  ["Decision", "An act, letterized. We ask: is this your kind of move, and is that house willing today?"],
];

export const Route = createFileRoute("/key")({ component: KeyPage });

function KeyPage() {
  return (
    <SiteChrome current="/key">
      <header className="max-w-2xl">
        <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">The dictionary</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Key</h1>
      </header>
      <dl className="mt-10 max-w-2xl divide-y divide-rule/60">
        {ENTRIES.map(([term, plain]) => (
          <div key={term} className="py-5">
            <dt className="font-display text-xl">{term}</dt>
            <dd className="mt-1 text-ink/85">{plain}</dd>
          </div>
        ))}
      </dl>
    </SiteChrome>
  );
}
