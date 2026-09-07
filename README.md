# TEKKO Engineering Group — Corporate Website

Flagship B2B web presence for **TEKKO Engineering Group**, a Ghana-based,
Africa-focused engineering and hydropower solutions company. The site presents
every service line from the company business description, showcases project
experience, and captures qualified leads through a validated, rate-limited
contact form.

Built with Next.js 14 (App Router), strict TypeScript, Tailwind CSS,
shadcn/ui-style primitives and Framer Motion.

---

## Contents

1. [Quick start](#quick-start)
2. [Environment variables](#environment-variables)
3. [Scripts](#scripts)
4. [Architecture](#architecture)
5. [Content model](#content-model)
6. [Route map](#route-map)
7. [Lead capture & security](#lead-capture--security)
8. [SEO](#seo)
9. [Performance & accessibility](#performance--accessibility)
10. [Quality gates](#quality-gates)
11. [Deployment](#deployment)
12. [Editing content](#editing-content)

---

## Quick start

Requirements: **Node.js 20+** (tested on 20 and 24) and npm 10+.

```bash
git clone https://github.com/KobinaHans/blackarrows.git
cd blackarrows
git checkout Tekko-Website

npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Environment variables

Copy `.env.example` to `.env.local`. Only variables prefixed with
`NEXT_PUBLIC_` are exposed to the browser; everything else stays server-side.

| Variable                     | Required   | Purpose                                                                                    |
| ---------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`       | yes (prod) | Canonical origin used for `metadataBase`, sitemap, robots, JSON-LD and OG URLs.            |
| `NEXT_PUBLIC_CONTACT_EMAIL`  | no         | Public email shown in header/footer/contact page. Defaults to `info@tekkoengineering.com`. |
| `NEXT_PUBLIC_CONTACT_PHONE`  | no         | Public phone number (omit to hide).                                                        |
| `NEXT_PUBLIC_ADDRESS_STREET` | no         | Street address for footer + `LocalBusiness` schema.                                        |
| `NEXT_PUBLIC_ADDRESS_CITY`   | no         | Defaults to `Accra`.                                                                       |
| `NEXT_PUBLIC_ADDRESS_REGION` | no         | Defaults to `Greater Accra`.                                                               |
| `NEXT_PUBLIC_LINKEDIN_URL`   | no         | Company LinkedIn page (omit to hide the icon).                                             |
| `RESEND_API_KEY`             | yes (prod) | Server-only. Resend API key used to deliver contact-form leads.                            |
| `CONTACT_TO_EMAIL`           | yes (prod) | Inbox that receives leads.                                                                 |
| `CONTACT_FROM_EMAIL`         | yes (prod) | Verified Resend sender, e.g. `TEKKO Website <noreply@tekkoengineering.com>`.               |
| `RATE_LIMIT_MAX`             | no         | Max submissions per IP per window. Default `5`.                                            |
| `RATE_LIMIT_WINDOW_SECONDS`  | no         | Window length. Default `600`.                                                              |

In development, if `RESEND_API_KEY` is missing the form still validates and
succeeds; the lead is logged to the server console instead of emailed. In
production a missing key returns a friendly error and never leaks details.

## Scripts

| Command                | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server.                                                       |
| `npm run build`        | Production build (`next build`). Fails on any TS/lint error.                |
| `npm start`            | Serve the production build.                                                 |
| `npm run typecheck`    | `tsc --noEmit` with `strict` + `noUncheckedIndexedAccess`.                  |
| `npm run lint`         | ESLint (`next/core-web-vitals`, `next/typescript`) with `--max-warnings=0`. |
| `npm run format`       | Prettier write (with Tailwind class sorting).                               |
| `npm run format:check` | Prettier check.                                                             |

## Architecture

```
src/
├─ app/                      # App Router: routes, metadata, error boundaries
│  ├─ layout.tsx             # Root layout: fonts, providers, header/footer, Organization JSON-LD
│  ├─ page.tsx               # Home
│  ├─ services/              # Services overview + /services/[slug] (SSG)
│  ├─ about/ industries/ projects/ contact/ privacy/ terms/
│  ├─ contact/actions.ts     # Server Action: validation, rate limit, honeypot, Resend
│  ├─ error.tsx global-error.tsx not-found.tsx loading.tsx
│  ├─ sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
│  └─ globals.css            # Design tokens (CSS variables), light/dark, reduced motion
├─ components/
│  ├─ ui/                    # shadcn-style primitives (Button, Card, Input, Sheet, Accordion…)
│  ├─ layout/                # Header (responsive nav), Footer, Logo, ThemeToggle
│  ├─ motion/                # Reveal/Stagger (scroll), Entrance (CSS), PageTransition, MotionProvider
│  ├─ sections/              # Page sections (Hero, ServicesOverview, ProjectGallery, ContactForm…)
│  └─ json-ld.tsx page-hero.tsx service-icon.tsx providers.tsx
├─ content/                  # Single source of truth for all copy (typed, from the business description)
│  ├─ site.ts                # Company identity, contact, nav, network, client types
│  ├─ services.ts            # 9 service lines: capabilities, outcomes, keywords, sector
│  └─ company.ts             # Leadership, projects, industries, stats, partnership offerings
└─ lib/
   ├─ seo.ts                 # buildMetadata() helper (canonical, OG, Twitter, robots)
   ├─ structured-data.ts     # Organization / ProfessionalService / Service / Breadcrumb schema
   ├─ contact-schema.ts      # Zod schema shared by client form and server action
   ├─ rate-limit.ts          # In-memory sliding-window limiter
   ├─ env.ts                 # Typed server env access
   └─ utils.ts               # cn(), absoluteUrl()
public/images/               # Local, optimised artwork rendered via next/image
scripts/generate-images.py   # Reproducible generator for the artwork (Pillow)
```

### Key decisions

- **Content-as-data.** All copy lives in `src/content/*.ts` as strongly typed
  objects. Pages iterate over the data, so adding a service means adding one
  object — the overview grid, detail page, sitemap, footer links, contact-form
  select and JSON-LD all update automatically.
- **Static by default.** Every marketing page is prerendered at build time
  (`/services/[slug]` uses `generateStaticParams` with `dynamicParams = false`).
  Only `/contact` is dynamic because it hosts the Server Action.
- **No hidden-before-hydration content.** Scroll reveals render visible on the
  server and only animate elements that are _below_ the fold on mount; the hero
  uses a CSS-only `Entrance` animation. This keeps LCP low and makes the site
  usable without JavaScript. `MotionConfig reducedMotion="user"` plus a CSS
  fallback honour `prefers-reduced-motion`.
- **Defensive rendering.** Content lookups return `undefined` rather than
  throwing; routes call `notFound()`; every optional field is accessed with `?.`
  and a fallback; `noUncheckedIndexedAccess` is on. Route-level `error.tsx` and
  `global-error.tsx` boundaries catch anything that slips through.
- **shadcn/ui pattern, vendored.** Primitives live in `src/components/ui` and
  are built on Radix UI + `class-variance-authority`, so they are fully owned
  and themeable via CSS variables.
- **Design system.** Industrial palette (deep navy "steel" scale + amber
  safety accent) defined once as HSL CSS variables in `globals.css`, exposed
  through Tailwind semantic tokens, with class-based dark mode via
  `next-themes`.

## Content model

`src/content/services.ts` — 9 service lines grouped into two sectors:

| Sector     | Slug                                           |
| ---------- | ---------------------------------------------- |
| Hydropower | `hydropower-rehabilitation-modernization`      |
| Hydropower | `hydropower-engineering-technical-consultancy` |
| Hydropower | `reverse-engineering-obsolescence`             |
| Hydropower | `component-manufacturing-supply`               |
| Hydropower | `field-services-quality-assurance`             |
| Industrial | `engineering-technical-consulting`             |
| Industrial | `manufacturing-fabrication`                    |
| Industrial | `project-management`                           |
| Industrial | `quality-assurance-factory-acceptance-testing` |

Each `Service` has `title`, `summary`, `description`, `capabilities[]`,
`outcomes[]`, `keywords[]`, `icon` and `sector`. Helpers: `getService(slug)`,
`getServicesBySector(sector)`, `getRelatedServices(service)`.

`src/content/company.ts` holds `projects` (filterable by `industry` and
`type`), `leadership`, `globalNetwork`, `industries`, `stats`,
`partnershipOfferings` and `clientValue`.

## Route map

| Route                                                                                   | Rendering | Notes                                                                        |
| --------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `/`                                                                                     | Static    | Hero, industries strip, services, stats, network, experience, why TEKKO, CTA |
| `/services`                                                                             | Static    | Sector-grouped service grid                                                  |
| `/services/[slug]`                                                                      | SSG       | `generateMetadata`, Service + Breadcrumb JSON-LD, related services           |
| `/about`                                                                                | Static    | Heritage, mission, leadership, network, values                               |
| `/industries`                                                                           | Static    | Client segments served                                                       |
| `/projects`                                                                             | Static    | Filterable experience gallery (industry × type)                              |
| `/contact`                                                                              | Dynamic   | RHF + Zod form → Server Action                                               |
| `/privacy`, `/terms`                                                                    | Static    | Legal                                                                        |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg` | Static    | Generated by route handlers                                                  |

## Lead capture & security

- **Validation** — one Zod schema (`src/lib/contact-schema.ts`) is used by
  `react-hook-form` on the client and re-run inside the Server Action, so the
  server never trusts the browser.
- **Honeypot** — a visually hidden `website` field; bots that fill it get a
  fake success and nothing is sent.
- **Rate limiting** — sliding window per client IP (`x-forwarded-for` /
  `x-real-ip`), default 5 requests / 10 minutes. The limiter is in-memory and
  therefore per-instance; for multi-instance or serverless deployments swap
  `src/lib/rate-limit.ts` for a shared store (Upstash Redis, Vercel KV).
- **Email** — sent via Resend from the server only. User input is HTML-escaped
  before templating. The API key is never referenced in client code.
- **Headers** — HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy` and `Permissions-Policy` are set in `next.config.mjs`;
  `X-Powered-By` is disabled.

## SEO

- `buildMetadata()` gives every page a title template, description, canonical
  URL, Open Graph and Twitter cards; service pages use `generateMetadata`.
- JSON-LD: `Organization` / `LocalBusiness` / `ProfessionalService` + `WebSite` on
  every page, `Service` and `BreadcrumbList` on service pages.
- `sitemap.ts` and `robots.ts` are generated from the content model.
- A branded Open Graph image is rendered at build time with `next/og`.

## Performance & accessibility

Lighthouse 12 against the production build (`npm run build && npm start`),
default mobile throttling:

| Page                           | Perf | A11y | Best Practices | SEO |
| ------------------------------ | ---- | ---- | -------------- | --- |
| `/`                            | 99   | 100  | 100            | 100 |
| `/services`                    | 95   | 100  | 100            | 100 |
| `/services/project-management` | 95   | 100  | 100            | 100 |
| `/about`                       | 97   | 100  | 100            | 100 |
| `/projects`                    | 95   | 100  | 100            | 100 |
| `/industries`                  | 96   | 100  | 100            | 100 |
| `/contact`                     | 95   | 100  | 100            | 100 |

Desktop preset: 100 / 100 / 100 / 100 on all audited pages. CLS is 0 on every
page (all images have explicit aspect ratios via `fill` + sized containers).

Accessibility features: skip link, semantic landmarks, focus-visible rings,
keyboard-operable mobile sheet and filter radiogroups, `aria-live` result
counts, form errors linked via `aria-describedby`, AA contrast in both themes.

## Quality gates

- `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`,
  `noFallthroughCasesInSwitch`.
- ESLint: `next/core-web-vitals` + `next/typescript` + `prettier`, zero
  warnings allowed (`--max-warnings=0`). Enforces inline `type` imports.
- Prettier with `prettier-plugin-tailwindcss`.
- Husky hooks (installed automatically by `npm install` via `prepare`):
  - `pre-commit` → `lint-staged` (ESLint fix + Prettier on staged files)
  - `commit-msg` → rejects messages that are not Conventional Commits
    (`feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`).

## Deployment

### Vercel (recommended)

1. Import the repository, select the `Tekko-Website` branch.
2. Framework preset: **Next.js** (auto-detected). Build command `npm run build`.
3. Add the environment variables from the table above (at minimum
   `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `CONTACT_FROM_EMAIL`).
4. In Resend, verify the sending domain used in `CONTACT_FROM_EMAIL`.
5. Deploy. Because Vercel functions are ephemeral, replace the in-memory
   rate limiter with Vercel KV / Upstash if strict limits are required.

### Self-hosted (Node)

```bash
npm ci
npm run build
NODE_ENV=production PORT=3000 npm start
```

Put the app behind a reverse proxy (nginx/Caddy) that forwards
`X-Forwarded-For` so rate limiting sees the real client IP. Point
`NEXT_PUBLIC_SITE_URL` at the public origin.

### Docker (optional)

Set `output: "standalone"` in `next.config.mjs` and use the official Next.js
Dockerfile pattern; copy `.next/standalone`, `.next/static` and `public`.

## Editing content

- **Add / change a service** → edit `src/content/services.ts`. The slug becomes
  the URL; the sitemap, nav, overview grid, detail page, footer, and contact
  select update automatically.
- **Add a project** → append to `projects` in `src/content/company.ts`, using
  existing `industry` / `type` values (or add new ones to the union types —
  the filters are derived from them).
- **Company details / contact** → `src/content/site.ts` or the corresponding
  `NEXT_PUBLIC_*` env variables.
- **Artwork** → replace files in `public/images/` (keep aspect ratios) or
  regenerate with `python3 scripts/generate-images.py` (requires Pillow).
