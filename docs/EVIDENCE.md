# Review evidence inventory

## Saved screenshots

All are real browser captures at 390×844 CSS pixels. The V5 images show production commit `7239557`; the V6 images show the initial refined preview before later focused fixes. They include raw review overlays where present. No screen recording is represented by these files.

| Chapter | V5 | V6 |
| --- | --- | --- |
| Envelope | Not exported | [Capture](evidence/after-envelope-mobile.jpg) |
| Invitation | [Capture](evidence/before-letter-mobile.jpg) | [Capture](evidence/after-letter-mobile.jpg) |
| Story | [Capture](evidence/before-story-mobile.jpg) | [Capture](evidence/after-story-mobile.jpg) |
| Family connection | [Capture](evidence/before-heritage-mobile.jpg) | [Capture](evidence/after-heritage-mobile.jpg) |
| Date | [Capture](evidence/before-day-mobile.jpg) | Not exported |
| Attire | [Capture](evidence/before-attire-mobile.jpg) | Not exported |
| Reply | [Capture](evidence/before-reply-mobile.jpg) | Not exported |

Desktop and remaining final mobile captures were inspected live but a complete exported set is outstanding. The Cloud Browser's documented shared-file directory was not readable from the project executor; browser-local files are not presented as downloadable artifacts.

## Logs and measurements

- `install.txt`, `unit-tests.txt`, `production-build.txt`, `production-http.txt`, `live-integration.txt`: actual local command output.
- `fresh-desktop-lab.json`: fresh desktop timing with a verified H1 LCP element.
- `browser-matrix-summary.json`: responsive state regression coverage across successive V6 previews.
- `browser-mobile-320.json`, `browser-mobile-390.json`: raw long QA sessions; retain their long tasks and startup limitations. Do not use their resized-session timing as cold mobile Web Vitals.
- `browser-cloud-summary.json`, `focused-final-checks.json`: later focused browser observations, with explicit laboratory limits.
- `final-browser-checks.json`: final application commit, desktop/short/enlarged/motion observations.
- `axe-before-final-layout.json`: earlier automated accessibility result; not a certification or final full manual review.
- `bundle-summary.json`: final local bundle sizes; all chunks includes optional QA/axe and admin, not initial transfer.
- `lighthouse-environment.md`: exact launcher failure; no score was generated.
- `final-source.json`: application commit and tree used for the final focused review; evidence-only commits may follow it.

## Reproduce and finish capture

Use the demo preview and `DEMO2027`, then inspect each chapter at 390×844 and 1440×900. The explicit demo `?qa=1` controls can position letter, three album memories, separated/joined families, calendar cell/midpoint/keepsake, attire and reply. Collapse the review panel before capture. Also capture the original boards, bookmark expansion and both clearly labeled demo confirmation outcomes. Record the whole guest journey continuously on physical phones, then use the Reel storyboard to plan a shorter edit. Preserve an uncut reference recording for motion review.

Run `npm ci`, `npm test`, `ROORA_DEMO_MODE=1 npm run build`, `npm run test:production`, and `npm run test:integration`. On a host with a working Chromium launcher, run `npm run test:performance` and retain Lighthouse output and a browser performance trace. Never use a real guest invitation or production organizer token for capture.
