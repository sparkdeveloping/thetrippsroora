# The Letter Home — V5: The woven celebration

Three redesigned scenes replace V4.2's static heritage rings, date ticket and small attire contact sheets.

- Heritage: separately identified sage and champagne threads draw together, weave and resolve into the shared story. Pinned desktop composition and independently pinned mobile art. The motif is editorial, not a claim about a traditional Shona symbol.
- Calendar: actual Monday-first December 2027 grid, with Wednesday 1 highlighted; a scroll-driven transformation carries that date into a keepsake card. Countdown and practical details follow; the existing all-day calendar download is retained because ceremony time is not available.
- Lookbook: each original supplied reference board becomes ten individually framed styles. Source files are unchanged. CSS crops, horizontal native snapping, previous/next, keyboard controls and a direct scrubber; full board lightbox remains. The palette retains guest/parent/couple distinctions.
- Existing opening, album, navigation, demo/live RSVP and six bundled media assets retained.

## Deploy
Copy the source files over your existing project. Preserve local environment variables and existing Vercel configuration. Run `npm run assets`, `git add -f public/media/*.webp`, then `git add .`, commit and push. The original six WebP files must be tracked; build validation deliberately remains mandatory.

## Verification
Node unit tests and asset check pass. Standalone Chromium scene checks passed at desktop 1440x900, mobile 390x844 and 320x700, plus mobile reduced-motion. Physical iOS Safari, live database, and Next.js production build have not been verified in this environment.

---

# The Letter Home — V4.2 | Verified photograph and navigation repair

## Start here

All six original family-supplied WebP files are **already included** in `public/media/`. The old automatic import procedure is no longer necessary. `npm run assets` now validates the required local files without any network dependency; `npm run build` refuses to build if a required WebP is missing or invalid. Historical V4.1 instructions below are superseded wherever they refer to importing photos or optional build checks. The standalone preview embeds the original image bytes.

Copy this version into the existing repository, preserving `.env.local`, Vercel environment variables and Git metadata. Check that Git tracks all six assets:

```sh
npm install
npm run assets
git add .
git ls-files public/media/*.webp
npm test
git commit -m "Bundle original photography and fix chapter navigation"
git push
```

The final `git ls-files` result should show six WebP paths. The test deployment still uses `ROORA_DEMO_MODE=1` and code `DEMO2027`; leave this off for real guests and configure the existing Supabase integration. Files under `public/` are publicly addressable, regardless of the visual invitation gate. Family photographs are already on the original published site, but review permission before sharing a new public deployment. Do not put confidential venue information in public assets or HTML.

The chapter navigator is now a hanging bookmark, connected to a spring-responsive SVG thread, and its panel is anchored consistently beneath the button. Explicit hidden state and scoped CSS protect sealed/opening/replay states. Album imagery is requested as the verified invitation opens, rather than waiting until the guest scrolls. The existing motion engine remains unchanged for this maintenance release.

Verification in this release: all 6 uploaded images were decoded with Pillow (valid WebP); 10 Node tests passed; 4 Chromium photo/navigation configurations passed; 4 cinematic configurations and 3 opening/RSVP configurations passed. Browser checks use an embedded-asset standalone preview, not a Next.js deployment. No production deployment, physical phone, real database or frame-rate profiling was performed. To regenerate the preview locally, use `npm run preview`, then open `preview.html`. See `AUDIT.md` for the next-pass acceptance criteria.

---
Historical notes (superseded by the above for image handling and navigation):

# The Letter Home V4 — The Living Album

V4 replaces the old chapter menu and story layout with a pinned, reversible photo narrative. It retains the V3.1 invitation gate, hosted demo mode, RSVP backend and organizer dashboard. The earlier implementation notes below are historical where they conflict with this section.

## Start / deploy

```sh
npm install
npm run assets  # pulls the six approved originals from Netlify if accessible
npm run dev
```

`npm run build` automatically attempts the same asset import before `next build`; the asset import is optional at build time so a temporary Netlify failure does not stop deployment. For Vercel, keep `ROORA_DEMO_MODE=1` while testing; `DEMO2027` opens the invitation and simulates RSVPs. Set it to 0 and configure the real backend before inviting guests. Do not overwrite your existing environment secrets.

