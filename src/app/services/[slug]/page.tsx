import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { projects } from "@/content/company";
import {
  getRelatedServices,
  getService,
  sectors,
  services,
} from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { ServiceCard } from "@/components/sections/service-card";
import { ServiceIcon } from "@/components/service-icon";

interface Params {
  params: { slug?: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const service = getService(params?.slug);
  if (!service) {
    return buildMetadata({
      title: "Service not found",
      description: "The requested service could not be found.",
      path: "/services",
      noIndex: true,
    });
  }
  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

const sectorImage: Record<string, string> = {
  hydropower: "/images/hero-turbine.jpg",
  industrial: "/images/fabrication.jpg",
};

export default function ServiceDetailPage({ params }: Params) {
  const service = getService(params?.slug);
  if (!service) notFound();

  const sector = sectors[service.sector];
  const related = getRelatedServices(service, 3);
  const relatedProjects = projects.filter((p) =>
    p.services.includes(service.slug),
  );
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortTitle, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd data={[serviceJsonLd(service), breadcrumbJsonLd(crumbs)]} />
      <PageHero
        eyebrow={sector?.label ?? "Service"}
        title={service.title}
        description={service.summary}
        crumbs={crumbs}
      >
        <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href={`/contact?service=${service.slug}`}>
              Request a Quote <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-steel-500 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={`/services#${service.sector}`}>
              All {sector?.label ?? ""} services
            </Link>
          </Button>
        </Reveal>
      </PageHero>

      <section className="container grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-md bg-secondary text-primary">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Overview
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
              {service.description}
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Capabilities
            </h2>
          </Reveal>
          <Stagger as="ul" className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.capabilities.map((c) => (
              <StaggerItem
                key={c}
                as="li"
                className="flex gap-3 rounded-md border bg-card p-4 text-sm leading-relaxed"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {c}
              </StaggerItem>
            ))}
          </Stagger>

          {relatedProjects.length > 0 ? (
            <Reveal className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Relevant experience
              </h2>
              <ul className="mt-6 space-y-3">
                {relatedProjects.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-1 rounded-md border-l-2 border-accent bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.region}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {p.type}
                    </Badge>
                  </li>
                ))}
              </ul>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link href="/projects">
                  View all experience <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          ) : null}
        </div>

        <aside className="lg:col-span-5">
          <Reveal direction="left" className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={sectorImage[service.sector] ?? "/images/blueprint.jpg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 rounded-lg border bg-card p-6">
              <p className="eyebrow mb-4">Client outcomes</p>
              <ul className="space-y-3">
                {service.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link href={`/contact?service=${service.slug}`}>
                  Discuss this service
                </Link>
              </Button>
            </div>
          </Reveal>
        </aside>
      </section>

      <section className="border-t bg-secondary/40 py-16 lg:py-24">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3">Related</p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Other services
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <Cta />
    </>
  );
}
