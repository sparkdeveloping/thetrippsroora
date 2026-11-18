# Hosting and organizer guide

## Review safely

Use the dedicated V6 branch preview with `DEMO2027`. The preview branch has a scoped `ROORA_DEMO_MODE=1` variable in Vercel. The production setting has not been changed. A demo reply never calls Supabase, and every live API route rejects requests while demo mode is enabled.

The original Netlify site is untouched. Do not promote this preview or populate real invitations until the family decisions and physical-device checks in the release report are complete.

## Prepare an isolated live-service rehearsal

The repository's PostgreSQL test runs the real schema in isolated PGlite. It checks allowances, idempotent receipts, update restrictions and denied public access. The live integration suite additionally sends actual Next.js HTTP requests through a local Supabase-shaped RPC transport into this database, covering acceptance, decline, retries, simultaneous HTTP requests and organizer authorization. This is isolated integration evidence, not a hosted Supabase or multi-connection database concurrency rehearsal.

For a family-approved isolated Supabase project, apply `db/schema.sql` as its owner. Set server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `INVITATION_PEPPER` (at least 32 random characters), and `ADMIN_TOKEN` (at least 32 random characters). Never prefix them `NEXT_PUBLIC_`. Keep demo mode enabled on ordinary reviews; enable live behavior only in the approved isolated rehearsal environment. Do not copy real guest records into a test project.

Use `scripts/create-invitation.mjs` with the approved guest allowance. The pepper must stay stable because codes are stored only as HMAC hashes. Verify create, acceptance, decline, safe retry, disallowed updates, disabled code, oversize allowance, rate limits, and simultaneous requests before a real launch.

`/admin` accepts the organizer bearer token in memory. It is not a public guest list. Never paste a token into a URL, screenshot, commit, public log or client environment variable. Do not run the organizer export against production data merely to test the interface.

## Known family decisions

- Ceremony time and arrival instructions: to be announced.
- Exact homestead address: shared privately with confirmed guests.
- RSVP deadline: to be announced.
- Real invitation allowances and guest records: organizer configuration, not inferred by the app.
- Photography permission for broader promotional sharing: confirm before publishing the Reel.
- Guest-data retention and post-event deletion: agree a policy before launch.

The all-day calendar entry is December 1–2, 2027 (exclusive end), with no invented ceremony time. The countdown uses the current date in Africa/Harare. The public visual gate does not protect public images or general event copy; confidential information belongs behind server authorization.

## Release and rollback

Run `npm ci`, tests, asset validation, production build and actual-app QA from the proposed commit. Review both normal and `?qa=1` URLs. Keep the existing production alias on V5 until approved. After approval, merge the review branch through GitHub and promote only the verified deployment through the normal Vercel workflow. Rollback uses the previous Vercel production deployment; no database migration is introduced by V6.
