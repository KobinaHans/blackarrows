import { clientValue } from "@/content/company";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";

export function WhyTekko() {
  return (
    <section className="container py-20 lg:py-28">
      <SectionHeader
        eyebrow="Why Choose TEKKO"
        title="Engineering-led. Quality-assured. Delivered."
        description="We combine engineering expertise, manufacturing experience, project management capability and quality assurance oversight to provide comprehensive support from concept through completion."
        align="center"
      />
      <Stagger
        as="ul"
        className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {clientValue.map((v, i) => (
          <StaggerItem
            key={v}
            as="li"
            className="flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-secondary/60"
          >
            <span className="font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-display text-base font-semibold leading-snug">
              {v}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
