# V6 — The Heirloom Edition: release review

**Status: implemented and deployed for review; production promotion is blocked by the outstanding validation and family decisions below.** The original Netlify site and Vercel production V5 have been preserved. No real invitations were created and no production guest responses were submitted.

## Baseline and release identity

The supplied project ZIP, GitHub `main`, and production deployment all identify **5.0.0**, commit `7239557fe6551b870921c5222d533e433c4f5a6c`. The V4.2 warning in the brief does not describe the inspected baseline. Baseline checks: 10 tests, six original images and a real Next.js build passed after restoring dependencies.

The dedicated review branch is `final-polish/v6-heirloom`. The final application source commit tested in the browser is `960608eb916b884f42c15b79129c19ddb9b4bfec`, deployed READY as `dpl_FTUoxvrJEK6gBybrccEohNKiCUbC`. Subsequent documentation/evidence commits do not alter application code. Package version is 6.0.0. Exact dependencies and a lockfile are committed; `node_modules` is intentionally excluded from source delivery.

## What changed

- Replaced the accumulated stylesheet and monolithic DOM controller with five stylesheets and scoped modules owned by one React mount/dispose lifecycle. Trusted static server markup remains; a framework rewrite was unnecessary.
- Unified spring tuning, motion preferences, interruptions and cleanup. Native document scrolling remains authoritative. No extra animation framework or smooth-scroll engine was added.
- Rebuilt the envelope choreography with overlapping alignment, seal, flap, extraction and expansion. The actual final HTML letter flies into place. Configured movement is about 2.12 seconds, excluding verification.
- Shortened the initial letter hold and introduced the approved first photograph through the same scroll composition. Refined portrait album crops, memory plateaus and explicit illustrative-photo wording.
- Refined the separated family threads and their slower convergence, keeping the connection an original design metaphor. Preserved the approved roora explanation and elders' role.
- Made the real Wednesday date surface move from its measured calendar cell into the keepsake. The all-day ICS and Harare countdown are verified without an invented ceremony time.
- Preserved all six originals and both attire boards. Added twenty reproducible, color-preserving local garment crops, native snapping, keyboard/slider/drag controls, tabs and an accessible original-board dialog.
- Refined the physical bookmark navigation, current chapter, predictable focus/Escape/outside dismissal, and an early guest motion control. Navigation remains hidden until opening succeeds.
- Stabilized reply fields, asynchronous state, retries, idempotency and confirmation focus. A successful service reference is required before live confirmation; demo acceptance and decline explicitly state that nothing was sent.
- Added safe linear layouts for short heights and enlarged text, complete reduced-motion content, image-failure recovery, and an inert server-rendered envelope form until its client listeners are ready.
- Preserved touch opening across software-keyboard/browser-toolbar height changes; rotation or width changes complete an authorized opening safely. Opt-in device orientation remains optional.

See [design/motion system](DESIGN-MOTION.md), [prioritized findings](AUDIT-REGISTER.md) and [organizer guide](ORGANIZER.md).

## Automated and browser verification

| Evidence | Observed result | Scope |
| --- | --- | --- |
| Reproducible installation | `npm ci` passed | Local locked dependencies |
| Unit/schema suite | **17/17 passed** | Springs, dates, request boundaries/abort, validation, credentials and real isolated SQL schema |
| Real production build | **Passed** | Next.js 16.4.6; required media validation included |
| Production-server HTTP suite | **31/31 passed** | Real running Next.js, inert gate, headers, demo isolation, ICS and all 26 binary assets |
| Isolated live-mode integration | **13/13 passed** | Actual Next.js HTTP → local RPC transport → PGlite PostgreSQL; accepts, declines, retries, simultaneous requests, authorization and disabled codes |
| Responsive browser matrix | **19/19 at each of seven sizes** | 320×700, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900 across successive V6 refinements |
| Final-source desktop regression | **19/19 passed** | Chromium 1363×936, normal motion |
| Final-source guest-reduced-motion regression | **19/19 passed** | Both controls synchronized; complete linear content; returning to normal restores one exposed pinned beat |
| Final-source short-height regression | **19/19 passed** | Browser zoom 400%, CSS viewport 340×234, 16px root text |
| Final-source enlarged-text regression | **19/19 passed** | Same CSS viewport, 200% root text (32px) |
| Image failure/recovery | **Passed** | One intentional 404, readable fallback, original restored; separate from required-asset errors |
| Keyboard controls | **Passed observed flows** | Outfit tab arrows/Home, gallery End, original-board Escape and focus return, bookmark Escape and direct section links |
| Reply flow | **Passed observed demo acceptance/decline** | Simulated response is explicitly labeled; confirmation focus brought into viewport |

