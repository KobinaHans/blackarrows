import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import {
  clientValue,
  globalNetwork,
  leadership,
  partnershipOfferings,
} from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { SectionHeader } from "@/components/sections/section-header";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "TEKKO Engineering Group is a specialized engineering, hydropower rehabilitation and technical services company supporting hydropower, industrial and infrastructure projects across Africa, led by a Chartered Mechanical Engineer and PMP-certified Project Manager.",
  path: "/about",
});

const values = [
  {
    title: "Engineering-led",
    body: "Every assignment is directed by qualified engineers who have designed, built, inspected and commissioned the equipment we work on.",
  },
  {
    title: "Practical & cost-effective",
    body: "We deliver technically sound solutions sized to the problem — no over-engineering, no shortcuts on safety or quality.",
  },
  {
    title: "Globally networked, locally present",
    body: "International manufacturing partners in Canada, Italy, Turkey and India, with responsive on-the-ground support in Ghana.",
  },
  {
    title: "Committed to Africa",
    body: "We support the sustainable development of Africa's infrastructure and energy sectors through long-term client success.",
  },
];

export default function AboutPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        eyebrow="About TEKKO"
        title="A specialized engineering and hydropower rehabilitation company dedicated to Africa"
        description="TEKKO Engineering Group supports hydropower generation, industrial and infrastructure projects across Africa with engineering consultancy, reverse engineering, component manufacturing, equipment supply, project management, quality assurance and field support services."
        crumbs={crumbs}
      />

      <section className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Who we are"
            title="International expertise. Global manufacturing. Local support."
          />
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              We provide engineering consultancy, reverse engineering, component
              manufacturing, equipment supply, project management, quality
              assurance and field support services for utilities, independent
              power producers, EPC contractors, mining companies and industrial
              clients.
            </p>
            <p>
              Our strength lies in combining international engineering expertise
              with a global manufacturing network and local African support.
              Through strategic partnerships with manufacturing shops in{" "}
              {site.network.join(", ")}, we deliver high-quality precision
              manufactured components and responsive technical support tailored
              to our clients&apos; operational needs.
            </p>
          </div>
        </Reveal>
        <Reveal direction="left">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/fabrication.jpg"
              alt="Structural steel fabrication in progress"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="border-y bg-secondary/40 py-16 lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Leadership" title={leadership.title} />
            <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
              {leadership.credentials.map((c) => (
                <Badge key={c} variant="accent">
                  {c}
                </Badge>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                {leadership.body}
              </p>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Having successfully managed multidisciplinary teams, fabrication
                facilities, OEM suppliers, quality programs and major equipment
                rehabilitation projects, Tekko Engineering Group brings
                practical, engineering-led solutions to every assignment.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-4">Full project lifecycle experience</p>
            </Reveal>
            <Stagger as="ol" className="grid gap-3 sm:grid-cols-2">
              {leadership.lifecycle.map((step, i) => (
                <StaggerItem
                  key={step}
                  as="li"
                  className="flex items-center gap-4 rounded-md border bg-card p-4"
                >
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{step}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-24">
        <SectionHeader
          eyebrow="Mission & ethos"
          title="Practical, cost-effective and technically sound"
          description="At TEKKO Engineering Group we are committed to delivering solutions that support the long-term success of our clients and the sustainable development of Africa's infrastructure and energy sectors."
          align="center"
        />
        <Stagger
          as="ul"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((v) => (
            <StaggerItem
              key={v.title}
              as="li"
              className="rounded-lg border bg-card p-6"
            >
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-steel-900 py-16 text-white lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Supply chain"
              title={globalNetwork.title}
              description={globalNetwork.intro}
              className="[&_p:last-child]:text-steel-300"
            />
            <Reveal delay={0.1}>
              <p className="mt-4 text-pretty leading-relaxed text-steel-300">
                Through years of involvement in manufacturing and refurbishment
                projects, the company&apos;s leadership has developed strong
                working relationships with industry-leading suppliers capable of
                producing high-quality components to international standards.
              </p>
            </Reveal>
          </div>
          <Stagger as="ul" className="grid gap-3">
            {globalNetwork.benefits.map((b) => (
              <StaggerItem
                key={b}
                as="li"
                className="flex gap-3 text-sm leading-relaxed text-steel-200"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {b}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <SectionHeader
            eyebrow="Value to clients"
            title="What you gain by engaging TEKKO"
          />
          <Stagger as="ul" className="mt-8 grid gap-3">
            {clientValue.map((v) => (
              <StaggerItem key={v} as="li" className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {v}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div>
          <SectionHeader
            eyebrow="Partnership opportunities"
            title="We are available to provide"
          />
          <Stagger as="ul" className="mt-8 grid gap-3">
            {partnershipOfferings.map((v) => (
              <StaggerItem key={v} as="li" className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {v}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <Cta />
    </>
  );
}
