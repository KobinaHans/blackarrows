import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { globalNetwork } from "@/content/company";
import { site } from "@/content/site";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";

export function GlobalNetwork() {
  return (
    <section className="on-dark bg-steel-900 py-20 text-white lg:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            eyebrow="Global Manufacturing Network"
            title={globalNetwork.title}
            description={globalNetwork.intro}
            className="[&_p:last-child]:text-steel-300"
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {site.network.map((country) => (
              <span
                key={country}
                className="rounded-sm border border-steel-600 bg-steel-800 px-3 py-1 font-mono text-xs uppercase tracking-wider"
              >
                {country}
              </span>
            ))}
          </Reveal>
          <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-2">
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
        <Reveal direction="left" className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-steel-700">
            <Image
              src="/images/blueprint.jpg"
              alt="Engineering drawing of a wicket gate bushing assembly"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-md border border-steel-700 bg-steel-950 p-5 shadow-xl sm:block">
            <p className="eyebrow">Quality oversight</p>
            <p className="mt-1 font-display text-lg font-semibold">
              Raw material → FAT → Site
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
