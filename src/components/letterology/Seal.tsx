import { pigmentOf, pigmentStyle } from "@/lib/letterology/pigment";
import type { Letter } from "@/lib/letterology/types";
import { cn } from "@/lib/utils";

export function Seal({
  letter,
  size = "md",
  className,
}: {
  letter: Letter;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pigment = pigmentOf(letter);
  return (
    <span
      title={`${letter} · ${pigment.name}`}
      className={cn(
        "inline-grid place-items-center rounded-full font-display font-semibold leading-none",
        size === "sm" && "size-8 text-sm",
        size === "md" && "size-11 text-lg",
        size === "lg" && "size-16 text-3xl",
        className,
      )}
      style={pigmentStyle(letter)}
    >
      {letter}
    </span>
  );
}
