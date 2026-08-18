import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";
import { DOCTRINE, DOCTRINE_CLOSE, DOCTRINE_PREFACE } from "@/lib/letterology/doctrine";

export const Route = createFileRoute("/doctrine")({ component: DoctrinePage });

function DoctrinePage() {
  return (
    <SiteChrome current="/doctrine">
      <header className="max-w-2xl">
        <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">The compact</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Doctrine</h1>
      </header>
      <div className="mt-8 max-w-2xl space-y-4">
        {DOCTRINE_PREFACE.map((paragraph) => (
          <p key={paragraph.slice(0, 28)} className="text-lg leading-relaxed text-ink/90">
            {paragraph}
          </p>
        ))}
      </div>
      {DOCTRINE.map((section) => (
        <section key={section.title} className="mt-12 max-w-2xl">
          <p className="font-display text-xs tracking-[0.18em] text-muted uppercase">{section.kicker}</p>
          <h2 className="mt-1 font-display text-2xl">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 28)} className="mt-3 leading-relaxed text-ink/90">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <p className="mt-14 max-w-2xl font-display text-xl text-ink">{DOCTRINE_CLOSE}</p>
    </SiteChrome>
  );
}
