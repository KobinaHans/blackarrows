import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Entrance } from "@/components/motion/entrance";

interface Crumb {
  name: string;
  path: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: readonly Crumb[];
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "on-dark relative overflow-hidden border-b bg-steel-950 text-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-[length:48px_48px] opacity-[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="container relative py-16 lg:py-24">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-steel-300">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1.5">
                  {i > 0 ? <ChevronRight className="h-3 w-3" /> : null}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-white">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.path} className="hover:text-white">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <Entrance>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="max-w-4xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-steel-200 sm:text-lg">
              {description}
            </p>
          ) : null}
        </Entrance>
        {children}
      </div>
    </section>
  );
}
