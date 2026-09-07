import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServicesBySector, sectors } from "@/content/services";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceCard } from "@/components/sections/service-card";

export function ServicesOverview() {
  return (
    <section className="container py-20 lg:py-28" aria-labelledby="services">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Services"
          title="Complete lifecycle support — from engineering to installation"
          description="Tekko Engineering Group provides engineering consulting services and executes contracts involving manufacturing, refurbishment, fabrication, construction and project delivery for hydropower generation, mining and industrial sectors."
        />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/services">
            All services <ArrowRight />
          </Link>
        </Button>
      </div>

      {(["hydropower", "industrial"] as const).map((sector) => (
        <div key={sector} className="mt-14">
          <div className="mb-6 flex items-center gap-4">
            <h3
              id={sector === "hydropower" ? "services" : undefined}
              className="font-display text-xl font-semibold"
            >
              {sectors[sector].title}
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {getServicesBySector(sector).map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ))}
    </section>
  );
}
