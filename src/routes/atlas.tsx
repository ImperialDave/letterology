import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";
import { Seal } from "@/components/letterology/Seal";
import { houseOf } from "@/lib/letterology/houses";
import { themeOf } from "@/lib/letterology/lexicon";
import { ALPHABET } from "@/lib/letterology/types";

export const Route = createFileRoute("/atlas")({ component: AtlasPage });

function AtlasPage() {
  return (
    <SiteChrome current="/atlas">
      <header className="max-w-2xl">
        <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">Twenty-six houses</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Atlas</h1>
        <p className="mt-4 text-lg text-ink/85">
          A letter is a role. Click a seal for the inner face, the outer face, and the court.
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {ALPHABET.map((letter) => {
          const house = houseOf(letter);
          return (
            <li key={letter}>
              <Link
                to="/atlas/$mark"
                params={{ mark: letter.toLowerCase() }}
                className="flex h-full items-start gap-3 rounded-3xl bg-raised p-4 shadow-[var(--shadow-border)] transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
              >
                <Seal letter={letter} />
                <span>
                  <span className="block font-display text-lg">{house.noun}</span>
                  <span className="mt-1 block text-sm text-muted">{themeOf(letter).name}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SiteChrome>
  );
}
