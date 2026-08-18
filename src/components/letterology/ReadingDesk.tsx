import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Seal } from "@/components/letterology/Seal";
import { almanacOf } from "@/lib/letterology/calendar";
import { houseOf } from "@/lib/letterology/houses";
import { decide, luckOf, type DecisionReading, type LuckReading } from "@/lib/letterology/luck";
import { letterize, type Portrait } from "@/lib/letterology/letterize";
import { mixLabel, mixTriad, pigmentOf } from "@/lib/letterology/pigment";
import type { Letter, Polarity } from "@/lib/letterology/types";
import { cn } from "@/lib/utils";

const LAST_KEY = "letterology:last-handle";
const EXAMPLES = ["grok", "ImperialDave", "letterology", "33cc"];

export function ReadingDesk({ initialHandle = "" }: { initialHandle?: string }) {
  const day = useMemo(() => almanacOf(new Date()), []);
  const [handle, setHandle] = useState(initialHandle);
  const [polarity, setPolarity] = useState<Polarity>("unmarked");
  const [act, setAct] = useState("");
  const [portrait, setPortrait] = useState<Portrait | null>(null);
  const [luck, setLuck] = useState<LuckReading | null>(null);
  const [decision, setDecision] = useState<DecisionReading | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialHandle) return;
    try {
      const last = localStorage.getItem(LAST_KEY);
      if (last) setHandle(last);
    } catch {
      /* ignore */
    }
  }, [initialHandle]);

  function run(nextHandle = handle) {
    const reading = letterize(nextHandle, polarity);
    if (!reading) {
      setPortrait(null);
      setLuck(null);
      setDecision(null);
      setError("A handle needs at least one letter or digit.");
      return;
    }
    setError("");
    setPortrait(reading);
    const nextLuck = luckOf(reading, day);
    setLuck(nextLuck);
    try {
      localStorage.setItem(LAST_KEY, nextHandle.trim());
    } catch {
      /* ignore */
    }
    const trimmedAct = act.trim();
    setDecision(trimmedAct ? decide(reading, trimmedAct, day) : null);
  }

  function runDecision() {
    if (!portrait) {
      run();
      return;
    }
    const next = decide(portrait, act, day);
    setDecision(next);
    if (!next) setError("Name the act in letters — a phrase we can letterize.");
  }

  return (
    <div className="space-y-10">
      <CurrentStrip
        dayIso={day.iso}
        weekday={day.weekdayName}
        charge={day.charge}
        favorable={day.favorable}
        contrary={day.contrary}
      />

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          run();
        }}
      >
        <label className="block">
          <span className="font-display text-xs tracking-[0.18em] text-muted uppercase">Username</span>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-display text-muted">
              @
            </span>
            <Input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="the handle you actually use"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="pl-9"
              aria-label="Username to letterize"
            />
          </div>
        </label>

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="h-10 rounded-full bg-raised px-3 font-display text-sm text-muted shadow-[var(--shadow-border)] hover:text-ink"
              onClick={() => {
                setHandle(example);
                run(example);
              }}
            >
              @{example}
            </button>
          ))}
        </div>

        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Polarity</legend>
          {(
            [
              ["unmarked", "Unmarked"],
              ["solar", "Solar"],
              ["lunar", "Lunar"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPolarity(value)}
              className={cn(
                "h-11 rounded-full px-4 font-display text-sm shadow-[var(--shadow-border)] transition-colors",
                polarity === value ? "bg-ink text-raised" : "bg-raised text-ink hover:bg-ink/5",
              )}
            >
              {label}
            </button>
          ))}
        </fieldset>

        <Button type="submit">Read my luck</Button>
        {error ? <p className="text-sm text-contrary">{error}</p> : null}
      </form>

      {portrait && luck ? <PortraitView portrait={portrait} luck={luck} /> : null}

      {portrait ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl">What are you deciding?</h2>
          <p className="max-w-xl text-sm text-muted">
            Letterize the act. We will tell you if it is your kind of move, and if today will have it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={act}
              onChange={(event) => setAct(event.target.value)}
              placeholder="quit, ask them, ship the launch, stay"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runDecision();
                }
              }}
            />
            <Button type="button" variant="line" onClick={runDecision} className="shrink-0">
              Time this
            </Button>
          </div>
          {decision ? <DecisionCard decision={decision} /> : null}
        </section>
      ) : null}
    </div>
  );
}