## Motion design

- One damped-spring model drives envelope tilt, the scroll control rig, and the magnetic navigation. It tracks position and velocity with an analytical, frame-rate-independent oscillator; no timer-based scroll hijacking.
- The letter is briefly pinned and recedes as the user scrolls. The opening flight uses compositor transforms with a restrained settling overshoot.
- The story is a single three-beat sticky stage. The scroll range holds the current memory, transitions to the next with coordinated rotation and offset, then holds again. It reverses naturally and releases at the end.
- The desktop heritage scene also uses a sticky runway; mobile heritage remains readable without locking the viewport. The existing event, fabric, RSVP and footer effects are preserved.
- The new named chapter dock uses a magnetic pointer response, compression on press, an expanding/collapsing chapter panel, Escape and outside-click dismissal, accessible anchor links and a reading-progress indicator. No hamburger or decorative emoji.
- OS reduced motion and the in-site motion toggle flatten the pinned album into a normal reading layout. Native scroll remains authoritative.

## Original images

See `public/media/README.md`. The original browser supplied the image descriptions for four couple images and two outfit boards, but stripped the actual image URLs. The sandbox cannot resolve the Netlify domain. No photo bytes are included. The importer matches the actual original image descriptions, validates same-origin URLs, and optimizes them with Sharp. If the page is client-rendered, use the documented browser manifest method. Successful imports are picked up automatically in both demo and live mode. The standalone preview embeds imported images when regenerated using `npm run preview`.

## Verification

- `npm test`: 10 passed (including mocked API, demo isolation, validation and exact-match asset parser).
- `python tests/browser-check.py`: three Chromium viewport configurations passed opening, attendance and replay tests.
- `python tests/cinematic-check.py`: four Chromium viewport configurations passed, including pinned position, all three beats, reverse scrolling, content bounds, chapter navigation and reduced-motion fallback.
- These are standalone preview browser tests, not a verified Next.js production build. Physical iOS/Safari motion, original-file downloads, real Web Vitals and Supabase integration remain unverified. The supplied project is not deployed to Vercel by this package.

---
## Previous implementation notes

# The Letter Home — Natalie & Jordan / V2 Cinematic Edition

An original, mobile-first Next.js invitation. The arrival is a material object, the opening is a continuous shift from envelope to letter, the story leads to cultural understanding, and the event details ultimately lead to a reply card. An accessible utility path bypasses the opening. This is a private invitation design, not a launched event.

## 1. Start immediately

Requires Node 20.9+ (Node 22 recommended). Download/extract the project. The ZIP is dependency-free source; install dependencies from the internet:

```bash
npm install
cp .env.example .env.local
# Optional demo mode for local dev only; set ALLOW_DEMO=1 in .env.local
npm run dev
```

Open `http://localhost:3000`. To exercise the demo RSVP, use `DEMO2027` (a simulated invitation with a two-person allowance). No data is sent or stored in demo mode. To generate a no-dependency HTML preview, run `npm run preview` and open `preview.html` in a browser. The preview contains the same markup, CSS and motion module as the real app. The demo intentionally uses placeholder monogram artwork even when local photograph files are installed.

```bash
npm test
npm run build
npm start
```

The container used to create the project could not reach the source site or npm registry; the Next dependency install, Next production build, real database migration and deployed application are **not verified**. Do not launch before completing the acceptance checks below. `npm test` works on Node alone; no package installation is required for these tests.

## 2. Product architecture

