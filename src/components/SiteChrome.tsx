import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Read" },
  { to: "/doctrine", label: "Doctrine" },
  { to: "/method", label: "Method" },
  { to: "/atlas", label: "Atlas" },
  { to: "/key", label: "Key" },
] as const;

export function SiteChrome({
  current,
  children,
}: {
  current?: (typeof NAV)[number]["to"];
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();

  return (
    <div className="paper-grain min-h-dvh">
      <header className="border-b border-rule/70">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-lg tracking-[0.18em] text-ink uppercase">
            Letterology
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3 py-2 text-muted transition-colors hover:text-ink",
                  current === item.to && "bg-ink/5 text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
            <span className="ml-1 flex min-h-10 min-w-16 items-center justify-end">
              {isPending ? (
                <span className="h-8 w-8 animate-pulse rounded-full bg-ink/10" />
              ) : user ? (
                <SignedIn>
                  <UserButton />
                </SignedIn>
              ) : (
                <SignedOut>
                  <Link to="/login" className="rounded-full px-3 py-2 text-muted hover:text-ink">
                    Sign in
                  </Link>
                </SignedOut>
              )}
            </span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">{children}</main>
      <footer className="mx-auto max-w-5xl border-t border-rule/70 px-4 py-8 text-sm text-muted sm:px-6">
        Official instrument. Usernames, not birth names. Luck is willingness. The decision is yours.
      </footer>
    </div>
  );
}
