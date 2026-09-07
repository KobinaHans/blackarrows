import type { Metadata } from "next";
import { Clock, Globe2, Mail, MapPin, Phone } from "lucide-react";

import { partnershipOfferings } from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/sections/contact-form";

import { submitContact } from "./actions";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Request a Quote",
  description:
    "Contact TEKKO Engineering Group to discuss hydropower rehabilitation, component manufacturing, fabrication, project management or QA/FAT support for your project in Africa.",
  path: "/contact",
});

interface ContactPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  const defaultService = firstParam(searchParams?.service);
  const defaultIndustry = firstParam(searchParams?.industry);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        eyebrow="Contact"
        title="Let's discuss your project"
        description="Tekko Engineering Group welcomes the opportunity to discuss how we can support your organisation in delivering successful projects, improving manufacturing quality, reducing operational risks and enhancing asset reliability."
        crumbs={crumbs}
      />
      <section className="container grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <Reveal className="lg:col-span-7">
          <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Request a quote or technical discussion
            </h2>
            <p className="mb-8 mt-2 text-sm text-muted-foreground">
              Fields marked <span className="text-destructive">*</span> are
              required.
            </p>
            <ContactForm
              action={submitContact}
              defaultService={defaultService}
              defaultIndustry={defaultIndustry}
            />
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1} className="lg:col-span-5">
          <div className="space-y-8 lg:sticky lg:top-28">
            <div className="rounded-lg border bg-card p-6">
              <p className="eyebrow mb-4">Get in touch</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:underline"
                  >
                    {site.contact.email}
                  </a>
                </li>
                {site.contact.phone ? (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <a
                      href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
                      className="hover:underline"
                    >
                      {site.contact.phone}
                    </a>
                  </li>
                ) : null}
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {site.address.streetAddress
                      ? `${site.address.streetAddress}, `
                      : ""}
                    {site.address.addressLocality}, {site.address.addressRegion}
                    , Ghana
                  </span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Monday – Friday, 08:00 – 17:00 GMT</span>
                </li>
                <li className="flex gap-3">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Manufacturing network: {site.network.join(" · ")}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-secondary/40 p-6">
              <p className="eyebrow mb-4">We are available to provide</p>
              <ul className="grid gap-2 text-sm">
                {partnershipOfferings.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
