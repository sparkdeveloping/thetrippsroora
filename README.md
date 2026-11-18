# The Letter Home — V6, The Heirloom Edition

Natalie and Jordan's roora invitation, December 1, 2027, Zimbabwe. This release preserves the approved photographs, family narrative, olive/ivory/chocolate palette, and invitation-based reply service.

## Run

Use Node 22 or newer. Dependencies are intentionally excluded from source downloads.

```sh
npm ci
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1
```

`ROORA_DEMO_MODE=1` enables `DEMO2027`. Demo replies are simulated in memory; the invitation, RSVP and organizer API routes all reject live service access. `ALLOW_DEMO=1` is honored only in development. Leave the hosted review in demo mode.

## Check the actual application

```sh
npm test
npm run assets
ROORA_DEMO_MODE=1 npm run build
npm run test:production
npm run test:performance
```

The production test starts and stops a real Next.js server. Performance testing additionally needs a working Chromium installation (`CHROME_PATH`); see the release report for this environment's launcher restriction. Browser QA uses the deployed Next.js application, not a standalone HTML imitation.

On a demo deployment, append `?qa=1`, open the invitation, then expand **Release QA**. Its explicit controls inspect reversible scene positions, run browser regressions and axe, and collect local-only timing observations. They do not send telemetry or store guest information. The QA bundle, including axe, is loaded only on this explicit demo URL. Ordinary guests never see these controls. Frame intervals are laboratory observations, not physical-device or GPU presentation measurements.

## Architecture

- `app/page.js` renders trusted, static invitation markup. No submitted content enters its HTML template.
- `app/Experience.js` owns a single React effect and disposes it on unmount.
- `src/experience/` separates envelope, navigation, native-scroll choreography, gallery, media, reply state, and shared spring/lifecycle helpers.
- `app/styles/` owns foundation, materials, chapters, controls, and cinematic alternatives. `globals.css` contains imports only.
- `app/api/` performs validation and calls the existing Supabase RPC contracts. Secrets remain server-side.
- `db/schema.sql` defines access restrictions, durable rate limits, one response per invitation, locked updates and idempotent receipts.

## Media

All six approved originals are committed. `public/media/originals.json` records their SHA-256 hashes. Twenty color-preserving crops are committed under `public/media/looks/`; their exact crop rectangles and source hashes are in `manifest.json`. `npm run looks` reproducibly regenerates them with the locked Sharp version. Both original boards remain available in the accessible native dialog. Build validation refuses a missing, altered, or undecodable required image. No remote image importer is needed.

Photography illustrates the relationship; it is not presented as documentary evidence of the meeting or engagement dates. The golden family thread is an original editorial metaphor, not a claimed traditional symbol.

## Hosting and organizer setup

The `final-polish/v6-heirloom` branch is for review. Do not merge or promote until the remaining release gates are closed. The production V5 deployment and original Netlify site are preserved. See [organizer instructions](docs/ORGANIZER.md), [motion and design system](docs/DESIGN-MOTION.md), [audit register](docs/AUDIT-REGISTER.md), and [release report](docs/RELEASE-REPORT.md).

The envelope is a visual gate. Files under `public/` and general invitation copy are publicly addressable. Exact venue details and guest records must remain server-side. No confidential address or unapproved ceremony time has been added.
