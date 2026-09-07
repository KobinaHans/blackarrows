import { stats } from "@/content/company";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function Stats() {
  return (
    <section className="border-y bg-secondary/50" aria-label="Key figures">
      <Stagger className="container grid grid-cols-2 divide-border py-10 sm:grid-cols-4 sm:divide-x">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="px-4 py-3 text-center sm:px-6">
            <p className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              {s.label}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
