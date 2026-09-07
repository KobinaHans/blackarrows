import type { Metadata } from "next";

import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects personal information submitted through this website.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ]}
      />
      <article className="container max-w-3xl space-y-8 py-16 leading-relaxed text-muted-foreground lg:py-24 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
        <p>
          {site.legalName} (&quot;TEKKO&quot;, &quot;we&quot;) respects your
          privacy. This policy explains what personal information we collect
          through this website and how we use it.
        </p>
        <section className="space-y-3">
          <h2>Information we collect</h2>
          <p>
            When you submit our contact form we collect the name, organisation,
            email address, telephone number (optional) and message you provide.
            We also process technical data such as IP address for security and
            rate-limiting purposes.
          </p>
        </section>
        <section className="space-y-3">
          <h2>How we use it</h2>
          <p>
            We use your information solely to respond to your enquiry, prepare
            proposals and manage our business relationship with you. We do not
            sell personal information and do not share it with third parties
            except service providers (such as our email delivery provider)
            acting on our instructions.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Retention & security</h2>
          <p>
            Enquiries are retained for as long as necessary to serve the purpose
            for which they were collected. We apply appropriate technical and
            organisational measures to protect your data.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal information at any time by emailing{" "}
            <a
              className="text-foreground underline"
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </a>
            .
          </p>
        </section>
      </article>
    </>
  );
}
