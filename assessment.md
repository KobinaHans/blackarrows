# Site assessment and upgrade report

Assessment date: 13 September 2026. Scope: the TEKKO Engineering Group website as delivered (Next.js, single app, content in TypeScript files), measured against the company business description and enterprise expectations for a B2B engineering firm.

A snapshot of the original code is kept in `.backup/original-site-2026-09-13.tar.gz` (excluded from version control).

## Summary

The original site had a sound content model and good accessibility intentions, but it **did not build**, could not be managed without a developer, relied on placeholder artwork, and had several security and scalability gaps that would block an enterprise deployment. All findings below are resolved in this release.

| Area | Rating before | Rating after |
| --- | --- | --- |
| Build and dependency health | Failing | Passing, pinned, CI-enforced |
| Visual identity and artwork | Placeholder | Bespoke drawings, icon set, refined brand |
| Content management | Code edits only | Full console with roles, audit and publishing |
| Lead capture | Email only, lost on failure | Stored, pipeline-managed, exportable |
| Security | Basic headers | WAF, CSP, RBAC, 2FA, audit, origin verification |
| Scalability | Single instance only | Multi-replica, shared state in PostgreSQL |
| Operations | Manual | IaC for AWS and Azure, CI/CD, alarms, runbook |

## Findings

### 1. Build was broken (critical)

- `next@16` was installed while the code used Next 14 APIs: synchronous `headers()`, `params` and `searchParams`. `next build` failed at type checking in `contact/actions.ts`.
- React 18 was installed, but Next 16 requires React 19.
- The `lint` script used `next lint`, which Next 16 removed; no ESLint configuration file existed.
- The README described Husky hooks, Prettier configuration and `.env.example`, none of which were present.

**Resolution:** upgraded to React 19 and Next 16.3 with async request APIs, an ESLint 9 flat configuration, Prettier, `.env.example`, and a CI pipeline that fails on type, lint, test, migration or image-scan problems.

### 2. No way to manage the site (high)

All copy lived in `src/content/*.ts`. Adding a project, correcting a phone number or publishing a legal update needed a developer and a redeploy.

**Resolution:** a PostgreSQL-backed content model and the TEKKO Console: services, experience, industries, home/about/legal pages, company details, network locations, SEO defaults, announcement banner, media library, enquiries, team, audit log and system status. Changes appear on the website within seconds.

### 3. Enquiries could be lost (high)

The contact form only sent an email. If email delivery failed or was misconfigured, the enquiry was gone. There was no pipeline, assignment, reference number or export.

**Resolution:** every enquiry is stored first with a reference (e.g. `TEK-2026-00042`), consent timestamp and hashed IP. Email notification and an optional auto-reply are sent after the response. The console provides a status pipeline, priority, assignment, internal notes, activity history, CSV export and data-retention controls.

### 4. Rate limiting did not work across instances (medium)

The limiter was in memory, so each container had its own counter, and limits reset on every deploy.

**Resolution:** a PostgreSQL-backed fixed-window limiter shared by every replica, plus WAF rate limits at the edge. Console sign-in and two-factor attempts are limited in the database too.

### 5. Placeholder artwork and generic icons (medium)

The four images were Pillow-generated shapes: a fan, a bridge, a sun over rectangles and concentric circles. They did not depict hydropower equipment. Service icons were stock Lucide glyphs; hydropower used a "waves" icon.

**Resolution:**

- The hero is a meridional section drawing of a Francis turbine unit, in the style of a general-arrangement drawing. Numbered balloons call out the components TEKKO actually supplies: guide bearing (Babbitt and wood linings), shaft sleeve, the wicket gate assembly (gates, bushings, pins, links and levers), wear rings, runner and spiral casing. Each links to its service, and hovering the parts list highlights the part.
- A bespoke 16-icon engineering set: runner, wicket gate, split journal bearing, 3D scan, set square, hard hat, FAT record, I-section, schedule, inspection loupe, dam, mine headframe, tower crane, process plant, supply network and refurbishment.
- Supporting technical drawings: bearing end view, scan-to-CAD, steel portal frame and scheme section. These are shown wherever no project photograph has been uploaded yet.
- A dot-matrix network map plotting Ghana and the partner countries.
- Real project photographs can now be uploaded in the console and replace the drawings per service or project.

### 6. Design read as a template (medium)

Every section repeated an all-caps tracked eyebrow label, numbered "01/02" markers on content that is not a sequence, identical card grids, fade-in animations on every block, and a stats band with "100% engineering-led".

**Resolution:** a refined identity built from the equipment the company works on (penstock ink, babbitt amber, tailwater teal on a cool drafting ground) and the Archivo variable typeface, whose width axis gives semi-expanded engineering headings. Services became a scannable register. Numbering is used only for genuine sequences (the lifecycle, drawing balloons). The call to action is a drawing title block with contact particulars. There is one orchestrated motion moment (the drawing), and reduced-motion preferences are respected. Unsubstantiated statistics were replaced with verifiable facts.

### 7. Content accuracy (low)

- The network was described inconsistently: "Ghana, Canada, Italy, and India" in one place, five countries including Turkey in another. The site now uses one consistent list, confirmed by the client in September 2026: Ghana, Italy, Turkey and India.
- The hero headline repeated the tagline rather than stating the client benefit.
- Each service now has questions and answers drawn from the business description, marked up as `FAQPage` structured data.

### 8. Security gaps (medium)

- No Content-Security-Policy.
- No protection against direct access to origins that bypasses the CDN.
- No audit trail and no role separation, because there was no admin.

**Resolution:** see the Security section of the README. It includes a CSP on both apps with a per-request nonce in the console; origin-verification headers enforced at the load balancer and in the apps; RBAC; two-factor authentication; an audit log; upload type sniffing; and CSV formula-injection protection.

### 9. No deployment path for enterprise hosting (medium)

The README recommended Vercel, and a self-hosted setup would have lost rate limits and had no infrastructure definitions.

**Resolution:** a Dockerfile with standalone Next.js output and non-root images; Terraform for AWS and Bicep for Azure, both in the African region closest to Ghana; zero-downtime deploys with automatic rollback; managed database backups; alarms; and a scheduled retention job.

## Retained strengths

- Content model derived faithfully from the business description (nine service lines, five experience entries, four industries).
- Accessibility foundations: skip link, landmarks, focus rings, labelled form errors and radiogroup filters. All are kept and extended.
- Structured data for Organization, Service and BreadcrumbList. It is kept and extended with FAQPage.

## Items for TEKKO to supply

- Real project and workshop photographs, with permission to publish.
- A confirmed phone number, street address and LinkedIn page, entered under Site settings.
- Legal review of the privacy policy and terms (Ghana Data Protection Act, 2012).
- The email sending domain (SES, Azure Communication Services or Microsoft 365) and SPF, DKIM and DMARC records.
- A decision on AWS or Azure as the primary cloud (both are supported) and the DNS provider.
