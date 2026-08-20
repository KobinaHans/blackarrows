# BlueChip Card Issuance

Enterprise instant card issuance platform with an SAP Fiori-style UI. Covers instant issuance, card management, batch processing, printing & production, reports, analytics, administration, and configuration.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Recharts (dashboards & analytics)
- Lucide icons
- Oxlint

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
```

Sign in on the login screen with any e-mail/password (demo auth), pick a role and branch, and enter any 6-digit MFA code.

## Structure

```
src/
  features/        # route-level modules (auth, dashboard, issuance, cards, batch, printing, reports, analytics, admin, configuration)
  shared/
    components/    # AppShell layout + reusable UI primitives (Button, DataTable, Modal, Wizard, badges…)
    data/          # deterministic mock data
    types/         # domain types
```
