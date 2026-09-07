import type { Service } from "@/content/services";
import { site } from "@/content/site";

const orgId = `${site.url}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(site.address.streetAddress
        ? { streetAddress: site.address.streetAddress }
        : {}),
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    areaServed: [
      { "@type": "Continent", name: "Africa" },
      { "@type": "Country", name: "Ghana" },
    ],
    knowsAbout: [
      "Hydropower rehabilitation",
      "Reverse engineering",
      "Component manufacturing",
      "Steel fabrication",
      "Project management",
      "Quality assurance",
      "Factory acceptance testing",
    ],
    ...(site.social.linkedin ? { sameAs: [site.social.linkedin] } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.contact.email,
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": orgId },
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/services/${service.slug}#service`,
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: `${site.url}/services/${service.slug}`,
    provider: { "@id": orgId },
    areaServed: { "@type": "Continent", name: "Africa" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} capabilities`,
      itemListElement: service.capabilities.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: c },
      })),
    },
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
