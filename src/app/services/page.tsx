import type { Metadata } from "next";

import { getServicesBySector, sectors, services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { ServiceCard } from "@/components/sections/service-card";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Hydropower rehabilitation, reverse engineering, component manufacturing, steel fabrication, project management and QA/FAT services for utilities, mining and industrial clients across Africa.",
  path: "/services",
  keywords: services.flatMap((s) => s.keywords),
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        eyebrow="Services"
        title="Engineering consulting and contract execution across the asset lifecycle"
        description="We provide engineering consulting services and execute contracts involving manufacturing, refurbishment, fabrication, construction and project delivery for hydropower generation, mining and industrial sectors."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      {(["hydropower", "industrial"] as const).map((sector) => (
        <section
          key={sector}
          id={sector}
          className="container scroll-mt-24 py-16 lg:py-24"
          aria-labelledby={`${sector}-heading`}
        >
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-3">{sectors[sector].label}</p>
            <h2
              id={`${sector}-heading`}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {sectors[sector].title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {sectors[sector].description}
            </p>
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getServicesBySector(sector).map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
      <Cta />
    </>
  );
}
