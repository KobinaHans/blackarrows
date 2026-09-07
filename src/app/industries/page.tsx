import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { industries } from "@/content/company";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { SectionHeader } from "@/components/sections/section-header";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "TEKKO serves hydropower utilities, independent power producers, mining companies, EPC contractors and industrial operators across Africa.",
  path: "/industries",
});

const industryServices: Record<string, readonly string[]> = {
  hydropower: [
    "hydropower-rehabilitation-modernization",
    "hydropower-engineering-technical-consultancy",
    "reverse-engineering-obsolescence",
    "component-manufacturing-supply",
    "field-services-quality-assurance",
  ],
  mining: [
    "manufacturing-fabrication",
    "engineering-technical-consulting",
    "project-management",
  ],
  epc: [
    "project-management",
    "quality-assurance-factory-acceptance-testing",
    "engineering-technical-consulting",
  ],
  industrial: [
    "manufacturing-fabrication",
    "engineering-technical-consulting",
    "quality-assurance-factory-acceptance-testing",
    "project-management",
  ],
};

export default function IndustriesPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        eyebrow="Industries"
        title="Serving the operators of Africa's most critical assets"
        description={`We work with ${site.clientTypes.join(", ").toLowerCase()} to improve reliability, reduce downtime and extend equipment life.`}
        crumbs={crumbs}
      />
      <section className="container py-16 lg:py-24">
        <SectionHeader
          eyebrow="Sectors"
          title="Tailored support for each sector"
          description="Every sector has its own failure modes, standards and commercial pressures. We map our service lines to your operating reality."
        />
        <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
          {industries.map((ind) => {
            const list = (industryServices[ind.slug] ?? [])
              .map((slug) => services.find((s) => s.slug === slug))
              .filter((s): s is NonNullable<typeof s> => Boolean(s));
            return (
              <StaggerItem
                key={ind.slug}
                className="flex flex-col rounded-lg border bg-card p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {ind.name}
                </h3>
                <p className="mt-2 text-muted-foreground">{ind.description}</p>
                <p className="eyebrow mb-3 mt-6">Relevant services</p>
                <ul className="flex flex-1 flex-col gap-2">
                  {list.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:border-accent hover:bg-secondary"
                      >
                        {s.shortTitle}
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="link" className="mt-4 w-fit px-0">
                  <Link href={`/contact?industry=${ind.slug}`}>
                    Talk to us about {ind.name.toLowerCase()} <ArrowRight />
                  </Link>
                </Button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
      <Cta />
    </>
  );
}