- `app/page.js`: Next server-rendered static invitation markup. `next/script` activates the isolated experience module after hydration. No client-side React rerendering inside that island; all changes are scoped DOM operations. `app/admin/page.js` is a React client component.
- `src/markup.mjs`: single trusted static markup source; no untrusted values interpolated into HTML. Editorial copy and dates live here. No database record is interpolated into HTML.
- `app/globals.css`: original visual system, material simulation, responsive layout, focus states and reduced motion.
- `public/experience.js`: envelope interaction state, Web Animations API, device orientation progressive enhancement, visually continuous letter proxy handoff, scroll progress, reversible scroll-synchronized cinematic engine, tab keyboard support, colors, lookbook dialog, countdown, RSVP controller. Uses sessionStorage only for the non-sensitive opening preference. Form fields/code remain in memory/DOM.
- `app/api`: server-side RSVP verification, submission and organizer snapshot, strict input checking and no-store JSON responses.
- `src/server.mjs`: HMAC-based code lookup, persistent DB rate-limit RPC, server-only service credentials, timeouts, body-size limits.
- `db/schema.sql`: invitations, one response per invitation, retry receipts, rate buckets, RLS, service-role-only RPCs. Locking the invitation row serializes changes; idempotency keys protect retries. Receipt payloads are hashed, not duplicated as plaintext.
- `scripts/create-invitation.mjs`: cryptographically random invitation codes and SQL inserts. `scripts/import-assets.mjs`: optional public HTML asset candidate import, for manual review and permission checks.
- `tests`: Node validation and mocked route-contract checks. `tests/browser-check.py`: Chromium interaction checks against the generated HTML (not a Next deployment test).

## 3. Decisions made for this implementation

This version uses CSS 3D layered paper and the Web Animations API, not WebGL/Three.js/GSAP. That is intentional: the interaction requires a single envelope and a letter; dependency-free rendering makes it possible to exercise the same motion in the standalone preview, and avoids a mandatory GPU/asset download. The handoff uses an expanding visual card proxy that fades into the real semantic HTML letter, not a literal WebGL mesh or exact geometry-matched FLIP transformation. Test this on physical phones. If a later look-dev pass requires custom materials, a heavier 3D scene can replace the envelope only without changing the guest flow or server.

The site uses Georgia and Arial fallback typography, not remotely fetched fonts. Add licensed local WOFF2 assets and tune spacing if the family approves Cormorant Garamond / Manrope. The visual identity retains the original olive, ivory, champagne, sage and chocolate palette. The envelope uses warm paper rather than duplicating the original cowhide. The copy and graphic motifs are proposals for family approval. The day/countdown is a calendar date in Africa/Harare; no ceremony time is invented. Calendar download is an all-day save-the-date, not a timed schedule.

The original page's narrative, roora explanation, location privacy, attire guidance, RSVP data and event date are represented. Original photographs/boards could not be retrieved; see `public/media/README.md`. The third couple portrait and closing portrait are not rendered in this first implementation. The heritage artwork is abstract, not a fictional homestead. No stock couple photos, unapproved music, or made-up family traditions.

No emails are collected in the original RSVP, so this version intentionally gives an on-screen reference and organizer dashboard rather than silently adding an email address field or sending email. A Resend integration and automated private location delivery should follow an approved contact and privacy policy. The organizer dashboard uses a strong single shared server-side token rather than Supabase Auth; for multiple organizers, replace it with authenticated per-user roles, audit logs, and a proper sign-out. The public invitation is not an access-controlled site: noindex is not authentication. Photos and public copy must be approved for this publication model. Exact venue details remain absent from public and guest UI until the family supplies a secure delivery policy.

## 4. Production setup

1. Create a fresh Supabase project; run `db/schema.sql` in the SQL editor. Inspect generated grants and RLS. The SQL is written for Supabase Postgres; test it in a disposable project first. Do not run unreviewed migrations on an existing event database.
2. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `INVITATION_PEPPER`, `ADMIN_TOKEN` as server-side environment secrets. Generate each secret independently, e.g. `openssl rand -hex 32`. Never use NEXT_PUBLIC_ for any of these. Keep the pepper stable; changing it invalidates existing invitation codes. Keep `ALLOW_DEMO=0` in production; production builds ignore ALLOW_DEMO even if set to 1. ROORA_DEMO_MODE=1 explicitly enables a hosted visual demo, disables live APIs, and must not be used for real guests.
3. Generate invitations locally with a matching pepper:
   ```bash
   node --env-file=.env.local scripts/create-invitation.mjs "Household display label" 2
   ```
   Run the emitted SQL insert in Supabase. Share the random code privately. Do not distribute the hashes, service key or admin token. `allow_updates` can be set false per invitation; one invitation corresponds to a household/party, not an individual seat.
