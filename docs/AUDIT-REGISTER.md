# Prioritized audit register

Baseline: the supplied ZIP, GitHub `main`, and Vercel production all identify V5, commit `7239557fe6551b870921c5222d533e433c4f5a6c`. The earlier V4.2 warning is stale. The original Netlify page was inspected for the dates, story and family-approved wording. Baseline: 10 tests passed, 6 original images validated, and a real Next.js production build passed after dependency restoration.

| Priority | Finding | Action / state |
| --- | --- | --- |
| P0 | Baseline/deployed version ambiguity | Resolved using GitHub branch and Vercel deployment metadata; V5 confirmed. |
| P0 | A demo could be mistaken for real persistence | Client confirmation explicitly names simulation; all live API routes remain disabled in demo. Preview branch has its own scoped demo setting. |
| P0 | Supplied images ignored by Git rules | Required originals and twenty crops tracked; mandatory hash/decode validation now covers all 26. |
| P0 | Standalone tests did not exercise Next.js | Replaced with a real production-server HTTP suite and demo-only deployed-app regression controls. |
| P1 | Six largely sequential opening stages | Replaced with overlap and one actual HTML paper surface in the final flight; 2120ms configured sequence, separate from verification. |
| P1 | Accumulated stylesheet overrides | Replaced 65,258 bytes of cumulative rules with five responsibility-based stylesheets; one breakpoint ownership model. |
| P1 | Monolithic controller / lifecycle ambiguity | Replaced with React-owned mount/dispose and focused modules; cleanup cancels frames, animations, observers, timers and listeners. |
| P1 | Inactive album beats exposed to assistive technology | Inactive pinned beats receive `inert` and `aria-hidden`; linear/reduced alternatives restore all content. |
| P1 | Long initial typographic hold | Shorter 135svh hold, visible continuation link, scroll-emerging approved photograph. |
| P1 | Calendar proxy crossfade | One date surface is measured from its real cell and moves continuously into the keepsake; forward/reverse regression checks pass. |
| P1 | Calendar and event facts | Wednesday verified; Harare midnight boundary tested; all-day calendar contains no invented time. |
| P1 | Gallery crop/decoding complexity | Twenty individually inspected, locally decoded crops; original boards retained, exact source rectangles recorded. |
| P1 | Accessibility contrast | First axe run found section-number contrast 4.26:1; color darkened. Nonselected garment captions retain full opacity. Final recheck required in evidence. |
| P1 | RSVP double submission / stale state | Busy guards, request fingerprints, stable idempotency IDs for retries, revision checks, aborts and verified references before confirmation. |
| P1 | Input focus / navigation reliability | Native anchors, focusable section destinations, Escape, outside click, focus-out dismissal, current chapter and safe-area-aware panel. |
| P1 | Device orientation | Explicit opt-in activation, readable denial fallback, calibrated baseline, reduced-motion and focus handling. Physical sensor behavior remains unverified. |
| P1 | Database correctness | Real schema exercised in isolated PGlite: limits, duplicate receipts, changed-payload rejection, update lock and public-role denial pass. Hosted Supabase/network concurrency remains a release gate. |
| P1 | Performance verification gap | Browser timing instrument added; raw results retained. Lighthouse launch blocked by sandbox socket restriction. No field INP or physical FPS claim. |
| P1 | Privacy distinction | Public photography/general copy documented as public; no private address or guest data added. Family approval needed for broader Reel sharing. |
| P2 | Historical README and optional importer | Replaced with a single current guide; removed obsolete importer, duplicated controller, standalone test scripts and nested historical ZIP. |
| P2 | Nonreproducible install | Exact runtime and development dependency versions, committed lockfile, `npm ci` workflow. |
| P2 | Missing organizer/review guide | Added design/motion system, organizer setup, audit register, release report and Reel storyboard. |

Remaining release gates are explicit, not silently waived: physical iPhone Safari and Android Chrome, hosted isolated Supabase rehearsal, representative-device GPU/thermal profiling and valid startup Web Vitals evidence, venue/time/deadline decisions, final family content/photography review, and production approval. The preview is not promoted to production.
