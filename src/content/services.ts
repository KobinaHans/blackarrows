export type ServiceSector = "hydropower" | "industrial";

export type ServiceIcon =
  | "turbine"
  | "drafting"
  | "scan"
  | "cog"
  | "hardhat"
  | "clipboard"
  | "factory"
  | "gantt"
  | "shield";

export interface Service {
  slug: string;
  sector: ServiceSector;
  title: string;
  shortTitle: string;
  icon: ServiceIcon;
  summary: string;
  description: string;
  capabilities: readonly string[];
  outcomes: readonly string[];
  keywords: readonly string[];
}

export const sectors: Record<
  ServiceSector,
  { label: string; title: string; description: string }
> = {
  hydropower: {
    label: "Hydropower",
    title: "Hydropower Services",
    description:
      "Rehabilitation, modernization, reverse engineering, precision component supply and field support for hydroelectric generating stations.",
  },
  industrial: {
    label: "Other Industries",
    title: "Mining, Industrial & Infrastructure",
    description:
      "Engineering consulting, manufacturing, fabrication, project management and QA/FAT services for mining, power and industrial operators.",
  },
};

export const services: readonly Service[] = [
  {
    slug: "hydropower-rehabilitation-modernization",
    sector: "hydropower",
    title: "Hydropower Rehabilitation & Modernization",
    shortTitle: "Rehabilitation & Modernization",
    icon: "turbine",
    summary:
      "Turbine, generator-auxiliary and mechanical system overhauls that extend unit life and restore design performance.",
    description:
      "We plan and execute rehabilitation and modernization programmes for hydroelectric generating units, from scoping and condition assessment through outage execution and recommissioning. Our engineering-led approach combines OEM-grade manufacturing partners with hands-on site leadership to return units to service safely, on schedule and within budget.",
    capabilities: [
      "Turbine and auxiliary equipment rehabilitation",
      "Mechanical system overhauls",
      "Life-extension and modernization projects",
      "Outage planning and execution support",
    ],
    outcomes: [
      "Restored efficiency and output on ageing units",
      "Reduced forced-outage rates and unplanned downtime",
      "Extended asset life with predictable capital planning",
    ],
    keywords: [
      "hydropower rehabilitation",
      "turbine overhaul",
      "hydro modernization Ghana",
      "unit life extension",
    ],
  },
  {
    slug: "hydropower-engineering-technical-consultancy",
    sector: "hydropower",
    title: "Engineering & Technical Consultancy (Hydropower)",
    shortTitle: "Engineering & Technical Consultancy",
    icon: "drafting",
    summary:
      "Mechanical design, technical audits, condition assessments and Owner's Engineer support for hydropower owners and operators.",
    description:
      "Our consultancy team supports utilities and independent power producers with independent, engineering-led advice across the asset lifecycle. We deliver mechanical design packages, technical audits and condition assessments, and provide project, construction, procurement and quality management support as an extension of your own team.",
    capabilities: [
      "Mechanical engineering design",
      "Technical audits and condition assessments",
      "Project and construction management",
      "Procurement and quality management support",
    ],
    outcomes: [
      "Independent technical oversight of contractors and OEMs",
      "Defensible capital and maintenance decisions",
      "Reduced procurement and execution risk",
    ],
    keywords: [
      "hydropower consultancy",
      "owner's engineer",
      "condition assessment",
      "technical audit",
    ],
  },
  {
    slug: "reverse-engineering-obsolescence",
    sector: "hydropower",
    title: "Reverse Engineering & Obsolescence Solutions",
    shortTitle: "Reverse Engineering",
    icon: "scan",
    summary:
      "3D scanning, CAD reconstruction and manufacturing drawings for obsolete, unavailable or undocumented components.",
    description:
      "When OEM support has ended or drawings no longer exist, we recover the design intent. Using 3D scanning and dimensional verification we reconstruct accurate CAD models and manufacturing drawings, then manufacture fit-for-purpose replacements through our qualified international supply network.",
    capabilities: [
      "3D scanning and dimensional verification",
      "CAD reconstruction and manufacturing drawings",
      "Replacement of obsolete or unavailable components",
    ],
    outcomes: [
      "Eliminate single-source and OEM lock-in risk",
      "Shorter lead times for critical spares",
      "Complete, ownable technical documentation",
    ],
    keywords: [
      "reverse engineering",
      "3D scanning",
      "obsolete parts",
      "CAD reconstruction",
    ],
  },
  {
    slug: "component-manufacturing-supply",
    sector: "hydropower",
    title: "Component Manufacturing & Supply",
    shortTitle: "Component Manufacturing",
    icon: "cog",
    summary:
      "Precision-manufactured bearings, wicket gate components, wear rings, shaft sleeves and custom machined parts to international standards.",
    description:
      "Through strategic partnerships with manufacturing shops, foundries and machine shops in Canada, Italy, Turkey, India and Ghana we supply high-quality precision components for hydro turbines and auxiliary systems, with quality oversight maintained from raw material to delivery.",
    capabilities: [
      "Bearings and bearing components (Babbitt, PTFE and wood bearings)",
      "Wicket gate bushings (including greaseless bushings), pins, links and levers",
      "Wear rings, shaft sleeves and sealing components",
      "Custom machined and fabricated parts",
    ],
    outcomes: [
      "OEM-equivalent quality at competitive pricing",
      "Access to specialized foundries and machine shops",
      "Expedited emergency spares for critical equipment",
    ],
    keywords: [
      "babbitt bearings",
      "wicket gate bushings",
      "greaseless bushings",
      "wear rings",
      "shaft sleeves",
    ],
  },
  {
    slug: "field-services-quality-assurance",
    sector: "hydropower",
    title: "Field Services & Quality Assurance",
    shortTitle: "Field Services & QA",
    icon: "hardhat",
    summary:
      "Site inspections, installation supervision, QC inspection and maintenance and reliability support at the plant.",
    description:
      "Our field engineers bring international hydro experience directly to your powerhouse. We conduct site inspections and technical assessments, supervise installation and alignment, provide quality control and inspection services, and support maintenance and reliability programmes.",
    capabilities: [
      "Site inspections and technical assessments",
      "Installation supervision",
      "Quality control and inspection services",
      "Maintenance and reliability support",
    ],
    outcomes: [
      "Right-first-time installation and commissioning",
      "Verified workmanship against specification",
      "Improved reliability KPIs and maintenance planning",
    ],
    keywords: [
      "installation supervision",
      "site inspection",
      "hydro field services",
      "reliability support",
    ],
  },
  {
    slug: "engineering-technical-consulting",
    sector: "industrial",
    title: "Engineering & Technical Consulting",
    shortTitle: "Engineering Consulting",
    icon: "drafting",
    summary:
      "Mechanical design and review, reverse engineering, technical specifications and equipment condition assessments for industrial clients.",
    description:
      "We provide mechanical engineering design and independent design review for mining, power and industrial operators. Our team reverse-engineers obsolete or damaged components, develops procurement-ready technical specifications, and performs equipment condition assessments that drive sound maintenance and capital decisions.",
    capabilities: [
      "Mechanical engineering design and review",
      "Reverse engineering of obsolete or damaged components",
      "Technical specification development",
      "Equipment condition assessments",
    ],
    outcomes: [
      "Clear, enforceable specifications for suppliers",
      "Lower technical risk on new and replacement equipment",
      "Objective asset condition data for planning",
    ],
    keywords: [
      "mechanical engineering consulting",
      "technical specification",
      "condition assessment",
      "design review",
    ],
  },
  {
    slug: "manufacturing-fabrication",
    sector: "industrial",
    title: "Manufacturing & Fabrication Services",
    shortTitle: "Manufacturing & Fabrication",
    icon: "factory",
    summary:
      "New component manufacture, refurbishment, structural steel and platework fabrication with full manufacturing quality surveillance.",
    description:
      "From new mechanical and structural components to the refurbishment of worn or damaged equipment, we execute manufacturing and fabrication contracts through qualified shops in Africa, North America, Europe and Asia. We supervise the shop floor, qualify suppliers and monitor performance so that quality is engineered in, not inspected in.",
    capabilities: [
      "Manufacturing of new mechanical and structural components",
      "Refurbishment and rebuilding of worn or damaged equipment components",
      "Fabrication of steel structures and industrial equipment",
      "Structural steel fabrication and installation",
      "Platework and custom fabrication",
      "Manufacturing quality surveillance and inspection",
      "Supplier qualification and performance monitoring",
      "Shop supervision and production management",
    ],
    outcomes: [
      "Components manufactured to international standards",
      "Reduced manufacturing delays and rework",
      "Traceable quality records for every deliverable",
    ],
    keywords: [
      "steel fabrication Ghana",
      "component manufacturing",
      "equipment refurbishment",
      "platework",
    ],
  },
  {
    slug: "project-management",
    sector: "industrial",
    title: "Project Management",
    shortTitle: "Project Management",
    icon: "gantt",
    summary:
      "PMP-led capital project planning, execution, recovery and shutdown management with rigorous cost, schedule and risk control.",
    description:
      "Led by a PMP-certified Project Manager with a track record across Africa and North America, we plan and deliver capital, shutdown and modernization projects. We manage contractors and vendors, control cost, schedule and risk, and prepare technical proposals and project documentation to the standard expected by lenders and boards.",
    capabilities: [
      "Capital project planning and execution",
      "Project recovery",
      "Shutdown and maintenance project management",
      "Equipment replacement and modernization projects",
      "Contractor and vendor management",
      "Cost, schedule, and risk management",
      "Technical proposal preparation and project documentation",
    ],
    outcomes: [
      "Projects delivered safely, on schedule and within budget",
      "Distressed projects recovered with a credible path to completion",
      "Transparent reporting for owners and financiers",
    ],
    keywords: [
      "project management Ghana",
      "shutdown management",
      "project recovery",
      "owner's engineer",
    ],
  },
  {
    slug: "quality-assurance-factory-acceptance-testing",
    sector: "industrial",
    title: "Quality Assurance & Factory Acceptance Testing",
    shortTitle: "QA & Factory Acceptance Testing",
    icon: "shield",
    summary:
      "QA/QC programme development (ITPs, NCRs), manufacturing audits, independent surveillance and witnessed Factory Acceptance Tests.",
    description:
      "We build and implement QA/QC programmes including Inspection and Test Plans and Non-Conformance Report processes, audit manufacturers and assess supplier quality systems, and provide independent quality surveillance and witnessed Factory Acceptance Testing so equipment arrives on site right the first time.",
    capabilities: [
      "Development and implementation of QA/QC programs (including ITPs and NCRs)",
      "Manufacturing audits and supplier quality assessments",
      "Independent quality surveillance",
      "Factory Acceptance Test",
    ],
    outcomes: [
      "Non-conformances caught at source, not on site",
      "Documented, auditable acceptance of every package",
      "Reduced commissioning delays and warranty disputes",
    ],
    keywords: [
      "factory acceptance testing",
      "QA/QC program",
      "ITP",
      "supplier audit",
    ],
  },
] as const;

export function getService(
  slug: string | undefined | null,
): Service | undefined {
  if (!slug) return undefined;
  return services.find((s) => s.slug === slug);
}

export function getServicesBySector(sector: ServiceSector): Service[] {
  return services.filter((s) => s.sector === sector);
}

export function getRelatedServices(service: Service, limit = 3): Service[] {
  const same = services.filter(
    (s) => s.sector === service.sector && s.slug !== service.slug,
  );
  const other = services.filter((s) => s.sector !== service.sector);
  return [...same, ...other].slice(0, limit);
}
