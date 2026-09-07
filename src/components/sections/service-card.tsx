import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "@/components/service-icon";

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <ServiceIcon name={service.icon} className="h-6 w-6" />
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.summary}
      </p>
      <ul className="mt-5 space-y-1.5 border-t pt-4 text-xs text-muted-foreground">
        {service.capabilities.slice(0, 3).map((c) => (
          <li key={c} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span className="line-clamp-1">{c}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
