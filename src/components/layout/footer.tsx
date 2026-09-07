import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { services } from "@/content/services";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark border-t bg-steel-900 text-steel-200">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="[&_span:last-child]:text-steel-400 [&_span]:text-white" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-300">
            {site.tagline}. Ghana-based, Africa-focused, backed by an
            international engineering and manufacturing network spanning{" "}
            {site.network.join(", ")}.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {site.address.addressLocality}, {site.address.addressRegion},
                Ghana
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-white"
              >
                {site.contact.email}
              </a>
            </li>
            {site.contact.phone ? (
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
                  className="hover:text-white"
                >
                  {site.contact.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h2 className="eyebrow mb-4">Services</h2>
          <ul className="grid gap-2.5 text-sm sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-steel-300 transition-colors hover:text-white"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="eyebrow mb-4">Company</h2>
          <ul className="space-y-2.5 text-sm">
            {nav
              .filter((n) => n.href !== "/")
              .map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-steel-300 transition-colors hover:text-white"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
          </ul>
          <h2 className="eyebrow mb-4 mt-8">Credentials</h2>
          <ul className="space-y-1.5 text-xs text-steel-400">
            <li>Chartered Mechanical Engineer (UK)</li>
            <li>Professional Engineer (Ghana)</li>
            <li>PMP-certified Project Management</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-steel-800">
        <div className="container flex flex-col gap-4 py-6 text-xs text-steel-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Use
            </Link>
            {site.social.linkedin ? (
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TEKKO on LinkedIn"
                className="hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
        <div className="container pb-6 text-xs leading-relaxed text-steel-400">
          Information on this website is provided for general guidance only and
          does not constitute an engineering opinion, warranty or offer. Scope,
          standards and deliverables are defined in individual contracts.
          Project references reflect the professional experience of the
          company&apos;s leadership team.
        </div>
      </div>
    </footer>
  );
}
