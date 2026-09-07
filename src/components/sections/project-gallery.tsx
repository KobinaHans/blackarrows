"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";

import {
  projectIndustries,
  projectTypes,
  type Project,
  type ProjectIndustry,
  type ProjectType,
} from "@/content/company";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type IndustryFilter = ProjectIndustry | "All";
type TypeFilter = ProjectType | "All";

export function ProjectGallery({ projects }: { projects: readonly Project[] }) {
  const [industry, setIndustry] = React.useState<IndustryFilter>("All");
  const [type, setType] = React.useState<TypeFilter>("All");

  const filtered = React.useMemo(
    () =>
      (projects ?? []).filter(
        (p) =>
          (industry === "All" || p.industry === industry) &&
          (type === "All" || p.type === type),
      ),
    [projects, industry, type],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4 text-accent" aria-hidden />
          Filter experience
        </h2>
        <FilterGroup
          label="Industry"
          options={["All", ...projectIndustries]}
          value={industry}
          onChange={setIndustry}
        />
        <FilterGroup
          label="Type"
          options={["All", ...projectTypes]}
          value={type}
          onChange={setType}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {projects.length} engagements
      </p>

      <m.ul layout className="mt-4 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((p) => (
            <m.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col rounded-lg border bg-card p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{p.industry}</Badge>
                <Badge variant="secondary">{p.type}</Badge>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {p.region}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.summary}
              </p>
              <p className="eyebrow mb-2 mt-5">Scope</p>
              <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                {p.scope.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                {p.services.map((slug) => {
                  const svc = services.find((s) => s.slug === slug);
                  if (!svc) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                    >
                      {svc.shortTitle}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  );
                })}
              </div>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No engagements match this combination. Try a different filter.
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 w-16 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-accent hover:bg-secondary",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
