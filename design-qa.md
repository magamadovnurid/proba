# Design QA — PROBA Mini App

## Reference and implementation

- Source reference: `/Users/mns/Downloads/PROBA.pdf`, page 16 (`design-reference/page-16.jpg`).
- Implementation screenshot: `design-reference/implementation-results-full.png`.
- Combined comparison: `design-reference/qa-results-comparison.png`.
- Runtime viewport: iPhone content area 393 × 852 CSS px inside the protected mobile-app device frame.
- Density and device chrome: iPhone runtime assets; screenshot captured at CSS scale in the in-app browser.

## Visual comparison

The implementation keeps the source's light cool-gray canvas, white biomarker cards, blue primary action, teal/amber/coral status language, compact clinical typography, rounded cards and iPhone-first spacing. The implemented results view intentionally adds a compact title bar, a fourth biomarker and the physician CTA so the complete product path can be demonstrated without changing the visual system.

No broken layout, clipping, unintended horizontal scroll, missing source asset, incorrect device chrome or unreadable overlap was found at the target viewport.

## Interactions verified

- Home → test selection → add B12 → total changes from 3 360 ₽ to 4 350 ₽.
- Select PROLAB → submit order → receive application `#L-1048`.
- Courier → select 12:00–13:00 → confirmation with assigned courier.
- Results → biomarker dashboard → physician consultation.
- Verified physician → scoped patient consent → booking → recommendation → product storefront.
- Standalone storefront from profile → add an independent product → cart changes to 1.
- Subscription → choose an 8-week interval → cycle scheduled with pause/skip language.
- Laboratory demo → accept order → upload demo results → client notification state.

## Technical checks

- Browser console errors: none.
- Browser console warnings: none.
- Runtime integrity check: passed for all 28 protected runtime files.
- TypeScript and production build: passed.
- Vite reports only a non-blocking bundle-size warning for the single prototype chunk.

## Fix history

- P2: default boilerplate language and page title were still present. Updated to Russian PROBA metadata and description.
- P2: the first visual capture retained browser focus and displayed the simulated mobile keyboard. Focus was cleared and the final comparison was recaptured.
- P0/P1: none found.

## Final result

passed