4. Add family-approved WebP photography to `public/media/` per README. Review image rights, identifying location details, metadata, crop, captions and legibility. The `.gitignore` excludes family media by default; explicitly add reviewed assets to a private repo or include them through an approved private build process. Missing live assets fall back gracefully but produce 404 responses; replace all configured slots or remove their `data-src` before public launch.
5. Deploy a **new private preview project**, separate from the sister's current Netlify site. Use a Next-compatible Vercel environment; configure secrets, use the standard Next.js build and output. Do not use static export for the API routes. No deployment or account changes were made by this delivery.
6. Organizer view: `/admin`. Enter the server-only organizer token, inspect totals and individual responses, optionally export private JSON. Clear session when done. Browser memory is the only token storage used by the app. Do not share the export broadly; establish a post-event retention policy and delete private downloads when no longer needed.

Rate limiting: the API uses the Vercel forwarded IP header (or trusted reverse-proxy `x-real-ip` fallback) to derive a keyed pseudonymous identifier. Verify the host overwrites these headers; on hosts where it does not, configure a trusted proxy or adjust the limiter. Without a trusted header, clients share an `unknown` bucket, so verify behavior before launch. Add WAF/bot protection for public exposure, rotate admin tokens as needed, restrict project access and clean old rate buckets. Set appropriate origin and CSP policies once hosting and assets are finalized. HMAC lookup and noindex are not replacements for access control.

## 5. Acceptance before sending real invitations

- Install and production-build the actual Next app; inspect any dependency advisories and lock dependencies.
- Run migration on a test Supabase project, create test invitations with different household allowances and update policies. Verify anonymous REST access denied; only intended RPC roles can execute. Test repeated requests, concurrent updates, invalid guest counts, invalid/disabled invitations, rate limits and server timeouts. Confirm one response per household and organizer totals. Confirm fail-closed behavior when credentials are missing. Verify database backup and recovery.
- Device tests on iOS Safari, Android Chrome and desktop browsers: deny motion permission, turn tilt on/off, switch orientation mid-opening, tap twice, replay, navigate directly, reload, slow network, keyboard and VoiceOver/TalkBack. Device orientation is optional. Confirm no horizontal overflow at 320px and 390px. Test short viewport / zoom and large text. Run axe and audit contrast manually; do not claim WCAG conformance based on current checks.
- Test with actual guests before launch. Verify they understand the event, date, attire, practical path and answer flow. Inspect Core Web Vitals on a real deployed connection; no metrics were measured here.
- Obtain the actual ceremony start time, RSVP deadline, family-approved attire wording, contact method, guest list/allowances, response-update policy, exact-location distribution policy and family-approved editorial photography. Update the copy before launch where necessary.
- Record a 9:16 reel from the final phone experience: 0–3 s tilt, 3–6 s open and unfold, 6–11 s story/heritage, 11–15 s attire, 15–18 s reply seal. Use demo data only. No real invitation codes, guest details, or private location in a public reel.

## 6. Verified in this delivery

The offline Node suite checks validation, normalization, HMAC and token authorization, absence of demo codes from live markup, and route contracts with mocked Supabase. The standalone preview was exercised with Chromium using 1440×900, 390×844, and 320×700 reduced-motion viewports; opening, palette, keyboard tabs, rejected demo codes, accepted/declined demo replies, replay, and no horizontal overflow/uncaught JS errors were checked. Browser policy prevented direct file/localhost navigation, so the HTML was loaded into a blank document for the browser checks; true URL loading, reload/session behavior, and sensor hardware were not fully verified. These tests do not establish production database integration, real-device behavior or a successful Next build.

## 7. V2 cinematic motion architecture

The native scroll position is the source of truth. Each of the 12 marked scene anchors has an independent progress value and analytic critically damped spring, using measured bounds and requestAnimationFrame. Scroll velocity contributes bounded tilt; the scheduler sleeps when settled and only writes to nearby scenes. ResizeObserver refreshes layout measurements. No wheel/touch interception, synthetic smooth-scroll controller, mandatory WebGL or external animation package. CSS transforms and clipping produce perspective, layered reveals and depth; the effect is spatial CSS, not a real 3D camera or shader renderer. This is a deliberate lightweight alternative to the proposed Lenis/GSAP/Three stack.

