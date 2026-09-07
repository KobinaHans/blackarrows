import type { Metadata } from "next";

import { projects } from "@/content/company";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { ProjectGallery } from "@/components/sections/project-gallery";

export const metadata: Metadata = buildMetadata({
  title: "Experience & Projects",
  description:
    "Hydropower overhauls in Ghana, field QA/QC and maintenance programmes in North America, and fabrication and factory acceptance testing coordination: the project experience behind TEKKO Engineering Group.",
  path: "/projects",
});

export default function ProjectsPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Experience", path: "/projects" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        eyebrow="Experience"
        title="Delivered safely, on schedule and within budget"
        description="The leadership team of Tekko Engineering Group brings extensive experience from major power generation and industrial projects across Africa and North America. This experience enables us to provide practical, technically sound and results-driven solutions tailored to client needs."
        crumbs={crumbs}
      />
      <section className="container py-16 lg:py-24">
        <ProjectGallery projects={projects} />
      </section>
      <Cta
        title="Have a similar challenge?"
        description="Tell us about your asset, outage or capital project and we will respond with a practical, engineering-led proposal."
      />
    </>
  );
}
