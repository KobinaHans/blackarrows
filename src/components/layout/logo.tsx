import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="36" height="36" rx="4" className="fill-primary" />
        <path d="M8 10h20v4H20v12h-4V14H8z" className="fill-accent" />
        <path d="M22 20h6v6h-6z" className="fill-primary-foreground/80" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">
          TEKKO
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Engineering Group
        </span>
      </span>
    </Link>
  );
}