Motion choreography: expanding letter borders; two sticky photographic runways with multi-plane paper frames, perspective, scaling and image masks; scroll-driven timeline thread and homecoming orbit; converging dimensional heritage rings and halo; layered event stationery and date; moving fabric folds and mouse-responsive light; restrained outfit illustration and reply-card decoration; final footer and confirmation seal. Controls and text remain in ordinary document flow. Motion is not a prerequisite to navigation or RSVP. Desktop/mobile sticky runways are only active on suitable viewport heights. The footer provides a persistent reduce-cinematic-motion preference; OS reduced motion takes precedence. The envelope also uses OS reduced-motion detection.

Test: `python tests/cinematic-check.py` (requires Python Playwright and Chromium at `/usr/bin/chromium`; adjust executable path for other systems). It checks five scene transforms and reversal on desktop and mobile, the optional motion switch, static reduced-motion layout, errors/overflow; it does not measure frame rate, GPU cost, real swipe input or Safari. Original HTML browser checks and all seven Node tests still pass. Real family media, production build, database setup, actual phone testing, and performance profiling remain required.

## V3 — sealed entry and corrected letter extraction
- The opening screen contains only the sealed envelope. Enter `DEMO2027` in the standalone preview; in production the existing verification endpoint must be configured and must return a valid invitation before opening.
- The code is reused for RSVP until replay/change code or reload. No code is persisted in browser storage. The opening gate is a UX gate: event content is present in the HTML. Do not store restricted venue data or secrets in this markup. Actual RSVP continues to require server verification.
- The flap and pocket have explicit layers, the card is hidden until the flap clears, and the extraction then expands into the readable invitation. Side navigation appears only once reading begins. The mobile control expands the side menu.
- Mobile tilt is automatic on platforms with unrestricted sensor access. On platforms requiring permission, the small phone-shaped envelope control requests it. Reduced motion and denied permissions are supported.
- Decorative Unicode star ornaments and bottom-of-letter navigation were removed. The full cinematic scroll system remains.
- Real iPhone sensor behavior, production compilation, and live Supabase integration still need verification. The project bundle does not include configuration secrets or original family photography.

## V3.1 — Hosted demo and centering hotfix

Deploy the new code, set `ROORA_DEMO_MODE=1` in the selected Vercel test deployment environment and redeploy. Enter `DEMO2027`. This mode is labeled DEMO INVITATION and all RSVP actions are simulated. Live verification, RSVP and admin API calls are disabled in this mode even if database credentials exist. Set `ROORA_DEMO_MODE=0` (or remove it), configure the database as above and redeploy before accepting real guests. The legacy ALLOW_DEMO flag remains local-only. The opening layout now explicitly centers a single grid track and is tested at multiple widths and heights.

## V4.1 — actual photo bytes and mobile motion
The authoring environment cannot resolve the original Netlify host. No actual family photo has been bundled yet. The browser export captures the actual images instead of relying on HTML scraping or remote image URL guesses. On the original Netlify site, open the invitation and Chrome DevTools Console, then paste the complete contents of `scripts/export-originals.browser.js` and run it. It downloads `roora-photos.json` containing the six approved images encoded as WebP. Move that file into the Next.js project root. Run `npm install` and `npm run assets` (or `npm run assets -- --pack /path/to/roora-photos.json`). Verify that all six files exist in `public/media`, then commit those WebPs. Do not commit the JSON pack; it is ignored. If a source image cannot be fetched or canvas is blocked by cross-origin rules, the exporter reports the exact missing slots; save those images manually and convert to the filenames listed in `public/media/README.md`. The actual Netlify transfer needs the user's network and browser; it has not been verified here.

Mobile motion now measures the actual sticky stage instead of relying on the changing browser viewport, responds to visual viewport resize, and uses more pronounced depth and longer scroll transitions. On short screens, the album retains a compact layout. Touch movement on the sealed envelope provides a fallback if sensor permission is unavailable. The OS reduced-motion preference remains respected; the existing motion toggle is retained. Physical Safari/iPhone validation is still needed.
