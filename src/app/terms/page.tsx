import type { Metadata } from "next";

import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms governing the use of the ${site.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ]}
      />
      <article className="container max-w-3xl space-y-8 py-16 leading-relaxed text-muted-foreground lg:py-24 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
        <section className="space-y-3">
          <h2>General information only</h2>
          <p>
            Content on this website is provided for general information about
            the services of {site.legalName}. It does not constitute engineering
            advice, a warranty, a quotation or an offer capable of acceptance.
            Scope, applicable standards, deliverables and commercial terms are
            defined exclusively in written contracts.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Project references</h2>
          <p>
            Project experience described on this site reflects the professional
            experience of the company&apos;s leadership team, including roles
            held prior to or independently of {site.legalName}.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Intellectual property</h2>
          <p>
            All text, graphics and code on this website are the property of{" "}
            {site.legalName} or its licensors and may not be reproduced without
            written permission.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {site.legalName} accepts no
            liability for any loss arising from reliance on information
            contained on this website.
          </p>
        </section>
      </article>
    </>
  );
}
