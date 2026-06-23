# UX Improvements — Master Task Tracker

All 5 reported issues across 3 phases. Check boxes as tasks complete.

---

## Phase 1 — Quick Fixes

| # | Task | File | Status |
|---|------|------|--------|
| 1.1 | Fix modal top-left flash — add `opacity: 0` base + `animation-fill-mode: both` | `src/styles/global.css` | [ ] |
| 1.2 | Bump body font-size to 17px (1.0625rem) | `src/styles/global.css` | [ ] |
| 1.3 | Fix mobile nav X button — remove `as-child`, rely on `@click="close"` | `src/components/islands/MobileNav.vue` | [ ] |
| 1.4 | Fix mobile nav link close — add `closeAndNavigate()` with rAF to avoid scroll-lock race | `src/components/islands/MobileNav.vue` | [ ] |

---

## Phase 2 — Card Hover

| # | Task | File | Status |
|---|------|------|--------|
| 2.1 | Replace `filter: drop-shadow` with `box-shadow` brand glow + 6px lift on `.card-hover:hover` | `src/styles/global.css` | [ ] |
| 2.2 | Add intensified hover to `.surface-featured.card-hover:hover` | `src/styles/global.css` | [ ] |
| 2.3 | Remove `filter` from `.card-hover` transition (no longer needed) | `src/styles/global.css` | [ ] |

---

## Phase 3 — Vehicle Selector

| # | Task | File | Status |
|---|------|------|--------|
| 3.1 | Create 3 inline SVG car silhouettes (Sedan, SUV, Truck) with animatable parts | new component or inline | [ ] |
| 3.2 | Build Variant A (spring bounce) on preview page | `src/pages/preview.astro` | [ ] |
| 3.3 | Build Variant B (drive-in) on preview page | `src/pages/preview.astro` | [ ] |
| 3.4 | Build Variant C (ground glow) on preview page | `src/pages/preview.astro` | [ ] |
| 3.5 | **[CHECKPOINT]** Owner picks variant from `/preview` | — | [ ] |
| 3.6 | Replace ToggleGroup pill with card-style vehicle selector in PricingEstimator | `src/components/islands/PricingEstimator.vue` | [ ] |
| 3.7 | Verify 375px mobile layout (3 cards side by side, legible) | — | [ ] |
| 3.8 | Verify keyboard arrow-key navigation still works on vehicle selector | — | [ ] |

---

## QA Sign-off

| Check | Result |
|-------|--------|
| Modal appears centered immediately (no flash) | [ ] |
| Body text reads comfortably larger | [ ] |
| Mobile nav closes on link tap | [ ] |
| Mobile nav closes on X button tap | [ ] |
| Pricing cards show blue glow on hover (desktop) | [ ] |
| Vehicle selector cards display correctly at 375px | [ ] |
| Booking prefill still works after vehicle selector change | [ ] |
| Lighthouse Performance ≥ 90 | [ ] |
