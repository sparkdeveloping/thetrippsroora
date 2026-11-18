# Design and motion system

The invitation remains an olive, warm ivory, chocolate, sage and champagne heirloom. Georgia and the local system sans stack are deliberate: no external font request, font substitution layout shift, or imitation of Apple's identity. Material detail comes from restrained paper grain, fold lighting, contact shadows, fine borders and a debossed seal. Important form copy is at least 14px; inputs and body copy use 16px at the default text size. Secondary editorial metadata is smaller.

## Shared motion

| Purpose | Tuning | Behavior |
| --- | --- | --- |
| Press / release | 110 / 240ms | Small translation/compression; stable input fields |
| Envelope tilt | 16 rad/s, damping .79 | At most 7° X and 8° Y; focus settles the object |
| Bookmark | 20 rad/s, damping .82 | At most 6px X, 4px Y; hit region stays accessible |
| Scroll composition | 18 rad/s, damping .90 | Native scroll is authoritative; tiny settling tail |
| Panel | 360ms | Controlled translation and scale; immediate dismissal |
| Outfit emphasis | 300–380ms | Images soften, captions retain contrast |
| Confirmation | 640ms | Seal appears after a confirmed service response |

The spring uses the analytic solution of an underdamped oscillator. Tests compare the state at 30, 60 and 120Hz. Easing for timeline gestures is `cubic-bezier(.22,.72,.18,1)`. No smooth-scroll library, scroll hijacker, WebGL scene or additional animation framework is introduced.

## Opening timeline

| Movement | Starts | Ends |
| --- | --- | --- |
| Object alignment | 0ms | 240ms |
| Entry surface recedes | 0ms | 180ms |
| Seal releases | 120ms | 420ms |
| Flap opens | 280ms | 900ms |
| Letter extracts | 620ms | 1260ms |
| Letter expands into HTML | About 1260ms | About 2120ms |

Verification latency is separate. These are configured timings, not measured frame presentation. The expanded letter uses the actual final HTML surface during flight and moves it into its resting section, avoiding an end-of-flight opacity proxy exchange. Resizing or enabling reduced motion finishes an already authorized opening safely. An aborted verification cannot unlock a later session. Replay cancels animations, clears invitation and response state, resets focus and removes the chapter hash.

## Chapters

The letter has a 135svh runway, down from the longer V5 hold, a clear continuation cue and a photographic glimpse that emerges with scroll. The album holds three memories with deliberate plateaus, coordinated photographic/copy movement and dedicated mobile framing. Only the current pinned beat is exposed to assistive technology; all beats remain available in the linear alternative. Portraits retain the couple's faces and the homecoming crop favors the couple over empty foliage.

Two family identities begin separated and their paths decelerate through convergence. The finished connection resolves into a shared story. The calendar uses a single date surface: its starting rectangle is measured from the real Wednesday cell, then translation and scale carry it into the keepsake. There is no second hidden date number that fades in over the first. The practical event details and all-day ICS remain independently readable.

Each look is a small local crop. Native horizontal snapping, mouse dragging, arrow keys, previous/next, a slider and full-board enlargement offer equivalent browsing paths. Palette controls describe family color exceptions in persistent copy as well as selected-state descriptions. No color adjustment is applied to outfits.

## Interruptions, accessibility and cost

Runways are reversible. Geometry reads are batched before scene writes; the engine caches scene geometry and queries. It sleeps when settled or hidden. Toolbar or keyboard height changes during field entry do not rebuild the scene rig. Device orientation is opt-in through a real user action, and pointer/touch use remains available without it. Permission denial has a readable fallback.

The OS preference and persistent guest motion toggle disable nonessential motion. At enlarged root text sizes (150% or greater), cinematic scenes reflow into a complete linear layout. On short viewports (under 620px high) the album and calendar use a linear composition that leaves reading and controls in normal document flow. This is a height/legibility adaptation, not a blanket mobile-width shutdown. Physical Safari sensor quality, thermal behavior and GPU rendering still require device testing.

## Research applied

- [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion): purposeful feedback, restraint, interruption and accessibility.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [Flip](https://gsap.com/docs/v3/Plugins/Flip/): measured geometry, reversible spatial transitions and mobile resize considerations informed the custom implementation. The libraries are not runtime dependencies.
- [MDN orientation permission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static): sensor access is initiated by user activation.
- [web.dev animation performance](https://web.dev/articles/animations-and-performance): transforms and opacity carry major movement. The calendar's small surface also interpolates color/radius; its real-device paint cost remains to be profiled.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [interaction motion guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions): keyboard alternatives, contrast, meaningful focus, target sizes and motion alternatives. Disabling interaction animation goes beyond the AA minimum.

The client request transport uses an AbortController and a cancellable timer, avoiding newer AbortSignal composition APIs beyond the framework’s browser floor. The envelope form is inert in server HTML and becomes usable only after all client handlers are registered.
