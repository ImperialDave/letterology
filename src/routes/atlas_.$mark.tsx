import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";
import { Seal } from "@/components/letterology/Seal";
import { alliesOf, enemiesOf } from "@/lib/letterology/circle";
import { houseOf } from "@/lib/letterology/houses";
import { themeOf } from "@/lib/letterology/lexicon";
import { pigmentOf, pigmentStyle } from "@/lib/letterology/pigment";
import { ALPHABET } from "@/lib/letterology/types";

export const Route = createFileRoute("/atlas_/$mark")({
  component: LetterPage,
});

function LetterPage() {
  const raw = Route.useParams().mark.toUpperCase();
  const letter = ALPHABET.includes(raw) ? raw : "X";
  const house = houseOf(letter);
  const theme = themeOf(letter);
  const pigment = pigmentOf(letter);

  return (
    <SiteChrome current="/atlas">
      <Link to="/atlas" className="text-sm text-muted hover:text-ink">
        Atlas
      </Link>
      <header className="mt-4 flex flex-wrap items-end gap-5">
        <span className="grid size-24 place-items-center rounded-full font-display text-5xl" style={pigmentStyle(letter)}>
          {letter}
        </span>
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-muted uppercase">
            {pigment.name} · {house.element}
          </p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl">{house.noun}</h1>
          <p className="mt-1 text-lg text-ink/80">{theme.name}</p>
        </div>
      </header>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed">{house.myth}</p>
      <p className="mt-4 max-w-2xl">{theme.essence}</p>

      <dl className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
          <dt className="font-display text-xs tracking-[0.16em] text-lunar uppercase">Inner</dt>
          <dd className="mt-2">{theme.inner}</dd>
        </div>
        <div className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
          <dt className="font-display text-xs tracking-[0.16em] text-solar uppercase">Outer</dt>
          <dd className="mt-2">{theme.outer}</dd>
        </div>
        <div className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
          <dt className="font-display text-xs tracking-[0.16em] text-warm uppercase">Gift</dt>
          <dd className="mt-2">{theme.gift}</dd>
        </div>
        <div className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
          <dt className="font-display text-xs tracking-[0.16em] text-contrary uppercase">Challenge</dt>
          <dd className="mt-2">{theme.challenge}</dd>
        </div>
      </dl>

      <p className="mt-8 max-w-2xl italic">{theme.invitation}</p>
      <p className="mt-3 text-sm text-muted">{house.tradition}</p>

      <section className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl">Allies — complete the job</h2>
          <ul className="mt-4 space-y-3">
            {alliesOf(letter).map((other) => (
              <li key={other}>
                <Link to="/atlas/$mark" params={{ mark: other.toLowerCase() }} className="flex items-center gap-3">
                  <Seal letter={other} size="sm" />
                  <span>{houseOf(other).noun}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl">Enemies — keep it honest</h2>
          <ul className="mt-4 space-y-3">
            {enemiesOf(letter).map((other) => (
              <li key={other}>
                <Link to="/atlas/$mark" params={{ mark: other.toLowerCase() }} className="flex items-center gap-3">
                  <Seal letter={other} size="sm" />
                  <span>{houseOf(other).noun}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteChrome>
  );
}
