# UX Enhancements — Master Tracker

Low-detail checklist for the 7-phase UX enhancement effort. One line per task.
Full detail + acceptance criteria live in each `phase-*.md` file. Tick boxes here as you go.

> Full plan & context: `~/.claude/plans/you-are-an-expert-glowing-waterfall.md`
> Build order: all 7 phases in order, then one review of the whole thing.

## Status legend
`[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Scaffold & deps
- [x] Create `plans/ux-enhancements/` tracking files
- [x] Add `zod` + `@calcom/embed-core` to `package.json` and install

## Phase 1 — Validation ([detail](phase-1-validation.md))
- [x] `src/lib/validation.ts` (US phone format, `isCoveredZip`, `quoteSchema`)
- [x] Move `COVERED_ZIPS` out of `ZipValidator.vue` into the shared module
- [x] Refactor `QuoteForm.vue` to use schema (add email validation + phone auto-format)
- [x] Refactor `ZipValidator.vue` to import shared zip helpers

## Phase 2 — Price estimator ([detail](phase-2-estimator.md))
- [x] Extract `PRICING`/`SIZES` to `src/data/pricing.ts`
- [x] Add exact per-size estimate output block (all tiers + add-ons)
- [x] Add inline ZIP gate → "Book this" opens modal prefilled with size
- [x] Keep `sessionStorage['elite-detail-size']` write

## Phase 3 — FAQ accordion ([detail](phase-3-faq-accordion.md))
- [x] Move FAQ items to `src/data/faq.ts`; point `buildFAQSchema()` + page at it
- [x] `FaqAccordion.vue` (Reka, `type="single"` collapsible, animated height)
- [x] Mount in `index.astro` replacing `<details>`; keep `#faq` anchor + parity
- [x] Respect `prefers-reduced-motion`

## Phase 4 — Booking modal ([detail](phase-4-booking-modal.md))
- [x] `BookingModal.vue` — Reka Dialog chrome + Cal **iframe embed** (embed-core dropped — see phase notes)
- [x] Brand-matched chrome (`theme=dark`, `month_view`) + prefill package/size via `notes`
- [x] Loading skeleton while iframe loads; close on `bookingSuccessful` postMessage
- [x] Global `a[href^="#book"]` interceptor → `booking:open` event
- [x] History state so mobile/desktop back closes modal
- [x] Mount once in `Layout.astro`; convert `#book` section to no-JS fallback
- [x] Retire `BookingEmbed.vue`; uninstall `@calcom/embed-core`

## Phase 5 — Motion + card hover + cleanup ([detail](phase-5-motion-cards.md))
- [x] Delete dead `src/lib/useReveal.ts`
- [x] Motion One micro-animations on key icons (ValueProps scale-in, reduced-motion gated)
- [x] Card hover lift (`.card-hover` on ValueProps + Pricing; OurWork deferred to real photos)
- [x] Confirm `@lucide/vue` route-split (not in homepage bundle); `/preview` noindex + sitemap-excluded

## Phase 6 — Product logos ([detail](phase-6-product-logos.md))
- [x] Dedupe products to Meguiar's / CarPro / Gyeon
- [x] Logo strip is data-driven (renders `<img>` from `public/logos/` when set); **wordmark fallback ships now** (no official SVGs sourced — owner to add)
- [x] Monochrome logo strip; greyscale→color/lift on hover (hover-only enhancement)
- [x] Legible default on touch/reduced-motion; ≥44px tiles; mobile wrap

## Phase 7 — Responsive UX audit ([detail](phase-7-responsive-audit.md))
- [x] Findability/IA pass (key info + booking obvious, mobile + desktop)
- [x] Layout/touch-target audit of new components (modal close 36→44px fixed)
- [x] StickyBar vs modal/footer overlap (z-index verified)
- [x] BookingModal + FaqAccordion on small screens (dvh + overflow-y-auto)
- [x] Document fixes; hover-as-enhancement verified for touch/reduced-motion

## Post-launch fix — booking modal loading flash
- [x] Switched modal to Cal's official embed snippet ([cal.ts](../../src/lib/cal.ts)); calendar
  renders inline, revealed on `linkReady` + crossfade → no more load-then-recenter flash
- [x] `bookingSuccessfulV2` event + 6s safety fallback + `app.cal.com` preconnect
- [x] Colors: chrome/container use site tokens; brand vars passed best-effort (owner sets Cal
  dashboard brand color for the in-calendar accent)
- [x] Fixed a latent Phase-5 bug: Motion One `easing`→`ease` (was a type error, now clean)

## Final verification
- [x] New/changed files lint clean; `npm run build` succeeds; preview serves 200 with all features
- [x] Bundle: `@lucide/vue` route-split off homepage; Motion One added for icon FX (see note)
- [ ] **Owner:** manual e2e on a real phone (modal/back-button/accordion/estimator) + Lighthouse mobile
- [ ] **Owner / separate cleanup:** pre-existing `npm run check` (7) + `npm run lint` (4) errors — NOT from this work (see phase-7 log)
