# The Letter Home — audit and next-pass acceptance criteria

## Evidence examined

Original Netlify content and accessible image descriptions, uploaded six-image WebP pack, screenshot of the live Vercel site, V4.1 project source, the current GitHub default-branch package manifest and all six canonical asset paths. All six paths returned 404 on GitHub. Reviewed Apple HIG Motion, GSAP ScrollTrigger/refresh/config, MDN CSS positioning/stacking contexts/viewport concepts, Next.js public assets and web.dev animation guidance. Local browser validation used Chromium, not actual iOS hardware or a deployed Next server.

## Priorities

| Priority | Finding | Decision | Acceptance |
| --- | --- | --- | --- |
| P0 | Optional image import and empty fallbacks conceal absent assets | Bundle six approved images; build fails if missing | All six exist before deploy, all URLs succeed in deployed network panel |
| P0 | Historical chapter-nav :has() selectors override panel geometry/visibility | Explicit hidden state and one scoped viewport anchor | No UI before unlock or after replay; every chapter link fits in viewport; keyboard Escape/outside click dismiss |
| P0 | Demo vs real RSVP configuration is easy to confuse | Separate test and real releases; never use demo for invitations | Valid/invalid codes, create/update/decline, server confirmation after persistence, real database test |
| P1 | Opening uses a proxy handoff and multiple fixed-duration stages | Next pass: a unified physical camera, measured card bounds, damped handoff and interruption handling | No visible cut, no clipping when keyboard/address bar changes, no double-open |
| P1 | Motion exists but on mobile is conditional, not equivalent to desktop | Mobile-first shot plans, stable measured pin distances, native scroll, responsive composition | Guest can advance and reverse through every beat on physical iPhone and Android; reduced-motion layout still works |
| P1 | The album uses isolated card transitions and repeated text | Let photographs occupy much more of frame; sequence from print to full-bleed memory to next print | Each supplied portrait visible and well-cropped, no misleading timestamp label, copy legible |
| P1 | Heritage is abstract and primarily copy | Family-approved narrative + emotional transition from portrait to homecoming; no invented homestead imagery | Cultural wording and visuals family-reviewed |
| P1 | Attire boards are dense at phone width | Large original lookbook crops/detail zoom plus explicit guest palette and exception roles | Color labels legible, models shown without clipping or color confusion, accessible lightbox |
| P1 | Navigation resembles generic menu | Hanging bookmark as prototype; next pass use a thread to encode actual chapter/scroll progress and retain standard anchors | 44px operable hit target, safe-area bounds, visible current chapter, no interaction required for visual thread |
| P1 | Later scenes rely primarily on passive reveals | Sequence letter, album, heritage, details, attire and reply as one journey, with intentionally still form fields | Each motion answers a user goal; direct access remains quick |
| P2 | Many appended CSS rules and monolithic DOM controller | Consolidate per-component styles and split motion, navigation, media and guest controllers; persistent automated visual regression | No competing rules; documented scene timeline; stable reduced-motion fallback |

## Next-pass motion architecture

One normalized scroll target per chapter, one spring-filtered visual progress, one velocity channel. Keep document scrolling native. Pin only a stable scene shell, never apply animated transforms to the pin itself; animate its child rig. Use stage bounds and measured pin distance for each narrative beat. Recompute at actual layout changes, not every transient mobile chrome resize. Preserve narrative position through viewport changes and orientation changes. Use GSAP ScrollTrigger if it materially simplifies coordinated pin/refresh/scrub; otherwise consolidate the existing local engine. Do not combine smoothing engines. Animate transform/opacity predominantly, reserve expensive effects for isolated, profiled moments. Pinning is an editorial device, not a navigational requirement. Use reduced motion and short-screen fallbacks.

## Storyboard

1. Receive: envelope alone; deliberate tilt optional, touch/pointer fallback. Code unlocks only when valid.
2. Read: letter emerges and fills screen, then photograph becomes the focal point. Avoid another long text-only pause.
3. Remember: three photographic beats — beginning, promise, homecoming. The images illustrate the story; do not imply they were taken at those moments. Scroll holds the composition, then progresses to the next photograph. Give each shot enough breathing room.
4. Understand: slow transition to heritage and family, short text with approved facts, no gamification of roora. No stock photograph passed off as grandparents' homestead.
5. Prepare: date/location-access status resolves into stable readable details. Attire: first real photo boards, then palette, then optional guidance.
6. Reply: form remains stable while decorative material settles; only real success triggers confirmation. Thread resolves after reply, not before.

## Release gates

- Assets: all six locally bundled, deployed image URLs 200, all visible and decoded; no fallback artwork during normal operation.
- Viewport: test 320px, 390px, 430px, tablet and desktop; actual iPhone Safari and Android Chrome; browser bars opening/closing, rotation, keyboard, pinch zoom, tap vs pointer, low-power conditions.
- Motion: scroll forward, stop, reverse, jump chapters, replay, resize and toggle reduced motion. No blocked scroll, no cut, no dropped state. Measure frame times on real devices; target smooth 60Hz where hardware permits, not a claim of measured FPS. Native accessibility alternatives.
- Product: invitation code valid/invalid, RSVP accept/decline/update/failure, cap party size, confirmation after actual save, organizer access, real database and location access controls. No demo users in real database.
- Accessibility: keyboard focus, screen reader ordering, inactive beats excluded from focus/appropriate accessibility exposure, contrast and touch-target review. WCAG 2.2 AA target only; audit required.
- Performance: inspect production bundle, decoded pixel sizes, layout shifts, and network waterfall; Lighthouse + real mobile performance, no claimed measurements yet. Build must pass asset validation.
