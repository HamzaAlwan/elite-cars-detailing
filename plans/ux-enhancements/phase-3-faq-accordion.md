# Phase 3 — Animated FAQ accordion (Reka UI)

**Goal:** replace the instant-toggle native `<details>` FAQ with a smoothly animated, accessible
Reka accordion.
**Why:** owner wants the Q&A to animate open/close instead of snapping.

## Tasks
- [ ] Create `src/data/faq.ts`: export the 5 FAQ items (`id`, `q`, `a`) currently inlined in `index.astro`.
- [ ] Update `src/data/schema.ts` `buildFAQSchema()` to read from `@/data/faq` (single source for UI + JSON-LD).
- [ ] Create `src/components/islands/FaqAccordion.vue`:
  - [ ] Reka `AccordionRoot type="single" collapsible` + `Item/Header/Trigger/Content`.
  - [ ] Animate height via `--reka-accordion-content-height` + opacity, using `--dur-base`/`--ease-standard`.
        Add the keyframes/utility in `global.css` if needed.
  - [ ] Chevron rotates 180° on open (match current SVG + `--dur-fast`).
  - [ ] `@media (prefers-reduced-motion: reduce)` → instant show/hide (no height anim).
  - [ ] Match existing classes: `rounded-xl border border-border bg-bg-elevated`, `px-5 py-4`, text sizes.
- [ ] In `index.astro`: replace the `<details>` map with `<FaqAccordion client:visible />`; keep the
      `#faq` `<Section>`, heading, and `data-reveal`.

## Acceptance
- Open/close animates smoothly; only one answer open at a time.
- Keyboard: Tab to triggers, Enter/Space toggles, arrow keys move between items (Reka default).
- Screen-reader roles/states correct (Reka handles `aria-expanded`/`region`).
- Reduced-motion → instant toggle.
- Rendered JSON-LD `FAQPage` output unchanged.

## Notes / decisions
- One-open-at-a-time (`type="single"`), per owner.
- Keep content identical — only the source location (faq.ts) and the interaction change.
