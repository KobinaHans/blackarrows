import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

interface CtaProps {
  title?: string;
  description?: string;
}

export function Cta({
  title = "Let's discuss how we can support your next project",
  description = "We are actively seeking to partner with power generation companies, mining companies, EPC contractors, plant operators, utilities and industrial organizations across Africa.",
}: CtaProps) {
  return (
    <section className="container pb-20 lg:pb-28">
      <Reveal className="relative overflow-hidden rounded-lg bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:px-16 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid bg-[length:48px_48px] opacity-[0.07]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-pretty text-primary-foreground/80">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/contact">
                Request a Quote <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/about">About TEKKO</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
