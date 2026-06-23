# Phase 6 — Social-proof product logos (real, monochrome strip)

**Goal:** replace the text-only "Professional Products We Use" cards with a premium real-logo strip.
**Why:** owner asked for icons/real logos for the products.

## Tasks
- [ ] In `src/components/sections/SocialProof.astro`, dedupe `products` to three:
      **Meguiar's** (Wash & clay), **CarPro** (Decon & ceramic — folds in CQUARTZ), **Gyeon** (Ceramic coatings).
- [ ] Source **official brand SVG logos** → `public/logos/` (e.g. `meguiars.svg`, `carpro.svg`, `gyeon.svg`).
      Official assets only; correct proportions; monochrome tint OK for an "as used by" wall.
      **Fallback:** if no clean official SVG, use a tasteful text wordmark + small icon (no low-res raster).
- [ ] Render as a **logo strip**:
  - [ ] Logos muted/greyscale by default (`opacity ~0.7`, single-color via `currentColor` where possible).
  - [ ] Hover → full color + slight lift (reuse Phase-5 card-hover), inside `@media (hover:hover)` only.
  - [ ] Each logo: `aria-label`/`alt` = brand name; small `note` caption beneath.
- [ ] **Hover-vs-tap**: on touch + reduced-motion, logos render in their full legible final state by
      default (never greyscale-only with no way to reveal).
- [ ] Mobile: centered grid wrap; ≥44px visual/tap height; no overflow.

## Acceptance
- Tidy, premium logo wall; greyscale→color/lift on hover (desktop); static & legible on mobile.
- Official assets, correct proportions, no trademark misuse.
- Section content/JSON-LD otherwise unaffected.

## Owner action
- Confirm these are the brands you actually use; supply any preferred logo file. We ship only official assets.

## Notes / decisions
- Deduped to 3 brands per owner. Real logos preferred; wordmark fallback acceptable.
