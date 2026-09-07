export type ProjectIndustry = "Hydropower" | "Manufacturing" | "Industrial";
export type ProjectType =
  "Overhaul" | "QA/QC" | "Maintenance" | "Manufacturing" | "Project Delivery";

export interface Project {
  id: string;
  title: string;
  industry: ProjectIndustry;
  type: ProjectType;
  region: string;
  summary: string;
  scope: readonly string[];
  services: readonly string[];
}

export const projects: readonly Project[] = [
  {
    id: "ghana-hydro-mechanical-overhaul",
    title: "Mechanical Overhaul of a Hydroelectric Power Station",
    industry: "Hydropower",
    type: "Overhaul",
    region: "Ghana",
    summary:
      "Leadership of the mechanical overhaul of a hydroelectric power station in Ghana, covering turbine and auxiliary systems from outage planning through recommissioning.",
    scope: [
      "Outage scoping and work-package development",
      "Turbine and auxiliary mechanical overhaul",
      "Multidisciplinary team and contractor coordination",
      "Recommissioning and hand-back to operations",
    ],
    services: [
      "hydropower-rehabilitation-modernization",
      "field-services-quality-assurance",
    ],
  },
  {
    id: "north-america-hydro-qaqc",
    title: "Field QA/QC on Hydropower Refurbishment Projects",
    industry: "Hydropower",
    type: "QA/QC",
    region: "North America",
    summary:
      "Field quality assurance and quality control for hydropower refurbishment projects in North America, verifying workmanship against specification throughout installation.",
    scope: [
      "Inspection and Test Plan implementation",
      "Non-conformance identification and close-out",
      "Installation and alignment verification",
      "Acceptance documentation",
    ],
    services: [
      "quality-assurance-factory-acceptance-testing",
      "field-services-quality-assurance",
    ],
  },
  {
    id: "north-america-site-maintenance",
    title: "Site Maintenance Programs & Major Unit Overhauls",
    industry: "Hydropower",
    type: "Maintenance",
    region: "North America",
    summary:
      "Management of site maintenance programmes, major unit overhauls, and the manufacturing and refurbishment of critical hydroelectric equipment across North America.",
    scope: [
      "Annual and long-term maintenance planning",
      "Major unit overhaul execution",
      "Critical equipment manufacturing and refurbishment",
      "Reliability improvement initiatives",
    ],
    services: [
      "hydropower-rehabilitation-modernization",
      "component-manufacturing-supply",
      "project-management",
    ],
  },
  {
    id: "fabrication-oem-fat-coordination",
    title: "Fabrication Shop, OEM & Factory Acceptance Test Coordination",
    industry: "Manufacturing",
    type: "Manufacturing",
    region: "International",
    summary:
      "Coordination of fabrication shops, manufacturing facilities, OEM suppliers, quality programmes and factory acceptance testing for critical power-generation equipment.",
    scope: [
      "Supplier qualification and shop supervision",
      "Manufacturing quality surveillance",
      "Witnessed Factory Acceptance Tests",
      "Logistics and delivery coordination",
    ],
    services: [
      "manufacturing-fabrication",
      "quality-assurance-factory-acceptance-testing",
    ],
  },
  {
    id: "capital-project-delivery",
    title: "Complex Engineering, Construction & Installation Projects",
    industry: "Industrial",
    type: "Project Delivery",
    region: "Africa & North America",
    summary:
      "Delivery of complex engineering, manufacturing, construction and installation projects safely, on schedule and within budget for power-generation and industrial clients.",
    scope: [
      "Capital project planning and controls",
      "Construction management",
      "Contractor and vendor management",
      "Commissioning and hand-over",
    ],
    services: ["project-management", "engineering-technical-consulting"],
  },
] as const;

export const projectIndustries: readonly ProjectIndustry[] = [
  "Hydropower",
  "Manufacturing",
  "Industrial",
];

export const projectTypes: readonly ProjectType[] = [
  "Overhaul",
  "QA/QC",
  "Maintenance",
  "Manufacturing",
  "Project Delivery",
];

export const leadership = {
  title: "Engineering-led leadership",
  credentials: [
    "Chartered Mechanical Engineer (UK)",
    "Professional Engineer (Ghana)",
    "PMP-certified Project Manager",
  ],
  body: "The technical division of the company is led by a Chartered Mechanical Engineer (UK), Professional Engineer (Ghana) and PMP-certified Project Manager with several years of experience delivering complex engineering, manufacturing, refurbishment, maintenance and capital projects across Africa and North America.",
  lifecycle: [
    "Design and engineering",
    "Reverse engineering",
    "Manufacturing oversight",
    "Fabrication management",
    "Quality assurance",
    "Factory acceptance testing (FAT)",
    "Construction management",
    "Site installation",
    "Commissioning",
    "Project execution",
  ],
} as const;

export const globalNetwork = {
  title: "Global Manufacturing & Supply Chain Advantage",
  intro:
    "A unique advantage of Tekko Engineering Group is access to an established network of highly reputable manufacturing shops, foundries, machine shops, fabrication facilities and specialized repair centres across North America, Europe, Asia and Africa.",
  benefits: [
    "Source and manufacture critical replacement parts quickly and efficiently",
    "Access specialized foundries for castings, forgings and custom-engineered components",
    "Arrange refurbishment and repair of complex components that may not be repairable locally",
    "Obtain competitive pricing from qualified international suppliers",
    "Reduce procurement risks and manufacturing delays",
    "Access specialized manufacturing capabilities unavailable within Ghana",
    "Expedite emergency repairs and replacement parts for critical equipment",
    "Maintain quality oversight throughout the manufacturing and refurbishment process",
  ],
} as const;

export const clientValue = [
  "Engineering-led project execution",
  "High-quality manufacturing and refurbishment services",
  "Improved equipment reliability and asset life",
  "Reduced project and supplier risks",
  "Strong contractor and vendor management",
  "Independent technical and quality oversight",
  "Better cost and schedule control",
  "Safe and efficient project delivery",
] as const;

export const partnershipOfferings = [
  "Engineering consulting services",
  "Manufacturing of new equipment and components",
  "Refurbishment of existing equipment and parts",
  "Steel fabrication and structural works",
  "Mechanical installation services",
  "Quality assurance and inspection services",
  "Factory acceptance testing support",
  "General industrial and construction contracting services",
  "Project management and Owner's Engineer support",
] as const;

export const industries = [
  {
    slug: "hydropower",
    name: "Hydropower Generation",
    description:
      "Utilities and independent power producers operating hydroelectric stations across Africa.",
  },
  {
    slug: "mining",
    name: "Mining",
    description:
      "Mining companies requiring fabrication, component refurbishment and shutdown project delivery.",
  },
  {
    slug: "epc",
    name: "EPC Contractors",
    description:
      "Engineering, procurement and construction contractors seeking Owner's Engineer and QA/FAT support.",
  },
  {
    slug: "industrial",
    name: "Industrial & Infrastructure",
    description:
      "Plant operators and project developers modernizing critical mechanical and structural assets.",
  },
] as const;

export const stats = [
  { value: "5", label: "Countries in manufacturing network" },
  { value: "2", label: "Continents of project delivery" },
  { value: "9", label: "Specialized service lines" },
  { value: "100%", label: "Engineering-led execution" },
] as const;
