export const site = {
  name: "TEKKO Engineering Group",
  shortName: "TEKKO",
  legalName: "Tekko Engineering Group",
  tagline: "Engineering, Manufacturing & Project Delivery Support Services",
  description:
    "TEKKO Engineering Group is a Ghana-based, Africa-focused engineering and hydropower solutions company providing rehabilitation, reverse engineering, component manufacturing, equipment supply, and technical support services.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tekkoengineering.com",
  locale: "en_GH",
  founded: "2024",
  address: {
    streetAddress: process.env.NEXT_PUBLIC_ADDRESS_STREET ?? "",
    addressLocality: process.env.NEXT_PUBLIC_ADDRESS_CITY ?? "Accra",
    addressRegion: process.env.NEXT_PUBLIC_ADDRESS_REGION ?? "Greater Accra",
    addressCountry: "GH",
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@tekkoengineering.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  },
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  },
  network: ["Ghana", "Canada", "Italy", "Turkey", "India"],
  clientTypes: [
    "Utilities",
    "Independent Power Producers",
    "EPC Contractors",
    "Mining Companies",
    "Industrial Operators",
    "Project Developers",
  ],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/projects", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
