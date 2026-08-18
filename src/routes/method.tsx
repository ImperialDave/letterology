import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";

const STEPS = [
  {
    title: "1. Strip the furniture",
    body: "Leading @ is not a letter. Dots, underscores, and hyphens are token boundaries — the same as spaces. Accents fold so a mark from another tongue can still name a role. Case is furniture.",
  },
  {
    title: "2. The first letter sits the house",
    body: "How you enter. A is the Seeker, L the Lover, X the Trickster. The rest of the handle may argue with that entrance. It does not get to pretend the entrance did not happen.",
  },
  {
    title: "3. Weight the rest",
    body: "Every letter starts at 1. Repeats add. The first letter of a later token adds 0.8. A closing letter adds 0.25. The two heaviest after the signature become manner (how) and field (where). Insistence is information.",
  },
  {
    title: "4. Digits are the Count",
    body: "1 is A, 9 is I, 0 is the Fool. If the handle has real letters, digits visit — they color the reading and do not sit the Path. If the handle is only numbers, the first digit sits the house. Numerology folded leftovers into one digit. We refuse the fold.",
  },
  {
    title: "5. Offices, not castes",
    body: "In this handle the signature is Supreme, manner Strong, field Ordinary, other present letters Gentle, the rest Silent. Sisaveli's tiers are recovered as offices a name confers. The alphabet has no aristocracy.",
  },
  {
    title: "6. Today's court is luck",
    body: "The date sits a house (the 17th is Q). That house's allies run warm — favorable currents. Its enemies withdraw — contrary currents. Your luck is the meeting of your Path with that court. Solar days sit the warm side of the fortnight; Lunar days sit the withdrawn side.",
  },
  {
    title: "7. Letterize the act",
    body: "A decision is also a name. We sit the act's first letter, ask if it is your kind of move, and ask if that house is willing today. Now, today-ok, wait, or reframe. Keep the step reversible when the weather is mixed.",
  },
];

export const Route = createFileRoute("/method")({ component: MethodPage });

function MethodPage() {
  return (
    <SiteChrome current="/method">
      <header className="max-w-2xl">
        <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">The specification</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">How a handle becomes a reading</h1>
        <p className="mt-4 text-lg text-ink/85">
          Every reading is composed from these rules. If the system cannot show its work, it has become a priest.
        </p>
      </header>
      <ol className="mt-10 max-w-2xl space-y-10">
        {STEPS.map((step) => (
          <li key={step.title}>
            <h2 className="font-display text-2xl">{step.title}</h2>
            <p className="mt-2 leading-relaxed text-ink/90">{step.body}</p>
          </li>
        ))}
      </ol>
    </SiteChrome>
  );
}
