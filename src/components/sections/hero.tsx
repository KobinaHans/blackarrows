import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Entrance } from "@/components/motion/entrance";

export function Hero() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-steel-950 text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-turbine.jpg"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-right opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/85 to-steel-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-transparent to-transparent" />
      </div>

      <div className="container relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 lg:min-h-[calc(100svh-5rem)] lg:py-28">
        <div className="max-w-3xl">
          <Entrance step={0}>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-accent" />
              Ghana-based · Africa-focused · Globally networked
            </p>
          </Entrance>
          <Entrance step={1}>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Engineering, Manufacturing &amp;{" "}
              <span className="text-accent">Project Delivery</span> Support
              Services
            </h1>
          </Entrance>
          <Entrance step={2}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-steel-200 sm:text-lg lg:text-xl">
              {site.name} is an engineering and hydropower solutions company
              providing rehabilitation, reverse engineering, component
              manufacturing, equipment supply and technical support. We help
              utilities, industrial operators, EPC contractors and project
              developers improve asset reliability, reduce downtime and extend
              the life of critical infrastructure.
            </p>
          </Entrance>
          <Entrance step={3}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href="/services">
                  Explore Services <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-steel-500 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Discuss a Project</Link>
              </Button>
            </div>
          </Entrance>
        </div>

        <Entrance step={4} className="mt-16 lg:mt-24">
          <dl className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              ["Hydropower", "Rehabilitation & modernization"],
              ["Manufacturing", "Precision components & fabrication"],
              ["Engineering", "Design, reverse engineering & QA"],
              ["Delivery", "PMP-led project execution"],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="font-display text-lg font-semibold">{term}</dt>
                <dd className="mt-1 text-sm text-steel-300">{desc}</dd>
              </div>
            ))}
          </dl>
        </Entrance>
      </div>
    </section>
  );
}