function CurrentStrip({
  dayIso,
  weekday,
  charge,
  favorable,
  contrary,
}: {
  dayIso: string;
  weekday: string;
  charge: "solar" | "lunar";
  favorable: Letter[];
  contrary: Letter[];
}) {
  return (
    <section className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)] sm:p-6">
      <p className="font-display text-xs tracking-[0.18em] text-muted uppercase">
        {weekday} · {dayIso} · {charge === "solar" ? "Solar day" : "Lunar day"}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-warm">Favorable currents</p>
          <p className="mt-1 text-sm text-muted">
            These glyphs run warm. Names and acts that carry them find doors ajar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {favorable.map((letter) => (
              <Link key={letter} to="/atlas/$mark" params={{ mark: letter.toLowerCase() }}>
                <Seal letter={letter} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-contrary">Contrary currents</p>
          <p className="mt-1 text-sm text-muted">These glyphs withdraw. Proceed gently where they lead.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {contrary.map((letter) => (
              <Link key={letter} to="/atlas/$mark" params={{ mark: letter.toLowerCase() }}>
                <Seal letter={letter} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitView({ portrait, luck }: { portrait: Portrait; luck: LuckReading }) {
  const mix = mixTriad(portrait.triad);
  const house = houseOf(portrait.signature);

  return (
    <article className="space-y-8">
      <header
        className="overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-border)] sm:p-8"
        style={{ backgroundColor: mix.css, color: mix.ink }}
      >
        <p className="font-display text-xs tracking-[0.2em] uppercase opacity-80">
          Letter Path {portrait.triad.join("")}
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">@{portrait.display}</h2>
        <p className="mt-2 max-w-xl text-lg">{portrait.title}</p>
        <p className="mt-1 text-sm opacity-80">
          {house.house} · {mixLabel(portrait.triad)}
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div>
            <p className="font-display text-xs tracking-[0.16em] uppercase opacity-80">Today's luck</p>
            <p className="font-display text-4xl tabular-nums">{luck.score}</p>
            <p className="text-sm">{luck.verdict}</p>
          </div>
          <div className="flex gap-2">
            {portrait.triad.map((letter, index) => (
              <Seal key={`${letter}-${index}`} letter={letter} size="lg" />
            ))}
          </div>
        </div>
      </header>

      <p className="max-w-2xl text-lg leading-relaxed">{luck.weather}</p>
      <p className="max-w-2xl text-ink/90">{luck.invitation}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <CounselCard kicker="Do this" body={luck.counsel.do} tone="warm" />
        <CounselCard kicker="Wait on" body={luck.counsel.wait} tone="contrary" />
        <CounselCard kicker="Ask" body={luck.counsel.ask} tone="ink" />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {luck.seats.map((seat) => (
          <div key={seat.role} className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
            <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
              {seat.role === "house" ? "Role" : seat.role === "manner" ? "How" : "Where"}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Seal letter={seat.letter} />
              <div>
                <p className="font-display text-xl">{houseOf(seat.letter).noun}</p>
                <p className="text-sm text-muted">
                  {seat.current === "favorable"
                    ? "Warm today"
                    : seat.current === "contrary"
                      ? "Withdrawn today"
                      : "Quiet today"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-2xl">The finding</h3>
        <p className="max-w-2xl">{portrait.statements.entrance}</p>
        <p className="max-w-2xl">{portrait.statements.path}</p>
        <p className="max-w-2xl text-ink/90">{luck.why}</p>
        <p className="max-w-2xl text-sm text-muted">{portrait.statements.court}</p>
        <p className="max-w-2xl text-sm text-muted">{portrait.statements.count}</p>
        <p className="max-w-2xl text-sm text-muted">{portrait.statements.polarity}</p>
      </section>

      <section>
        <h3 className="font-display text-2xl">Letters in office</h3>
        <ul className="mt-4 divide-y divide-rule/60">
          {portrait.inventory.map((item) => (
            <li key={item.letter} className="flex items-center justify-between gap-3 py-3">
              <Link
                to="/atlas/$mark"
                params={{ mark: item.letter.toLowerCase() }}
                className="flex items-center gap-3"
              >
                <Seal letter={item.letter} size="sm" />
                <span>
                  <span className="font-display">{houseOf(item.letter).noun}</span>
                  <span className="ml-2 text-sm text-muted">{pigmentOf(item.letter).name}</span>
                </span>
              </Link>
              <span className="font-display text-xs tracking-[0.14em] text-muted uppercase">{item.office}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function CounselCard({
  kicker,
  body,
  tone,
}: {
  kicker: string;
  body: string;
  tone: "warm" | "contrary" | "ink";
}) {
  return (
    <div className="rounded-3xl bg-raised p-5 shadow-[var(--shadow-border)]">
      <p
        className={cn(
          "font-display text-xs tracking-[0.16em] uppercase",
          tone === "warm" && "text-warm",
          tone === "contrary" && "text-contrary",
          tone === "ink" && "text-muted",
        )}
      >
        {kicker}
      </p>
      <p className="mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

function DecisionCard({ decision }: { decision: DecisionReading }) {
  const tone = decision.timing === "now" || decision.timing === "today-ok" ? "text-warm" : "text-contrary";
  return (
    <div className="rounded-3xl bg-raised p-6 shadow-[var(--shadow-border)]">
      <p className="font-display text-xs tracking-[0.16em] text-muted uppercase">
        Act sits {decision.actLetter} · {decision.actHouse} · fit {decision.score}
      </p>
      <h3 className={cn("mt-2 font-display text-2xl", tone)}>{decision.headline}</h3>
      <p className="mt-3 max-w-2xl leading-relaxed">{decision.body}</p>
      <p className="mt-3 max-w-2xl font-semibold">{decision.next}</p>
    </div>
  );
}
