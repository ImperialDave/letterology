import { createFileRoute } from "@tanstack/react-router";
import { ReadingDesk } from "@/components/letterology/ReadingDesk";
import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteChrome current="/">
      <header className="max-w-2xl">
        <p className="font-display text-xs tracking-[0.22em] text-gold-deep uppercase">The official instrument</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-6xl">Letterize a username. Read your luck. Time the move.</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/85">
          A letter does not change its nature — only its willingness. We read the handle you already use against
          today's court, then tell you what to lean into, what to wait on, and whether an act will travel.
        </p>
      </header>
      <div className="mt-10">
        <ReadingDesk />
      </div>
    </SiteChrome>
  );
}