These browser regressions inspect reversible album/calendar states, both galleries, document overflow, required media and uncaught errors. The seven-size matrix predates the last focused viewport/accessibility fixes; it is not represented as seven fresh runs of the final commit. Final focused checks are recorded separately. This is Chromium laboratory evidence, not iOS/Android certification.

The isolated database suite uses the actual schema and role restrictions. Its local RPC bridge is not hosted Supabase, and simultaneous HTTP requests into an in-process database do not establish multi-connection production concurrency. No hosted integration credentials were used.

## Accessibility

Automated axe checks targeting WCAG 2.2 AA tags found zero violations after correcting the initial section-number contrast. Incomplete color-contrast and ARIA findings still require human review; an automated pass is not certification. Keyboard paths, form labels/statuses, error focus, original-board dismissal and motion preferences were exercised. Inactive pinned album beats are hidden/inert; linear alternatives expose all three. Increased text and short viewports keep the calendar and reply in normal flow.

Screen-reader testing with VoiceOver/TalkBack, complete manual contrast review, pinch zoom on physical Safari, and real software-keyboard/safe-area behavior remain unverified. Sensor denial/unavailability has a graceful path in code; permission behavior and physical tilt quality require actual phones.

## Performance: measured results and limits

| Observation | Result | Interpretation |
| --- | --- | --- |
| Fresh connected desktop navigation | LCP **2048ms**, CLS **0**, longest observed interaction **72ms** | Valid H1 LCP element, 1728×907 laboratory session on an earlier V6 preview; not field data or a final mobile result |
| Opening in that session | **2184ms** | Measured from opening start to reading phase; verification excluded |
| Final-source opening | **2144.2ms** | Chromium laboratory observation |
| Foreground warm Cloud Browser journey | 3663 rAF intervals, median/p95 **16.7ms**, one interval over 20ms | Scheduling evidence only; cannot establish GPU frame presentation or physical 60 FPS |
| Original imagery | **1,495,470 bytes** | All six unchanged, hashed and decoded |
| Twenty look files | **581,056 bytes** | Derived crops; originals retained |

The final Cloud Browser's reported LCP of 936ms identified an injected `chrome-extension://…/cursor-chat.png` image. It is **excluded from the product LCP conclusion**. Other Cloud Browser LCP summaries lacking a validated product element are also not used to claim the target. The retained resized/background mobile session with a 41.6-second LCP is not a valid fresh-start measurement. An early 320px QA/stress session recorded a 2672ms interaction and long tasks; this remains in the raw evidence and is not hidden by the faster focused sessions. It warrants representative-device investigation; a finite lab interaction maximum is not field INP.

Lighthouse launch was attempted with a local temporary directory, but Chromium exited on a sandbox-denied socket (`Operation not permitted`). No Lighthouse score or full performance trace is claimed. There is no valid cold mobile LCP, field INP, physical-device FPS, thermal/low-power measurement or hosted load test. **The complete performance acceptance gate remains open.**

## Visual evidence and requested deliverables

The evidence directory contains actual V5 mobile stills for the six reading chapters and V6 stills for the envelope, letter, story and family connection. These were visually reviewed. Browser overlays/cursors visible in raw captures are review tooling, not invitation UI. The saved V6 stills precede the last focused fixes, whose browser checks are identified by commit.

Continuous screen recordings and a complete exported before/after desktop-and-mobile screenshot set could not be produced with the available browser/file bridge. Missing images are not reconstructed or passed off as captures. The actual-product [9:16 Reel storyboard](REEL-STORYBOARD.md) is supplied; a final Reel or interaction recording is not claimed. See [evidence inventory](EVIDENCE.md) for exact coverage and reproducible capture instructions.

## Remaining launch gates

1. Test physical iPhone Safari and Android Chrome: sensors, touch, toolbar/safe area, keyboard, rotation, zoom, reversal and lower-power/GPU/thermal behavior. Desktop emulation does not close this gate.
2. Profile representative-device cold startup and the whole motion journey; obtain valid LCP/INP/CLS, full traces and Lighthouse where Chromium can launch. Investigate the early stress-session long tasks.
3. Rehearse the live service in an approved isolated hosted Supabase environment, including genuine concurrent connections, rate limits, permission boundaries, failures and organizer access.
4. Finish human screen-reader/contrast review and the missing full screenshot/recording set.
5. Obtain family decisions for ceremony/arrival time, exact private address handling, RSVP deadline, guest allowances/records, retention and promotional photography permission. The UI leaves unknown details announced as pending.
6. Review and approve the release before merging/promoting. The preview is intentionally demo-only; no production data or secrets were added.

All implementation, locally executable checks and accessible preview refinements are delivered for review. This report does not claim perfection or production readiness while these gates remain open.
