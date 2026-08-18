import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full min-h-11 rounded-full border-0 bg-raised px-4 font-serif text-base text-ink shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted focus:shadow-[var(--shadow-border-hover)]",
        className,
      )}
      {...props}
    />
  );
}
