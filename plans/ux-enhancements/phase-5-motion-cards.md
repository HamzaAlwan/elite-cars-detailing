# Phase 5 — Motion One micro-animations + card hover + cleanup

**Goal:** put the installed-but-unused Motion One library to work on tasteful icon micro-animations,
add a consistent card-hover lift, and remove dead code.
**Why:** owner thought animated icons were unused — the real unused assets are the `motion` lib and
a dead composable. Also wants hover animation on cards.

## Tasks
- [ ] Delete `src/lib/useReveal.ts` (nothing imports it). Keep `reveal.ts` + `motion.ts` `prefersReducedMotion`.
- [ ] Motion One micro-animations (`animate`, `inView` from `motion`), all gated on `prefersReducedMotion()`:
  - [ ] ValueProps icons: subtle scale/draw on scroll-in (1–2 elements per view max).
  - [ ] Booking-modal CTA icon: one-shot nudge (optional, restrained).
  - [ ] transform/opacity only; durations within `--dur-*`; ease-out enter.
- [ ] Card hover lift:
  - [ ] Add a hover utility/class (or extend `.surface-raised`/`.surface-featured`) in `global.css`:
        `translateY(-2px..-4px)` + slightly stronger shadow; transition `--dur-base`/`--ease-standard`.
  - [ ] Wrap in `@media (hover:hover) and (pointer:fine)` so touch devices get no stuck hover.
  - [ ] No layout shift / jitter (transform + box-shadow only).
  - [ ] Apply to value-prop cards, pricing tiers, product-logo tiles (Phase 6), gallery cards, `ui/Card.astro`.
- [ ] Verify `@lucide/vue` / `preview.astro` aren't shipped to end users (dev-only page or excluded from build/sitemap).

## Acceptance
- Key icons animate tastefully on scroll-in; reduced-motion → fully static.
- All cards lift subtly on hover (desktop), nothing jitters, no stuck hover on touch.
- `useReveal.ts` gone; no broken imports; bundle no larger than necessary.

## Notes / decisions
- "Animate 1–2 elements per view" — keep it restrained, premium, not flashy.
- Card hover is one consistent treatment reused everywhere (and by the logo strip).
