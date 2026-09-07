import type { Metadata } from "next";

import { site } from "@/content/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
}: PageMeta): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: site.locale,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
