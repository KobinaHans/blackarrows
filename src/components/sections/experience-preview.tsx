import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { leadership, projects } from "@/content/company";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/sections/section-header";

export function ExperiencePreview() {
  return (
    <section className="border-t bg-secondary/40 py-20 lg:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Relevant Experience"
              title="Proven on major power generation and industrial projects"
              description="The leadership team of Tekko Engineering Group brings extensive experience from major power generation and industrial projects across Africa and North America."
            />
            <Stagger as="ul" className="mt-8 space-y-4">
              {projects.slice(0, 4).map((p) => (
                <StaggerItem
                  key={p.id}
                  as="li"
                  className="flex flex-col gap-2 rounded-md border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium leading-snug">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.region}
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {p.type}
                  </Badge>
                </StaggerItem>
              ))}
            </Stagger>
            <Button asChild variant="link" className="mt-6 px-0">
              <Link href="/projects">
                View all experience <ArrowRight />
              </Link>
            </Button>
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/powerhouse.jpg"
                alt="Hydroelectric powerhouse and penstocks at dusk"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 rounded-lg border bg-card p-6">
              <p className="eyebrow mb-2">{leadership.title}</p>
              <ul className="flex flex-wrap gap-2">
                {leadership.credentials.map((c) => (
                  <li key={c}>
                    <Badge variant="outline">{c}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {leadership.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
