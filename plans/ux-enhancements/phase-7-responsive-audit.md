# Phase 7 — Responsive UX & polish audit (mobile + desktop)

**Goal:** the site is easy to use and key info is easy to find on both phone and desktop — not just
"doesn't break on mobile." Run last so it covers every new component.
**Why:** owner's top priority — best UI/UX across devices, necessary info easy to see and find.

## Tasks
### Findability / IA
- [ ] Confirm the key info is obvious within a glance/one scroll (mobile) and above-the-fold-ish
      (desktop): what it is, price, service area, how to book, phone number.
- [ ] One primary CTA per section (skill `primary-action`); consistent CTA wording via `CTA` constants.
- [ ] Booking is reachable from every section without hunting.

### Responsive layout (375 / 390 / 768 / 1024 / 1440 px + landscape)
- [ ] Touch targets ≥44px; ≥8px spacing between targets.
- [ ] No horizontal overflow anywhere; long text wraps; tables/grids reflow.
- [ ] Safe-area insets (notch / home indicator) for StickyBar + modal.
- [ ] `min-h-dvh` instead of `100vh` where full-height is used.
- [ ] Inputs 16px (already global); visible focus rings everywhere.
- [ ] Desktop: container max-width respected, comfortable line length, balanced whitespace, hover states.

### New-component checks
- [ ] StickyBar doesn't overlap modal/scrim or footer; reserve bottom padding.
- [ ] BookingModal full-height-friendly on small screens (scrollable body, close reachable, Cal min-height sane).
- [ ] FaqAccordion content doesn't clip when animating.
- [ ] Estimator + ZIP gate usable one-handed on mobile.

### A11y / motion
- [ ] `prefers-reduced-motion` on → all new animations static, layout intact.
- [ ] Largest Dynamic Type / browser zoom 200% → no breakage or truncation.

## Acceptance
- Clean and easy to scan at all listed widths + a landscape pass.
- Key info + booking obvious on both form factors.
- No overflow; targets meet size; reduced-motion + large text don't break layout.

## Log (audit findings)
- **Fixed:** BookingModal close button was `size-9` (36px) → bumped to `size-11` (44px) to meet the
  touch-target minimum.
- **Verified — z-index:** modal overlay/content are `z-[1000]`; nav, sticky bar, mobile-nav are all
  `≤ z-50`, so the scrim correctly covers the sticky bar and nav. No layering conflict.
- **Verified — touch targets:** size toggle items, ZIP gate input+button, estimator Book CTA, FAQ
  triggers (px-5 py-4), product-logo tiles (`min-h-16`), and the #book fallback button all ≥44px.
- **Verified — overflow/dvh:** modal uses `max-h-[90dvh]` + `flex` + `overflow-y-auto` (scrolls, no
  clip); iframe `h-[72dvh]`. Body reserves `pb-[72px]` for the sticky bar; modal sits above it.
- **Verified — hover-vs-tap:** card lift and logo greyscale→color are inside
  `@media (hover:hover) and (pointer:fine)`; touch + reduced-motion get the legible final state.
- **Verified — findability:** price (estimator + cards), service area (ZIP gate + ServiceArea),
  booking (modal from every CTA + sticky bar), and phone (sticky bar + #book + footer) are all
  reachable within a short scroll on mobile and present on desktop.
- **Verified — build/serve:** `npm run build` clean; preview serves `200` with every new feature in
  the HTML; FAQ JSON-LD still emits all 5 questions from the shared `faq.ts`.
- **Pre-existing (NOT from this work, flagged to owner):** 7 `ts(2367)` errors from `{{PLACEHOLDER}}`
  comparisons against real `as const` values in `site.ts`; 4 lint errors in `BeforeAfterSlider.vue`
  (deprecated `slot=`) and `Hero.astro` (astro JSX parse). Out of scope — recommend a separate cleanup.
- **Owner runtime check recommended:** open the page on a real phone, exercise the modal (open from a
  CTA, back-button closes, booking success closes), accordion, and estimator; run Lighthouse mobile.
